from pathlib import Path
import gzip, hashlib, json, subprocess
baseline = 'b3af968'
folder = Path('tests/fixtures/van-coachwork')
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:tests/fixtures/van-coachwork/revision.json'], capture_output=True).returncode == 0:
    raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
paths = ['src/van-asset.ts', 'src/van-bodywork.ts',
         'public/models/van.glb', 'public/models/van-candidate.glb',
         'tests/demo-quality-invariants.ts', 'tests/armor-integration.test.ts',
         'tests/van-coachwork.test.ts']
folder.mkdir(parents=True, exist_ok=True)
files = {}
for path in paths:
    previous = subprocess.run(['git', 'show', baseline + ':' + path], capture_output=True).stdout
    snapshot = path.replace('/', '-') + '.gz'
    (folder / snapshot).write_bytes(gzip.compress(previous, mtime=0))
    files[path] = {'snapshot': snapshot, 'before': hashlib.sha256(previous).hexdigest(),
                   'after': hashlib.sha256(Path(path).read_bytes()).hexdigest()}
(folder / 'revision.json').write_text(json.dumps({'baseline': baseline, 'files': files}, indent=2) + '\n')
print(len(files), 'frozen van-coachwork inputs')
