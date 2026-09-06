"""Refresh local streets around The Hidden Reef; reuse --source for an Overpass JSON file."""
import argparse, json, urllib.request, urllib.parse
from pathlib import Path
from build_vectors import simplify, chain_lines
parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path)
args = parser.parse_args()
query = '[out:json][timeout:35];way["highway"~"^(residential|tertiary|unclassified|living_street|secondary|primary)$"](40.12,-74.91,40.155,-74.855);out geom;'
if args.source:
    data = json.loads(args.source.read_text())
else:
    request = urllib.request.Request('https://overpass-api.de/api/interpreter',
        data=urllib.parse.urlencode({'data': query}).encode(),
        headers={'User-Agent': 'PhiladelphiaRelief static-map-data-build'})
    with urllib.request.urlopen(request, timeout=55) as response:
        data = json.load(response)
if data.get('remark') or not data.get('elements'):
    raise SystemExit('Incomplete street data; existing asset preserved')
lines = [[(round(p['lon'], 6), round(p['lat'], 6)) for p in e.get('geometry', [])]
    for e in data['elements'] if 'highway' in e.get('tags', {})]
lines = [line for line in lines if len(line) > 1]
path = Path(__file__).resolve().parents[1] / 'data/roads.geojson'
doc = json.loads(path.read_text())
doc['features'] = [f for f in doc['features'] if f['properties'].get('district') != 'levittown']
doc['features'].append({'type': 'Feature', 'properties': {'t': 5, 'district': 'levittown'},
    'geometry': {'type': 'MultiLineString', 'coordinates': [simplify(c, 1.5) for c in chain_lines(lines)]}})
doc['levittownStreets'] = {'source': 'OpenStreetMap contributors, ODbL 1.0', 'ways': len(lines),
    'bounds': [40.12, -74.91, 40.155, -74.855]}
path.write_text(json.dumps(doc, separators=(',', ':')) + '\n')
print(f'Added {len(lines)} Levittown street segments')
