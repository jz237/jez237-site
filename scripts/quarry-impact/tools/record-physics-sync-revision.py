from pathlib import Path
import gzip,hashlib,json
root=Path(__file__).resolve().parents[1];fixture=root/'tests/fixtures/physics-sync';path=fixture/'revision.json';revision=json.loads(path.read_text())
for name,entry in revision['files'].items():
 before=gzip.decompress((fixture/entry['snapshot']).read_bytes());assert hashlib.sha256(before).hexdigest()==entry['before']
 entry['after']=hashlib.sha256((root/name).read_bytes()).hexdigest()
path.write_text(json.dumps(revision,indent=2)+'\n')
