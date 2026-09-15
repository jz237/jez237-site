"""Regenerate lossless delivery images after changing the two source PNG atlases.
Requires Pillow. Run from scripts/rotatable-aquascape, then npm run build:sites.
"""
from pathlib import Path
import hashlib,json
from PIL import Image
root=Path(__file__).resolve().parent
out=root/'loading-source';out.mkdir(exist_ok=True)
records={}
for name in ['living-species','grazer-material-atlas']:
 src=root/'public'/(name+'.png');dst=out/(name+'.webp');image=Image.open(src)
 image.save(dst,'WEBP',lossless=True,method=4,exact=True)
 assert Image.open(dst).convert(image.mode).tobytes()==image.tobytes()
 records[name]={'sourceSHA256':hashlib.sha256(src.read_bytes()).hexdigest(),'webpSHA256':hashlib.sha256(dst.read_bytes()).hexdigest(),'decodedSHA256':hashlib.sha256(image.tobytes()).hexdigest(),'size':image.size,'mode':image.mode}
(out/'pixel-provenance.json').write_text(json.dumps(records,indent=2)+'\n',encoding='utf-8')
