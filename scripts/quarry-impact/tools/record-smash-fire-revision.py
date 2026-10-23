"""Freeze the additive smash-fire release; --check never writes."""
from pathlib import Path
import gzip
import hashlib
import json
import subprocess
import sys

baseline = '2d49e08a8fc3d18ed7da8c02c8fc6b75436f7f0c'
folder = Path('tests/fixtures/smash-fire')
revision_path = folder / 'revision.json'
if sys.argv[1:] not in (['--check'], ['--capture']):
    raise SystemExit('Use --check (read-only) or explicitly authorize --capture')
check_only = sys.argv[1:] == ['--check']
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This leaf is committed; create a successor instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = ['src/damage-handling.ts', 'src/vehicle.ts', 'src/main.ts', 'tests/smash-fire.test.ts', 'work/destruction-tests.txt', 'public/models/packed/alder-ab48ebfccffc.glb.gz', 'public/models/packed/buggy-c10c6af9e006.glb.gz', 'public/models/packed/compact-b26c0f0b87b3.glb.gz', 'public/models/packed/cornet-812565dfc693.glb.gz', 'public/models/packed/fernleigh-d44821a4a9f0.glb.gz', 'public/models/packed/hollins-7195adc98912.glb.gz', 'public/models/packed/kite-3e7b24122478.glb.gz', 'public/models/packed/linnet-447ae1334d2f.glb.gz', 'public/models/packed/marten-b2dacf6660c8.glb.gz', 'public/models/packed/morrow-56087bc6e4f4.glb.gz', 'public/models/packed/muscle-9adc04fd431d.glb.gz', 'public/models/packed/pipit-8b27a14cc536.glb.gz', 'public/models/packed/ravenhill-f9cff36bb8bb.glb.gz', 'public/models/packed/regent-86654fe34a58.glb.gz', 'public/models/packed/saber-beb2efaf1323.glb.gz', 'public/models/packed/shuttle-6f576f6390e7.glb.gz', 'public/models/packed/starfin-4f7720a2d5e3.glb.gz', 'public/models/packed/tern-15bcf1de4577.glb.gz', 'public/models/packed/tordal-3e776614fdb2.glb.gz', 'public/models/packed/trail-bf1becebe62d.glb.gz', 'public/models/packed/utility-756e8ed025e2.glb.gz', 'public/models/packed/van-d7af282b0910.glb.gz', 'public/models/packed/wagon-9600b2eb1ee2.glb.gz', 'src/packed-models.json', 'tests/fastest-hit-invariants.ts', 'tests/fastest-hit-history.test.ts', 'tests/smash-fire-invariants.ts', 'tests/smash-fire-history.test.ts', 'tools/record-smash-fire-revision.py']
sha = lambda data: hashlib.sha256(data).hexdigest()
tracked = set(subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', baseline]).decode().splitlines())
fixtures = sorted(path for path in tracked if path.startswith('tests/fixtures/'))
if len(fixtures) != 6322:
    raise SystemExit('Expected all 6322 immutable predecessor fixtures')

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
    print(len(files), 'candidate inputs;', len(protected_hashes), 'protected inputs including all 6322 old fixtures; no writes')
else:
    folder.mkdir(parents=True, exist_ok=True)
    for name, data in snapshots.items():
        (folder / name).write_bytes(data)
    revision_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print(len(files), 'captured smash-fire inputs; all 6322 older fixtures preserved')
