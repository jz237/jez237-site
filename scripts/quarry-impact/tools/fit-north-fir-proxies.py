"""Fit compact flare bands to the actual exported photographed trunk surface.

The lower scan includes an asymmetric ground/root plate. A single convex hull
around its full height produced an invisible collar. Consecutive narrow bands
follow radial triangle intersections instead, with a separately fitted stem.
"""
import hashlib
import json
import struct
from pathlib import Path
import numpy as np
from scipy.spatial import ConvexHull

ROOT = Path(__file__).resolve().parents[1]
variants = []
for variant in range(3):
    path = ROOT / f'public/models/quarry-north-fir-{variant}.glb'
    shipped = path.read_bytes()
    decoded = ROOT / f'outputs/forest-edge/authoring/decoded/{path.name}'
    data = decoded.read_bytes(); size = struct.unpack_from('<I', data, 12)[0]
    document = json.loads(data[20:20 + size]); blob = data[28 + size:]
    def accessor(index):
        attribute = document['accessors'][index]; view = document['bufferViews'][attribute['bufferView']]
        return np.frombuffer(blob, dtype={5126: np.float32, 5125: np.uint32, 5123: np.uint16}[attribute['componentType']],
            count=attribute['count'] * {'SCALAR': 1, 'VEC3': 3, 'VEC2': 2}[attribute['type']],
            offset=view.get('byteOffset', 0) + attribute.get('byteOffset', 0)).reshape(attribute['count'], -1)
    mesh = next(m for m in document['meshes'] if m['name'] == f'NorthFir_{variant}_near_Trunk')
    primitive = mesh['primitives'][0]
    triangles = accessor(primitive['attributes']['POSITION'])[accessor(primitive['indices']).reshape(-1, 3)]
    vertices = np.unique(triangles.reshape(-1, 3), axis=0)
    plate = vertices[vertices[:, 1] <= .012]
    footprint = []
    for angle in np.linspace(0, 2 * np.pi, 48, endpoint=False):
        direction = np.array([np.cos(angle), np.sin(angle)])
        footprint.append(plate[np.argmax(plate[:, [0, 2]] @ direction)])
    footprint = np.unique(np.asarray(footprint), axis=0)
    rings = []
    for y in [.002, .004, .008, .014, .022, .035, .05]:
        hits = []
        for a, b in [(0, 1), (1, 2), (2, 0)]:
            start, end = triangles[:, a], triangles[:, b]
            valid = (start[:, 1] <= y) != (end[:, 1] <= y)
            factor = (y - start[valid, 1]) / (end[valid, 1] - start[valid, 1])
            points = start[valid] + (end[valid] - start[valid]) * factor[:, None]
            hits.extend(zip(np.flatnonzero(valid).tolist(), points[:, [0, 2]].tolist()))
        by_triangle = {}
        for key, point in hits: by_triangle.setdefault(key, []).append(point)
        segments = np.asarray([points for points in by_triangle.values() if len(points) == 2])
        begin, delta = segments[:, 0], segments[:, 1] - segments[:, 0]
        ring = []
        for angle in np.linspace(0, np.pi * 2, 32, endpoint=False):
            direction = np.array([np.cos(angle), np.sin(angle)])
            denominator = direction[0] * delta[:, 1] - direction[1] * delta[:, 0]
            safe = np.abs(denominator) > 1e-12
            distance = np.full(len(delta), np.inf); edge = np.full(len(delta), np.inf)
            distance[safe] = (begin[safe, 0] * delta[safe, 1] - begin[safe, 1] * delta[safe, 0]) / denominator[safe]
            edge[safe] = (begin[safe, 0] * direction[1] - begin[safe, 1] * direction[0]) / denominator[safe]
            valid = safe & (distance > 0) & (edge >= -1e-7) & (edge <= 1 + 1e-7)
            radius = float(np.min(distance[valid])) if valid.any() else [0.0073, .0115, .0097][variant]
            ring.append([direction[0] * radius, y, direction[1] * radius])
        rings.append(np.asarray(ring, dtype=np.float32))
    parts = []
    for lower, upper in zip(rings[:-1], rings[1:]):
        points = np.concatenate([lower, upper]); hull = ConvexHull(points)
        parts.append(points[hull.vertices].reshape(-1).tolist())
    variants.append({'variant': variant, 'normalizedStemRadius': [.0073, .0115, .0097][variant],
        'normalizedStemHeight': .84, 'parts': parts,
        'bands': [[float(a[0, 1]), float(b[0, 1])] for a, b in zip(rings[:-1], rings[1:])],
        'groundPlate': {'maxNormalizedY': .012, 'supportDirections': 48,
            'selection': 'Outermost signed XZ support vertex in each of48 radial directions, from actual near Trunk vertices atY<=.012; no canopy/branch points',
            'points': footprint.tolist()},
        'modelSha256': hashlib.sha256(shipped).hexdigest()})
    print(variant, 'profile radii', [round(float(np.linalg.norm(r[:, [0, 2]], axis=1).max()), 5) for r in rings], flush=True)
output = {'method': '32 radial intersections per actual near-trunk horizontal section; six disjoint convex height bands. Central radius independently fitted to visible trunk above flare.', 'variants': variants}
(ROOT / 'source/models/quarry-north-fir-proxies.json').write_text(json.dumps(output, indent=2) + '\n', encoding='utf-8', newline='\n')
