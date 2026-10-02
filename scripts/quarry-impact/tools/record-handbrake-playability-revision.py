"""Freeze the additive Handbrake Playability release; --check never writes."""
from pathlib import Path
import gzip
import hashlib
import json
import subprocess
import sys

baseline = '21592fd35a30d5623472d50debc809696737bf27'
folder = Path('tests/fixtures/handbrake-playability')
revision_path = folder / 'revision.json'
if sys.argv[1:] not in (['--check'], ['--capture']):
    raise SystemExit('Use --check (read-only) or explicitly authorize --capture')
check_only = sys.argv[1:] == ['--check']
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This leaf is committed; create a successor instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = [
    'src/vehicle-physics.ts', 'src/event-ui.ts', 'tests/handbrake-physics.test.ts',
    'tests/tyre-failure-physics.test.ts',
    'tests/buggy-physics.test.ts', 'tests/physics-sync.test.ts', 'tests/historical-handbrake-policy.ts',
    'tests/handbrake-playability-invariants.ts', 'tests/handbrake-playability-history.test.ts',
    'tests/challenge-playability-invariants.ts', 'tools/record-handbrake-playability-revision.py',
]
sha = lambda data: hashlib.sha256(data).hexdigest()
tracked = set(subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', baseline]).decode().splitlines())
fixtures = sorted(path for path in tracked if path.startswith('tests/fixtures/'))
if len(fixtures) != 755:
    raise SystemExit('Expected all 755 immutable predecessor fixtures')

def previous(path):
    return subprocess.check_output(['git', 'show', baseline + ':' + path]) if path in tracked else b''

protected = sorted(path for path in tracked if path not in paths and (
    path.startswith(('src/', 'tests/', 'tools/', 'multiplayer/', 'public/', 'source/')) or
    path in ['package.json', 'package-lock.json']))
protected_hashes = {}
for path in protected:
    expected = sha(previous(path))
    if sha(Path(path).read_bytes()) != expected:
        raise SystemExit('Protected source/history/asset changed: ' + path)
    protected_hashes[path] = expected
published_models = {
    'public/models/coupe.glb': 'dc3bae23e49b8d4e5f80de5973bd38ed87b485ad40af5aee0a14d9ebf10e32ea',
    'public/models/sedan.glb': 'e5b197c08da6ce5696a62ffb76917a321168cd8f3ddf80630a6ff0e12c100e5c',
    'public/models/hatch.glb': '7a3c5661c3a8285facd4c1dac8e39238f18a92b69acbb776c7073118bbc7210c',
}
model_manifest = {entry['file']: entry['sha256'] for entry in json.loads(Path('source/model-manifest.json').read_text())}
for path, expected in published_models.items():
    if model_manifest.get(path) != expected or sha(Path(path).read_bytes()) != expected:
        raise SystemExit('Original published vehicle changed: ' + path)
    protected_hashes[path] = expected
changed = set(subprocess.check_output(['git', 'diff', '--name-only', baseline, '--',
    'src', 'tests', 'tools', 'multiplayer', 'public', 'source', 'package.json', 'package-lock.json']).decode().splitlines())
added = set(subprocess.check_output(['git', 'ls-files', '--others', '--exclude-standard', '--', 'src', 'tests', 'tools']).decode().splitlines())
unexpected = sorted(path for path in changed | added if path not in paths and not path.startswith(str(folder) + '/'))
if unexpected:
    raise SystemExit('Unlisted candidate input: ' + ', '.join(unexpected))
missing = [path for path in paths if not Path(path).is_file()]
if missing:
    raise SystemExit('Candidate is incomplete: ' + ', '.join(missing))

# Reverse only the two reviewed production edits; every remaining byte must
# equal the published baseline. Functional tests separately exercise the fix.
replacements = {
    'src/vehicle-physics.ts': (
        "  controller.setWheelEngineForce(i,force*corner.power*(kind==='tern'?(i<2?front[i%2]:0):(kind==='coupe'||isClassicKind(kind))?(i>1?rear[i%2]:0):.5*(i<2?front:rear)[i%2]));",
        "  // Rapier ignores wheelBrake when engine force is nonzero. Disengage only\n  // the handbraked rear wheels so the brake works while front drive is retained.\n  controller.setWheelEngineForce(i,state.input.handbrake&&i>1&&kind!=='tern'?0:force*corner.power*(kind==='tern'?(i<2?front[i%2]:0):(kind==='coupe'||isClassicKind(kind))?(i>1?rear[i%2]:0):.5*(i<2?front:rear)[i%2]));",
    ),
    'src/event-ui.ts': (
        'Course choice applies to solo circuit races. Derby, playground, challenges and online events use Blackridge Quarry.',
        'Course choice applies to solo circuit races. Challenges use their listed venue. Derby, playground and online events use Blackridge Quarry.',
    ),
}
known_before = {
    'src/vehicle-physics.ts': 'f4ff63df9c4aafc755b4e71809637c0efccca9e0185bf56ef894b970b67713a4',
    'src/event-ui.ts': '18509d4cbea23a6410f23592141d25fe248ff7f5f1f3f2aa02c7d38f92953a4a',
}
normalized_hashes = {}
for path, (before, after) in replacements.items():
    current = Path(path).read_bytes()
    if current.count(after.encode()) != 1:
        raise SystemExit('Expected reviewed change exactly once: ' + path)
    normalized = current.replace(after.encode(), before.encode(), 1)
    if normalized != previous(path) or sha(normalized) != known_before[path]:
        raise SystemExit('Production changed outside the reviewed replacement: ' + path)
    normalized_hashes[path] = sha(normalized)
if sha(Path('src/main.ts').read_bytes()) != 'b66c9e7153ab451feafb2aa1a17cf0b4b7c3e9f89fe8233f702699b2f58be81e':
    raise SystemExit('Actual main camera/AI/timing/replay/input/event code changed')

# Exact reviewed reference-adapter changes only. The old frozen kernels,
# scenario inputs, all assertions and tolerances must remain byte-for-byte.
historical_test_changes = {'tests/tyre-failure-physics.test.ts': [['import {kinds,trajectory,wheelParameters,trial,motionProbe} from '
                                         "'./tyre-failure-scenarios';\n",
                                         'import {kinds,trajectory,wheelParameters,trial,motionProbe,type PhysicsAPI} '
                                         "from './tyre-failure-scenarios';\n"
                                         'import {withHistoricalHandbrakePolicy} from '
                                         "'./historical-handbrake-policy';\n"],
                                        ['',
                                         '// Keep the frozen bundle/hash intact, applying only the reviewed current '
                                         'rear\n'
                                         '// handbrake policy to its powered-handbrake trajectory phases.\n'
                                         'const '
                                         'previousWithHandbrake:PhysicsAPI={...previous,stepVehiclePhysics(...args:Parameters<typeof '
                                         'current.stepVehiclePhysics>){\n'
                                         ' return '
                                         'withHistoricalHandbrakePolicy(args[1],args[2],args[4].input.handbrake,()=>previous.stepVehiclePhysics(...args));\n'
                                         '}};\n'],
                                        ["test('all eleven cars preserve exact intact and subthreshold trajectories "
                                         "except the explicit modern rim correction',t=>{\n",
                                         "test('all eleven cars preserve exact intact and subthreshold trajectories "
                                         'under current handbrake policy except the explicit modern rim '
                                         "correction',t=>{\n"],
                                        ['  const before=trajectory(previous,kind,tuned,damaged);\n',
                                         '  const before=trajectory(previousWithHandbrake,kind,tuned,damaged);\n'],
                                        [" t.diagnostic('44 frozen traces:40 scenarios remain exact with present "
                                         'zero/subthreshold tyre state;4 sedan/hatch damaged stock/tuned scenarios '
                                         'receive the explicit rim-clearance correction. Both tyreDamage0 and.64 were '
                                         "checked.');\n",
                                         " t.diagnostic('Frozen kernel with only the documented rear handbrake "
                                         'engine-command adapter;44 traces:40 scenarios remain exact with present '
                                         'zero/subthreshold tyre state;4 sedan/hatch damaged stock/tuned scenarios '
                                         'receive the explicit rim-clearance correction. Both tyreDamage0 and.64 were '
                                         "checked.');\n"],
                                        ["test('missing tyre condition preserves severe legacy wheel trauma for every "
                                         "drivetrain and setup',()=>{\n",
                                         "test('missing tyre condition preserves severe legacy wheel trauma under "
                                         "current handbrake policy for every drivetrain and setup',()=>{\n"],
                                        ['  const '
                                         'oldDamage=[1,.92,.85,.7],before=trajectory(previous,kind,tuned,true,undefined,oldDamage),after=trajectory(current,kind,tuned,true,undefined,oldDamage);\n',
                                         '  const '
                                         'oldDamage=[1,.92,.85,.7],before=trajectory(previousWithHandbrake,kind,tuned,true,undefined,oldDamage),after=trajectory(current,kind,tuned,true,undefined,oldDamage);\n']],
 'tests/buggy-physics.test.ts': [['', "import {withHistoricalHandbrakePolicy} from './historical-handbrake-policy';\n"],
                                 ["test('all ten preceding vehicles keep exact physics trajectories with tuned, "
                                  "damaged and legacy engine states',()=>{\n",
                                  '// Apply only the later reviewed rear handbrake policy to the frozen reference;\n'
                                  '// all original trajectory inputs and exact state comparisons remain intact.\n'
                                  'const previousStep=(...args:Parameters<typeof '
                                  'stepVehiclePhysics>)=>withHistoricalHandbrakePolicy(args[1],args[2],args[4].input.handbrake,()=>previous.stepVehiclePhysics(...args));\n'
                                  "test('all ten preceding vehicles keep exact physics trajectories under current "
                                  "handbrake policy with tuned, damaged and legacy engine states',()=>{\n"],
                                 ['  const '
                                  'runs=[{create:createVehiclePhysics,step:stepVehiclePhysics,spec:vehicleSpecification},{create:previous.createVehiclePhysics,step:previous.stepVehiclePhysics,spec:previous.vehicleSpecification}].map(api=>{const '
                                  'world=new '
                                  'R.World({x:0,y:-9.81,z:0});world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));const '
                                  'spec=api.spec(kind,setup),car=api.create(R,world,kind,spec.mass);car.body.setTranslation({x:0,y:.89,z:0},true);return{api,world,spec,...car,s:state()};});\n',
                                  '  const '
                                  'runs=[{create:createVehiclePhysics,step:stepVehiclePhysics,spec:vehicleSpecification},{create:previous.createVehiclePhysics,step:previousStep,spec:previous.vehicleSpecification}].map(api=>{const '
                                  'world=new '
                                  'R.World({x:0,y:-9.81,z:0});world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));const '
                                  'spec=api.spec(kind,setup),car=api.create(R,world,kind,spec.mass);car.body.setTranslation({x:0,y:.89,z:0},true);return{api,world,spec,...car,s:state()};});\n']],
 'tests/physics-sync.test.ts': [['', "import {withHistoricalHandbrakePolicy} from './historical-handbrake-policy';\n"],
                                ["test('shared physics preserves legacy health-based solo behavior for all cars, "
                                 "tunes, damaged wheels and variable steps',()=>{\n",
                                 "test('shared physics preserves legacy health-based solo behavior under current "
                                 "handbrake policy for all cars, tunes, damaged wheels and variable steps',()=>{\n"],
                                ['',
                                 '  // Only the frozen caller receives the later rear handbrake policy; its\n'
                                 '  // legacy component semantics and all motion assertions stay unchanged.\n'],
                                ['   for(const r of '
                                 '[old,fresh]){if(i===600){r.car.health=72;r.car.damageLeft=12;r.car.wreckParts.wheelDamage[0]=.65;r.car.wreckParts.wheelShift[0].set(.07,0,-.1);}r.world.timestep=dt;r.car.input=input;r.car.preStep(dt);r.world.step();r.car.postStep(dt,i/60);}\n',
                                 '   for(const r of '
                                 '[old,fresh]){if(i===600){r.car.health=72;r.car.damageLeft=12;r.car.wreckParts.wheelDamage[0]=.65;r.car.wreckParts.wheelShift[0].set(.07,0,-.1);}r.world.timestep=dt;r.car.input=input;if(r===old)withHistoricalHandbrakePolicy(r.car.controller,kind,input.handbrake,()=>r.car.preStep(dt));else '
                                 'r.car.preStep(dt);r.world.step();r.car.postStep(dt,i/60);}\n']]}
historical_test_hashes = {'tests/tyre-failure-physics.test.ts': 'ea98b6da1870a661435a653ccdd3442a46ae20434c0a13c1e4983e7d47d7d4b3',
 'tests/buggy-physics.test.ts': '60a3f0f7a24ff58f6f383da80a4f1a1859fc942a3033292e0cd286aaced3d021',
 'tests/physics-sync.test.ts': 'c016702b9848a81eb56720b26162a5e9820fc65d395eca46a9f49098653d77ae'}
normalized_historical_hashes = {}
for path, changes in historical_test_changes.items():
    normalized = Path(path).read_bytes()
    for before, after in changes:
        if normalized.count(after.encode()) != 1:
            raise SystemExit('Expected reviewed test adapter exactly once: ' + path)
        normalized = normalized.replace(after.encode(), before.encode(), 1)
    if normalized != previous(path) or sha(normalized) != historical_test_hashes[path]:
        raise SystemExit('Historical test changed outside the reviewed adapter: ' + path)
    normalized_historical_hashes[path] = sha(normalized)

files, snapshots = {}, {}
for path in paths:
    before = previous(path)
    snapshot = path.replace('/', '-') + '.gz'
    snapshots[snapshot] = gzip.compress(before, mtime=0)
    files[path] = {'snapshot': snapshot, 'before': sha(before), 'after': sha(Path(path).read_bytes())}
manifest = {
    'baseline': baseline, 'files': files, 'protected': protected_hashes,
    'previousFixtureCount': len(fixtures), 'normalizedSourceSha256': normalized_hashes,
    'normalizedHistoricalTestsSha256': normalized_historical_hashes,
    'protectedOrigins': {path: 'published source/model-manifest.json (original untracked GLB)' for path in published_models},
}
expected_names = set(snapshots) | {'revision.json'}
if folder.exists() and any(not path.is_file() or path.name not in expected_names for path in folder.iterdir()):
    raise SystemExit('Unexpected file or directory in the new leaf')
if check_only:
    print(len(files), 'candidate inputs ready;', len(protected_hashes), 'protected inputs and all 755 old fixtures verified; no writes')
else:
    folder.mkdir(parents=True, exist_ok=True)
    for name, data in snapshots.items():
        (folder / name).write_bytes(data)
    revision_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print(len(files), 'newly captured handbrake inputs; all 755 older fixtures preserved')
