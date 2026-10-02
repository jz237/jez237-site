"""Freeze the additive Opposing AI release; --check validates without writing."""
from pathlib import Path
import gzip
import hashlib
import json
import subprocess
import sys

baseline = '9768bcf264d4bb39ae8ada88895c72e79b3b55ab'
folder = Path('tests/fixtures/opposing-ai')
revision_path = folder / 'revision.json'
if sys.argv[1:] not in ([], ['--check']):
    raise SystemExit('Usage: python3 tools/record-opposing-ai-revision.py [--check]')
check_only = sys.argv[1:] == ['--check']
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = [
    'src/driving-brain.ts', 'tests/opposing-driving.test.ts',
    'tests/opposing-vehicle.test.ts', 'tests/opposing-ai-invariants.ts',
    'tests/opposing-ai-history.test.ts', 'tests/club-cup-invariants.ts',
    'tools/record-opposing-ai-revision.py',
]
sha = lambda data: hashlib.sha256(data).hexdigest()
tracked = set(subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', baseline]).decode().splitlines())

# Only the solo driver decision module changes. Preserve every other shipped
# source, backend file, vehicle asset, established test/tool and all 722 earlier
# fixture files, including snapshot bytes as well as the manifest chain.
protected = sorted(path for path in tracked if path not in paths and (
    path.startswith('src/') or path.startswith('multiplayer/') or
    path.startswith('tests/') or path.startswith('tools/') or
    path.startswith('public/models/') and path.endswith('.glb') or
    path in ['package.json', 'package-lock.json']))

# These original licensed GLBs predate this checkout's tracked source history.
# Pin the already-published manifest values, never an unchecked current hash.
published_models = {
    'public/models/coupe.glb': 'dc3bae23e49b8d4e5f80de5973bd38ed87b485ad40af5aee0a14d9ebf10e32ea',
    'public/models/sedan.glb': 'e5b197c08da6ce5696a62ffb76917a321168cd8f3ddf80630a6ff0e12c100e5c',
    'public/models/hatch.glb': '7a3c5661c3a8285facd4c1dac8e39238f18a92b69acbb776c7073118bbc7210c',
}
protected_hashes = {}
for path in protected:
    previous = subprocess.check_output(['git', 'show', baseline + ':' + path])
    expected = sha(previous)
    if sha(Path(path).read_bytes()) != expected:
        raise SystemExit('Opposing AI scope changed protected input: ' + path)
    protected_hashes[path] = expected
model_manifest = {row['file']: row['sha256'] for row in json.loads(Path('source/model-manifest.json').read_text())}
for path, expected in published_models.items():
    if model_manifest.get(path) != expected or sha(Path(path).read_bytes()) != expected:
        raise SystemExit('Opposing AI changed a published vehicle asset: ' + path)
    protected_hashes[path] = expected

# Fail before freezing if an integration change escaped the explicit file list.
changed = set(subprocess.check_output(['git', 'diff', '--name-only', baseline, '--',
    'src', 'tests', 'tools', 'multiplayer', 'package.json', 'package-lock.json']).decode().splitlines())
added = set(subprocess.check_output(['git', 'ls-files', '--others', '--exclude-standard', '--', 'src', 'tests']).decode().splitlines())
unexpected = sorted(path for path in changed | added if path not in paths and not path.startswith(str(folder) + '/'))
if unexpected:
    raise SystemExit('Unlisted Opposing AI source/test changes: ' + ', '.join(unexpected))

def previous(path):
    return subprocess.check_output(['git', 'show', baseline + ':' + path]) if path in tracked else b''

# Main, camera, physics and contact/damage modules are protected in full above.
# Reject a different predecessor instead of silently changing the trace baseline.
if sha(previous('src/driving-brain.ts')) != '0a6e68734d7fc1c58756e1db68072e51572168bbcf18d5a62732289ac6a2fc80':
    raise SystemExit('Opposing AI predecessor differs from the reviewed driver baseline')
if b'\n' in Path('src/main.ts').read_bytes().replace(b'\r\n', b''):
    raise SystemExit('Opposing AI main.ts must retain its original CRLF line endings')

files = {}
snapshots = {}
for path in paths:
    before = previous(path)
    snapshot = path.replace('/', '-') + '.gz'
    snapshots[snapshot] = gzip.compress(before, mtime=0)
    files[path] = {'snapshot': snapshot, 'before': sha(before), 'after': sha(Path(path).read_bytes())}
manifest = {'baseline': baseline, 'files': files, 'protected': protected_hashes,
    'protectedOrigins': {path: 'published source/model-manifest.json (original untracked GLB)' for path in published_models}}
if check_only:
    print(len(files), 'Opposing AI inputs ready;', len(protected_hashes), 'protected inputs verified; no snapshots written')
else:
    folder.mkdir(parents=True, exist_ok=True)
    for name, data in snapshots.items():
        (folder / name).write_bytes(data)
    revision_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print(len(files), 'frozen Opposing AI inputs;', len(protected_hashes), 'unchanged source, assets, physics and history inputs verified')
