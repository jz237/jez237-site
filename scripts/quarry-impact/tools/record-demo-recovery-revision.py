from pathlib import Path
import gzip, hashlib, json, subprocess
baseline = '2e641fea22272631c1dad949f8a14f5814c95b20'
folder = Path('tests/fixtures/demo-recovery')
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:tests/fixtures/demo-recovery/revision.json'], capture_output=True).returncode == 0:
    raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
paths = ['src/demo-director.ts', 'tests/van-coachwork-invariants.ts',
         'tests/demo-recovery.test.ts', 'tests/demo-recovery-history.test.ts']
folder.mkdir(parents=True, exist_ok=True)
files = {}
for path in paths:
    old = subprocess.run(['git', 'show', baseline + ':' + path], capture_output=True)
    if old.returncode and subprocess.run(['git', 'cat-file', '-e', baseline], capture_output=True).returncode:
        raise SystemExit('Unavailable revision baseline')
    previous = old.stdout
    snapshot = path.replace('/', '-') + '.gz'
    (folder / snapshot).write_bytes(gzip.compress(previous, mtime=0))
    files[path] = {'snapshot': snapshot, 'before': hashlib.sha256(previous).hexdigest(),
                   'after': hashlib.sha256(Path(path).read_bytes()).hexdigest()}
(folder / 'revision.json').write_text(json.dumps({'baseline': baseline, 'files': files}, indent=2) + '\n')
print(len(files), 'frozen demo-recovery inputs')
