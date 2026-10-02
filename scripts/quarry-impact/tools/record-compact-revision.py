from pathlib import Path
import subprocess,hashlib,json,gzip
baseline='f2cb3aa4916df434ca01b2a978b627adca16904e'
paths=subprocess.check_output(['git','diff','--name-only',baseline]).decode().splitlines()
paths=[p for p in paths if p.startswith(('src/','tests/','tools/'))]
paths+=['src/driving-probe.ts','src/compact-asset.ts','public/models/compact.glb','public/models/compact-candidate.glb','public/licenses/ROOK-1100.md','tools/build-compact.ts','tools/compact-asset-preview.js','compact-asset-preview.html']
folder=Path('tests/fixtures/compact');folder.mkdir(parents=True,exist_ok=True)
files={}
for p in sorted(set(paths)):
    old=subprocess.run(['git','show',baseline+':'+p],capture_output=True).stdout
    snapshot=p.replace('/','-')+'.gz'
    (folder/snapshot).write_bytes(gzip.compress(old,mtime=0))
    files[p]={'snapshot':snapshot,'before':hashlib.sha256(old).hexdigest(),'after':hashlib.sha256(Path(p).read_bytes()).hexdigest()}
(folder/'revision.json').write_text(json.dumps({'baseline':baseline,'files':files},indent=2)+'\n')
print(len(files),'compact revision inputs frozen against the preceding release')
