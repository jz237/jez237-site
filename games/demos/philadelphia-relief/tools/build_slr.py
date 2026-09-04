#!/usr/bin/env python3
"""Bake NOAA sea-level-rise inundation scenarios for the flood layer.

Source: NOAA Office for Coastal Management, "Sea Level Rise Vectors"
(the data behind the Sea Level Rise Viewer), bulk download, no token:

  https://coast.noaa.gov/slrdata/Sea_Level_Rise_Vectors/<STATE>/<pkg>.zip

Each package is a file geodatabase with one polygon layer per scenario,
`<ST>_slr_<N>ft`, showing inundation at N feet above current mean higher high
water (MHHW), plus `<ST>_low_<N>ft` low-lying areas that are not hydrologically
connected. NOAA's use constraint, quoted in the output and in the About panel:
"These data illustrate the scale of potential flooding, not the exact location,
and do not account for erosion, subsidence, or future construction."

The Philadelphia region spans four packages: PA (the Pennsylvania shore of the
Delaware), NJ_Middle and NJ_Southern (the New Jersey shore, split at 40 N) and
DE (the Delaware state line at the region's south-west corner). Only polygons inside the map
region are kept; they are simplified to ~15 m, written as GeoJSON beside the
cache for inspection, and packed (floodpack.py) with one class per scenario.

Requires pyogrio (bundles GDAL) and shapely to read the geodatabases.

Usage:  python tools/build_slr.py [--refresh]
"""
from __future__ import annotations

import argparse
import json
import os
import pathlib
import sys
import time
import urllib.request
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import region  # noqa: E402
from build_vectors import simplify, clip_polygon, ring_area_m2, round_coords  # noqa: E402
from floodpack import write_pack  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "flood"
CACHE = pathlib.Path(os.environ.get("PHILLY_NOAA_CACHE", "/tmp/noaa-slr"))

BASE = "https://coast.noaa.gov/slrdata/Sea_Level_Rise_Vectors"
PACKAGES = [
    ("PA", "PA/PA_slr_data_dist.zip", "PA_slr"),
    ("NJ_Middle", "NJ/NJ_Middle_slr_data_dist.zip", "NJ_Middle_slr"),
    ("NJ_Southern", "NJ/NJ_Southern_slr_data_dist.zip", "NJ_Southern_slr"),
    ("DE", "DE/DE_slr_data_dist.zip", "DE_slr"),
]
SCENARIOS_FT = [1, 2, 3, 4, 5, 6, 8, 10]
MIN_AREA_M2 = 3000.0
SIMPLIFY_M = 15.0
USER_AGENT = "philadelphia-relief-build/1.0 (static site asset generator)"


def download(rel: str, refresh: bool) -> pathlib.Path:
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / pathlib.Path(rel).name
    if path.exists() and not refresh and path.stat().st_size > 0:
        print(f"[slr] {path.name}: cache hit ({path.stat().st_size / 1e6:.1f} MB)", flush=True)
        return path
    url = f"{BASE}/{rel}"
    print(f"[slr] downloading {url}", flush=True)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=600) as resp, open(path, "wb") as out:
        while True:
            chunk = resp.read(1 << 20)
            if not chunk:
                break
            out.write(chunk)
    print(f"[slr] {path.name}: {path.stat().st_size / 1e6:.1f} MB", flush=True)
    return path


def extract(zip_path: pathlib.Path) -> pathlib.Path:
    target = CACHE / zip_path.stem
    if not target.exists():
        target.mkdir(parents=True)
        with zipfile.ZipFile(zip_path) as z:
            z.extractall(target)
    gdbs = list(target.rglob("*.gdb"))
    if not gdbs:
        raise SystemExit(f"no geodatabase inside {zip_path.name}")
    return gdbs[0]


def rings_from_geometry(geom) -> list:
    """(outer, [holes]) ring groups, lon/lat tuples, of a shapely Polygon/MultiPolygon.

    Holes matter here: NOAA's inundation polygons wrap islands of higher
    ground, which must stay dry on the map."""
    polys = list(geom.geoms) if hasattr(geom, "geoms") else [geom]
    out = []
    for poly in polys:
        if poly.is_empty:
            continue
        out.append(([(x, y) for x, y in poly.exterior.coords],
                    [[(x, y) for x, y in hole.coords] for hole in poly.interiors]))
    return out


MIN_HOLE_M2 = 1500.0


def finish_ring(ring, simplify_m: float) -> list | None:
    """Clip a ring to the region, simplify and close it; None when nothing is left."""
    if len(ring) < 4:
        return None
    pts = clip_polygon(ring)
    if len(pts) < 4:
        return None
    simp = round_coords(simplify(pts, simplify_m), 5)
    if len(simp) < 4:
        return None
    if simp[0] != simp[-1]:
        simp.append(simp[0])
    return simp


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--refresh", action="store_true")
    args = ap.parse_args()

    try:
        import pyogrio
        import pyogrio.raw  # noqa: F401 - registers the raw reader
        import shapely
    except ImportError:
        raise SystemExit("pyogrio and shapely are required: pip install pyogrio shapely")

    OUT.mkdir(parents=True, exist_ok=True)
    features = []
    stats = {}
    for state, rel, prefix in PACKAGES:
        zip_path = download(rel, args.refresh)
        gdb = extract(zip_path)
        layers = {name for name, _kind in pyogrio.list_layers(str(gdb))}
        for ft in SCENARIOS_FT:
            layer = f"{prefix}_{ft}ft"
            if layer not in layers:
                print(f"[slr] {state}: no layer {layer}", flush=True)
                continue
            # Raw read: geometry comes back as WKB, decoded with shapely, so
            # geopandas is not needed.
            _meta, _index, wkbs, _fields = pyogrio.raw.read(
                str(gdb), layer=layer,
                bbox=(region.WEST, region.SOUTH, region.EAST, region.NORTH))
            kept = 0
            t0 = time.time()
            # NOAA polygons carry tens of thousands of vertices each; simplify
            # in C (shapely) before the pure-Python clip and final pass.
            tol_deg = SIMPLIFY_M / region.METERS_PER_DEG_LAT
            for wkb in wkbs:
                geom = shapely.from_wkb(wkb) if wkb is not None else None
                if geom is None or geom.is_empty:
                    continue
                geom = shapely.simplify(geom, tol_deg, preserve_topology=True)
                for outer_ring, hole_rings in rings_from_geometry(geom):
                    outer = finish_ring(outer_ring, SIMPLIFY_M * 0.5)
                    if outer is None:
                        continue
                    area = ring_area_m2(outer)
                    if area < MIN_AREA_M2:
                        continue
                    holes = []
                    for hole_ring in hole_rings:
                        hole = finish_ring(hole_ring, SIMPLIFY_M * 0.5)
                        if hole is None or ring_area_m2(hole) < MIN_HOLE_M2:
                            continue
                        holes.append(hole)
                        area -= ring_area_m2(hole)
                    features.append({
                        "type": "Feature",
                        "properties": {"ft": ft, "st": state, "a": int(max(0, area)),
                                       "holes": len(holes)},
                        "geometry": {"type": "Polygon", "coordinates": [outer, *holes]},
                    })
                    kept += 1
            stats[f"{state}_{ft}ft"] = {"source": len(wkbs), "kept": kept}
            print(f"[slr] {state} {ft} ft: {len(wkbs)} source polygons, {kept} kept "
                  f"({time.time() - t0:.0f}s)", flush=True)

    features.sort(key=lambda f: (f["properties"]["ft"], -f["properties"]["a"]))
    doc = {
        "type": "FeatureCollection",
        "source": {
            "name": "NOAA Office for Coastal Management, Sea Level Rise Viewer data "
                    "(Sea Level Rise Vectors), packages PA, NJ_Middle, NJ_Southern, DE",
            "url": "https://coast.noaa.gov/slrdata/",
            "credit": "NOAA Office for Coastal Management",
            "useConstraint": "These data illustrate the scale of potential flooding, not the "
                             "exact location, and do not account for erosion, subsidence, or "
                             "future construction. Inundation is shown as it would appear "
                             "during the highest high tides with the sea level rise amount.",
            "datum": "feet above current mean higher high water (MHHW)",
            "fetched": time.strftime("%Y-%m-%d"),
            "note": "Clipped to the map region and simplified to ~15 m, holes (islands of "
                    "higher ground) kept; low-lying hydrologically disconnected areas are "
                    "not included.",
        },
        "scenariosFt": SCENARIOS_FT,
        "stats": stats,
        "features": features,
    }
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / "noaa-slr.geojson"
    path.write_text(json.dumps(doc, separators=(",", ":")) + "\n")
    print(f"[slr] wrote {path}: {len(features)} polygons, {path.stat().st_size / 1024:.0f} KB",
          flush=True)
    pack_slr(doc, OUT / "noaa-slr")
    return 0


def pack_slr(doc: dict, stem: pathlib.Path) -> None:
    """One class per scenario ('1ft' ... '10ft'); the value is the feet."""
    classes = [f"{ft}ft" for ft in doc["scenariosFt"]]
    manifest = {k: v for k, v in doc.items() if k not in ("type", "features")}
    write_pack(doc["features"], classes, lambda f: f"{f['properties']['ft']}ft",
               lambda f: int(f["properties"]["ft"]), stem, manifest, min_area=6000.0, simplify_m=20.0)


if __name__ == "__main__":
    raise SystemExit(main())
