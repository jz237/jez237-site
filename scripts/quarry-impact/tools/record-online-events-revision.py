from pathlib import Path
import json,gzip,hashlib
root=Path(__file__).resolve().parents[1];path=root/'tests/fixtures/online-events/revision.json';revision=json.loads(path.read_text())
for file,entry in revision['files'].items():
 before=gzip.decompress((path.parent/entry['snapshot']).read_bytes())
 assert hashlib.sha256(before).hexdigest()==entry['before']
 entry['after']=hashlib.sha256((root/file).read_bytes()).hexdigest()
path.write_text(json.dumps(revision,indent=2)+'\n')
