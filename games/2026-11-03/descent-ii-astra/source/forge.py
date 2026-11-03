"""Build the close-range blast, smoke and architectural detail pack from Overload."""
import sys
from pathlib import Path
from io import BytesIO
from PIL import Image
import UnityPy
from package import pack
env=UnityPy.load(str(Path(sys.argv[1])/"resources.assets"))
tex={o.peek_name().lower():o for o in env.objects if o.type.name=="Texture2D"}
files={}
def save(n,im):
    b=BytesIO();im.save(b,"PNG",compress_level=4);files[n]=b.getvalue()
for i,name in enumerate(['optimized_explodenoisy02','optimized_explode68','optimized_oilrigexplosion','optimized_smoke']):
    save(f"plume{i}.png",tex[name].read().image.convert("RGBA"))
# Use the real vent, painted beam and fastener regions, not a flattened door UV layout.
canvas=Image.new("RGB",(512,512))
for row,(n,box) in enumerate([("om_decals_01a_basecolor",(.018,.39,.985,.585)),("ind_metal_trim_01a_basecolor",(.02,.075,.98,.222)),
        ("tn_decals_01a_basecolor",(.475,.70,.918,.823)),("ind_metal_decals_02b_basecolor",(.02,.08,.98,.29))]):
    im=tex[n].read().image.convert("RGB");cropped=im.crop(tuple(int(v*p) for v,p in zip(box,(*im.size,*im.size))))
    canvas.paste(cropped.resize((512,128),Image.Resampling.LANCZOS),(0,row*128))
save("forge.png",canvas)
from bulkheads import make_bulkhead
for i in range(3):
    diffuse,normal=make_bulkhead(tex,i)
    save(f"m{180+i}.png",diffuse);save(f"n{180+i}.png",normal)
pack("forge",files.items())


