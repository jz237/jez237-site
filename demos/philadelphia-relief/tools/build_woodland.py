"""Bake mapped OSM woodland polygons, preserving clearings and multipolygon holes.

Usage: python tools/build_woodland.py [--source cached-overpass.json]
"""
import argparse
import json
import urllib.parse
import urllib.request
from pathlib import Path
from datetime import datetime, timezone
from build_vectors import chain_lines, geom_of, simplify, round_coords, ring_area_m2

ROOT = Path(__file__).resolve().parent.parent

def contains(ring, point):
    x, y = point
    inside = False
    for a, b in zip(ring, ring[1:] + ring[:1]):
        if (a[1] > y) != (b[1] > y) and x < (b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]:
            inside = not inside
    return inside

def build(raw):
    if raw.get('remark') or not raw.get('elements'):
        raise ValueError('Incomplete woodland extract')
    features = []
    members = {m['ref'] for e in raw['elements'] if e['type'] == 'relation'
               for m in e.get('members', []) if m['type'] == 'way'}
    def clean(ring):
        if len(ring) < 4 or ring[0] != ring[-1] or ring_area_m2(ring) < 600:
            return None
        points = round_coords(simplify(ring, 6), 6)
        if len(points) < 4:
            return None
        if points[-1] != points[0]:
            points.append(points[0])
        return points
    for e in raw['elements']:
        tags = e.get('tags', {})
        if e['type'] == 'way':
            if e['id'] in members:
                continue
            outer = [clean(geom_of(e))]
            inner = []
        elif e['type'] == 'relation':
            outer = [clean(r) for r in chain_lines([geom_of(m) for m in e.get('members', [])
                     if m.get('role', '') in ('', 'outer') and len(geom_of(m)) > 1])]
            inner = [clean(r) for r in chain_lines([geom_of(m) for m in e.get('members', [])
                     if m.get('role') == 'inner' and len(geom_of(m)) > 1])]
        else:
            continue
        for ring in filter(None, outer):
            features.append({'type': 'Feature', 'properties': {'id': f"{e['type']}/{e['id']}",
                'name': tags.get('name', ''), 'cover': tags.get('natural', tags.get('landuse'))},
                'geometry': {'type': 'Polygon', 'coordinates': [ring,
                    *[hole for hole in inner if hole and contains(ring, hole[0])]]}})
    return {'type': 'FeatureCollection', 'attribution': 'OpenStreetMap contributors · ODbL 1.0',
            'source': 'https://www.openstreetmap.org/copyright',
            'tags': ['natural=wood', 'landuse=forest'],
            'retrieved': datetime.now(timezone.utc).date().isoformat(),
            'note': 'Mapped woodland; individual illustrative crowns are not a tree survey.',
            'features': features}

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=Path)
    args = parser.parse_args()
    if args.source:
        raw = json.loads(args.source.read_text(encoding='utf-8'))
    else:
        bbox = '39.7,-75.8,40.55,-74.7'
        query = f'[out:json][timeout:120][maxsize:67108864];(nwr["natural"="wood"]({bbox});nwr["landuse"="forest"]({bbox}););out geom;'
        request = urllib.request.Request('https://overpass.private.coffee/api/interpreter',
            data=urllib.parse.urlencode({'data': query}).encode(),
            headers={'User-Agent': 'PhiladelphiaRelief/3.0 (https://jez237.com/demos/philadelphia-relief/)'})
        with urllib.request.urlopen(request, timeout=150) as response:
            raw = json.load(response)
    doc = build(raw)
    target = ROOT / 'data/woodland.geojson'
    target.write_text(json.dumps(doc, separators=(',', ':')) + '\n', encoding='utf-8')
    print(f"Wrote {len(doc['features'])} woodland polygons, {target.stat().st_size:,} bytes")
