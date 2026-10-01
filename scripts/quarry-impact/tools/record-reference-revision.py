"""Freeze this increment without rewriting any earlier provenance manifest."""
from pathlib import Path
import json,gzip,hashlib
root=Path(__file__).resolve().parents[1];original=root/'outputs/reference-overhaul/original'
sha=lambda b:hashlib.sha256(b).hexdigest()
files={}
for old in original.joinpath('src').glob('*'):
    if not old.is_file():continue
    name='src/'+old.name;before=old.read_bytes();after=(root/name).read_bytes()
    if before==after:continue
    fixture='tests/fixtures/reference-before-'+old.name+'.gz';(root/fixture).write_bytes(gzip.compress(before,mtime=0))
    files[name]={'before':sha(before),'after':sha(after),'snapshot':fixture}
models=json.loads((original/'source/model-packing.json').read_bytes())
shared=json.loads((root/'source/coupe-realism-physics.json').read_bytes())
manifest={'previousRelease':'c25fd2358edfbdbdda4e77a696e20d9be79fedd4','method':'Reference-led visual construction, authored Blender quarry planes/infrastructure/wheel detail, photographic ground, coherent HDR/key rotation and HUD. Original collision, car and audio files retained.','files':files,'protectedModels':{m['source']:m['sourceSha256']for m in models['models'].values()},'protectedWorker':shared['sourceHashes']}
(root/'source/reference-overhaul-revision.json').write_bytes((json.dumps(manifest,indent=2)+'\n').encode())
print('Frozen reference revision:',len(files),'changed sources,',len(models['models']),'original models protected')
