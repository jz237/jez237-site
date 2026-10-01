"""Record authored wheel anchors for the renderer-free authority.

Run after changing production GLBs, then run tests/online-damage.test.ts. That
check also verifies the model offsets against the actual rendered Vehicle.
"""
from pathlib import Path
import hashlib,json,struct
root=Path(__file__).resolve().parents[1]
models={}
for kind,offset in [('coupe',1),('sedan',1.04),('hatch',1.05)]:
    data=(root/f'public/models/{kind}.glb').read_bytes()
    assert data[:4]==b'glTF' and struct.unpack_from('<I',data,4)[0]==2
    size,chunk_type=struct.unpack_from('<II',data,12)
    assert chunk_type==0x4e4f534a
    gltf=json.loads(data[20:20+size])
    nodes={node.get('name'):node for node in gltf['nodes']}
    wheels=[]
    for label in ['FL','FR','RL','RR']:
        node=nodes['wheel_'+label]
        assert len(node['translation'])==3
        wheels.append(dict(zip(('x','y','z'),node['translation'])))
    models[kind]={'sha256':hashlib.sha256(data).hexdigest(),'modelOffset':offset,'wheels':wheels}
(root/'src/vehicle-damage-anchors.json').write_text(json.dumps(models,indent=2)+'\n')
