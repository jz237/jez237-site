"""Record this bounded visual/effects revision without replacing old fixtures.
Requires the preserved, byte-identical source from the previous release.
"""
import pathlib,hashlib,gzip,json
root=pathlib.Path(__file__).resolve().parents[1]
files={}
for old in (root/'outputs/workyard/original').glob('*.ts'):
    name='src/'+old.name
    before=old.read_bytes();after=(root/name).read_bytes()
    if before==after:continue
    snapshot='tests/fixtures/workyard-before-'+old.name+'.gz'
    (root/snapshot).write_bytes(gzip.compress(before,mtime=0))
    files[name]={'before':hashlib.sha256(before).hexdigest(),'after':hashlib.sha256(after).hexdigest(),'snapshot':snapshot}
(root/'source/workyard-revision.json').write_text(json.dumps({'previousRelease':'5ae55c09a983b5cae8b92c3d9d2d3fd62d7cc84e','scope':'Industrial scenery, lighting and presentation-only crash response. Shared Worker/physics inputs unchanged.','files':files},indent=2)+'\n')
