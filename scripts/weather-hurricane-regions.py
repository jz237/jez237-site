"""Prepare small US/Canada context layers from public-domain Natural Earth 50m.

Usage: python scripts/weather-hurricane-regions.py <admin1_lines.geojson> <admin1_regions.geojson>
Source: https://github.com/nvkelso/natural-earth-vector/tree/master/geojson
These are approximate map context, not weather warning boundaries.
"""
import gzip
import json
import math
import sys
from pathlib import Path


def simplify(points, tolerance=0.025):
    if len(points) <= 2:
        return points
    ax, ay = points[0]
    bx, by = points[-1]
    dx, dy = bx - ax, by - ay
    length = dx * dx + dy * dy
    furthest, index = 0, 0
    for i, (x, y) in enumerate(points[1:-1], 1):
        t = max(0, min(1, ((x - ax) * dx + (y - ay) * dy) / length)) if length else 0
        distance = math.hypot(x - ax - t * dx, y - ay - t * dy)
        if distance > furthest:
            furthest, index = distance, i
    if furthest > tolerance:
        return simplify(points[:index + 1], tolerance)[:-1] + simplify(points[index:], tolerance)
    return [points[0], points[-1]]


lines = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
regions = json.loads(Path(sys.argv[2]).read_text(encoding='utf-8'))
features, labels = [], []
for feature in lines['features']:
    if feature['properties']['ADM0_A3'] not in ['USA', 'CAN']:
        continue
    assert feature['geometry']['type'] == 'LineString'
    coordinates = [[round(x, 3), round(y, 3)] for x, y in simplify(feature['geometry']['coordinates'])]
    features.append({'type': 'Feature', 'properties': {}, 'geometry': {'type': 'LineString', 'coordinates': coordinates}})
for feature in regions['features']:
    p = feature['properties']
    if p['adm0_a3'] in ['USA', 'CAN']:
        labels.append({'name': p['name'], 'short': p['postal'], 'lat': round(p['latitude'], 3), 'lon': round(p['longitude'], 3)})
raw = json.dumps({'type': 'FeatureCollection', 'features': features, 'labels': labels}, separators=(',', ':')).encode('utf-8')
output = Path(__file__).resolve().parents[1] / 'weather/data/north-america-regions.geojson'
output.write_bytes(raw)
print(f'{len(features)} boundaries / {len(labels)} labels / {len(raw):,} bytes / {len(gzip.compress(raw)):,} gzip bytes')
