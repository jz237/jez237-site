# Repack the already-hosted Mini Moto pine for the coastal instanced renderer.
# No topology changes: retains the source normals, UVs and alpha-cutout boughs.
import json,struct,io
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
source=root.parents[1]/'2026-09-13/mini-moto-park/assets/pine-v3.glb'
data=source.read_bytes();n=struct.unpack_from('<I',data,12)[0];g=json.loads(data[20:20+n]);blob=data[28+n:]
out=root/'assets/scenery';out.mkdir(exist_ok=True)
binary=bytearray();meshes=[]
for primitive in g['meshes'][0]['primitives']:
 item={}
 for name,index in [*primitive['attributes'].items(),('index',primitive['indices'])]:
  a=g['accessors'][index];v=g['bufferViews'][a['bufferView']];offset=v.get('byteOffset',0)+a.get('byteOffset',0)
  width={'SCALAR':1,'VEC2':2,'VEC3':3}[a['type']];size={5123:2,5125:4,5126:4}[a['componentType']]
  stride=v.get('byteStride',width*size);packed=b''.join(blob[offset+i*stride:offset+i*stride+width*size] for i in range(a['count']))
  while len(binary)%4:binary.append(0)
  item[name]={'offset':len(binary),'length':a['count']*width,'itemSize':width,'type':a['componentType']};binary.extend(packed)
 meshes.append(item)
for i,image in enumerate(g['images']):
 v=g['bufferViews'][image['bufferView']];im=Image.open(io.BytesIO(blob[v['byteOffset']:v['byteOffset']+v['byteLength']])).convert('RGBA');im.thumbnail((1024,1024));im.convert('RGB').save(out/'pine-bark.jpg',quality=86,optimize=True) if i==0 else im.save(out/'pine-bough.webp',quality=88,method=6)
(out/'pine.bin').write_bytes(binary);(out/'pine.json').write_text(json.dumps({'rotation':g['nodes'][0]['rotation'],'meshes':meshes}),encoding='utf-8')
print('Packed pine:',len(binary),'geometry bytes;',sum(p.stat().st_size for p in out.iterdir()),'total bytes')
