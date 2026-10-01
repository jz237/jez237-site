"""Record reviewed garage edits against the isolated baseline Git commit.
Run only after reviewing the source diff; does not change older release fixtures.
"""
from pathlib import Path
import gzip,hashlib,json,subprocess
root=Path(__file__).resolve().parents[1]
fixture=root/'tests/fixtures/garage'
fixture.mkdir(parents=True,exist_ok=True)
previous=json.loads((fixture/'revision.json').read_text()) if (fixture/'revision.json').exists() else None
files={}
for name in ['src/main.ts','src/vehicle.ts','src/style.css']:
    if previous:
        entry=previous['files'][name]
        before=gzip.decompress((fixture/entry['snapshot']).read_bytes())
        assert hashlib.sha256(before).hexdigest()==entry['before'], 'Baseline snapshot changed'
    else:
        before=subprocess.check_output(['git','show','81bb167:'+name],cwd=root)
    after=(root/name).read_bytes()
    snapshot=name.replace('/','-')+'.gz'
    (fixture/snapshot).write_bytes(gzip.compress(before,mtime=0))
    files[name]={'before':hashlib.sha256(before).hexdigest(),'after':hashlib.sha256(after).hexdigest(),'snapshot':snapshot}
(fixture/'revision.json').write_text(json.dumps({'baseline':'529c847e8a03812491ff8de1f64b85f22f8166a8','purpose':'Garage, physical tuning and saved setups','files':files},indent=2)+'\n')
