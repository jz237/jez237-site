from io import BytesIO
from pathlib import Path
import base64,json,sys
from PIL import Image,ImageDraw
import numpy as np
import UnityPy
ov=Path(sys.argv[1]);dst=Path(__file__).resolve().parents[1]
env=UnityPy.load(str(ov/"resources.assets"))
tex={o.peek_name().lower():o for o in env.objects if o.type.name=="Texture2D"}
def get(n):return tex[n].read().image.convert("RGB")
atlas=get("tn_decals_01a_basecolor")
base=get("ind_metal_wall_03a_basecolor").resize((512,512),Image.Resampling.LANCZOS)
def trim(box,size):
    return atlas.crop(tuple(round(x*t) for x,t in zip(box,(*atlas.size,*atlas.size)))).resize(size,Image.Resampling.LANCZOS)
base.paste(trim((.48,.70,.91,.82),(266,59)),(51,324))
base.paste(trim((.53,.54,.65,.62),(71,34)),(379,92))
vent=get("om_decals_01a_basecolor")
base.paste(vent.crop((21,406,1006,586)).resize((248,41)),(115,56))
d=ImageDraw.Draw(base)
def channel(points):
    d.line(points,fill=(37,45,47),width=4,joint="curve")
    d.line([(x,y+2) for x,y in points],fill=(119,127,125),width=1)
channel([(4,151),(322,151),(345,130),(507,130)])
channel([(282,509),(282,457),(312,427),(510,427)])
for x,y in [(24,21),(484,21),(23,487),(482,487),(330,164),(369,143),(300,409),(102,280)]:
    d.ellipse((x-3,y-3,x+3,y+3),fill=(30,39,42),outline=(130,136,133))
    d.line([(x-1,y+1),(x+1,y-1)],fill=(94,99,98))
data=BytesIO();base.save(data,"PNG")
(dst/"skin.js").write_text("window.astraSkin="+json.dumps(base64.b64encode(data.getvalue()).decode())+";\n")

