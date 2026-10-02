from pathlib import Path
import gzip
import hashlib
import json
import subprocess

baseline = '6357577d5c4967c63e2da5004f9c78272d38423d'
folder = Path('tests/fixtures/classic-wheel')
revision_path = folder / 'revision.json'
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = [
    'src/road-wheels.ts', 'src/tern-asset.ts', 'src/marten-asset.ts',
    'public/models/tern.glb', 'public/models/tern-candidate.glb',
    'public/models/marten.glb', 'public/models/marten-candidate.glb',
    'tests/classic-wheel-quality.test.ts', 'tests/classic-wheel-invariants.ts',
    'tests/armor-integration.test.ts', 'tests/buggy-wheel-invariants.ts',
    'tests/tern.test.ts', 'tests/marten.test.ts', 'tests/marten-greenhouse.test.ts',
    'tools/record-classic-wheel-revision.py',
]
protected = [
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
        raise SystemExit('Tern/Marten wheel and sill scope changed protected input: ' + path)
    protected_hashes[path] = expected
folder.mkdir(parents=True, exist_ok=True)
files = {}
for path in paths:
    previous = subprocess.check_output(['git', 'show', baseline + ':' + path]) if path in tracked else b''
    snapshot = path.replace('/', '-') + '.gz'
    (folder / snapshot).write_bytes(gzip.compress(previous, mtime=0))
    files[path] = {'snapshot': snapshot, 'before': sha(previous), 'after': sha(Path(path).read_bytes())}
revision_path.write_text(json.dumps({'baseline': baseline, 'files': files, 'protected': protected_hashes}, indent=2) + '\n')
print(len(files), 'frozen classic-wheel inputs;', len(protected), 'physics, camera and presentation inputs verified unchanged')
