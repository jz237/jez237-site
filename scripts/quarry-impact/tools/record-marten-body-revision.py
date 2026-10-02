from pathlib import Path
import gzip,hashlib,json,subprocess
baseline='5693e4a'
folder=Path('tests/fixtures/marten-body')
if subprocess.run(['git','cat-file','-e','HEAD:tests/fixtures/marten-body/revision.json'],capture_output=True).returncode==0:
 raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
paths=['src/vehicle-surface.ts','src/marten-asset.ts', 'src/marten-bodywork.ts', 'src/assets.ts', 'public/models/marten.glb', 'public/models/marten-candidate.glb', 'tools/marten-asset-preview.js', 'marten-asset-preview.html', 'tests/marten-invariants.ts', 'tests/marten-bodywork.test.ts']
folder.mkdir(parents=True,exist_ok=True);files={}
for p in paths:
 old=subprocess.run(['git','show',baseline+':'+p],capture_output=True).stdout;snapshot=p.replace('/','-')+'.gz';(folder/snapshot).write_bytes(gzip.compress(old,mtime=0))
 files[p]={'snapshot':snapshot,'before':hashlib.sha256(old).hexdigest(),'after':hashlib.sha256(Path(p).read_bytes()).hexdigest()}
(folder/'revision.json').write_text(json.dumps({'baseline':baseline,'files':files},indent=2)+'\n')
print(len(files),'frozen refinement inputs')
