from pathlib import Path
import gzip,hashlib,json,subprocess
baseline='78ce2bb'
folder=Path('tests/fixtures/vehicle-condition')
if subprocess.run(['git','cat-file','-e','HEAD:tests/fixtures/vehicle-condition/revision.json'],capture_output=True).returncode==0:
 raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
paths=['multiplayer/simulation.ts', 'public/models/marten-candidate.glb', 'public/models/marten.glb', 'src/audio.ts', 'src/component-damage.ts', 'src/engine-condition.ts', 'src/main.ts', 'src/marten-asset.ts', 'src/marten-greenhouse.ts', 'src/online-view.ts', 'src/vehicle-physics.ts', 'src/vehicle-surface.ts', 'src/vehicle.ts', 'tests/engine-integration.test.ts', 'tests/engine-physics.test.ts', 'tests/physics-sync.test.ts', 'tests/marten-body-invariants.ts', 'tests/marten-bodywork.test.ts', 'tests/marten-greenhouse.test.ts', 'tools/vehicle-condition-preview.ts', 'vehicle-condition-preview.html']
folder.mkdir(parents=True,exist_ok=True);files={}
for p in paths:
 old=subprocess.run(['git','show',baseline+':'+p],capture_output=True).stdout;snapshot=p.replace('/','-')+'.gz';(folder/snapshot).write_bytes(gzip.compress(old,mtime=0))
 files[p]={'snapshot':snapshot,'before':hashlib.sha256(old).hexdigest(),'after':hashlib.sha256(Path(p).read_bytes()).hexdigest()}
(folder/'revision.json').write_text(json.dumps({'baseline':baseline,'files':files},indent=2)+'\n')
print(len(files),'frozen vehicle-condition inputs')
