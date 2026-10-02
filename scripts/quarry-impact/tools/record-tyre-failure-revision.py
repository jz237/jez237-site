from pathlib import Path
import gzip
import hashlib
import json
import subprocess

baseline = '3dfca59aae2d45b5e317bfbeb212db6bb4611edb'
folder = Path('tests/fixtures/tyre-failure')
revision_path = folder / 'revision.json'
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = [
    'multiplayer/protocol.ts', 'multiplayer/simulation.ts',
    'src/component-damage.ts', 'src/main.ts', 'src/network-validation.ts',
    'src/online-view.ts', 'src/replay-data.ts', 'src/replay-scene.ts',
    'src/style.css', 'src/vehicle-contact.ts', 'src/vehicle-physics.ts',
    'src/vehicle.ts', 'src/wheel-mechanics.ts', 'src/wheel-physics.ts',
    'src/tyre-condition.ts', 'src/tyre-feedback.ts', 'src/tyre-visual.ts',
    'tests/online-damage.test.ts', 'tests/online-setup-physics.test.ts',
    'tests/physics-sync.test.ts',
    'tests/utility-integration.test.ts', 'tests/tyre-contact.test.ts',
    'tests/tyre-failure-integration.test.ts', 'tests/tyre-failure-physics.test.ts',
    'tests/tyre-failure-scenarios.ts', 'tests/tyre-state.test.ts',
    'tests/tyre-visual.test.ts', 'tests/tyre-failure-invariants.ts',
    'tests/tyre-failure-history.test.ts', 'tests/demo-recovery-invariants.ts',
    'tests/fixtures/tyre-failure/previous-kernel.mjs.gz',
    'tests/fixtures/tyre-failure/previous-kernel.json',
    'tools/record-tyre-failure-revision.py',
]
sha = lambda data: hashlib.sha256(data).hexdigest()

# Prove that the frozen complete kernel is the same pre-tyre graph in both
# the original physics baseline and the subsequent published camera release.
kernel = json.loads((folder / 'previous-kernel.json').read_text())
assert kernel['revision'] == '2e641fea22272631c1dad949f8a14f5814c95b20'
assert sha(gzip.decompress((folder / 'previous-kernel.mjs.gz').read_bytes())) == kernel['bundleSHA256']
for path, expected in kernel['sources'].items():
    for revision in [kernel['revision'], baseline]:
        previous = subprocess.check_output(['git', 'show', revision + ':' + path])
        if sha(previous) != expected:
            raise SystemExit('Frozen kernel source differs: ' + revision + ':' + path)

tracked = set(subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', baseline]).decode().splitlines())
folder.mkdir(parents=True, exist_ok=True)
files = {}
for path in paths:
    previous = subprocess.check_output(['git', 'show', baseline + ':' + path]) if path in tracked else b''
    snapshot = path.replace('/', '-') + '.gz'
    (folder / snapshot).write_bytes(gzip.compress(previous, mtime=0))
    files[path] = {'snapshot': snapshot, 'before': sha(previous), 'after': sha(Path(path).read_bytes())}
revision_path.write_text(json.dumps({'baseline': baseline, 'physicsBaseline': kernel['revision'], 'files': files}, indent=2) + '\n')
print(len(files), 'frozen tyre-failure inputs; all', len(kernel['sources']), 'previous kernel sources verified at both baselines')
