"""Record this optimization against the preserved, tested demo release."""
from pathlib import Path
import gzip, hashlib, json
root=Path(__file__).resolve().parents[1]
files={}
for old in (root/'outputs/performance-pass/original').rglob('*'):
    if not old.is_file(): continue
    name=old.relative_to(root/'outputs/performance-pass/original').as_posix()
    before=old.read_bytes();after=(root/name).read_bytes()
    if before==after:continue
    snapshot='tests/fixtures/performance-before-'+name.replace('/','-')+'.gz'
    (root/snapshot).write_bytes(gzip.compress(before,mtime=0))
    files[name]={'before':hashlib.sha256(before).hexdigest(),'after':hashlib.sha256(after).hexdigest(),'snapshot':snapshot}
(root/'source/performance-revision.json').write_bytes((json.dumps({'previousRelease':'be2a80254199583fa3718a011935eb02023bf1f6','scope':'Loading and client rendering work; original assets, physics, handling, damage field and server inputs preserved.','files':files},indent=2)+'\n').encode())
