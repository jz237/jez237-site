"""Trace the black tang profile into profiles.json.

Silhouette edges are measured from the clean-flank plate. Fin bases, eye, gill
margin, mouth and paired-fin outlines were read from gridded, equalized crops.
Widths were measured on references/rostratum-dorsal (full width in px per
dorsal-plate column) and mapped to the side view by two landmarks: snout tip
(2180 -> 2118) and scalpel (640 -> 625); the spread pectoral and eye bulges are
bridged. Only the shape is used: 'width' caps the peak half-width at 0.068 body
lengths (about a quarter of body depth), because GPT Image tends to widen views
from above. Writes the entry and proofs/rostratum-trace.png for review.

  python trace_rostratum.py
"""
import json,numpy as np
from pathlib import Path
from PIL import Image,ImageFilter,ImageDraw
ROOT=Path(__file__).resolve().parent
src=ROOT/'references'/'rostratum-skin.png'
m=np.asarray(Image.open(src).convert('L'))<105
m=np.asarray(Image.fromarray(m.astype(np.uint8)*255).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5)))>0
def top(x):return int(np.where(m[:,x])[0].min())
def bottom(x):return int(np.where(m[:,x])[0].max())
def leftmost(y):return int(np.where(m[y,:])[0].min())
begin,end=530,2118
body_top=[[530,748],[580,750],[640,748],[700,700],[750,655],[800,612],[850,575],[900,542],[950,515],[1000,495],[1050,475],[1100,456],[1150,440],[1200,425],[1250,412],[1300,404],[1350,398],[1400,395],[1450,396],[1500,401],[1550,408],[1600,414],[1630,416]]
# The snout tip follows the reference sheet: a pointed tip with a small mouth,
# not the plate's fat rounded lower lip.
body_top+=[[x,top(x)] for x in range(1660,2081,30)]+[[2100,955],[end,967]]
body_bottom=[[530,915],[570,910],[620,913],[700,955],[760,985],[800,1005],[850,1040],[900,1085],[960,1135],[1040,1182],[1100,1205],[1180,1230],[1250,1247],[1315,1260]]
body_bottom+=[[x,bottom(x)] for x in range(1360,2001,40)]+[[2040,1031],[2070,1022],[2095,1009],[end,994]]
dorsal=[[600,748]]+[[x,top(x)] for x in range(620,1611,30)]+[[1630,412]]
caudal=[[548,752]]+[[x,top(x)] for x in range(540,199,-40)]
caudal+=[[leftmost(y),y] for y in range(500,1151,60)]
caudal+=[[x,bottom(x)] for x in range(220,541,40)]+[[548,913]]
anal=[[600,905],[700,955],[800,1005],[900,1085],[1000,1160],[1100,1205],[1200,1236],[1300,1258],[1315,1261]]+[[x,bottom(x)] for x in range(1300,579,-40)]
pec=[[1592,958],[1500,872],[1400,812],[1308,780],[1296,860],[1300,950],[1325,1015],[1380,1042],[1470,1025],[1560,995]]
pelvic=[[1500,1242],[1470,1282],[1420,1335],[1360,1402],[1288,1442],[1298,1380],[1330,1318],[1365,1262],[1390,1245]]
# Dorsal-plate widths (full px) at dorsal x, mapped to lateral px by the snout
# tip (2180 -> 2118) and scalpel (640 -> 625). Pectoral and eye spans bridged.
dw={500:40,540:48,580:52,620:56,660:62,700:85,740:90,780:101,820:116,860:134,900:152,940:171,980:189,1020:207,1060:223,1100:240,1140:254,1180:270,1220:284,1260:299,1300:311,1340:323,1380:330,1420:336,1460:337,1700:297,1740:274,1780:262,1820:247,1860:231,1900:197,1940:174,1980:145,2020:118,2060:93,2100:76,2140:61,2180:18}
peak=max(dw.values())
thickness=[[round(625+(x-640)*(2118-625)/(2180-640)),round(w/peak,3)] for x,w in sorted(dw.items())]
profile={'range':[begin,end],'cy':830,'width':.068,'crossPower':1.45,'thickness':thickness,'texture':'rostratum-texture.png','skinTexture':'rostratum-skin-texture.png',
 'eye':[1712,686,48],'eyeDome':.0018,'mouth':[2115,981],'gill':[1647,735,950],'pec':pec,'pelvic':pelvic,'top':body_top,'bottom':body_bottom,'dorsal':dorsal,'fins':[caudal,[],anal]}
profile.update(rings=120,sides=64,dorsalFade=[.012,.045],eyeDome=.0035,lipRings=[[.003,.8,1],[.001,.55,.55],[-.02,.25,.065]])
profiles=ROOT/'profiles.json';data=json.loads(profiles.read_bytes().decode('utf-8'));data['rostratum']=profile
# profiles.json keeps its CRLF line endings.
profiles.write_bytes((json.dumps(data,indent=2)+'\n').replace('\n','\r\n').encode('utf-8'))
im=Image.open(ROOT/'references'/'rostratum.png').convert('RGB');d=ImageDraw.Draw(im)
for pts,c in [(body_top,(255,60,60)),(body_bottom,(255,60,60)),(dorsal,(60,255,60)),(caudal,(255,220,0)),(anal,(0,200,255)),(pec,(255,0,255)),(pelvic,(255,140,0))]:
    d.line([tuple(p) for p in pts]+([tuple(pts[0])] if pts in (caudal,anal,pec,pelvic) else []),fill=c,width=3)
x,y,r=profile['eye'];d.ellipse([x-r,y-r,x+r,y+r],outline=(0,255,255),width=3)
gx,g0,g1=profile['gill'];d.line([(gx-57,g0),(gx-57+40,(g0+g1)/2),(gx-57,g1)],fill=(255,255,255),width=3)
d.ellipse([2111-6,990-6,2111+6,990+6],fill=(255,255,0))
im.resize((1152,768)).save(ROOT/'proofs'/'rostratum-trace.png')
