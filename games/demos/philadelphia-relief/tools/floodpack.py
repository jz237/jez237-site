#!/usr/bin/env python3
"""Pack flood polygons into the compact binary the browser reads (PHF1).

GeoJSON is the inspectable intermediate; the shipped asset is a few hundred
kilobytes instead of several megabytes. Layout, little-endian:

  header   'PHF1' | u32 polygon count | f64 west, south, east, north
  polygon  u8 class | i16 value | u16 vertex count | u16 x, u16 y  x count

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
from build_vectors import simplify, ring_area_m2  # noqa: E402

MAGIC = b"PHF1"


def quantise(lon: float, lat: float) -> tuple:
    qx = round((lon - region.WEST) / (region.EAST - region.WEST) * 65535)
    qy = round((lat - region.SOUTH) / (region.NORTH - region.SOUTH) * 65535)
    return min(65535, max(0, qx)), min(65535, max(0, qy))


def pack(features: list, classes: list, class_of, value_of, min_area: float,
         simplify_m: float) -> tuple:
    """Return (bytes, per-class kept counts, vertex count)."""
    body = bytearray()
    counts = {c: 0 for c in classes}
    vertices = 0
    kept = 0
    for f in features:
        cls = class_of(f)
        if cls not in counts:
            continue
        ring = f["geometry"]["coordinates"][0]
        if ring_area_m2(ring) < min_area:
            continue
        pts = simplify([tuple(p) for p in ring], simplify_m) if simplify_m > 0 else ring
        if len(pts) >= 2 and tuple(pts[0]) == tuple(pts[-1]):
            pts = pts[:-1]
        if len(pts) < 3:
            continue
        q = [quantise(x, y) for x, y in pts]
        # Drop consecutive duplicates the quantisation may create.
        dedup = [q[0]]
        for p in q[1:]:
            if p != dedup[-1]:
                dedup.append(p)
        if len(dedup) > 1 and dedup[0] == dedup[-1]:
            dedup.pop()
        if len(dedup) < 3 or len(dedup) > 65535:
            continue
        value = value_of(f)
        body += struct.pack("<BhH", classes.index(cls), value, len(dedup))
        for qx, qy in dedup:
            body += struct.pack("<HH", qx, qy)
        counts[cls] += 1
        vertices += len(dedup)
        kept += 1
    header = MAGIC + struct.pack("<Idddd", kept, region.WEST, region.SOUTH, region.EAST, region.NORTH)
    return bytes(header) + bytes(body), counts, vertices


def write_pack(features: list, classes: list, class_of, value_of, stem: pathlib.Path,
               manifest: dict, min_area: float = 10000.0, simplify_m: float = 25.0) -> dict:
    data, counts, vertices = pack(features, classes, class_of, value_of, min_area, simplify_m)
    bin_path = stem.with_suffix(".bin")
    bin_path.write_bytes(data)
    doc = dict(manifest)
    if isinstance(doc.get("classes"), dict):
        doc["classLabels"] = doc["classes"]
    doc.update({
        "format": "PHF1",
        "file": bin_path.name,
        "bytes": len(data),
        "classes": classes,
        "kept": counts,
        "vertices": vertices,
        "minAreaM2": min_area,
        "simplifyM": simplify_m,
        "bounds": [region.WEST, region.SOUTH, region.EAST, region.NORTH],
    })
    stem.with_suffix(".json").write_text(json.dumps(doc, indent=1) + "\n")
    print(f"[floodpack] wrote {bin_path.name}: {sum(counts.values())} polygons, {vertices} vertices, "
          f"{len(data) / 1024:.0f} KB; {counts}", flush=True)
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
