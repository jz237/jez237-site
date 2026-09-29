"""Preserve the approved fire release for the historical regression chain."""
import pathlib, hashlib, gzip, json
root=pathlib.Path(__file__).resolve().parents[1]
files={}
for old in (root/'outputs/wreck-finish/original').iterdir():
    name='src/'+old.name
    before=old.read_bytes();after=(root/name).read_bytes()
    if before==after:continue
    snapshot='tests/fixtures/wreck-finish-before-'+old.name+'.gz'
    (root/snapshot).write_bytes(gzip.compress(before,mtime=0))
    files[name]={'before':hashlib.sha256(before).hexdigest(),'after':hashlib.sha256(after).hexdigest(),'snapshot':snapshot}
(root/'source/wreck-finish-revision.json').write_text(json.dumps({'previousRelease':'448c0c2b3bdc96b3ea0deed92d22a6f0a5025916','scope':'Visual panel compression, clean cut strips, hinged parts, persistent chips and soot, damage-directed wreck camera. Worker inputs unchanged.','files':files},indent=2)+'\n',encoding='utf-8')
