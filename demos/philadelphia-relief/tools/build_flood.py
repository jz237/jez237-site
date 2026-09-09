#!/usr/bin/env python3
"""Bake FEMA flood hazard zones for the Philadelphia Relief flood layer.

Source: FEMA National Flood Hazard Layer (NFHL), "Flood Hazard Zones" layer of
the public ArcGIS REST service. NFHL is a US federal government work and is
in the public domain; FEMA asks that it be cited as the National Flood Hazard
Layer and notes the effective FIRM is the regulatory product.

  https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28

Fetched once at build time, paged through the region, clipped and simplified,
and written as a packed binary (see floodpack.py) with a JSON manifest. Nothing
in the browser talks to FEMA.

What the classes mean (FEMA definitions):
  AE / A / AO / AH   Special Flood Hazard Area: 1% annual-chance flood
  VE                 Coastal high hazard area (1% annual chance with wave action)
  X (0.2 PCT ...)    Moderate flood hazard: 0.2% annual-chance flood
Polygons carry STATIC_BFE (base flood elevation, feet, NAVD88) where FEMA has
mapped one, otherwise -9999.

Usage:  python tools/build_flood.py [--refresh]
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import pathlib
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import region  # noqa: E402
from build_vectors import simplify, clip_polygon, ring_area_m2, round_coords  # noqa: E402
from floodpack import write_pack  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "flood"
CACHE = pathlib.Path(os.environ.get("PHILLY_FEMA_CACHE", "/tmp/philly-fema-cache"))

SERVICE = "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query"
USER_AGENT = "philadelphia-relief-build/1.0 (static site asset generator)"
PAGE = 2000

# Query groups -> class code used by the runtime.
GROUPS = [
    ("sfha", "FLD_ZONE IN ('AE','A','AO','AH')", "1% annual-chance flood (Special Flood Hazard Area)"),
    ("coastal", "FLD_ZONE = 'VE'", "1% annual-chance coastal high hazard (wave action)"),
    ("moderate", "FLD_ZONE = 'X' AND ZONE_SUBTY LIKE '0.2 PCT%'", "0.2% annual-chance flood"),
]

MIN_AREA_M2 = 4000.0
MIN_HOLE_M2 = 1500.0
SIMPLIFY_M = 18.0


OUT_FIELDS = "OBJECTID,FLD_ZONE,ZONE_SUBTY,SFHA_TF,STATIC_BFE,DFIRM_ID"


def fetch(where: str, offset: int, refresh: bool, box=None) -> dict:
    box = box or (region.WEST, region.SOUTH, region.EAST, region.NORTH)
    params = {
        "where": where,
        "geometry": ",".join(f"{v:.5f}" for v in box),
        "geometryType": "esriGeometryEnvelope",
        "inSR": "4326",
        "outSR": "4326",
        "spatialRel": "esriSpatialRelIntersects",
        "outFields": OUT_FIELDS,
        "geometryPrecision": "5",
        "resultOffset": str(offset),
        "resultRecordCount": str(PAGE),
        "f": "json",
    }
    url = SERVICE + "?" + urllib.parse.urlencode(params)
    # The cache key is the full request, hashed deterministically: a change to
    # the fields or the paging must never reuse a stale response.
    key = hashlib.sha1(url.encode()).hexdigest()[:16]
    path = CACHE / f"{key}.json"
    if path.exists() and not refresh and path.stat().st_size > 0:
        return json.loads(path.read_text())
    last = None
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=300) as resp:
                raw = resp.read()
            payload = json.loads(raw)
            if "error" in payload:
                raise RuntimeError(payload["error"])
            CACHE.mkdir(parents=True, exist_ok=True)
            path.write_bytes(raw)
            return payload
        except (urllib.error.URLError, OSError, json.JSONDecodeError, RuntimeError) as exc:
            last = exc
            wait = 15 * (attempt + 1)
            print(f"[flood] {where[:30]} @{offset}: {type(exc).__name__} {exc}; retry in {wait}s",
                  flush=True)
            time.sleep(wait)
    raise RuntimeError(f"FEMA query failed: {last}")


TILES = 5   # the whole-region envelope makes the service fail with HTTP 500


def fetch_all(where: str, refresh: bool) -> list:
    """Page through the query, one sub-envelope at a time, deduped by OBJECTID."""
    seen, features = set(), []
    dx = (region.EAST - region.WEST) / TILES
    dy = (region.NORTH - region.SOUTH) / TILES
    for ty in range(TILES):
        for tx in range(TILES):
            box = (region.WEST + tx * dx, region.SOUTH + ty * dy,
                   region.WEST + (tx + 1) * dx, region.SOUTH + (ty + 1) * dy)
            offset = 0
            while True:
                page = fetch(where, offset, refresh, box)
                got = page.get("features", [])
                fresh = 0
                for f in got:
                    oid = (f.get("attributes") or {}).get("OBJECTID")
                    if oid is None:
                        raise RuntimeError("FEMA response has no OBJECTID; cannot page safely")
                    if oid in seen:
                        continue
                    seen.add(oid)
                    features.append(f)
                    fresh += 1
                more = page.get("exceededTransferLimit") or len(got) == PAGE
                if not got or not more:
                    break
                offset += len(got)
                time.sleep(0.5)
            print(f"[flood] {where[:34]} tile {tx},{ty}: {len(features)} so far", flush=True)
    return features


def shoelace(ring) -> float:
    area = 0.0
    for i in range(len(ring) - 1):
        area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
    return area


def point_in_ring(x: float, y: float, ring) -> bool:
    inside = False
    for i in range(len(ring) - 1):
        x1, y1 = ring[i]
        x2, y2 = ring[i + 1]
        if (y1 > y) != (y2 > y):
            if x < x1 + (y - y1) * (x2 - x1) / (y2 - y1):
                inside = not inside
    return inside


def rings_of(geom: dict) -> list:
    """(outer, [holes]) groups of an Esri JSON polygon.

    Esri rings are clockwise for outers (negative shoelace in lon/lat) and
    counter-clockwise for holes; each hole belongs to the outer that contains
    its first vertex. Holes matter: a floodplain wraps islands of higher ground."""
    if not geom:
        return []
    rings = [r for r in (geom.get("rings") or []) if len(r) >= 4]
    outers = [r for r in rings if shoelace(r) <= 0]
    holes = [r for r in rings if shoelace(r) > 0]
    if not outers:
        return [(r, []) for r in rings[:1]]
    groups = [(outer, []) for outer in outers]
    for hole in holes:
        x, y = hole[0]
        for outer, hs in groups:
            if point_in_ring(x, y, outer):
                hs.append(hole)
                break
    return groups


def load_cached_features() -> dict:
    """Every feature in the response cache, deduped by OBJECTID and classified
    by its own attributes, for a rebuild without touching FEMA's servers."""
    by_code = {code: [] for code, _w, _l in GROUPS}
    seen = set()
    for path in sorted(CACHE.glob("*.json")):
        try:
            payload = json.loads(path.read_text())
        except json.JSONDecodeError:
            continue
        for f in payload.get("features", []) if isinstance(payload, dict) else []:
            attrs = f.get("attributes") or {}
            oid = attrs.get("OBJECTID")
            if oid is None or oid in seen:
                continue
            zone = attrs.get("FLD_ZONE")
            subty = attrs.get("ZONE_SUBTY") or ""
            if zone in ("AE", "A", "AO", "AH"):
                code = "sfha"
            elif zone == "VE":
                code = "coastal"
            elif zone == "X" and subty.startswith("0.2 PCT"):
                code = "moderate"
            else:
                continue
            seen.add(oid)
            by_code[code].append(f)
    return by_code


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--refresh", action="store_true")
    ap.add_argument("--from-cache", action="store_true",
                    help="rebuild from every cached response instead of querying")
    args = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    out_features = []
    counts = {}
    bfe_count = 0
    hole_count = 0
    cached = load_cached_features() if args.from_cache else None

    def finish(ring, tol):
        pts = clip_polygon([tuple(p) for p in ring])
        if len(pts) < 4:
            return None
        simp = round_coords(simplify(pts, tol), 5)
        if len(simp) < 4:
            return None
        if simp[0] != simp[-1]:
            simp.append(simp[0])
        return simp

    for code, where, label in GROUPS:
        raw = cached[code] if cached is not None else fetch_all(where, args.refresh)
        kept = 0
        for f in raw:
            props = f.get("attributes", {}) or {}
            for outer_ring, hole_rings in rings_of(f.get("geometry")):
                simp = finish(outer_ring, SIMPLIFY_M)
                if simp is None:
                    continue
                area = ring_area_m2(simp)
                if area < MIN_AREA_M2:
                    continue
                holes = []
                for hole_ring in hole_rings:
                    hole = finish(hole_ring, SIMPLIFY_M)
                    if hole is None or ring_area_m2(hole) < MIN_HOLE_M2:
                        continue
                    holes.append(hole)
                    area -= ring_area_m2(hole)
                hole_count += len(holes)
                bfe = props.get("STATIC_BFE")
                has_bfe = isinstance(bfe, (int, float)) and bfe > -9000
                if has_bfe:
                    bfe_count += 1
                out_features.append({
                    "type": "Feature",
                    "properties": {
                        "c": code,
                        "z": props.get("FLD_ZONE"),
                        "bfe": round(float(bfe), 1) if has_bfe else None,
                        "a": int(max(0, area)),
                        "holes": len(holes),
                    },
                    "geometry": {"type": "Polygon", "coordinates": [simp, *holes]},
                })
                kept += 1
        counts[code] = {"fetched": len(raw), "kept": kept, "label": label}
        print(f"[flood] {code}: {len(raw)} fetched, {kept} kept", flush=True)

    out_features.sort(key=lambda f: -f["properties"]["a"])
    doc = {
        "type": "FeatureCollection",
        "source": {
            "name": "FEMA National Flood Hazard Layer (NFHL), Flood Hazard Zones",
            "url": "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28",
            "license": "US federal government work; public domain. Cite as FEMA NFHL.",
            "note": "The effective FIRM is the regulatory product; this is a simplified "
                    "visualisation of the NFHL as served on the build date, clipped to the "
                    "map region and simplified to ~18 m, holes (islands of higher ground) kept. "
                    "Not for insurance, permitting or "
                    "engineering decisions.",
            "fetched": time.strftime("%Y-%m-%d"),
        },
        "classes": {code: label for code, _w, label in GROUPS},
        "counts": counts,
        "withBaseFloodElevation": bfe_count,
        "holes": hole_count,
        "features": out_features,
    }
    # The GeoJSON is kept beside the cache for inspection; the browser gets
    # the packed binary plus a manifest.
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / "fema-nfhl.geojson"
    path.write_text(json.dumps(doc, separators=(",", ":")) + "\n")
    print(f"[flood] wrote {path}: {len(out_features)} polygons, "
          f"{path.stat().st_size / 1024:.0f} KB, {bfe_count} with BFE", flush=True)

    def value_of(f):
        bfe = f["properties"].get("bfe")
        return int(round(bfe * 10)) if isinstance(bfe, (int, float)) else -32768

    manifest = {k: v for k, v in doc.items() if k not in ("type", "features")}
    write_pack(out_features, [code for code, _w, _l in GROUPS], lambda f: f["properties"]["c"],
               value_of, OUT / "fema-nfhl", manifest)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
