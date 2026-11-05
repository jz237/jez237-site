"""Build the web's lossless, individually fetchable material pairs and an index
into the original movie parcels. Run with WEB_GAME and STANDALONE_GAME paths.
The disk launcher uses the same movie index and its original script parcels."""
from pathlib import Path
import base64,gzip,hashlib,json,re,struct,sys
web,standalone=map(Path,sys.argv[1:3])
payload=web/'payload'
out=payload/'stream24'
out.mkdir(exist_ok=True)
def pack(name):
    raw=(payload/(name+'.js')).read_text()
    chunks,entries=json.loads(raw.split('=',1)[1].split(';',1)[0])
    return chunks,entries
def data(name):
    chunks,entries=pack(name)
    raw=b''.join(gzip.decompress((payload/c).read_bytes()) for c in chunks)
    pos=0
    for key,size in entries:
        yield key,raw[pos:pos+size]
        pos+=size
    assert pos==len(raw)
images={}
for group in ('art','forge','surfaces20'):
    images.update(data(group))
groups={}
for filename in sorted(images):
    match=re.fullmatch(r'[mn](\d+)\.png',filename)
    group='material-'+match[1] if match else 'fire-sprites' if filename.startswith('blast') else Path(filename).stem
    groups.setdefault(group,[]).append(filename)
def artifact(stem,content):
    name=stem+'-'+hashlib.sha256(content).hexdigest()[:12]+'.bin'
    (out/name).write_bytes(content)
    return name
catalog={}
for stem,names in groups.items():
    raw=b''.join(images[n] for n in names)
    catalog[artifact(stem,raw)]=[[n,len(images[n])] for n in names]
pyro=json.loads((web/'pyro-field.js').read_text().split('=',1)[1].strip(';\n\r'))
collectibles=json.loads((web/'collectibles.js').read_text().split('=',1)[1].strip(';\n\r'))
effects={'field':artifact('pyro-field',base64.b64decode(pyro)),'mesh':artifact('collectibles',base64.b64decode(collectibles['gzip'])),'catalog':collectibles['catalog']}
types=json.loads((payload/'surfaces20.js').read_text().split('window.astraMaterialTypes=')[1].strip(';\r\n'))
index={'materials':catalog,'effects':effects,'types':types}
def emit(path,name,value):
    path.write_text('window.'+name+'='+json.dumps(value,separators=(',',':'))+';\n',encoding='utf8')
emit(out/'index.js','astraStreamCatalog',index)
chunks,_=pack('movies')
offsets=[0]
for chunk in chunks:
    offsets.append(offsets[-1]+int.from_bytes((payload/chunk).read_bytes()[-4:],'little'))
movies={}
start=0
for library,archive in data('movies'):
    assert archive[:4]==b'DMVL',library
    count=struct.unpack_from('<I',archive,4)[0]
    pos=8+17*count
    for i in range(count):
        name,length=struct.unpack_from('<13sI',archive,8+17*i)
        name=name.split(b'\0')[0].decode('ascii').lower()
        assert re.fullmatch(r'[a-z0-9_-]+\.mve',name),name
        movies.setdefault(name,[start+pos,length])
        pos+=length
    assert pos==len(archive)
    start+=len(archive)
assert start==offsets[-1]
for target in (payload,standalone/'payload'):
    emit(target/'movie-index24.js','astraMovieIndex',{'offsets':offsets,'files':chunks,'movies':movies})
print(len(groups),'material batches,',len(movies),'indexed cutscenes;',len(images),'exact original images')
