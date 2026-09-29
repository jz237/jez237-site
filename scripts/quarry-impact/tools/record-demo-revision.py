"""Preserve the previous tested wreck release, including its historical hash chain."""
from pathlib import Path
import gzip,hashlib,json
root=Path(__file__).resolve().parents[1]
files={}
for old in (root/'outputs/demo-ai-fire/original').iterdir():
    name='src/'+old.name;before=old.read_bytes();after=(root/name).read_bytes()
    if before==after:continue
    snapshot='tests/fixtures/demo-before-'+old.name+'.gz'
    (root/snapshot).write_bytes(gzip.compress(before,mtime=0))
    files[name]={'before':hashlib.sha256(before).hexdigest(),'after':hashlib.sha256(after).hexdigest(),'snapshot':snapshot}
(root/'source/demo-revision.json').write_text(json.dumps({'previousRelease':'f11dedbb1f2626628c1f5ce781c9122e64a29330','scope':'Solo/demo driving, spectator cameras, variable vehicle fire and rare delayed cosmetic fuel bursts. Worker inputs and audio files unchanged.','files':files},indent=2)+'\n',encoding='utf-8')
