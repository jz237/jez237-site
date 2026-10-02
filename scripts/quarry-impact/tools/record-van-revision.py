from pathlib import Path
import subprocess, hashlib, json, gzip

baseline = '0be79d8'
folder = Path('tests/fixtures/van')
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:tests/fixtures/van/revision.json'], capture_output=True).returncode == 0:
    raise SystemExit('Van revision is committed; create a new revision layer instead of recapturing it')
paths = subprocess.check_output(['git', 'diff', '--name-only', baseline]).decode().splitlines()
paths = [p for p in paths if p.startswith(('src/', 'tests/', 'tools/')) and not p.startswith('tests/fixtures/van/')]
paths += ['src/van-asset.ts', 'src/vehicle-pressing.ts', 'tools/build-van.ts', 'tools/van-asset-preview.js', 'tools/check-van-release.mjs', 'van-asset-preview.html', 'public/models/van.glb', 'public/models/van-candidate.glb', 'public/licenses/RILLFORD-CARRIER.md', 'tests/van.test.ts']
folder.mkdir(parents=True, exist_ok=True)
files = {}
for p in sorted(set(paths)):
    old = subprocess.run(['git', 'show', baseline + ':' + p], capture_output=True).stdout
    snapshot = p.replace('/', '-') + '.gz'
    (folder / snapshot).write_bytes(gzip.compress(old, mtime=0))
    files[p] = {'snapshot': snapshot, 'before': hashlib.sha256(old).hexdigest(), 'after': hashlib.sha256(Path(p).read_bytes()).hexdigest()}
(folder / 'revision.json').write_text(json.dumps({'baseline': baseline, 'files': files}, indent=2) + '\n')
print(len(files), 'van revision inputs frozen against the published compact release')
