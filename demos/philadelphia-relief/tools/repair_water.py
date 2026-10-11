"""Repair baked OSM water rings and remove overlapping transparent surfaces.

Requires Shapely. The original geometry remains in Git history. Linear river
features and polygon properties are preserved; repairs do not fetch new data.
"""
import json
from pathlib import Path

from shapely import make_valid
from shapely.geometry import GeometryCollection, mapping, shape
from shapely.ops import unary_union


def polygons(geometry):
    if geometry.geom_type == 'Polygon':
        yield geometry
    elif hasattr(geometry, 'geoms'):
        for child in geometry.geoms:
            yield from polygons(child)


def repair(document):
    result = dict(document)
    features = []
    covered = GeometryCollection()
    for feature in document['features']:
        if feature['geometry']['type'] not in ('Polygon', 'MultiPolygon'):
            features.append(feature)
            continue
        clean = unary_union(list(polygons(make_valid(shape(feature['geometry'])))))
        # Source ways and relation members can repeat the same water surface.
        # Drawing those twice changes alpha inside visible triangle boundaries.
        clean = clean.difference(covered)
        pieces = list(polygons(clean))
        if not pieces:
            continue
        clean = unary_union(pieces)
        covered = covered.union(clean)
        features.append({**feature, 'geometry': mapping(clean)})
    result['features'] = features
    result['geometryRepair'] = 'tools/repair_water.py: valid, non-overlapping water polygons'
    return result


if __name__ == '__main__':
    path = Path(__file__).resolve().parent.parent / 'data' / 'water.geojson'
    source = json.loads(path.read_text(encoding='utf-8'))
    result = repair(source)
    path.write_text(json.dumps(result, separators=(',', ':')) + '\n', encoding='utf-8')
    print(f"Water repair: {len(source['features'])} -> {len(result['features'])} features")
