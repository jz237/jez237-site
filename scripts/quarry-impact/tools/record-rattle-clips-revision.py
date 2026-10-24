"""Freeze the additive rattle-clips release; --check never writes."""
from pathlib import Path
import gzip
import hashlib
import json
import subprocess
import sys

baseline = 'db10c003f6fdfc9573ad2760265db67c35cfc760'
folder = Path('tests/fixtures/rattle-clips')
revision_path = folder / 'revision.json'
if sys.argv[1:] not in (['--check'], ['--capture']):
    raise SystemExit('Use --check (read-only) or explicitly authorize --capture')
check_only = sys.argv[1:] == ['--check']
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This leaf is committed; create a successor instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = ['public/audio/manifest.json', 'public/audio/rattle-0.ogg', 'public/audio/rattle-1.ogg', 'public/audio/rattle-2.ogg', 'public/audio/rattle-3.ogg', 'public/audio/thump.ogg', 'public/licenses/CREDITS.md', 'tools/destruction-audio.py', 'tests/rattle-clips.test.ts', 'tests/destruction-audio.test.ts', 'tests/vehicle-fire.test.ts', 'work/destruction-tests.txt', 'work/sound/ui-rattles.mjs', 'tests/sound-levels-invariants.ts', 'tests/sound-levels-history.test.ts', 'tests/rattle-clips-invariants.ts', 'tests/rattle-clips-history.test.ts', 'tools/record-rattle-clips-revision.py']
sha = lambda data: hashlib.sha256(data).hexdigest()
tracked = set(subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', baseline]).decode().splitlines())
fixtures = sorted(path for path in tracked if path.startswith('tests/fixtures/'))
if len(fixtures) != 7298:
    raise SystemExit('Expected all 7298 immutable predecessor fixtures')

def previous(path):
    return subprocess.check_output(['git', 'show', baseline + ':' + path]) if path in tracked else b''

protected = sorted(path for path in tracked if path not in paths and (
    path.startswith(('src/', 'tests/', 'tools/', 'multiplayer/', 'scores/', 'public/', 'source/')) or
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

files, snapshots = {}, {}
for path in paths:
    before = previous(path)
    snapshot = path.replace('/', '-') + '.gz'
    snapshots[snapshot] = gzip.compress(before, mtime=0)
    files[path] = {'snapshot': snapshot, 'before': sha(before), 'after': sha(Path(path).read_bytes())}
manifest = {'baseline': baseline, 'files': files, 'protected': protected_hashes, 'previousFixtureCount': len(fixtures)}
expected_names = set(snapshots) | {'revision.json'}
if folder.exists() and any(not path.is_file() or path.name not in expected_names for path in folder.iterdir()):
    raise SystemExit('Unexpected file or directory in the new leaf')
if check_only:
    if revision_path.exists() and json.loads(revision_path.read_text()) != manifest:
        raise SystemExit('Captured leaf does not match current candidate')
    print(len(files), 'candidate inputs;', len(protected_hashes), 'protected inputs including all 7298 old fixtures; no writes')
else:
    folder.mkdir(parents=True, exist_ok=True)
    for name, data in snapshots.items():
        (folder / name).write_bytes(data)
    revision_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print(len(files), 'captured rattle-clips inputs; all 7298 older fixtures preserved')
