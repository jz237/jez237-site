"""Bake a USGS city backdrop; bounds match terrain.js. Requires Pillow."""
import urllib.request,urllib.parse,io
from pathlib import Path
from PIL import Image
q=urllib.parse.urlencode({'bbox':'-75.235,39.90,-75.095,40.005','bboxSR':4326,'imageSR':4326,'size':'4096,4096','format':'jpg','transparent':'false','f':'image'})
u='https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/export?'+q
with urllib.request.urlopen(u,timeout=90) as r: data=r.read()
im=Image.open(io.BytesIO(data));im.save(Path(__file__).resolve().parents[1] / 'data/imagery-city.webp',quality=90,method=6)
print(im.size,Path(Path(__file__).resolve().parents[1] / 'data/imagery-city.webp').stat().st_size)
