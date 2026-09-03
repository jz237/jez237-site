#!/usr/bin/env python3
"""Bake the vector overlay layers for the Philadelphia 3D map.

Everything is fetched once at build time from the public Overpass API (no key,
no account) and written to static GeoJSON under data/. Nothing in the browser
ever talks to Overpass, so the shipped app has no third-party runtime calls and
no rate-limit exposure.

Data (c) OpenStreetMap contributors, ODbL 1.0. The files under data/ are a
Derivative Database: keep the attribution in the About panel and the README.

Usage:  python tools/build_vectors.py [--layer water] [--refresh]
"""
from __future__ import annotations

import argparse
import json
import math
import os
import pathlib
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import region  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
CACHE = pathlib.Path(os.environ.get("PHILLY_OSM_CACHE", "/tmp/philly-osm-cache"))

ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.osm.jp/api/interpreter",
]
USER_AGENT = "philly-3d-map-build/1.0 (static site asset generator)"

BBOX = region.bbox_overpass()

# --------------------------------------------------------------------------
# Overpass transport
# --------------------------------------------------------------------------


def overpass(query: str, cache_key: str, refresh: bool = False) -> dict:
    cache_path = CACHE / f"{cache_key}.json"
    if cache_path.exists() and not refresh and cache_path.stat().st_size > 0:
        print(f"[osm] {cache_key}: cache hit", flush=True)
        return json.loads(cache_path.read_text())

    body = urllib.parse.urlencode({"data": query}).encode()
    last: Exception | None = None
    for attempt in range(6):
        endpoint = ENDPOINTS[attempt % len(ENDPOINTS)]
        try:
            print(f"[osm] {cache_key}: querying {urllib.parse.urlparse(endpoint).netloc} "
                  f"(attempt {attempt + 1})", flush=True)
            req = urllib.request.Request(
                endpoint, data=body,
                headers={"User-Agent": USER_AGENT,
                         "Content-Type": "application/x-www-form-urlencoded"})
            with urllib.request.urlopen(req, timeout=240) as resp:
                raw = resp.read()
            payload = json.loads(raw)
            cache_path.parent.mkdir(parents=True, exist_ok=True)
            cache_path.write_bytes(raw)
            print(f"[osm] {cache_key}: {len(payload.get('elements', []))} elements", flush=True)
            return payload
        except (urllib.error.URLError, OSError, json.JSONDecodeError) as exc:
            last = exc
            wait = 12 * (attempt + 1)
            print(f"[osm] {cache_key}: {type(exc).__name__} {exc}; retry in {wait}s", flush=True)
            time.sleep(wait)
    raise RuntimeError(f"overpass failed for {cache_key}: {last}")


# --------------------------------------------------------------------------
# Geometry helpers
# --------------------------------------------------------------------------


def _perp_sq(p, a, b) -> float:
    """Squared perpendicular distance, with longitude scaled to metres-ish."""
    k = math.cos(math.radians(region.LAT0))
    px, py = (p[0] - a[0]) * k, p[1] - a[1]
    bx, by = (b[0] - a[0]) * k, b[1] - a[1]
    denom = bx * bx + by * by
    if denom == 0.0:
        return px * px + py * py
    t = max(0.0, min(1.0, (px * bx + py * by) / denom))
    dx, dy = px - t * bx, py - t * by
    return dx * dx + dy * dy


def simplify(points: list, tol_m: float) -> list:
    """Iterative Douglas-Peucker; tolerance given in metres."""
    if len(points) < 3:
        return points
    tol = (tol_m / region.METERS_PER_DEG_LAT) ** 2
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        lo, hi = stack.pop()
        if hi - lo < 2:
            continue
        worst, worst_i = -1.0, -1
        for i in range(lo + 1, hi):
            d = _perp_sq(points[i], points[lo], points[hi])
            if d > worst:
                worst, worst_i = d, i
        if worst > tol:
            keep[worst_i] = True
            stack.append((lo, worst_i))
            stack.append((worst_i, hi))
    return [p for p, k in zip(points, keep) if k]


def clip_bbox(points: list) -> list:
    """Split a polyline into runs that touch the region bounds.

    Each emitted run keeps one vertex past the edge on either side so the line
    visibly leaves the frame instead of stopping short of it. Runs made purely
    of out-of-region vertices are dropped.
    """
    runs, cur, has_inside = [], [], False
    for lon, lat in points:
        inside = region.WEST - 0.02 <= lon <= region.EAST + 0.02 and \
            region.SOUTH - 0.02 <= lat <= region.NORTH + 0.02
        if inside:
            cur.append((lon, lat))
            has_inside = True
        else:
            if has_inside:
                cur.append((lon, lat))       # one vertex past the edge
                runs.append(cur)
            cur, has_inside = [(lon, lat)], False
    if has_inside and len(cur) > 1:
        runs.append(cur)
    return [r for r in runs if len(r) >= 2]


def clip_polygon(ring: list, pad: float = 0.01) -> list:
    """Sutherland-Hodgman clip of a ring against the region rectangle.

    Overpass returns a whole relation whenever any part of it intersects the
    bbox, so without this the Pinelands National Reserve and Wharton State
    Forest arrive as 300 km2 blobs stretching far past the scene. The terrain
    mesh only exists inside the region, so anything outside it would drape onto
    clamped edge heights and read as a flat green smear.
    """
    w, e = region.WEST - pad, region.EAST + pad
    s, n = region.SOUTH - pad, region.NORTH + pad

    def clip_edge(pts, inside, intersect):
        if not pts:
            return []
        out = []
        prev = pts[-1]
        prev_in = inside(prev)
        for cur in pts:
            cur_in = inside(cur)
            if cur_in:
                if not prev_in:
                    out.append(intersect(prev, cur))
                out.append(cur)
            elif prev_in:
                out.append(intersect(prev, cur))
            prev, prev_in = cur, cur_in
        return out

    def lerp_x(a, b, x):
        t = (x - a[0]) / (b[0] - a[0])
        return (x, a[1] + t * (b[1] - a[1]))

    def lerp_y(a, b, y):
        t = (y - a[1]) / (b[1] - a[1])
        return (a[0] + t * (b[0] - a[0]), y)

    pts = [tuple(p) for p in ring]
    if pts and pts[0] == pts[-1]:
        pts = pts[:-1]
    pts = clip_edge(pts, lambda p: p[0] >= w, lambda a, b: lerp_x(a, b, w))
    pts = clip_edge(pts, lambda p: p[0] <= e, lambda a, b: lerp_x(a, b, e))
    pts = clip_edge(pts, lambda p: p[1] >= s, lambda a, b: lerp_y(a, b, s))
    pts = clip_edge(pts, lambda p: p[1] <= n, lambda a, b: lerp_y(a, b, n))
    return pts


def round_coords(points: list, nd: int = 5) -> list:
    out, prev = [], None
    for lon, lat in points:
        c = [round(lon, nd), round(lat, nd)]
        if c != prev:
            out.append(c)
            prev = c
    return out


def geom_of(el: dict) -> list:
    return [(g["lon"], g["lat"]) for g in el.get("geometry", []) if g]


def ring_area_m2(points: list) -> float:
    """Shoelace area of a lat/lon ring, projected to local metres."""
    if len(points) < 3:
        return 0.0
    k = region.METERS_PER_DEG_LON
    j = region.METERS_PER_DEG_LAT
    total = 0.0
    for i in range(len(points)):
        x1, y1 = points[i][0] * k, points[i][1] * j
        x2, y2 = points[(i + 1) % len(points)][0] * k, points[(i + 1) % len(points)][1] * j
        total += x1 * y2 - x2 * y1
    return abs(total) / 2.0


def write_geojson(name: str, features: list, extra: dict | None = None) -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    doc = {
        "type": "FeatureCollection",
        "attribution": "(c) OpenStreetMap contributors, ODbL 1.0",
        "generator": "tools/build_vectors.py",
        "region": {"west": region.WEST, "east": region.EAST,
                   "south": region.SOUTH, "north": region.NORTH},
        "features": features,
    }
    if extra:
        doc.update(extra)
    path = DATA / f"{name}.geojson"
    path.write_text(json.dumps(doc, separators=(",", ":")) + "\n")
    kb = path.stat().st_size / 1024.0
    print(f"[osm] wrote {path.name}: {len(features)} features, {kb:.0f} KB", flush=True)


def chain_lines(lines: list) -> list:
    """Greedily join polylines that share an exact endpoint.

    OSM splits a highway or a creek into a new way at every intersection and
    every tag change, so a raw export is thousands of 2-3 point fragments. Each
    fragment costs ~70 bytes of GeoJSON Feature boilerplate and breaks
    Douglas-Peucker into useless little windows. Chaining first cuts the file
    size several-fold *and* produces better simplification and smoother lines.

    Endpoints come from shared OSM nodes, so exact float equality is the right
    join test here.
    """
    ends: dict[tuple, list[int]] = {}
    for i, pts in enumerate(lines):
        ends.setdefault(pts[0], []).append(i)
        ends.setdefault(pts[-1], []).append(i)

    used = [False] * len(lines)
    out = []

    def take_from(node):
        """Find one still-unused line that starts or ends at `node`."""
        for j in ends.get(node, ()):
            if not used[j]:
                return j
        return None

    for i, pts in enumerate(lines):
        if used[i]:
            continue
        used[i] = True
        chain = list(pts)

        # Extend forward off the tail, then backward off the head. A junction
        # with 3+ branches simply ends the chain, which is what we want.
        while chain[-1] != chain[0]:
            j = take_from(chain[-1])
            if j is None:
                break
            used[j] = True
            nxt = lines[j]
            # Orient `nxt` so it begins at the current tail, then skip that
            # shared vertex.
            fwd = list(nxt) if nxt[0] == chain[-1] else list(reversed(nxt))
            chain.extend(fwd[1:])
        while chain[-1] != chain[0]:
            j = take_from(chain[0])
            if j is None:
                break
            used[j] = True
            prv = lines[j]
            # Orient `prv` so it *ends* at the current head, then drop that
            # shared vertex before prepending.
            fwd = list(prv) if prv[-1] == chain[0] else list(reversed(prv))
            chain[:0] = fwd[:-1]

        out.append(chain)
    return out


def line_features(elements, tol_m, classify, min_len_m=0.0, nd=5):
    """Way -> chained -> simplified -> grouped MultiLineString pipeline.

    Features are grouped by their property signature, so an entire road class
    or a whole named river ships as one Feature instead of thousands.
    """
    groups: dict[str, list] = {}
    props_of: dict[str, dict] = {}
    seen = set()
    for el in elements:
        if el.get("type") != "way" or el["id"] in seen:
            continue
        seen.add(el["id"])
        props = classify(el.get("tags", {}) or {})
        if props is None:
            continue
        pts = geom_of(el)
        if len(pts) < 2:
            continue
        key = json.dumps(props, sort_keys=True)
        props_of[key] = props
        groups.setdefault(key, []).append(pts)

    feats = []
    for key, lines in groups.items():
        parts = []
        for chain in chain_lines(lines):
            for run in clip_bbox(chain):
                simplified = round_coords(simplify(run, tol_m), nd)
                if len(simplified) < 2:
                    continue
                if min_len_m > 0 and polyline_len_m(simplified) < min_len_m:
                    continue
                parts.append(simplified)
        if not parts:
            continue
        feats.append({
            "type": "Feature",
            "properties": props_of[key],
            "geometry": {"type": "MultiLineString", "coordinates": parts},
        })
    return feats


def polyline_len_m(points: list) -> float:
    total = 0.0
    for i in range(1, len(points)):
        dx = (points[i][0] - points[i - 1][0]) * region.METERS_PER_DEG_LON
        dy = (points[i][1] - points[i - 1][1]) * region.METERS_PER_DEG_LAT
        total += math.hypot(dx, dy)
    return total


# --------------------------------------------------------------------------
# Layers
# --------------------------------------------------------------------------


def layer_water(refresh: bool) -> None:
    """Rivers, named creeks, and open-water polygons."""
    q = f"""[out:json][timeout:240];
(
  way["waterway"="river"]({BBOX});
  way["waterway"="canal"]["name"]({BBOX});
  way["waterway"="stream"]["name"]({BBOX});
);
out geom 40000;"""
    lines = overpass(q, "water_lines", refresh)

    def classify(t):
        w = t.get("waterway")
        name = t.get("name")
        if w == "river":
            rank = 1 if name in ("Delaware River", "Schuylkill River") else 2
        elif w == "canal":
            rank = 3
        else:
            if not name:
                return None
            rank = 3
        return {"n": name, "w": w, "rank": rank}

    feats = line_features(lines.get("elements", []), tol_m=25.0, classify=classify,
                          min_len_m=350.0)

    q2 = f"""[out:json][timeout:240];
(
  way["natural"="water"]({BBOX});
  relation["natural"="water"]({BBOX});
  way["landuse"="reservoir"]({BBOX});
);
out geom 40000;"""
    polys = overpass(q2, "water_polys", refresh)

    poly_feats = []
    for el in polys.get("elements", []):
        tags = el.get("tags", {}) or {}
        rings = []
        if el.get("type") == "way":
            pts = geom_of(el)
            if len(pts) >= 4:
                rings = [pts]
        else:
            for m in el.get("members", []):
                if m.get("role") in ("outer", "") and m.get("geometry"):
                    pts = [(g["lon"], g["lat"]) for g in m["geometry"]]
                    if len(pts) >= 4:
                        rings.append(pts)
        for raw in rings:
            pts = clip_polygon(raw)
            if len(pts) < 4:
                continue
            area = ring_area_m2(pts)
            if area < 60000:                       # drop ponds under ~6 ha
                continue
            simplified = round_coords(simplify(pts, 40.0), 5)
            if len(simplified) < 4:
                continue
            if simplified[0] != simplified[-1]:
                simplified.append(simplified[0])
            poly_feats.append({
                "type": "Feature",
                "properties": {"n": tags.get("name"), "area": int(area),
                               "w": tags.get("water") or tags.get("natural") or "water"},
                "geometry": {"type": "Polygon", "coordinates": [simplified]},
            })
    poly_feats.sort(key=lambda f: -f["properties"]["area"])

    write_geojson("water", feats + poly_feats,
                  {"note": "waterway=river/canal plus named streams; open-water polygons >2.5 ha"})


def layer_roads(refresh: bool) -> None:
    q = f"""[out:json][timeout:240];
(
  way["highway"~"^(motorway|trunk|primary|secondary)$"]({BBOX});
  way["highway"~"^(motorway_link|trunk_link)$"]({BBOX});
);
out geom 200000;"""
    data = overpass(q, "roads", refresh)

    TIER = {"motorway": 1, "trunk": 1, "primary": 2, "secondary": 3,
            "motorway_link": 4, "trunk_link": 4}

    def classify(t):
        h = t.get("highway")
        tier = TIER.get(h)
        if tier is None:
            return None
        p = {"t": tier}
        ref = t.get("ref")
        name = t.get("name")
        if tier <= 2 and (ref or name):
            # OSM concatenates concurrent designations as "I 76;PATP"; the
            # first one is the primary route and the only one that fits a label.
            p["n"] = (ref or name).split(";")[0].strip()
        return p

    feats = line_features(data.get("elements", []), tol_m=35.0, classify=classify,
                          min_len_m=200.0, nd=5)
    write_geojson("roads", feats,
                  {"note": "tier 1 motorway/trunk, 2 primary, 3 secondary, 4 ramps"})


def layer_rail(refresh: bool) -> None:
    q = f"""[out:json][timeout:240];
(
  way["railway"~"^(rail|light_rail|subway|tram|narrow_gauge)$"]["service"!~"."]({BBOX});
);
out geom 200000;"""
    data = overpass(q, "rail", refresh)

    def classify(t):
        r = t.get("railway")
        if t.get("usage") == "industrial" and r == "rail":
            return None
        kind = {"rail": 1, "light_rail": 2, "subway": 2, "tram": 3,
                "narrow_gauge": 3}.get(r)
        if kind is None:
            return None
        p = {"k": kind}
        if t.get("name"):
            p["n"] = t["name"]
        return p

    feats = line_features(data.get("elements", []), tol_m=40.0, classify=classify,
                          min_len_m=400.0)
    write_geojson("rail", feats, {"note": "non-service track; 1 heavy rail, 2 metro, 3 tram"})


def layer_boundaries(refresh: bool) -> None:
    """County (admin_level 6) and municipal (8) lines, deduped by way id."""
    q = f"""[out:json][timeout:280];
(
  relation["boundary"="administrative"]["admin_level"~"^(6|8)$"]({BBOX});
);
out geom 60000;"""
    data = overpass(q, "boundaries", refresh)

    best: dict[int, tuple[int, str | None]] = {}
    geom: dict[int, list] = {}
    for rel in data.get("elements", []):
        tags = rel.get("tags", {}) or {}
        try:
            level = int(tags.get("admin_level", "8"))
        except ValueError:
            continue
        name = tags.get("name")
        for m in rel.get("members", []):
            if m.get("type") != "way" or not m.get("geometry"):
                continue
            ref = m["ref"]
            pts = [(g["lon"], g["lat"]) for g in m["geometry"]]
            if len(pts) < 2:
                continue
            geom.setdefault(ref, pts)
            prev = best.get(ref)
            # A shared way belongs to the most significant boundary it carries.
            if prev is None or level < prev[0]:
                best[ref] = (level, name)

    # Group by level, chain the shared ways back into long boundary runs, then
    # emit one MultiLineString per level. County names ride along as points in
    # the places layer, so nothing is lost by dropping per-way names here.
    by_level: dict[int, list] = {}
    for ref, pts in geom.items():
        level, _name = best[ref]
        by_level.setdefault(level, []).append(pts)

    feats = []
    for level in sorted(by_level):
        tol = 70.0 if level == 6 else 140.0
        min_len = 300.0 if level == 6 else 900.0
        parts = []
        for chain in chain_lines(by_level[level]):
            for run in clip_bbox(chain):
                simplified = round_coords(simplify(run, tol), 5)
                if len(simplified) < 2 or polyline_len_m(simplified) < min_len:
                    continue
                parts.append(simplified)
        if parts:
            feats.append({
                "type": "Feature", "properties": {"lvl": level},
                "geometry": {"type": "MultiLineString", "coordinates": parts},
            })
    write_geojson("boundaries", feats,
                  {"note": "lvl 6 = county, lvl 8 = municipality; shared ways deduped "
                           "then chained into continuous runs"})


def layer_parks(refresh: bool) -> None:
    q = f"""[out:json][timeout:280];
(
  way["leisure"~"^(park|nature_reserve)$"]({BBOX});
  relation["leisure"~"^(park|nature_reserve)$"]({BBOX});
  way["boundary"="protected_area"]({BBOX});
  relation["boundary"="protected_area"]({BBOX});
);
out geom 60000;"""
    data = overpass(q, "parks", refresh)

    feats = []
    for el in data.get("elements", []):
        tags = el.get("tags", {}) or {}
        rings = []
        if el.get("type") == "way":
            pts = geom_of(el)
            if len(pts) >= 4:
                rings = [pts]
        else:
            for m in el.get("members", []):
                if m.get("role") in ("outer", "") and m.get("geometry"):
                    pts = [(g["lon"], g["lat"]) for g in m["geometry"]]
                    if len(pts) >= 4:
                        rings.append(pts)
        for raw in rings:
            pts = clip_polygon(raw)
            if len(pts) < 4:
                continue
            area = ring_area_m2(pts)
            if area < 250000:                      # ~25 ha floor keeps the file lean
                continue
            simplified = round_coords(simplify(pts, 70.0), 5)
            if len(simplified) < 4:
                continue
            if simplified[0] != simplified[-1]:
                simplified.append(simplified[0])
            feats.append({
                "type": "Feature",
                "properties": {"n": tags.get("name"), "area": int(area)},
                "geometry": {"type": "Polygon", "coordinates": [simplified]},
            })
    feats.sort(key=lambda f: -f["properties"]["area"])
    write_geojson("parks", feats[:600],
                  {"note": "parks / nature reserves / protected areas >25 ha"})


def layer_places(refresh: bool) -> None:
    q = f"""[out:json][timeout:240];
(
  node["place"~"^(city|town|village|suburb|neighbourhood|borough)$"]["name"]({BBOX});
);
out body 40000;"""
    data = overpass(q, "places", refresh)

    RANK = {"city": 1, "borough": 2, "town": 2, "suburb": 3,
            "village": 3, "neighbourhood": 4}
    feats = []
    for el in data.get("elements", []):
        tags = el.get("tags", {}) or {}
        name = tags.get("name")
        kind = tags.get("place")
        if not name or kind not in RANK:
            continue
        pop = 0
        try:
            pop = int(str(tags.get("population", "0")).replace(",", "").strip() or 0)
        except ValueError:
            pop = 0
        rank = RANK[kind]
        # Philadelphia itself is the anchor label; everything else ranks below.
        if name == "Philadelphia" and kind == "city":
            rank = 0
        feats.append({
            "type": "Feature",
            "properties": {"n": name, "k": kind, "rank": rank, "pop": pop},
            "geometry": {"type": "Point",
                         "coordinates": [round(el["lon"], 5), round(el["lat"], 5)]},
        })
    feats.sort(key=lambda f: (f["properties"]["rank"], -f["properties"]["pop"]))
    write_geojson("places", feats,
                  {"note": "OSM place nodes; rank 0 Philadelphia, 1 city, 2 town/borough, "
                           "3 suburb/village, 4 neighbourhood"})


LAYERS = {
    "water": layer_water,
    "roads": layer_roads,
    "rail": layer_rail,
    "boundaries": layer_boundaries,
    "parks": layer_parks,
    "places": layer_places,
}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--layer", action="append", choices=sorted(LAYERS), default=None)
    ap.add_argument("--refresh", action="store_true")
    args = ap.parse_args()

    names = args.layer or list(LAYERS)
    for i, name in enumerate(names):
        LAYERS[name](args.refresh)
        if i < len(names) - 1:
            time.sleep(4)          # be polite to the shared Overpass instances
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
