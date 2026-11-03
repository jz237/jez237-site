"""Lay out mine service panels from Overload's tileable materials and trim sheets."""
from functools import lru_cache
import zlib
import numpy as np
from PIL import Image

def finish_plate(name,size,color,nx,ny,rough,tex):
    """Return albedo and tangent-space surface data. All coordinates repeat at tile edges."""
    key=zlib.crc32(name.encode())
    yy,xx=np.mgrid[:size,:size].astype(np.float32)
    u=(xx+.5)/size;v=(yy+.5)/size
    is_stone=any(k in name for k in ("stone","rock","lava","ice_"))
    if is_stone:
        y=color.mean(2)
        nx+=np.clip((np.roll(y,2,1)-np.roll(y,-2,1))*1.45,-.40,.40)
        ny+=np.clip((np.roll(y,2,0)-np.roll(y,-2,0))*1.45,-.40,.40)
        return color,nx,ny,np.clip(rough+.18,0,1)
    # Door textures are mesh UV layouts in Overload. Take a face plate and trim
    # regions separately to build a continuous two-leaf Descent door.
    door="door" in name
    if door:
        bx=tex["ind_metal_wall_03a_basecolor"].read().image.convert("RGB").resize((size,size),Image.Resampling.LANCZOS)
        color=np.asarray(bx).astype(np.float32)/255*.78
    h=np.zeros((size,size),np.float32)
    def rectangle(x,y,w,d): return (u>=x)&(u<x+w)&(v>=y)&(v<y+d)
    def insert(sheet,box,place,blend=.92):
        x,y,w,d=place
        x0,y0,x1,y1=[int(t*size) for t in (x,y,x+w,y+d)]
        if sheet not in tiles: tiles[sheet]=tex[sheet].read().image.convert("RGB")
        im=tiles[sheet]
        im=im.crop(tuple(round(q*n) for q,n in zip(box,(*im.size,*im.size))))
        src=np.asarray(im.resize((x1-x0,y1-y0),Image.Resampling.LANCZOS)).astype(np.float32)/255.
        target=color[y0:y1,x0:x1]
        target[:]=target*(1-blend)+src*blend
        h[y0:y1,x0:x1]-=1.15
    # A narrow recess breaks the tile boundary. Convex plate shoulders catch moving lights.
    edge=np.minimum.reduce((u,1-u,v,1-v))
    h+=np.clip((edge-.004)*95,0,1)*1.2
    color*=np.clip(.67+edge*26,.67,1)[:,:,None]
    if door:
        seam=np.abs(u-.5)
        h-=np.clip(1-seam*66,0,1)*2.4
        color*=np.clip(.16+seam*44,.16,1)[:,:,None]
        for x in (.07,.56):
            insert("om_decals_01a_basecolor",(.02,.386,.98,.587),(x,.70,.37,.13))
            insert("tn_decals_01a_basecolor",(.526,.533,.657,.636),(x+.05,.41,.17,.095),.88)
            h[rectangle(x,.19,.37,.035)]-=1.6
    elif key%5!=0:
        # Different service bays share the same construction vocabulary and texel density.
        lower=bool(key&4)
        y=.74 if lower else .075
        if key%3==0:
            insert("om_decals_01a_basecolor",(.02,.386,.98,.587),(.105,y,.79,.16),.90)
        elif key%3==1:
            insert("ind_metal_trim_01a_basecolor",(.035,.08,.965,.225),(.07,y,.86,.12),.93)
        else:
            insert("tn_decals_01a_basecolor",(.472,.700,.918,.822),(.095,y,.58,.115),.83)
    # Machined sockets and countersunk fasteners, in opposing pairs.
    for x in (.048,.952):
        for y in (.047,.953):
            dx=u-x;dy=v-y
            r=np.sqrt(dx*dx+dy*dy)
            h-=np.clip(1-abs(r-.012)*230,0,1)*1.55
            h+=np.clip(1-r*106,0,1)*.87
            color[r<.011]*=.78
            slot=(abs(dx+dy)<.0019)&(r<.008)
            color[slot]*=.42
    # Recessed guide lamps. Only selected wall families carry an emissive insert.
    if "ceiling" in name or (not door and key%7==0):
        leds=rectangle(.25,.49,.50,.012)&((u*30)%1>.12)
        shell=rectangle(.23,.478,.54,.035)
        color[shell]*=.48;h[shell]-=.8
        color[leds]=[.72,.91,.96] if key&1 else [1.0,.64,.25]
    nx+=np.clip((np.roll(h,1,1)-np.roll(h,-1,1))*.40,-.72,.72)
    ny+=np.clip((np.roll(h,1,0)-np.roll(h,-1,0))*.40,-.72,.72)
    # Baked occlusion is independent of the moving light evaluated at run time.
    color*=np.clip(1+h*.09,.65,1.04)[:,:,None]
    return color,nx,ny,rough
tiles={}

