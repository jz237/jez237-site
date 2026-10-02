from pathlib import Path
import gzip,hashlib,json,subprocess
baseline='576b599'
folder=Path('tests/fixtures/marten')
if subprocess.run(['git','cat-file','-e','HEAD:tests/fixtures/marten/revision.json'],capture_output=True).returncode==0:
 raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
paths=['tests/demo-workshop.test.ts','public/licenses/CREDITS.md', 'src/assets.ts', 'src/classic-vehicle-specs.ts', 'src/main.ts', 'src/rules.ts', 'src/vehicle-fire-profile.ts', 'src/vehicle-fire.ts', 'src/vehicle-physics.ts', 'src/vehicle-thermal-state.ts', 'src/vehicle.ts', 'src/wreck-attachments.ts', 'src/wreck-finish.ts', 'tests/classic-roster.test.ts', 'tests/compact.test.ts', 'tests/coupe-asset.test.ts', 'tests/coupe-realism.test.ts', 'tests/estate-rear.test.ts', 'tests/livery-assets.test.ts', 'tests/online-damage.test.ts', 'tests/online-livery-render.test.ts', 'tests/online-setup-physics.test.ts', 'tests/replay-assets.test.ts', 'tests/structural-realism.test.ts', 'tests/tern-cabin-invariants.ts', 'tests/tern-cabin.test.ts', 'tests/tern-front.test.ts', 'tests/tern.test.ts', 'tests/utility-integration.test.ts', 'tests/van-finish.test.ts', 'tests/van.test.ts', 'tests/wreck-finish.test.ts', 'tests/wreck-geometry.test.ts', 'tools/car-asset-audit.ts', 'src/marten-asset.ts', 'public/models/marten.glb', 'public/models/marten-candidate.glb', 'public/licenses/MARTEN-1600.md', 'tools/build-marten.ts', 'tools/marten-asset-preview.js', 'marten-asset-preview.html', 'tests/marten.test.ts', 'tools/check-marten-release.mjs']
folder.mkdir(parents=True,exist_ok=True);files={}
for p in paths:
 old=subprocess.run(['git','show',baseline+':'+p],capture_output=True).stdout;snapshot=p.replace('/','-')+'.gz';(folder/snapshot).write_bytes(gzip.compress(old,mtime=0))
 files[p]={'snapshot':snapshot,'before':hashlib.sha256(old).hexdigest(),'after':hashlib.sha256(Path(p).read_bytes()).hexdigest()}
(folder/'revision.json').write_text(json.dumps({'baseline':baseline,'files':files},indent=2)+'\n')
print(len(files),'frozen refinement inputs')
