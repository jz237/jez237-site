from pathlib import Path
import gzip, hashlib, json, subprocess
baseline = 'bcdb9f4'
folder = Path('tests/fixtures/demo-quality')
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:tests/fixtures/demo-quality/revision.json'], capture_output=True).returncode == 0:
    raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
paths = [
    'src/assets.ts', 'src/main.ts', 'multiplayer/simulation.ts',
    'src/impact-adjudication.ts', 'tests/impact-adjudication.test.ts',
    'tests/buggy-batching.test.ts', 'tests/armor-invariants.ts', 'tests/armor-integration.test.ts',
    'tests/online-damage.test.ts', 'tests/online-setup-physics.test.ts',
]
folder.mkdir(parents=True, exist_ok=True)
files = {}
for path in paths:
    previous = subprocess.run(['git', 'show', baseline + ':' + path], capture_output=True).stdout
    snapshot = path.replace('/', '-') + '.gz'
    (folder / snapshot).write_bytes(gzip.compress(previous, mtime=0))
    files[path] = {'snapshot': snapshot, 'before': hashlib.sha256(previous).hexdigest(), 'after': hashlib.sha256(Path(path).read_bytes()).hexdigest()}
(folder / 'revision.json').write_text(json.dumps({'baseline': baseline, 'files': files}, indent=2) + '\n')
print(len(files), 'frozen demo-quality inputs')
