"""Preserve street names from an Overpass response before line simplification."""
import argparse
import json
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, required=True)
args = parser.parse_args()
raw = json.loads(args.source.read_text(encoding='utf-8'))
if raw.get('remark') or not raw.get('elements'):
    raise SystemExit('Incomplete source; existing labels preserved')
seen, labels = set(), []
for element in raw['elements']:
    tags, geometry = element.get('tags', {}), element.get('geometry', [])
    if not tags.get('name') or not tags.get('highway') or len(geometry) < 2:
        continue
    point = geometry[len(geometry) // 2]
    key = (tags['name'], round(point['lon'] / .0015), round(point['lat'] / .0015))
    if key in seen:
        continue
    seen.add(key)
    labels.append(dict(name=tags['name'], lon=point['lon'], lat=point['lat'], kind='street', rank=2.0))
target = Path(__file__).resolve().parents[1] / 'data/street-labels.json'
target.write_text(json.dumps(dict(source='OpenStreetMap contributors, ODbL 1.0', labels=labels),
                            separators=(',', ':')) + '\n', encoding='utf-8')
print(f'{len(labels)} street labels')
