"""Lossless GLB transport: unchanged vertex/image bytes, shared textures, gzip.
Original authoring/runtime GLBs remain available as compatibility fallbacks.
"""
from pathlib import Path
import struct, json, hashlib, gzip, os
root=Path(__file__).resolve().parents[1];public=root/'public';output=public/'models/packed'
output.mkdir(parents=True,exist_ok=True);(output/'textures').mkdir(exist_ok=True)
hash=lambda data:hashlib.sha256(data).hexdigest()
existing={}
for path in sorted(public.rglob('*')):
    if path.suffix.lower() in ['.png','.jpg','.jpeg','.webp'] and not path.is_relative_to(output):
        existing.setdefault(hash(path.read_bytes()),path)
manifest={'version':1,'method':'Lossless extraction/deduplication of image bytes; unchanged buffer-view bytes; gzip level 9. Original GLBs retained.','models':{},'textures':{}}
runtime={}
for file in sorted((public/'models').glob('*.glb')):
    source=file.read_bytes();assert struct.unpack_from('<III',source)==(0x46546c67,2,len(source))
    cursor=12;doc=None;binary=None
    while cursor<len(source):
        size,kind=struct.unpack_from('<II',source,cursor);data=source[cursor+8:cursor+8+size];cursor+=8+size
        if kind==0x4e4f534a:doc=json.loads(data)
        elif kind==0x004e4942:binary=data
    assert len(doc['buffers'])==1 and 'uri' not in doc['buffers'][0]
    images=[];removed=set()
    for image in doc.get('images',[]):
        if 'bufferView' in image:
            index=image.pop('bufferView');view=doc['bufferViews'][index];offset=view.get('byteOffset',0);data=binary[offset:offset+view['byteLength']]
            digest=hash(data);ext={'image/png':'.png','image/jpeg':'.jpg','image/webp':'.webp'}.get(image['mimeType']);assert ext
            target=existing.get(digest,output/'textures'/(digest[:24]+ext))
            if target.is_relative_to(output):target.write_bytes(data)
            image['uri']=os.path.relpath(target,output).replace('\\','/');removed.add(index)
            record={'file':target.relative_to(public).as_posix(),'bytes':len(data),'sha256':digest}
            manifest['textures'][record['file']]=record;images.append(record)
        elif 'uri' in image and not image['uri'].startswith('data:'):
            target=(file.parent/image['uri']).resolve();assert target.is_relative_to(public)
            image['uri']=os.path.relpath(target,output).replace('\\','/')
            data=target.read_bytes();record={'file':target.relative_to(public).as_posix(),'bytes':len(data),'sha256':hash(data)}
            manifest['textures'][record['file']]=record;images.append(record)
    old_views=doc['bufferViews'];mapping={};views=[];packed=bytearray()
    for index,view in enumerate(old_views):
        if index in removed:continue
        assert view.get('buffer',0)==0
        packed.extend(b'\0'*(-len(packed)%4));offset=view.get('byteOffset',0);data=binary[offset:offset+view['byteLength']]
        mapped=dict(view);mapped['byteOffset']=len(packed);packed.extend(data);mapping[index]=len(views);views.append(mapped)
        assert bytes(packed[mapped['byteOffset']:mapped['byteOffset']+mapped['byteLength']])==data
    def remap(node):
        if isinstance(node,dict):
            for key,value in list(node.items()):
                if key=='bufferView':assert value in mapping;node[key]=mapping[value]
                else:remap(value)
        elif isinstance(node,list):
            for value in node:remap(value)
    doc['bufferViews']=views;remap(doc);packed.extend(b'\0'*(-len(packed)%4));doc['buffers'][0]['byteLength']=len(packed)
    encoded=json.dumps(doc,separators=(',',':'),ensure_ascii=False).encode();encoded+=b' '*(-len(encoded)%4)
    glb=struct.pack('<III',0x46546c67,2,28+len(encoded)+len(packed))+struct.pack('<II',len(encoded),0x4e4f534a)+encoded+struct.pack('<II',len(packed),0x004e4942)+packed
    compressed=gzip.compress(glb,compresslevel=9,mtime=0);name=file.stem+'-'+hash(compressed)[:12]+'.glb.gz';(output/name).write_bytes(compressed)
    runtime[file.name]=name
    manifest['models'][file.name]={'source':'models/'+file.name,'sourceBytes':len(source),'sourceSha256':hash(source),'file':'models/packed/'+name,'bytes':len(compressed),'sha256':hash(compressed),'expandedBytes':len(glb),'images':images,'retainedBufferViews':len(views)}
(root/'src/packed-models.json').write_bytes((json.dumps(runtime,indent=2)+'\n').encode())
(root/'source/model-packing.json').write_bytes((json.dumps(manifest,indent=2)+'\n').encode())
print(json.dumps({'models':len(runtime),'originalModelMB':sum(m['sourceBytes'] for m in manifest['models'].values())/1e6,'packedModelMB':sum(m['bytes'] for m in manifest['models'].values())/1e6,'sharedTextureMB':sum(m['bytes']for m in manifest['textures'].values())/1e6,'textures':len(manifest['textures'])}))
