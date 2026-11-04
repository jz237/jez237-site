"""Re-extract native-resolution surface data; existing simulation assets stay intact."""
from pathlib import Path
from collections import Counter
from io import BytesIO
import sys,json,gzip,base64
import argparse
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('resources',type=Path,help='Owned Overload resources.assets')
parser.add_argument('standalone',type=Path,help='Astra standalone output directory')
parser.add_argument('web',type=Path,help='Astra web output directory')
args=parser.parse_args()
here=Path(__file__).resolve().parent;local=args.standalone;web=args.web
for folder in [local,web]:(folder/'payload').mkdir(parents=True,exist_ok=True)
import numpy as np
from PIL import Image
import UnityPy
from plates import finish_plate
env=UnityPy.load(str(args.resources))
tex={o.peek_name().lower():o for o in env.objects if o.type.name=='Texture2D'}
materials=json.loads((here/'material-index.json').read_text())['materials']
aliases=json.loads((web/'payload/aliases.js').read_text().split('=',1)[1].rstrip(';\n'));counts=Counter(aliases.values())
metal=[k for k,(n,s) in materials.items() if s==512 and ('wall' in n or 'floor' in n or 'ceiling' in n) and not any(t in n for t in ['rock','stone'])]
top=set(sorted(metal,key=lambda k:-counts[k])[:12])
chosen={k:(n,1024 if k in top else 512) for k,(n,s) in materials.items() if k in top or (s==256 and 'lava' not in n)}
entries={};manifest={}
def png(name,array):
 im=Image.fromarray(np.uint8(np.clip(array,0,1)*255));buf=BytesIO();im.save(buf,'PNG',compress_level=8);entries[name]=buf.getvalue()
for label,(name,size) in chosen.items():
 def read(n):return np.asarray(tex[n].read().image.resize((size,size),Image.Resampling.LANCZOS)).astype(np.float32)/255
 c=read(name)[:,:,:3];stem=name.removesuffix('_basecolor');nx=np.zeros((size,size),np.float32);ny=nx.copy()
 if stem+'_normal' in tex:
  nm=read(stem+'_normal');x=nm[:,:,3] if nm.shape[2]==4 and nm[:,:,3].std()>.025 and nm[:,:,0].std()<.025 else nm[:,:,0]
  y=nm[:,:,1];nx=(x-.5)*2;ny=(y-.5)*2
 rough=np.full_like(nx,.60)
 if stem+'_metallic' in tex:rough=.82-.47*read(stem+'_metallic')[:,:,0]
 if stem+'_emissive' in tex:c+=read(stem+'_emissive')[:,:,:3]*.26
 c,nx,ny,rough=finish_plate(name,size,c,nx,ny,rough,tex)
 # Leave lighting to the tangent-space shader rather than baking a bright edge.
 png(label,np.maximum(c,0)**.96);png('n'+label[1:],np.stack((nx*.5+.5,ny*.5+.5,rough),axis=2))
 manifest[label]={'source':name,'size':size,'oldSize':materials[label][1]}
 print(label,size,flush=True)
# Four trim rows retain the original source's fine vents, paint and fasteners.
atlas=Image.new('RGB',(1024,1024))
for row,(name,box) in enumerate([('om_decals_01a_basecolor',(.018,.39,.985,.585)),('ind_metal_trim_01a_basecolor',(.02,.075,.98,.222)),('tn_decals_01a_basecolor',(.475,.70,.918,.823)),('ind_metal_decals_02b_basecolor',(.02,.08,.98,.29))]):
 im=tex[name].read().image.convert('RGB');atlas.paste(im.crop(tuple(int(v*p) for v,p in zip(box,(*im.size,*im.size)))).resize((1024,256),Image.Resampling.LANCZOS),(0,row*256))
buf=BytesIO();atlas.save(buf,'PNG',compress_level=8);entries['forge.png']=buf.getvalue()
raw=bytearray();index=[];chunks=[]
for name,content in entries.items():index.append([name,len(content)]);raw.extend(content)
for i,start in enumerate(range(0,len(raw),6*1024*1024)):
 zipped=gzip.compress(raw[start:start+6*1024*1024],5,mtime=0);stem=f'surfaces20-{i:03d}';chunks.append(stem)
 (local/'payload'/f'{stem}.js').write_bytes(b'astraParcel("'+base64.b64encode(zipped)+b'");\n')
 (web/'payload'/f'{stem}.bin').write_bytes(zipped)
kinds=[-1]*256
for label,(name,size) in materials.items():
    kinds[int(label[1:4])+1]=4 if 'lava' in name else 0 if 'rock' in name or 'stone' in name else 1
for i in range(181,184):kinds[i]=1
type_script='window.astraMaterialTypes='+json.dumps(kinds,separators=(',',':'))+';\n'
for folder,extension in [(local,'js'),(web,'bin')]:
 (folder/'payload/surfaces20.js').write_text('astraIndex.surfaces20='+json.dumps([[s+'.'+extension for s in chunks],index],separators=(',',':'))+';\n'+type_script)
(here/'surface-detail-index.json').write_text(json.dumps(manifest,indent=2))
print('Prepared',len(chosen),'surface pairs,',len(chunks),'parcels,',round(len(raw)/1e6,1),'MB decoded PNG data.')
