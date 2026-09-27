import pathlib, urllib.request, json, hashlib, shutil
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'public/assets'; OUT.mkdir(parents=True,exist_ok=True)
manifest=[]
def download(url,path,source):
 try:
  if not path.exists():
   req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 QuarryImpact asset preparation'})
   path.write_bytes(urllib.request.urlopen(req,timeout=60).read())
  manifest.append({'file':path.name,'source':source,'url':url,'license':'CC0-1.0','sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
  print(path.name,path.stat().st_size,flush=True)
 except Exception as e: print('FAILED',path.name,str(e),flush=True)
for asset,short in [('rock_boulder_dry','rock'),('aerial_asphalt_01','asphalt'),('brown_mud_leaves_01','mud')]:
 for typ in ['diff','nor_gl','rough']:
  download(f'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/{asset}/{asset}_{typ}_2k.jpg',OUT/f'{short}_{typ}.jpg',f'https://polyhaven.com/a/{asset}')
download('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloofendal_48d_partly_cloudy_puresky_1k.hdr',OUT/'sky.hdr','https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky')
old=ROOT.parent/'releases/jez237-choplifter-3ecb122e/games/2026-09-10/after-the-storm/assets/terrain'
for name in ['forrest_ground_01','bark_brown_02','coast_sand_rocks_02']:
 for typ in ['diff','nor_gl','rough']:
  matches=list(old.glob(f'{name}*{typ}*.jpg'))
  if matches:
   dst=OUT/f'{name}_{typ}.jpg';shutil.copyfile(matches[0],dst)
   manifest.append({'file':dst.name,'source':f'https://polyhaven.com/a/{name}','license':'CC0-1.0','sha256':hashlib.sha256(dst.read_bytes()).hexdigest()})
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2))
