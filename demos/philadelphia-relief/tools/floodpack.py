#!/usr/bin/env python3
"""Pack flood polygons into the compact binary the browser reads (PHF2).

GeoJSON is the inspectable intermediate; the shipped asset is a few hundred
kilobytes instead of several megabytes. Layout, little-endian:

  header   'PHF2' | u32 polygon count | f64 west, south, east, north
  polygon  u8 class | i16 value | u16 ring count
  ring     u16 vertex count | u16 x, u16 y  x count      (outer ring first, then holes)

Holes are kept: a floodplain wraps islands of higher ground, and drawing them
flooded would be a lie of the map's own making.

Coordinates are quantised to 65535 steps across the region bounds (about
1.4 m here), which is well inside the source simplification. `class` is the
index into the manifest's class list; `value` carries a per-polygon number
(FEMA: base flood elevation in tenths of a foot, -32768 when none; NOAA: the
scenario in feet). A JSON manifest beside the binary carries the source,
licence, class labels and counts, so the About panel quotes the bake.

Usage:  python tools/floodpack.py <in.geojson> <out-stem> --classes sfha,coastal,moderate
"""
from __future__ import annotations

import argparse
import json
import os
import pathlib
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import region  # noqa: E402
from build_vectors import ring_area_m2  # noqa: E402

MAGIC = b"PHF2"


def quantise(lon: float, lat: float) -> tuple:
    qx = round((lon - region.WEST) / (region.EAST - region.WEST) * 65535)
    qy = round((lat - region.SOUTH) / (region.NORTH - region.SOUTH) * 65535)
    return min(65535, max(0, qx)), min(65535, max(0, qy))


def clean_polygon(rings: list, simplify_m: float) -> list:
    """Topology-preserving simplification plus validity repair, via shapely.

    A plain Douglas-Peucker pass on a wiggly floodplain ring creates
    self-intersections, and earcut then fills the wrong side. Shapely's
    simplify keeps the topology and buffer(0) repairs what is left; the
    result may split into several polygons, each returned as [outer, *holes]."""
    from shapely.geometry import Polygon
    from shapely.validation import make_valid
    tol = simplify_m / region.METERS_PER_DEG_LAT
    try:
        poly = Polygon(rings[0], [r for r in rings[1:] if len(r) >= 4])
    except (ValueError, TypeError):
        return []
    if not poly.is_valid:
        poly = make_valid(poly)
    poly = poly.simplify(tol, preserve_topology=True)
    if not poly.is_valid:
        poly = poly.buffer(0)
    # make_valid may hand back a GeometryCollection holding a MultiPolygon
    # (plus stray lines); flatten it all the way down to polygons or the
    # largest inundation polygons vanish.
    out = []

    def collect(geom):
        if geom.is_empty:
            return
        if geom.geom_type == "Polygon":
            if geom.area > 0:
                out.append([list(geom.exterior.coords)] + [list(h.coords) for h in geom.interiors])
        elif hasattr(geom, "geoms"):
            for g in geom.geoms:
                collect(g)

    collect(poly)
    return out


def quantise_ring(ring, simplify_m: float):
    """Quantise and de-duplicate one already-simplified ring; None when fewer than 3 points remain."""
    pts = [tuple(p) for p in ring]
    if len(pts) >= 2 and pts[0] == pts[-1]:
        pts = pts[:-1]
    if len(pts) < 3:
        return None
    q = [quantise(x, y) for x, y in pts]
    dedup = [q[0]]
    for pt in q[1:]:
        if pt != dedup[-1]:
            dedup.append(pt)
    if len(dedup) > 1 and dedup[0] == dedup[-1]:
        dedup.pop()
    if len(dedup) < 3 or len(dedup) > 65535:
        return None
    return dedup


def pack(features: list, classes: list, class_of, value_of, min_area: float,
         simplify_m: float) -> tuple:
    """Return (bytes, per-class kept counts, vertex count, hole count)."""
    body = bytearray()
    counts = {c: 0 for c in classes}
    vertices = 0
    holes = 0
    kept = 0
    for f in features:
        cls = class_of(f)
        if cls not in counts:
            continue
        rings = f["geometry"]["coordinates"]
        if ring_area_m2(rings[0]) < min_area:
            continue
        value = value_of(f)
        # A ring is stored with a 16-bit vertex count. A marsh coastline at
        # 15 m can run past 65,535 points, so coarsen that polygon alone
        # until every ring fits rather than drop it (which once lost most
        # of NOAA's 4 ft scenario) or bloat the format.
        tol = simplify_m
        parts = clean_polygon(rings, tol)
        for _ in range(8):
            if all(len(ring) <= 65000 for part in parts for ring in part):
                break
            tol *= 1.5
            parts = clean_polygon(rings, tol)
        for part in parts:
            if ring_area_m2(part[0]) < min_area:
                continue
            packed_rings = []
            for i, ring in enumerate(part):
                q = quantise_ring(ring, simplify_m)
                if q is None:
                    if i == 0:
                        break
                    continue          # a hole too small to survive quantisation
                packed_rings.append(q)
            if not packed_rings or len(packed_rings) > 65535:
                continue
            body += struct.pack("<BhH", classes.index(cls), value, len(packed_rings))
            for q in packed_rings:
                body += struct.pack("<H", len(q))
                for qx, qy in q:
                    body += struct.pack("<HH", qx, qy)
                vertices += len(q)
            holes += len(packed_rings) - 1
            counts[cls] += 1
            kept += 1
    header = MAGIC + struct.pack("<Idddd", kept, region.WEST, region.SOUTH, region.EAST, region.NORTH)
    return bytes(header) + bytes(body), counts, vertices, holes


def write_pack(features: list, classes: list, class_of, value_of, stem: pathlib.Path,
               manifest: dict, min_area: float = 10000.0, simplify_m: float = 25.0) -> dict:
    data, counts, vertices, holes = pack(features, classes, class_of, value_of, min_area, simplify_m)
    bin_path = stem.with_suffix(".bin")
    bin_path.write_bytes(data)
    doc = dict(manifest)
    if isinstance(doc.get("classes"), dict):
        doc["classLabels"] = doc["classes"]
    doc.update({
        "format": "PHF2",
        "file": bin_path.name,
        "bytes": len(data),
        "classes": classes,
        "kept": counts,
        "vertices": vertices,
        "holes": holes,
        "minAreaM2": min_area,
        "simplifyM": simplify_m,
        "bounds": [region.WEST, region.SOUTH, region.EAST, region.NORTH],
    })
    stem.with_suffix(".json").write_text(json.dumps(doc, indent=1) + "\n")
    print(f"[floodpack] wrote {bin_path.name}: {sum(counts.values())} polygons, {holes} holes, "
          f"{vertices} vertices, {len(data) / 1024:.0f} KB; {counts}", flush=True)
    return doc


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("geojson")
    ap.add_argument("stem")
    ap.add_argument("--classes", required=True, help="comma-separated class codes in order")
    ap.add_argument("--class-key", default="c")
    ap.add_argument("--value-key", default="bfe")
    ap.add_argument("--value-scale", type=float, default=10.0)
    ap.add_argument("--min-area", type=float, default=10000.0)
    ap.add_argument("--simplify", type=float, default=25.0)
    args = ap.parse_args()
    doc = json.loads(pathlib.Path(args.geojson).read_text())
    classes = args.classes.split(",")

    def value_of(f):
        v = f["properties"].get(args.value_key)
        return int(round(v * args.value_scale)) if isinstance(v, (int, float)) else -32768

    manifest = {k: v for k, v in doc.items() if k not in ("type", "features")}
    write_pack(doc["features"], classes, lambda f: f["properties"].get(args.class_key), value_of,
               pathlib.Path(args.stem), manifest, args.min_area, args.simplify)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
