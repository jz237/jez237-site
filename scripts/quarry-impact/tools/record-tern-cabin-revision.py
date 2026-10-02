from pathlib import Path
import gzip,hashlib,json,subprocess
baseline='81a51ea'
folder=Path('tests/fixtures/tern-cabin')
if subprocess.run(['git','cat-file','-e','HEAD:tests/fixtures/tern-cabin/revision.json'],capture_output=True).returncode==0:
 raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
paths=['src/tern-asset.ts','src/tern-cabin.ts','public/models/tern.glb','public/models/tern-candidate.glb','tools/tern-asset-preview.js','tern-asset-preview.html','tests/tern-front-invariants.ts','tests/tern-cabin.test.ts']
folder.mkdir(parents=True,exist_ok=True);files={}
for p in paths:
 old=subprocess.run(['git','show',baseline+':'+p],capture_output=True).stdout;snapshot=p.replace('/','-')+'.gz';(folder/snapshot).write_bytes(gzip.compress(old,mtime=0))
 files[p]={'snapshot':snapshot,'before':hashlib.sha256(old).hexdigest(),'after':hashlib.sha256(Path(p).read_bytes()).hexdigest()}
(folder/'revision.json').write_text(json.dumps({'baseline':baseline,'files':files},indent=2)+'\n')
print(len(files),'frozen refinement inputs')
