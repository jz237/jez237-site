from pathlib import Path
import gzip
import hashlib
import json
import subprocess

baseline = '737ef40dd5d01f17e3e2196b7ac6895b46dcf3a1'
folder = Path('tests/fixtures/buggy-wheel')
revision_path = folder / 'revision.json'
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = [
    'src/buggy-wheels.ts', 'src/buggy-asset.ts',
    'public/models/buggy.glb', 'public/models/buggy-candidate.glb',
    'tests/buggy-wheel-quality.test.ts', 'tests/buggy-wheel-invariants.ts',
    'tests/buggy-asset.test.ts', 'tests/buggy-batching.test.ts',
    'tests/armor-integration.test.ts', 'tests/tyre-failure-invariants.ts',
    'tools/record-buggy-wheel-revision.py',
]
protected = [
    'src/vehicle-physics.ts', 'src/wheel-physics.ts', 'src/tyre-condition.ts',
    'src/component-damage.ts', 'src/vehicle-contact.ts', 'src/classic-vehicle-specs.ts',
    'src/vehicle-armor-spec.ts', 'src/rules.ts', 'multiplayer/simulation.ts',
    'src/replay-data.ts', 'src/replay-scene.ts', 'src/wheel-mechanics.ts',
    'src/tyre-visual.ts', 'src/buggy-suspension.ts', 'src/demo-director.ts',
    'src/vehicle.ts', 'src/assets.ts', 'package.json', 'package-lock.json',
]
sha = lambda data: hashlib.sha256(data).hexdigest()
tracked = set(subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', baseline]).decode().splitlines())
protected_hashes = {}
for path in protected:
    previous = subprocess.check_output(['git', 'show', baseline + ':' + path])
    expected = sha(previous)
    if sha(Path(path).read_bytes()) != expected:
        raise SystemExit('Wheel-only scope changed protected input: ' + path)
    protected_hashes[path] = expected
folder.mkdir(parents=True, exist_ok=True)
files = {}
for path in paths:
    previous = subprocess.check_output(['git', 'show', baseline + ':' + path]) if path in tracked else b''
    snapshot = path.replace('/', '-') + '.gz'
    (folder / snapshot).write_bytes(gzip.compress(previous, mtime=0))
    files[path] = {'snapshot': snapshot, 'before': sha(previous), 'after': sha(Path(path).read_bytes())}
revision_path.write_text(json.dumps({'baseline': baseline, 'files': files, 'protected': protected_hashes}, indent=2) + '\n')
print(len(files), 'frozen buggy-wheel inputs;', len(protected), 'physics, camera and presentation inputs verified unchanged')
