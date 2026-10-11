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


def clip_ring(ring):
    points = ring[:-1]
    for axis, edge, keep_above in [(0, -180, True), (0, 12, False), (1, -8, True), (1, 72, False)]:
        result = []
        if not points:
            return []
        previous = points[-1]
        inside = lambda point: point[axis] >= edge if keep_above else point[axis] <= edge
        for current in points:
            if inside(current) != inside(previous):
                t = (edge - previous[axis]) / (current[axis] - previous[axis])
                result.append([previous[j] + t * (current[j] - previous[j]) for j in range(2)])
            if inside(current):
                result.append(current)
            previous = current
        points = result
    rounded = [[round(x, 3), round(y, 3)] for x, y in points]
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
        shell = clip_ring(simplify(polygon[0]))
        if len(shell) >= 4:
            retained.append([shell])
    if retained:
        properties = feature['properties']
        features.append({'type': 'Feature', 'properties': {'name': properties['NAME_EN']},
                         'geometry': {'type': 'MultiPolygon', 'coordinates': retained}})
output = Path(__file__).resolve().parents[1] / 'weather/data/basemap.geojson'
output.write_text(json.dumps({'type': 'FeatureCollection', 'features': features}, separators=(',', ':')), encoding='utf-8')
print(f'{len(features)} countries · {output.stat().st_size:,} bytes · {output}')
