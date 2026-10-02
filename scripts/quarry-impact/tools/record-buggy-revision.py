from pathlib import Path
import gzip,hashlib,json,subprocess
baseline='5983019'
folder=Path('tests/fixtures/buggy')
if subprocess.run(['git','cat-file','-e','HEAD:tests/fixtures/buggy/revision.json'],capture_output=True).returncode==0:
 raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
# Review this explicit list whenever a release input is added.
paths=['buggy-asset-preview.html', 'multiplayer/simulation.ts', 'public/licenses/CREDITS.md', 'public/licenses/RAVINE-1800.md', 'public/models/buggy-candidate.glb', 'public/models/buggy.glb', 'src/assets.ts', 'src/buggy-asset.ts', 'src/buggy-geometry.ts', 'src/buggy-suspension.ts', 'src/classic-vehicle-specs.ts', 'src/engine-condition.ts', 'src/main.ts', 'src/online-view.ts', 'src/replay-scene.ts', 'src/rules.ts', 'src/vehicle-contact.ts', 'src/vehicle-fire-profile.ts', 'src/vehicle-physics.ts', 'src/vehicle-surface.ts', 'src/vehicle.ts', 'tests/buggy-asset.test.ts', 'tests/buggy-integration.test.ts', 'tests/buggy-physics.test.ts', 'tests/classic-roster.test.ts', 'tests/compact.test.ts', 'tests/coupe-asset.test.ts', 'tests/coupe-realism.test.ts', 'tests/demo-workshop.test.ts', 'tests/engine-integration.test.ts', 'tests/engine-physics.test.ts', 'tests/estate-rear.test.ts', 'tests/livery-assets.test.ts', 'tests/marten-bodywork.test.ts', 'tests/marten.test.ts', 'tests/online-damage.test.ts', 'tests/online-livery-render.test.ts', 'tests/online-setup-physics.test.ts', 'tests/replay-assets.test.ts', 'tests/structural-realism.test.ts', 'tests/tern-cabin.test.ts', 'tests/tern-front.test.ts', 'tests/tern.test.ts', 'tests/utility-integration.test.ts', 'tests/van-finish.test.ts', 'tests/van.test.ts', 'tests/vehicle-condition-invariants.ts', 'tests/wreck-finish.test.ts', 'tests/wreck-geometry.test.ts', 'tools/buggy-asset-preview.js', 'tools/build-buggy.ts', 'tools/car-asset-audit.ts', 'tools/check-marten-release.mjs']
folder.mkdir(parents=True,exist_ok=True);files={}
for p in paths:
 old=subprocess.run(['git','show',baseline+':'+p],capture_output=True).stdout;snapshot=p.replace('/','-')+'.gz';(folder/snapshot).write_bytes(gzip.compress(old,mtime=0))
 files[p]={'snapshot':snapshot,'before':hashlib.sha256(old).hexdigest(),'after':hashlib.sha256(Path(p).read_bytes()).hexdigest()}
(folder/'revision.json').write_text(json.dumps({'baseline':baseline,'files':files},indent=2)+'\n')
print(len(files),'frozen buggy inputs')
