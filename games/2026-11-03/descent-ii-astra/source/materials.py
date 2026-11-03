"""Map local Overload surface families and particle flipbooks to D2 PIG bitmap slots."""
from collections import Counter
from pathlib import Path
from io import BytesIO
import json, re, struct, sys, zlib
import numpy as np
from PIL import Image
import UnityPy
from plates import finish_plate
from package import pack, out

overload, pig = map(Path,sys.argv[1:3])
env=UnityPy.load(str(overload/"resources.assets"))
tex={o.peek_name().lower():o for o in env.objects if o.type.name=="Texture2D"}
pigdata=pig.read_bytes()
count=struct.unpack_from("<I",pigdata,8)[0]
slots=[]
for i in range(count):
    name,frame,*rest=struct.unpack_from("<8s6BI",pigdata,12+i*18)
    base=name.partition(b"\0")[0].decode().lower()
    slots.append((base,frame&63 if frame&64 else None))
counts=Counter(base for base,frame in slots if frame is not None)
def select(pattern,limit):
    matches=sorted(n for n in tex if re.fullmatch(pattern,n))
    assert matches,pattern
    return [matches[j] for j in np.linspace(0,len(matches)-1,min(limit,len(matches)),dtype=int)]
families={
 "stone":select(r"(ind_stone_floor_\w+|rockwall_\w+|stones)_basecolor",16),
 "wall":select(r"(ind_metal_wall_\w+|om_wall_\w+)_basecolor",32),
 "armor":select(r"(ind_metal_panel_\w+|cc_wall_\w+)_basecolor",12),
 "ceiling":select(r"(ind_metal_ceiling_\w+|om_ceiling_\w+)_basecolor",12),
 "floor":select(r"(om_floor_\w+|cc_floor_\w+)_basecolor",12),
 "door":select(r"(om_door_0[12]|cc_door_01a|alien_door_0[12])_basecolor",5),
 "hot":select(r"lava_\d+_basecolor",2),
 "console":select(r"(cc_monitor_01a|om_monitors_01a)_basecolor",2),
}
sheets=["optimized_explodenoisy02","optimized_explode68","optimized_oilrigexplosion"]
entries,aliases,used={}, {}, {}
def png(img):
    b=BytesIO();img.save(b,format="PNG",compress_level=2);return b.getvalue()
def art(name,size):
    key=(name,size)
    if key in used: return used[key]
    label="m%03d.png"%len(used);used[key]=label
    def read(n):
        return np.asarray(tex[n].read().image.resize((size,size),Image.Resampling.LANCZOS)).astype(np.float32)/255.
    c=read(name)[:,:,:3]
    stem=name.removesuffix("_basecolor")
    normal=stem+"_normal"
    nx=np.zeros((size,size),np.float32); ny=nx.copy()
    if normal in tex:
        nm=read(normal)
        # Unity's DXT5nm puts tangent X in alpha; unpacked normals put it in red.
        x=nm[:,:,3] if nm[:,:,3].std()>.025 and nm[:,:,0].std()<.025 else nm[:,:,0]
        y=nm[:,:,1]
        nx=(x-.5)*2; ny=(y-.5)*2
        bevel=(x-.5)*.60+(y-.5)*.50
        c=c*(1+bevel[:,:,None])+np.maximum(bevel-.04,0)[:,:,None]*np.array([.20,.25,.26])
    em=stem+"_emissive"
    if em in tex: c+=read(em)[:,:,:3]*.46
    rough=np.full_like(nx,.60)
    metal=stem+"_metallic"
    if metal in tex:
        m=read(metal); rough=.82-.47*m[:,:,0]
    c,nx,ny,rough=finish_plate(name,size,c,nx,ny,rough,tex)
    detail=np.stack((nx*.5+.5,ny*.5+.5,rough),axis=2)
    entries["n"+label[1:]]=png(Image.fromarray((np.clip(detail,0,1)*255).astype(np.uint8)))
    c=np.clip((np.maximum(c,0)**.94)*1.08,0,1)
    entries[label]=png(Image.fromarray((c*255).astype(np.uint8)))
    return label
for base,frame in slots:
    dest=base if frame is None else f"{base}#{frame}"
    if dest in aliases: continue
    ident=zlib.crc32(base.encode())
    if re.fullmatch(r"exp\d+",base) and frame is not None:
        effect=int(base[3:])
        sheet=sheets[(0 if effect in (6,13,18,20,23) else 2 if effect in (17,21,26) else 1)]
        # All three sheets are ordered from the upper left, in 8 x 8 cells.
        cell=round(3+frame*57/max(1,counts[base]-1))
        label=f"blast{sheets.index(sheet)}-{cell:02d}.png"
        if label not in entries:
            atlas=tex[sheet].read().image
            step=atlas.width//8; x=(cell%8)*step; y=(cell//8)*step
            entries[label]=png(atlas.crop((x,y,x+step,y+step)).convert("RGBA"))
        aliases[dest]=label
        continue
    size=512
    if base.startswith("rock"): family="stone"
    elif base.startswith("metl"): family="floor" if ident%5==0 else "wall"
    elif base.startswith("ceil"): family="ceiling"
    elif base.startswith(("door","wall","secretdr")): family="door";size=256
    elif base.startswith(("ctrl","rmap")): family="console";size=256
    elif base.startswith(("ship","rbot","react","box")): family="armor"
    elif base.startswith("lava"): family="hot";size=256
    elif base.startswith(("misc","blown","fram")): family="wall";size=256 if frame is not None else 512
    else: continue
    choices=families[family]
    name=choices[ident%len(choices)]
    aliases[dest]=art(name,size)
pack("art",entries.items())
(out/"payload/aliases.js").write_text("window.astraAliases="+json.dumps(aliases,separators=(",",":"))+";\n")
(out/"source/material-index.json").write_text(json.dumps({"materials":{v:k for k,v in used.items()},
        "explosionSheets":sheets,"bitmapSlots":len(aliases),"explosionFrames":sum(k.startswith("exp") for k in aliases)},indent=2))
print(len(aliases),"stock bitmap slots;",len(used),"prepared surface maps.")


