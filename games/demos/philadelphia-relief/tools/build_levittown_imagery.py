"""Bake a USGS Levittown backdrop; bounds match terrain.js. Requires Pillow."""
from urllib.request import urlopen
from urllib.parse import urlencode
from PIL import Image
from io import BytesIO
from pathlib import Path
q=urlencode({'bbox':'-74.9067,40.1188,-74.8587,40.1548','bboxSR':4326,'imageSR':4326,'size':'2048,1536','format':'jpg','f':'image'})
with urlopen('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/export?'+q,timeout=60) as response:data=response.read()
image=Image.open(BytesIO(data));target=(Path(__file__).resolve().parents[1] / 'data/imagery-levittown.webp');image.save(target,quality=88,method=6);print(image.size,target.stat().st_size)
