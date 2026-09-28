"""Preserve the previous release's exact source bytes for old milestone tests."""
import pathlib,hashlib,gzip,json
root=pathlib.Path(__file__).resolve().parents[1]
files={}
for old in (root/'outputs/wreck-geometry/original').iterdir():
    name='src/'+old.name
    before=old.read_bytes();after=(root/name).read_bytes()
    if before==after:continue
    snapshot='tests/fixtures/wreck-before-'+old.name+'.gz'
    (root/snapshot).write_bytes(gzip.compress(before,mtime=0))
    files[name]={'before':hashlib.sha256(before).hexdigest(),'after':hashlib.sha256(after).hexdigest(),'snapshot':snapshot}
(root/'source/wreck-revision.json').write_text(json.dumps({'previousRelease':'9923eca5ee14029e440339eeccd213799f2ae3fb','scope':'Deformation topology, coherent body/window/structure damage, grouped attachments, five-second solo wreck inspection, shallow bank relief, branch trees and verge patches. All shared simulation inputs unchanged.','files':files},indent=2)+'\n',encoding='utf-8')
