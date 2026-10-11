"""Prepare the local, public-domain Natural Earth 1:50m hurricane basemap.

python scripts/weather-hurricane-basemap.py <ne_50m_admin_0_countries.geojson>
Source: https://github.com/nvkelso/natural-earth-vector/tree/master/geojson
No runtime downloads, map keys, or tile services are required by the page.
"""
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


def prepare_ring(ring):
    rounded = [[round(x, 3), round(y, 3)] for x, y in simplify(ring)[:-1]]
    if len(rounded) < 3:
        return []
    return rounded + [rounded[0]]


source = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
features = []
for feature in source['features']:
    geometry = feature['geometry']
    polygons = [geometry['coordinates']] if geometry['type'] == 'Polygon' else geometry['coordinates']
    retained = []
    for polygon in polygons:
        rings = [prepare_ring(ring) for ring in polygon]
        if rings[0]:
            valid = [ring for ring in rings if ring]
            retained.append(valid)
            # Leaflet can display longitudes outside -180..180. Keep an intact
            # western copy of date-line land so Pacific tracks have context.
            if max(point[0] for point in valid[0]) >= 130:
                retained.append([[[round(x - 360, 3), y] for x, y in ring] for ring in valid])
    if retained:
        properties = feature['properties']
        features.append({'type': 'Feature', 'properties': {'name': properties['NAME_EN']},
                         'geometry': {'type': 'MultiPolygon', 'coordinates': retained}})
output = Path(__file__).resolve().parents[1] / 'weather/data/basemap.geojson'
output.write_text(json.dumps({'type': 'FeatureCollection', 'features': features}, separators=(',', ':')), encoding='utf-8')
print(f'{len(features)} countries · {output.stat().st_size:,} bytes · {output}')
