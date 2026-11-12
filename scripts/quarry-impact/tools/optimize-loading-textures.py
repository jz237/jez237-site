"""Build smaller transport textures; keep source art and numeric terrain masks intact.
Requires Pillow. Run after model packing/optimization so shared image files exist.
"""
from pathlib import Path
from PIL import Image, ImageFile
import hashlib,json,io
root=Path(__file__).resolve().parents[1]
ImageFile.MAXBLOCK=64*1024*1024
public=root/'public'
out=public/'assets/loading'
out.mkdir(parents=True,exist_ok=True)
manifest={}; report=[]
sources=[p for p in sorted((public/'assets').rglob('*')) if p.is_file() and out not in p.parents and 'fx' not in p.relative_to(public/'assets').parts]+sorted((public/'models/packed/textures').glob('*'))
for source in sources:
    if source.suffix.lower() not in ['.jpg','.jpeg','.png','.webp']:continue
    with Image.open(source) as original:
        if max(original.size)<=1024 or source.stat().st_size<200_000:continue
        record={}
        for profile,edge in [('desktop',2048),('mobile',1024)]:
            im=original.copy();im.thumbnail((edge,edge),Image.Resampling.LANCZOS)
            buf=io.BytesIO()
            if 'A' in im.getbands():
                im.save(buf,format='WEBP',lossless=True,method=6);ext='webp'
            else:
                # No colour transforms: normal/ARM channels retain their interpretation.
                im.convert('RGB').save(buf,format='JPEG',quality=92,subsampling=0,optimize=True);ext='jpg'
            data=buf.getvalue()
            if len(data)>=source.stat().st_size:continue
            name=source.stem+'-'+hashlib.sha256(data).hexdigest()[:12]+'.'+ext
            target=out/name
            target.write_bytes(data);record[profile]=target.relative_to(public).as_posix()
        if record:
            manifest[source.relative_to(public).as_posix()]=record
            report.append({'source':source.relative_to(public).as_posix(),'originalBytes':source.stat().st_size,**{k:(public/v).stat().st_size for k,v in record.items()}})
(root/'src/loading-textures.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8',newline='\n')
(root/'source/loading-textures.json').write_text(json.dumps({'method':'2048px desktop / 1024px touch, JPEG 92 4:4:4; lossless WebP for alpha; original files retained','textures':report},indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps({'textures':len(report),'originalMB':sum(r['originalBytes'] for r in report)/1e6,'desktopMB':sum(r.get('desktop',r['originalBytes']) for r in report)/1e6,'mobileMB':sum(r.get('mobile',r['originalBytes']) for r in report)/1e6}))
