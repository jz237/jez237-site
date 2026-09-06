import sys,json,urllib.request,urllib.parse
from pathlib import Path
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'tools'))
from build_vectors import simplify,chain_lines
query='[out:json][timeout:55];way["highway"~"^(tertiary|residential|unclassified|living_street)$"](39.87,-75.28,40.08,-75.03);out geom;'
import argparse
parser=argparse.ArgumentParser(description='Add Philadelphia local streets to the regional roads asset.')
parser.add_argument('--source', type=Path, help='Reuse an Overpass JSON response')
args=parser.parse_args()
if args.source:
 data=json.loads(args.source.read_text(encoding='utf-8'))
else:
 req=urllib.request.Request('https://overpass-api.de/api/interpreter',
  data=urllib.parse.urlencode({'data':query}).encode(),
  headers={'User-Agent':'PhiladelphiaRelief/1.1 static-map-data-build'})
 with urllib.request.urlopen(req,timeout=70) as response: data=json.load(response)
if data.get('remark') or not data.get('elements'):
 raise SystemExit('Overpass returned incomplete or empty data; existing asset preserved')
lines=[]
for el in data['elements']:
 coords=[(round(pt['lon'],6),round(pt['lat'],6)) for pt in el.get('geometry',[])]
 if len(coords)>1: lines.append(coords)
chains=[simplify(c,1.5) for c in chain_lines(lines)]
f=root/'data/roads.geojson'; doc=json.loads(f.read_text()); doc['features']=[x for x in doc['features'] if x['properties'].get('t')!=5 or x['properties'].get('district')]
doc['features'].append({'type':'Feature','properties':{'t':5},'geometry':{'type':'MultiLineString','coordinates':chains}})
doc['localStreets']={'source':'OpenStreetMap contributors, ODbL 1.0','bounds':[39.87,-75.28,40.08,-75.03],'classes':['tertiary','residential','unclassified','living_street'],'ways':len(lines),'simplificationMetres':1.5}
f.write_text(json.dumps(doc,separators=(',',':'))+'\n')
print('Added',len(lines),'street segments in',len(chains),'chains;',f.stat().st_size,'bytes',flush=True)
