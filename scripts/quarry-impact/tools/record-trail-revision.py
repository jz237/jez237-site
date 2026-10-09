"""Freeze the additive trail release; --check never writes."""
from pathlib import Path
import gzip
import hashlib
import json
import subprocess
import sys

baseline = 'db15e7f6734ee4a24913ad82f5f77e4ef296d076'
folder = Path('tests/fixtures/trail')
revision_path = folder / 'revision.json'
if sys.argv[1:] not in (['--check'], ['--capture']):
    raise SystemExit('Use --check (read-only) or explicitly authorize --capture')
check_only = sys.argv[1:] == ['--check']
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This leaf is committed; create a successor instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = ['public/licenses/CREDITS.md', 'src/assets.ts', 'src/career.ts', 'src/challenges.ts', 'src/classic-vehicle-specs.ts', 'src/club-cup.ts', 'src/grid-rules.ts', 'src/rules.ts', 'src/save-backup.ts', 'src/structural-damage.ts', 'src/tyre-condition.ts', 'src/vehicle-armor-spec.ts', 'src/vehicle-physics.ts', 'src/vehicle.ts', 'src/wreck-attachments.ts', 'tests/career.test.ts', 'tests/challenge-main.test.ts', 'tests/driving-assists.test.ts', 'tests/time-trial-ui.test.ts', 'tests/time-trial.test.ts', 'tools/check-marten-release.mjs', 'src/trail-asset.ts', 'tools/build-trail.ts', 'public/models/trail.glb', 'public/licenses/BIRCH-TRAIL.md', 'tests/trail.test.ts', 'tests/trail-courses.test.ts', 'tests/trail-drive.test.ts', 'tests/trail-preservation.test.ts', 'tests/stadium-reservoir-invariants.ts', 'tests/stadium-reservoir-history.test.ts', 'tests/trail-invariants.ts', 'tests/trail-history.test.ts', 'tools/record-trail-revision.py']
sha = lambda data: hashlib.sha256(data).hexdigest()
tracked = set(subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', baseline]).decode().splitlines())
fixtures = sorted(path for path in tracked if path.startswith('tests/fixtures/'))
if len(fixtures) != 1929:
    raise SystemExit('Expected all 1929 immutable predecessor fixtures')

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
    print(len(files), 'candidate inputs;', len(protected_hashes), 'protected inputs including all 1929 old fixtures; no writes')
else:
    folder.mkdir(parents=True, exist_ok=True)
    for name, data in snapshots.items():
        (folder / name).write_bytes(data)
    revision_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print(len(files), 'captured trail inputs; all 1929 older fixtures preserved')
