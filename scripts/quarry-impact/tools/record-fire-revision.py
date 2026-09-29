"""Freeze the preceding public source; no simulation fixtures are rewritten."""
import pathlib,hashlib,gzip,json
root=pathlib.Path(__file__).resolve().parents[1]
files={}
for old in (root/'outputs/vehicle-fire/original').iterdir():
    name='src/'+old.name
    before=old.read_bytes();after=(root/name).read_bytes()
    if before==after:continue
    snapshot='tests/fixtures/fire-before-'+old.name+'.gz'
    (root/snapshot).write_bytes(gzip.compress(before,mtime=0))
    files[name]={'before':hashlib.sha256(before).hexdigest(),'after':hashlib.sha256(after).hexdigest(),'snapshot':snapshot}
(root/'source/fire-revision.json').write_text(json.dumps({'previousRelease':'f21a7502d202555920aaeb6981c1148f05d94d00','scope':'Presentation-only vehicle combustion, smoke and offline ElevenLabs effects. Shared simulation unchanged.','files':files},indent=2)+'\n',encoding='utf-8')
