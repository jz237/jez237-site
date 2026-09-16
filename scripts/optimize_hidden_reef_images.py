"""Lossless delivery assets for Hidden Reef; original artwork stays editable.
Requires Pillow. Every header crop is verified byte-for-byte against source pixels.
"""
from pathlib import Path
from PIL import Image
import hashlib,io,json,re
ROOT=Path(__file__).resolve().parents[1]
site=ROOT/'prototypes/hidden-reef'; header=site/'assets/animated-header'; out=site/'assets/optimized';out.mkdir(exist_ok=True)
manifest={}
def save(key,source,box=None):
 im=Image.open(header/source).convert('RGBA'); im=im.crop(box) if box else im
 buffer=io.BytesIO();im.save(buffer,'WEBP',lossless=True,method=6,exact=True);data=buffer.getvalue()
 assert Image.open(io.BytesIO(data)).convert('RGBA').tobytes()==im.tobytes()
 name=f'header-{key}-{hashlib.sha256(data).hexdigest()[:12]}.webp';(out/name).write_bytes(data)
 manifest[key]={'url':'../optimized/'+name,'bytes':len(data),'size':im.size,'box':box}
for key in ['reef','fish']:save(key,key+'.png')
for key,source,box in [('crest','reference.png',(1011,41,1159,162)),('the','reference.png',(666,147,1504,235)),('title','lettering-clean.png',(456,220,1724,439)),('tagline','reference.png',(466,439,1714,497))]:save(key,source,box)
html=(header/'index.html').read_text(encoding='utf8')
for key in ['crest','the','title','tagline']:
 x,y,right,bottom=manifest[key]['box']
 image=f'<image href="{manifest[key]["url"]}" x="{x}" y="{y}" width="{right-x}" height="{bottom-y}" filter="url(#lettering-{("gold" if key in ["crest","the"] else "water")}-mask)" />'
 html=re.sub(r'(<g clip-path="url\(#'+key+r'-region\)">)\s*<image[\s\S]*?/>',r'\1\n                    '+image,html)
html=re.sub(r'<link rel="preload"[^>]*data-header-preload[^>]*>','',html)
html=html.replace('</head>',f'<link rel="preload" as="image" href="{manifest["reef"]["url"]}" fetchpriority="high" data-header-preload></head>')
(header/'index.html').write_text(html,encoding='utf8')
css=(header/'header.css').read_text(encoding='utf8');css=re.sub(r'background: url\((?:\./lettering-clean.png|\.\./optimized/header-reef-[^)]*)\) center / cover;',f'background: url({manifest["reef"]["url"]}) center / cover;',css);(header/'header.css').write_text(css,encoding='utf8')
engine=(header/'reef-engine.ts').read_text(encoding='utf8')
for key in ['reef','fish']:
 engine=re.sub(r'(?:\./'+key+r'\.png|\.\./optimized/header-'+key+r'-[a-f0-9]+\.webp)',manifest[key]['url'],engine)
(header/'reef-engine.ts').write_text(engine,encoding='utf8')
(site/'assets/header-assets.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf8')
print(json.dumps(manifest,indent=2));print('Total header images:',sum(x['bytes'] for x in manifest.values()))
icon=Image.open(site/'assets/site/header-fish.png').convert('RGBA');icon.thumbnail((64,64),Image.Resampling.LANCZOS);icon.save(site/'assets/site/favicon.png',optimize=True)
