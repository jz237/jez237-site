from pathlib import Path
import gzip,hashlib,json,subprocess
baseline='294b505'
folder=Path('tests/fixtures/tern')
if subprocess.run(['git','cat-file','-e','HEAD:tests/fixtures/tern/revision.json'],capture_output=True).returncode==0:
 raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
paths=subprocess.check_output(['git','diff','--name-only',baseline]).decode().splitlines()
paths=[p for p in paths if p.startswith(('src/','tests/','tools/')) and not p.startswith('tests/fixtures/')]
paths+=['src/tern-asset.ts','tools/build-tern.ts','tools/tern-asset-preview.js','tern-asset-preview.html','public/models/tern.glb','public/models/tern-candidate.glb','public/licenses/TERN-1400.md','public/licenses/CREDITS.md','tests/tern.test.ts']
folder.mkdir(parents=True,exist_ok=True);files={}
for p in sorted(set(paths)):
 old=subprocess.run(['git','show',baseline+':'+p],capture_output=True).stdout;snapshot=p.replace('/','-')+'.gz';(folder/snapshot).write_bytes(gzip.compress(old,mtime=0))
 files[p]={'snapshot':snapshot,'before':hashlib.sha256(old).hexdigest(),'after':hashlib.sha256(Path(p).read_bytes()).hexdigest()}
(folder/'revision.json').write_text(json.dumps({'baseline':baseline,'files':files},indent=2)+'\n')
print(len(files),'Tern revision inputs recorded against the verified van finish release')
