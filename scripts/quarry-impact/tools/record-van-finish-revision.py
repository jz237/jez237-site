from pathlib import Path
import gzip, hashlib, json, subprocess

baseline = '62d2d8d'
folder = Path('tests/fixtures/van-finish')
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:tests/fixtures/van-finish/revision.json'], capture_output=True).returncode == 0:
    raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
paths = ['src/van-asset.ts', 'src/assets.ts', 'src/formed-vehicle-panel.ts',
         'public/models/van.glb', 'public/models/van-candidate.glb',
         'tests/van-invariants.ts', 'tests/van-finish.test.ts']
folder.mkdir(parents=True, exist_ok=True)
files = {}
for path in paths:
    old = subprocess.run(['git', 'show', baseline + ':' + path], capture_output=True).stdout
    snapshot = path.replace('/', '-') + '.gz'
    (folder / snapshot).write_bytes(gzip.compress(old, mtime=0))
    files[path] = {'snapshot': snapshot, 'before': hashlib.sha256(old).hexdigest(),
                   'after': hashlib.sha256(Path(path).read_bytes()).hexdigest()}
(folder / 'revision.json').write_text(json.dumps({'baseline': baseline, 'files': files}, indent=2) + '\n')
print(len(files), 'vehicle-finish revision inputs recorded against the published van')
