from pathlib import Path
import gzip
import hashlib
import json
import subprocess

baseline = 'fe8dbaef1fe1e7495835eda14fd4f61470198f60'
folder = Path('tests/fixtures/tern-greenhouse')
revision_path = folder / 'revision.json'
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = [
    'src/tern-greenhouse.ts', 'src/tern-asset.ts',
    'public/models/tern.glb', 'public/models/tern-candidate.glb',
    'tests/tern-greenhouse.test.ts', 'tests/tern-greenhouse-invariants.ts',
    'tests/classic-wheel-quality.test.ts', 'tests/classic-wheel-invariants.ts',
    'tests/armor-integration.test.ts', 'tests/tern.test.ts', 'tools/record-tern-greenhouse-revision.py',
]
protected = [
    'src/tern-front-refinement.ts', 'src/tern-cabin.ts', 'tools/build-tern.ts',
    'src/road-wheels.ts', 'src/marten-asset.ts', 'src/marten-bodywork.ts', 'src/marten-greenhouse.ts',
    'public/models/marten.glb', 'public/models/marten-candidate.glb',
    'src/formed-vehicle-panel.ts', 'src/classic-window-frame.ts',
    'src/wreck-geometry.ts', 'src/wreck-attachments.ts', 'src/wreck-topology.ts',
    'src/livery-paint.ts', 'src/vehicle-surface.ts',
    'src/compact-asset.ts', 'public/models/compact.glb', 'public/models/compact-candidate.glb',
    'src/van-asset.ts', 'public/models/van.glb', 'public/models/van-candidate.glb',
    'src/buggy-wheels.ts', 'src/buggy-asset.ts', 'public/models/buggy.glb', 'public/models/buggy-candidate.glb',
    'src/vehicle-physics.ts', 'src/wheel-physics.ts', 'src/tyre-condition.ts',
    'src/component-damage.ts', 'src/vehicle-contact.ts', 'src/classic-vehicle-specs.ts',
    'src/vehicle-armor-spec.ts', 'src/rules.ts', 'multiplayer/simulation.ts',
    'src/replay-data.ts', 'src/replay-scene.ts', 'src/wheel-mechanics.ts',
    'src/tyre-visual.ts', 'src/buggy-suspension.ts', 'src/demo-director.ts',
    'src/demo-camera-visibility.ts', 'src/main.ts',
    'src/vehicle.ts', 'src/assets.ts', 'package.json', 'package-lock.json',
]
sha = lambda data: hashlib.sha256(data).hexdigest()
tracked = set(subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', baseline]).decode().splitlines())
protected_hashes = {}
for path in protected:
    previous = subprocess.check_output(['git', 'show', baseline + ':' + path])
    expected = sha(previous)
    if sha(Path(path).read_bytes()) != expected:
        raise SystemExit('Tern greenhouse scope changed protected input: ' + path)
    protected_hashes[path] = expected
folder.mkdir(parents=True, exist_ok=True)
files = {}
for path in paths:
    previous = subprocess.check_output(['git', 'show', baseline + ':' + path]) if path in tracked else b''
    snapshot = path.replace('/', '-') + '.gz'
    (folder / snapshot).write_bytes(gzip.compress(previous, mtime=0))
    files[path] = {'snapshot': snapshot, 'before': sha(previous), 'after': sha(Path(path).read_bytes())}
revision_path.write_text(json.dumps({'baseline': baseline, 'files': files, 'protected': protected_hashes}, indent=2) + '\n')
print(len(files), 'frozen tern-greenhouse inputs;', len(protected), 'physics, camera and presentation inputs verified unchanged')
