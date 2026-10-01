"""Record reviewed changes while retaining the immutable preceding source snapshot."""
from pathlib import Path
import gzip,hashlib,json,subprocess
root=Path(__file__).resolve().parents[1]
fixture=root/'tests/fixtures/controls'
fixture.mkdir(parents=True,exist_ok=True)
prior=json.loads((fixture/'revision.json').read_text()) if (fixture/'revision.json').exists() else None
files={}
for name in ['src/main.ts','src/style.css']:
    if prior and name in prior['files']:
        entry=prior['files'][name]
        before=gzip.decompress((fixture/entry['snapshot']).read_bytes())
        assert hashlib.sha256(before).hexdigest()==entry['before'], 'Baseline snapshot changed'
    else:
        before=subprocess.check_output(['git','show','64074af:'+name],cwd=root)
    after=(root/name).read_bytes();snapshot=name.replace('/','-')+'.gz'
    (fixture/snapshot).write_bytes(gzip.compress(before,mtime=0))
    files[name]={'before':hashlib.sha256(before).hexdigest(),'after':hashlib.sha256(after).hexdigest(),'snapshot':snapshot}
(fixture/'revision.json').write_text(json.dumps({'baseline':'64074af','purpose':'Remappable driving controls, gamepad calibration and steering limit assist','files':files},indent=2)+'\n')
