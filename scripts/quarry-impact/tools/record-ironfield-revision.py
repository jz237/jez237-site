"""Freeze the additive Ironfield release; --check validates without writing."""
from pathlib import Path
import gzip
import hashlib
import json
import subprocess
import sys

baseline = '7f62f7942e536c5ad5a95618529565dca38525d5'
folder = Path('tests/fixtures/ironfield')
revision_path = folder / 'revision.json'
if sys.argv[1:] not in ([], ['--check']):
    raise SystemExit('Usage: python3 tools/record-ironfield-revision.py [--check]')
check_only = sys.argv[1:] == ['--check']
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = [
    'src/course-id.ts', 'src/race-course.ts', 'src/ironfield-course.ts',
    'src/ironfield-venue.ts', 'src/ironfield-ground.ts', 'src/ironfield-world.ts',
    'src/main.ts', 'src/event-rules.ts', 'src/event-ui.ts', 'src/demo-session.ts',
    'src/vehicle.ts', 'src/effects.ts', 'src/demo-director.ts', 'src/quarry-minimap.ts',
    'src/replay-data.ts', 'src/replay-scene.ts', 'src/replay-studio.ts',
    'src/replay-library.ts', 'src/replay-library-ui.ts', 'src/static-shadows.ts',
    'tests/ironfield.test.ts', 'tests/course-settings.test.ts',
    'tests/course-ground.test.ts', 'tests/course-world-isolation.test.ts',
    'tests/course-shadows.test.ts', 'tests/course-minimap.test.ts',
    'tests/course-replay.test.ts', 'tests/course-replay-scene.test.ts',
    'tests/course-start.test.ts',
    'tests/tyre-failure-history.test.ts',
    'tests/ironfield-invariants.ts', 'tests/tern-greenhouse-invariants.ts',
    'tools/record-ironfield-revision.py',
]
sha = lambda data: hashlib.sha256(data).hexdigest()
tracked = set(subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', baseline]).decode().splitlines())

# Everything else in the shipped renderer/physics/Quarry source and backend is
# immutable in this course release. Historical fixture manifests remain exact;
# their existing verifiers independently authenticate every compressed snapshot.
protected = sorted(path for path in tracked if path not in paths and (
    path.startswith('src/') or path.startswith('multiplayer/') or
    path.startswith('public/models/') and path.endswith('.glb') or
    path.startswith('tests/fixtures/') and path.endswith('/revision.json') or
    path in ['package.json', 'package-lock.json', 'tests/demo.test.ts',
             'tests/demo-comfort.test.ts', 'tests/demo-recovery.test.ts',
             'tests/demo-presentation.test.ts', 'tests/demo-visibility.test.ts',
             'tests/physics-sync.test.ts', 'tests/tyre-failure-integration.test.ts',
             'tests/tyre-state.test.ts']))

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
        raise SystemExit('Ironfield scope changed protected input: ' + path)
    protected_hashes[path] = expected
model_manifest = {row['file']: row['sha256'] for row in json.loads(Path('source/model-manifest.json').read_text())}
for path, expected in published_models.items():
    if model_manifest.get(path) != expected or sha(Path(path).read_bytes()) != expected:
        raise SystemExit('Ironfield changed a published vehicle asset: ' + path)
    protected_hashes[path] = expected

# Fail before freezing if an integration change escaped the explicit file list.
changed = set(subprocess.check_output(['git', 'diff', '--name-only', baseline, '--',
    'src', 'tests', 'tools', 'multiplayer', 'package.json', 'package-lock.json']).decode().splitlines())
added = set(subprocess.check_output(['git', 'ls-files', '--others', '--exclude-standard', '--', 'src', 'tests']).decode().splitlines())
unexpected = sorted(path for path in changed | added if path not in paths and not path.startswith(str(folder) + '/'))
if unexpected:
    raise SystemExit('Unlisted Ironfield source/test changes: ' + ', '.join(unexpected))

def previous(path):
    return subprocess.check_output(['git', 'show', baseline + ':' + path]) if path in tracked else b''

# Ground injection is the only permitted change to the settled demo camera.
director = Path('src/demo-director.ts').read_bytes().decode()
director = director.replace(',private groundHeight:(x:number,z:number)=>number=landscapeHeight', '')
director = director.replace('this.groundHeight', 'landscapeHeight')
if director.encode() != previous('src/demo-director.ts'):
    raise SystemExit('Ironfield changed demo camera behavior beyond ground sampling')

def camera_block(text):
    return text.split('function updateCamera(dt: number) {', 1)[1].split('function frame(now: number) {', 1)[0]

main = Path('src/main.ts').read_bytes().decode()
ground = 'Math.max(scenerySurfaceHeight(desired.x, desired.z), quarryExtensionHeight(desired.x, desired.z) ?? -Infinity, quarryWestWallHeight(desired.x, desired.z) ?? -Infinity)'
main_camera = camera_block(main).replace('activeVenue===quarryVenue?' + ground + ':activeVenue.course.height(desired.x,desired.z)', ground)
if main_camera != camera_block(previous('src/main.ts').decode()):
    raise SystemExit('Ironfield changed the main camera beyond venue ground sampling')
if b'\n' in Path('src/main.ts').read_bytes().replace(b'\r\n', b''):
    raise SystemExit('Ironfield main.ts must retain its original CRLF line endings')

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
    print(len(files), 'Ironfield inputs ready;', len(protected_hashes), 'protected inputs verified; no snapshots written')
else:
    folder.mkdir(parents=True, exist_ok=True)
    for name, data in snapshots.items():
        (folder / name).write_bytes(data)
    revision_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print(len(files), 'frozen Ironfield inputs;', len(protected_hashes), 'unchanged source, assets, physics and history inputs verified')
