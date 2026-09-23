"""Refresh public PWD map snapshots. No private infrastructure endpoints."""
import json, urllib.request, urllib.parse, concurrent.futures
from pathlib import Path
BASE='https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/'
OUT=Path(__file__).resolve().parents[1]/'data'/'underground'
AREAS={
 'center':[-75.191,39.940,-75.14,39.967],
 'mill':[-75.255,39.948,-75.196,39.990],
 'wingohocking':[-75.188,40.014,-75.128,40.056],
 'cohocksink':[-75.165,39.962,-75.108,39.998],
 'city':[-75.285,39.865,-74.95,40.15],
}
LAYERS={
 'historic':('HistoricStreams_Arc','name,source','1=1'),
 'culverts':('Hydrographic_Features_Arc','creek_name,inf1',"inf1 = 'Culverted'"),
 'outfalls':('OUTFALLS','system,outfall_type','1=1'),
 'inlets':('INLETS','system,inlettype','1=1'),
}
def query(area,key):
 name,fields,where=LAYERS[key];features=[];offset=0
 while True:
  params=dict(f='json',where=where,outFields=fields,geometry=','.join(map(str,AREAS[area])),
   geometryType='esriGeometryEnvelope',inSR=4326,outSR=4326,spatialRel='esriSpatialRelIntersects',
   returnGeometry='true',geometryPrecision=6,maxAllowableOffset=0.000015,
   resultOffset=offset,resultRecordCount=2000,orderByFields='objectid ASC')
  url=BASE+name+'/FeatureServer/0/query?'+urllib.parse.urlencode(params)
  with urllib.request.urlopen(url,timeout=60) as r:doc=json.load(r)
  if 'error' in doc:raise RuntimeError(doc['error'])
  for f in doc.get('features',[]):
   a=f['attributes'];g=f.get('geometry',{})
   if key in ('inlets','outfalls'):
    features.append([g['x'],g['y'],a.get('system') or 'Unknown',a.get('outfall_type' if key=='outfalls' else 'inlettype') or 'Unknown'])
   else:
    features.append({'name':a.get('name' if key=='historic' else 'creek_name') or 'Unnamed waterway',
     'paths':g.get('paths',[])})
  if not doc.get('exceededTransferLimit'):break
  offset+=2000
 return key,features
def build(area):
 keys=[k for k in LAYERS if area!='city' or k!='inlets']
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:data=dict(pool.map(lambda k:query(area,k),keys))
 data['inlets']=data.get('inlets',[])
 data['bounds']=AREAS[area];data['retrieved']='2026-09-23'
 data['source']='City of Philadelphia / Philadelphia Water Department open data'
 OUT.mkdir(exist_ok=True)
 path=OUT/(area+'.json');path.write_text(json.dumps(data,separators=(',',':')),encoding='utf-8')
 print(area,{k:len(data[k]) for k in LAYERS},path.stat().st_size)
if __name__=='__main__':
 for area in AREAS:build(area)
