"""Resurface the original cockpit around its exact instruments and canopy openings."""
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter
from io import BytesIO
from pathlib import Path
import UnityPy,sys
from d2art import bitmap_reader
from package import pack
root,ov=map(Path,sys.argv[1:])
get=bitmap_reader(root)
env=UnityPy.load(str(ov/'resources.assets'))
tex={o.peek_name().lower():o for o in env.objects if o.type.name=="Texture2D"}
sheet=tex["ind_metal_trim_01a_basecolor"].read().image.convert("RGB")
plate=sheet.crop((28,240,996,836))
def surface(name,scale):
    stock=get(name);W,H=stock.width*scale,stock.height*scale
    src=stock.resize((W,H),Image.Resampling.LANCZOS)
    ref=np.asarray(src).astype(float)
    ink=ref[:,:,:3]
    yy,xx=np.mgrid[:H,:W];u=xx/W;v=yy/H
    metal=np.asarray(plate.resize((W//2,H//2),Image.Resampling.LANCZOS)).astype(float)
    metal=metal[yy%(H//2),xx%(W//2)]
    detail=(metal-metal.mean((0,1)))*.60
    luma=ink.mean(2)
    filled=np.clip((luma-3)/15,0,1)[:,:,None]
    lit=(24+76*np.maximum(0,1-v)**1.4)[:,:,None]*np.array([.62,.76,.80])
    body=ink*.92+(lit+detail)*filled
    out=Image.fromarray(np.clip(body,0,255).astype(np.uint8),"RGB")
    if name.startswith("cockpit"):
        dr=ImageDraw.Draw(out)
        def xy(p):return tuple(round(q*size/base) for q,size,base in zip(p,(W,H),(640,480)))
        def line(coords,color,width=1):dr.line([xy(p) for p in coords],fill=color,width=max(1,round(W/640*width)),joint="curve")
        def mirror(points):return [(640-x,y) for x,y in points]
        def twin(points,color,width=1):line(points,color,width);line(mirror(points),color,width)
        # Edge-lit aluminum rails follow the two original canopy pillars.
        twin([(0,24),(49,82),(93,138),(126,189),(150,237),(171,282)],(86,110,113),1.4)
        twin([(0,37),(47,95),(84,143),(119,198),(145,249),(159,280)],(20,32,35),3)
        for x,y in [(24,78),(58,116),(88,157),(111,193),(137,237),(152,271)]:
            for px in [x,640-x]:
                a,b=xy((px,y));r=max(3,round(2.75*W/640))
                dr.ellipse((a-r,b-r,a+r,b+r),fill=(14,22,25),outline=(100,112,111),width=max(1,r//4))
                dr.line((a-r//2,b+r//3,a+r//2,b-r//3),fill=(82,94,95),width=max(1,r//4))
        twin([(19,321),(55,317),(78,316)],(66,83,84),1)
        twin([(39,352),(69,347),(91,335)],(32,41,42),2)
        twin([(129,347),(248,347),(255,353)],(134,112,74),1)
        twin([(129,345),(245,345)],(66,70,66),1)
        for x in (87,92,97,102):
            twin([(x,321),(x+4,317)],(188,123,62),1.35)
        line([(263,290),(282,290)],(92,171,176),1.6)
        line([(358,290),(377,290)],(92,171,176),1.6)
        try:font=ImageFont.truetype("consola.ttf",max(7,round(5.5*W/640)))
        except OSError:font=ImageFont.load_default()
        for pos,label in [((128,340),"PORT  //  WPN"),((398,340),"STBD  //  SEC"),((274,299),"GX"),((340,299),"R01")]:
            dr.text(xy(pos),label,fill=(147,168,163),font=font)
    out.putalpha(src.getchannel("A"))
    stream=BytesIO();out.save(stream,"PNG",compress_level=4);return stream.getvalue()
pack("cockpit",((n+".png",surface(n,3 if n.endswith("b") and n.startswith("cockpit") else 2))
                for n in ("cockpitb","cockpit","rearview","rearb","status","statusb")))

