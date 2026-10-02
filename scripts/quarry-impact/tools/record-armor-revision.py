from pathlib import Path
import gzip,hashlib,json,subprocess

baseline='69a9673'
folder=Path('tests/fixtures/armor')
if subprocess.run(['git','cat-file','-e','HEAD:tests/fixtures/armor/revision.json'],capture_output=True).returncode==0:
 raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
paths=[
 'src/assets.ts','src/demo-session.ts','src/garage-ui.ts','src/main.ts','src/vehicle.ts',
 'src/vehicle-armor.ts','src/vehicle-armor-spec.ts','src/vehicle-physics.ts','src/vehicle-contact.ts',
 'multiplayer/simulation.ts','tests/buggy-invariants.ts','tests/demo-workshop.test.ts',
 'tests/armor-asset.test.ts','tests/armor-integration.test.ts','tests/armor-physics.test.ts','tests/armor-demo.test.ts',
 'armor-preview.html','tools/armor-preview.ts','public/licenses/CREDITS.md','tests/online-setup-physics.test.ts',
]
folder.mkdir(parents=True,exist_ok=True);files={}
for p in paths:
 old=subprocess.run(['git','show',baseline+':'+p],capture_output=True).stdout
 snapshot=p.replace('/','-')+'.gz';(folder/snapshot).write_bytes(gzip.compress(old,mtime=0))
 files[p]={'snapshot':snapshot,'before':hashlib.sha256(old).hexdigest(),'after':hashlib.sha256(Path(p).read_bytes()).hexdigest()}
(folder/'revision.json').write_text(json.dumps({'baseline':baseline,'files':files},indent=2)+'\n')
print(len(files),'frozen reinforcement inputs')
