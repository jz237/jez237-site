#!/usr/bin/env python3
"""Bake the 3D structures layer: building footprints and the Delaware bridges.

Everything comes from OpenStreetMap via the public Overpass API, fetched once
at build time and written to compact static files under data/structures/.
Nothing in the browser ever talks to Overpass.

Data (c) OpenStreetMap contributors, ODbL 1.0. Philadelphia's building heights
in OSM derive largely from the City of Philadelphia's LiDAR-based footprint
import, which is why Center City has measured heights on ~78% of footprints.

Two detail zones, chosen so the payload stays bounded instead of dumping the
whole 94 km region:

  center-city   full fabric: every footprint, rowhouses included
  inner-city    notable only: >=12 m, >=4 storeys, named, or >=2,500 m2

Buildings are split into height tiers (tall / mid / low) so the renderer can
skip the rowhouse tier entirely on low-power hardware.

A small curated table supplies heights for skyline towers that have no height
in OSM (One Liberty Place, Comcast Center, ...). Those are counted and flagged
as curated in the manifest; they are public reference values, not surveys.

Usage:
  python tools/build_structures.py --fetch-only     # download + cache raw OSM
  python tools/build_structures.py                  # fetch (cached) + bake
"""
from __future__ import annotations

import argparse
import json
import re
import math
import os
import pathlib
import struct
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import region  # noqa: E402
from build_vectors import chain_lines, simplify, ring_area_m2  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "structures"
CACHE = pathlib.Path(os.environ.get("PHILLY_OSM_CACHE", "/tmp/philly-osm-cache"))

ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.fr/api/interpreter",   # osm.jp's cert no longer matches
]
USER_AGENT = "philadelphia-relief-build/1.0 (static site asset generator)"

# ---------------------------------------------------------------------------
# Zones
# ---------------------------------------------------------------------------

ZONES = [
    {
        "id": "center-city",
        "label": "Center City & University City",
        "mode": "full",
        # South St to Fairmount, the Schuylkill's west bank (Drexel/Penn) to
        # the Delaware waterfront.
        "south": 39.938, "west": -75.205, "north": 39.970, "east": -75.135,
    },
    {
        "id": "inner-city",
        "label": "Inner Philadelphia & Camden (notable buildings)",
        "mode": "notable",
        # Navy Yard and the sports complex up to Port Richmond and Temple,
        # the airport's east edge across to the Camden waterfront.
        "south": 39.880, "west": -75.260, "north": 40.010, "east": -75.080,
    },
    # Suburban zones: notable buildings only, and `lazy`, so the browser
    # fetches them as the camera approaches rather than at start-up.
    {
        "id": "schuylkill-valley",
        "label": "King of Prussia, Norristown & Conshohocken (notable buildings)",
        "mode": "notable", "lazy": True,
        "south": 40.060, "west": -75.420, "north": 40.130, "east": -75.270,
    },
    {
        "id": "main-line",
        "label": "The Main Line (notable buildings)",
        "mode": "notable", "lazy": True,
        "south": 39.990, "west": -75.330, "north": 40.060, "east": -75.205,
    },
    {
        "id": "northeast-philadelphia",
        "label": "Northeast Philadelphia (notable buildings)",
        "mode": "notable", "lazy": True,
        "south": 40.010, "west": -75.100, "north": 40.110, "east": -74.960,
    },
    {
        "id": "cherry-hill",
        "label": "Cherry Hill & eastern Camden County (notable buildings)",
        "mode": "notable", "lazy": True,
        "south": 39.880, "west": -75.080, "north": 39.960, "east": -74.950,
    },
    {
        "id": "airport-chester",
        "label": "The airport, Tinicum & Chester (notable buildings)",
        "mode": "notable", "lazy": True,
        "south": 39.820, "west": -75.430, "north": 39.900, "east": -75.260,
    },
    {
        "id": "lower-bucks",
        "label": "Bristol, Levittown & Bensalem (notable buildings)",
        "mode": "notable", "lazy": True,
        "south": 40.070, "west": -74.960, "north": 40.180, "east": -74.800,
    },
    {
        "id": "trenton",
        "label": "Trenton (notable buildings)",
        "mode": "notable", "lazy": True,
        "south": 40.195, "west": -74.800, "north": 40.245, "east": -74.720,
    },
    {
        "id": "wilmington",
        "label": "Wilmington (notable buildings)",
        "mode": "notable", "lazy": True,
        "south": 39.720, "west": -75.590, "north": 39.780, "east": -75.510,
    },
]

# Height tiers in metres. The low tier is what the performance mode skips.
TIERS = [("tall", 35.0), ("mid", 12.0), ("low", 0.0)]

MIN_FOOTPRINT_M2 = 20.0          # sheds and garages do not read at any range
MERGE_BELOW_M = 18.0             # fabric below this merges into block rows
MERGE_BANDS_M = (7.0, 12.0)      # ...within these height bands (then 12-18)
MERGE_GAP_M = 0.3                # party-wall gap to close before the union
NOTABLE_MIN_AREA_M2 = 2500.0     # in the notable zone, big-but-low still counts
NOTABLE_MIN_HEIGHT_M = 20.0      # ~six storeys: mid-rise and up

# Curated heights (metres, architectural/roof, rounded) for footprints that
# have neither `height` nor `building:levels` in OSM. Public reference values,
# clearly not survey data. Keyed by the exact OSM name.
CURATED_HEIGHTS = {
    "Comcast Center": 297,
    "One Liberty Place": 288,
    "Two Liberty Place": 258,
    "BNY Mellon Center": 241,
    "Three Logan Square": 227,
    "G. Fred DiBona Jr. Building": 190,
    "FMC Tower at Cira Centre South": 224,
    "Two Commerce Square": 172,
    "One Commerce Square": 172,
    "1818 Market Street": 152,
    "Centre Square": 150,
    "Centre Square West": 150,
    "Centre Square East": 122,
    "Wells Fargo Building": 150,
    "The Laurel Rittenhouse Square": 184,
    "Arthaus": 165,
    "Two Logan Square": 133,
    "One Logan Square": 86,
    "Murano": 144,
    "The St. James": 137,
    "Symphony House": 130,
    "10 Rittenhouse Square": 104,
    "The Drake": 114,
    "PNB Building": 145,
    "One South Broad": 145,
    "1500 Walnut Street": 90,
    "Philadelphia Museum of Art": 36,
    "Independence Hall": 20,
    "Pennsylvania Convention Center": 30,
    "Reading Terminal Market": 18,
    "Liberty Bell Center": 10,
    "Camden City Hall": 113,
    "Lincoln Financial Field": 55,
    "Citizens Bank Park": 40,
    "Wells Fargo Center": 45,
    "Xfinity Mobile Arena": 45,
    "Franklin Field": 24,
    "Xfinity Live!": 18,
    "Adventure Aquarium": 22,
}

# City Hall: the OSM footprint is the whole 150 m block, whose roof is ~50 m.
# Extruding it to the 167 m of the tower would make a cube. The tower is a
# separately curated box so the silhouette reads.
CURATED_EXTRAS = [
    {
        "name": "Philadelphia City Hall tower", "lon": -75.16353, "lat": 39.95253,
        "w": 26, "d": 26, "height": 167, "note":
        "Tower to the base of the statue; the OSM footprint below it is held at ~50 m.",
    },
]
CURATED_FOOTPRINT_HEIGHTS = {
    # name -> height to use for the footprint even if OSM offers something else
    "Philadelphia City Hall": 50,
    "City Hall": 50,
}


def replaced_by_models() -> set:
    """OSM names whose flat extrusion a schematic landmark model stands in for."""
    path = ROOT / "data" / "landmark-models.json"
    if not path.exists():
        return set()
    doc = json.loads(path.read_text())
    names = set()
    for model in doc.get("models", []):
        names.update(model.get("replaces", []))
    return names


REPLACED_BY_MODELS = replaced_by_models()


def historic_years() -> dict:
    """Curated construction years keyed by exact OSM name (data/historic-buildings.json)."""
    path = ROOT / "data" / "historic-buildings.json"
    if not path.exists():
        return {}
    doc = json.loads(path.read_text())
    return {name: int(v["year"]) for name, v in doc.get("buildings", {}).items()}


HISTORIC_YEARS = historic_years()
HISTORIC_MATCHED: set = set()


def parse_year(value) -> int | None:
    """A four-digit year from an OSM start_date ('1893', '1893-05-01', 'c. 1740')."""
    if not value:
        return None
    m = re.search(r"(1[5-9]\d\d|20\d\d)", str(value))
    return int(m.group(1)) if m else None


def building_year(tags: dict) -> tuple[int, str]:
    """(year, source): the curated year wins, then OSM start_date, else 0 (undated)."""
    name = tags.get("name")
    if name in HISTORIC_YEARS:
        HISTORIC_MATCHED.add(name)
        return HISTORIC_YEARS[name], "curated"
    y = parse_year(tags.get("start_date"))
    if y:
        return y, "osm"
    return 0, "none"

# ---------------------------------------------------------------------------
# Bridges. Deck alignment and width come from OSM; the structural parameters
# are curated approximations from public references (rounded). The renderer
# builds a schematic form from these — it is a recognisable silhouette, not a
# survey of the steel.
# ---------------------------------------------------------------------------

BRIDGES = [
    {
        "id": "benjamin-franklin", "name": "Benjamin Franklin Bridge",
        "osm_name": r"^Benjamin Franklin Bridge$", "type": "suspension",
        "main_span_m": 533, "tower_height_m": 116, "clearance_m": 41,
        "deck_width_m": 39, "opened": 1926, "carries": "I-676 / US 30, PATCO",
        "note": "Main span 1,750 ft; the world's longest suspension span when it opened.",
    },
    {
        "id": "walt-whitman", "name": "Walt Whitman Bridge",
        "osm_name": r"^Walt Whitman Bridge$", "type": "suspension",
        "main_span_m": 610, "tower_height_m": 114, "clearance_m": 46,
        "deck_width_m": 32, "opened": 1957, "carries": "I-76",
        "note": "Main span 2,000 ft.",
    },
    {
        "id": "betsy-ross", "name": "Betsy Ross Bridge",
        "osm_name": r"^Betsy Ross Bridge$", "type": "truss",
        "main_span_m": 222, "truss_height_m": 26, "truss_position": "below",
        "clearance_m": 41, "deck_width_m": 30, "opened": 1976, "carries": "NJ 90",
        "note": "Continuous steel deck truss: the roadway rides on top of the steel.",
    },
    {
        "id": "tacony-palmyra", "name": "Tacony-Palmyra Bridge",
        "osm_name": r"^Tacony.Palmyra Bridge$", "type": "arch",
        "main_span_m": 165, "arch_rise_m": 32, "clearance_m": 16,
        "deck_width_m": 14, "opened": 1929, "carries": "NJ 73",
        "note": "Steel tied arch beside a bascule span.",
    },
    {
        "id": "commodore-barry", "name": "Commodore Barry Bridge",
        "osm_name": r"^Commodore Barry Bridge$", "type": "truss",
        "main_span_m": 501, "truss_height_m": 52, "truss_position": "above",
        "clearance_m": 58, "deck_width_m": 24, "opened": 1974, "carries": "US 322",
        "note": "Cantilever through truss; among the longest of its kind.",
    },
    {
        "id": "burlington-bristol", "name": "Burlington-Bristol Bridge",
        "osm_name": r"^Burlington.Bristol Bridge$", "type": "lift",
        "main_span_m": 165, "tower_height_m": 60, "clearance_m": 19,
        "deck_width_m": 8, "opened": 1931, "carries": "NJ 413 / PA 413",
        "note": "Vertical-lift span between two towers.",
    },
]

# ---------------------------------------------------------------------------
# Overpass transport (same cache discipline as build_vectors.py)
# ---------------------------------------------------------------------------


def overpass(query: str, cache_key: str, refresh: bool = False) -> dict:
    cache_path = CACHE / f"{cache_key}.json"
    if cache_path.exists() and not refresh and cache_path.stat().st_size > 0:
        print(f"[structures] {cache_key}: cache hit "
              f"({cache_path.stat().st_size / 1e6:.1f} MB)", flush=True)
        return json.loads(cache_path.read_text())

    body = urllib.parse.urlencode({"data": query}).encode()
    last: Exception | None = None
    for attempt in range(6):
        endpoint = ENDPOINTS[attempt % len(ENDPOINTS)]
        try:
            print(f"[structures] {cache_key}: querying "
                  f"{urllib.parse.urlparse(endpoint).netloc} (attempt {attempt + 1})",
                  flush=True)
            req = urllib.request.Request(
                endpoint, data=body,
                headers={"User-Agent": USER_AGENT,
                         "Content-Type": "application/x-www-form-urlencoded"})
            with urllib.request.urlopen(req, timeout=600) as resp:
                raw = resp.read()
            payload = json.loads(raw)
            if "remark" in payload and "error" in str(payload.get("remark", "")).lower():
                raise RuntimeError(payload["remark"])
            cache_path.parent.mkdir(parents=True, exist_ok=True)
            cache_path.write_bytes(raw)
            print(f"[structures] {cache_key}: {len(payload.get('elements', []))} elements, "
                  f"{len(raw) / 1e6:.1f} MB", flush=True)
            return payload
        except (urllib.error.URLError, OSError, json.JSONDecodeError, RuntimeError) as exc:
            last = exc
            wait = 20 * (attempt + 1)
            print(f"[structures] {cache_key}: {type(exc).__name__} {exc}; retry in {wait}s",
                  flush=True)
            time.sleep(wait)
    raise RuntimeError(f"overpass failed for {cache_key}: {last}")


def bbox(z) -> str:
    return f"{z['south']},{z['west']},{z['north']},{z['east']}"


QUERY_VERSION = "v2"   # bump when a query changes so the cache refetches


def fetch_zone(zone, refresh=False) -> dict:
    b = bbox(zone)
    # Stadiums are `leisure=stadium` areas, frequently with no `building` tag
    # at all (Lincoln Financial Field, Citizens Bank Park), so they need their
    # own clause or the sports complex is an empty lot.
    if zone["mode"] == "full":
        q = f"""[out:json][timeout:600][maxsize:1073741824];
(
  way["building"]({b});
  relation["building"]["type"="multipolygon"]({b});
  way["leisure"="stadium"]({b});
  relation["leisure"="stadium"]["type"="multipolygon"]({b});
);
out geom;"""
    else:
        q = f"""[out:json][timeout:600][maxsize:1073741824];
(
  way["building"](if: number(t["height"]) >= 12)({b});
  way["building"](if: number(t["building:levels"]) >= 4)({b});
  way["building"]["name"]({b});
  relation["building"]["type"="multipolygon"](if: number(t["height"]) >= 12)({b});
  relation["building"]["type"="multipolygon"](if: number(t["building:levels"]) >= 4)({b});
  relation["building"]["type"="multipolygon"]["name"]({b});
  way["leisure"="stadium"]({b});
  relation["leisure"="stadium"]["type"="multipolygon"]({b});
);
out geom;"""
    return overpass(q, f"structures_{zone['id']}_{QUERY_VERSION}", refresh)


def fetch_bridges(refresh=False) -> dict:
    b = region.bbox_overpass()
    names = "|".join(f"({br['osm_name'].strip('^$')})" for br in BRIDGES)
    q = f"""[out:json][timeout:300];
(
  way["man_made"="bridge"]["name"~"{names}"]({b});
  relation["man_made"="bridge"]["name"~"{names}"]({b});
  way["bridge"]["highway"]["name"~"{names}"]({b});
);
out geom;"""
    return overpass(q, "structures_bridges", refresh)


# ---------------------------------------------------------------------------
# Processing
# ---------------------------------------------------------------------------

def parse_num(value) -> float | None:
    if value is None:
        return None
    s = str(value).strip().lower().replace(",", ".")
    for suffix in (" m", "m", " metres", " meters"):
        if s.endswith(suffix):
            s = s[: -len(suffix)].strip()
    if s.endswith("ft") or s.endswith("'"):
        try:
            return float(s.rstrip("ft'").strip()) * 0.3048
        except ValueError:
            return None
    try:
        return float(s)
    except ValueError:
        return None


def derive_height(tags: dict, area_m2: float) -> tuple[float, str, float]:
    """Return (height_m, source, min_height_m)."""
    name = tags.get("name")
    min_h = parse_num(tags.get("min_height")) or 0.0

    if name in CURATED_FOOTPRINT_HEIGHTS:
        return float(CURATED_FOOTPRINT_HEIGHTS[name]), "curated", min_h

    h = parse_num(tags.get("height"))
    if h is not None and 2.0 <= h <= 400.0:
        return h, "measured", min_h

    if name in CURATED_HEIGHTS:
        return float(CURATED_HEIGHTS[name]), "curated", min_h

    levels = parse_num(tags.get("building:levels"))
    if levels is not None and 1 <= levels <= 120:
        roof = parse_num(tags.get("roof:levels")) or 0
        return 3.3 * levels + 1.5 + 2.5 * roof, "levels", min_h

    kind = tags.get("building", "yes")
    if kind == "stadium" or tags.get("leisure") == "stadium":
        # A bowl, not a block; 30 m is the seating rim of a typical major venue.
        return 30.0, "default", min_h
    if kind in ("house", "residential", "terrace", "detached", "semidetached_house"):
        return 10.0, "default", min_h
    if kind in ("garage", "garages", "shed", "hut", "roof", "carport"):
        return 3.5, "default", min_h
    if kind in ("church", "cathedral", "chapel"):
        return 16.0, "default", min_h
    if kind in ("industrial", "warehouse", "retail", "commercial", "school", "hospital",
                "university", "college", "public", "civic", "office", "hotel", "apartments"):
        return 12.0 if area_m2 < 800 else 15.0, "default", min_h
    return 9.0, "default", min_h


def outer_rings(el: dict) -> list:
    """Outer rings of a way or multipolygon relation, as (lon, lat) lists."""
    if el.get("type") == "way":
        pts = [(g["lon"], g["lat"]) for g in el.get("geometry", []) if g]
        return [pts] if len(pts) >= 4 else []
    rings = []
    for m in el.get("members", []):
        if m.get("type") == "way" and m.get("role") in ("outer", "") and m.get("geometry"):
            pts = [(g["lon"], g["lat"]) for g in m["geometry"]]
            if len(pts) >= 4:
                rings.append(pts)
    # Multipolygon outers are frequently split across several ways; chain them.
    if len(rings) > 1:
        joined = chain_lines([r[:-1] if r[0] == r[-1] else r for r in rings])
        rings = [r + [r[0]] if r[0] != r[-1] else r for r in joined if len(r) >= 3]
    return rings


def to_local(lon: float, lat: float, origin) -> tuple[float, float]:
    """Metres east/south of the zone origin, matching the runtime projection."""
    x = (lon - origin[0]) * region.METERS_PER_DEG_LON
    z = (origin[1] - lat) * region.METERS_PER_DEG_LAT
    return x, z


def tier_of(height: float) -> str:
    for name, floor in TIERS:
        if height >= floor:
            return name
    return "low"


def process_zone(zone, payload, seen_ids: set) -> list:
    """Turn raw OSM elements into building records (local-metre polygons)."""
    origin = ((zone["west"] + zone["east"]) / 2, (zone["south"] + zone["north"]) / 2)
    records = []
    for el in payload.get("elements", []):
        key = (el.get("type"), el.get("id"))
        if key in seen_ids:
            continue
        tags = el.get("tags", {}) or {}
        if tags.get("building") in ("no", "roof") or tags.get("building:part"):
            continue
        if tags.get("name") in REPLACED_BY_MODELS:
            # A schematic model (data/landmark-models.json) draws this one.
            seen_ids.add(key)
            continue
        if not tags.get("building") and tags.get("leisure") != "stadium":
            continue
        emitted = False
        for ring in outer_rings(el):
            area = ring_area_m2(ring)
            if area < MIN_FOOTPRINT_M2:
                continue
            # Overpass returns anything that touches the box; a footprint whose
            # centroid lies outside belongs to whichever zone does contain it.
            c_lon = sum(p[0] for p in ring) / len(ring)
            c_lat = sum(p[1] for p in ring) / len(ring)
            if not (zone["west"] <= c_lon <= zone["east"]
                    and zone["south"] <= c_lat <= zone["north"]):
                continue
            height, source, min_h = derive_height(tags, area)
            if zone["mode"] == "notable":
                named = bool(tags.get("name"))
                # A three-storey rowhouse measures 12 m; that is fabric, not a
                # landmark. Mid-rise, big-box, or named-and-substantial only.
                notable = (height >= NOTABLE_MIN_HEIGHT_M
                           or (area >= NOTABLE_MIN_AREA_M2 and height >= 8.0)
                           or (named and height >= 12.0)
                           or (named and area >= 1200.0)
                           or tags.get("name") in HISTORIC_YEARS)   # dated: history is notable
                if not notable:
                    continue
            simplified = simplify(ring[:-1] if ring[0] == ring[-1] else ring, 0.6)
            if len(simplified) < 3:
                continue
            local = [to_local(lon, lat, origin) for lon, lat in simplified]
            # Keep the whole footprint inside the zone box, so the manifest's
            # bounds are honest and int16 packing cannot overflow.
            if any(abs(x) > 32000 or abs(z) > 32000 for x, z in local):
                continue
            year, year_source = building_year(tags)
            records.append({
                "id": f"{el['type'][0]}{el['id']}",
                "name": tags.get("name"),
                "height": round(height, 1),
                "min_height": round(min_h, 1),
                "source": source,
                "area": round(area),
                "poly": local,
                "tier": tier_of(height),
                "year": year,
                "year_source": year_source,
            })
            emitted = True
        if emitted:
            seen_ids.add(key)
    return records, origin


def merge_low_rows(records: list) -> tuple[list, int]:
    """Union touching sub-18 m footprints of similar height into block rows.

    A rowhouse is ~5 m wide: at any camera distance the map actually uses, a
    row of twenty is sub-pixel per house. Merging them into one polygon per
    row cuts the low tier's vertex count several-fold and loses nothing that
    could be seen. Requires shapely; without it the tier ships unmerged.
    """
    try:
        from shapely.geometry import Polygon
        from shapely.ops import unary_union
    except ImportError:  # pragma: no cover - environment dependent
        print("[structures] shapely not available; low tier left unmerged", flush=True)
        return records, 0

    low = [r for r in records if r["height"] < MERGE_BELOW_M and r["source"] != "curated"]
    others = [r for r in records if not (r["height"] < MERGE_BELOW_M and r["source"] != "curated")]
    if not low:
        return records, 0

    def band_of(h):
        for i, top in enumerate(MERGE_BANDS_M):
            if h < top:
                return i
        return len(MERGE_BANDS_M)

    bands: dict[int, list] = {}
    for r in low:
        bands.setdefault(band_of(r["height"]), []).append(r)

    merged = []
    for band, group in bands.items():
        polys = []
        for r in group:
            try:
                p = Polygon(r["poly"])
                if not p.is_valid:
                    p = p.buffer(0)
                if p.is_empty or p.area <= 0:
                    continue
                # Party walls in the city import are often drawn twice with a
                # few decimetres between them; grow each footprint by that
                # much so touching houses really touch, then shrink back.
                polys.append(p.buffer(MERGE_GAP_M, join_style=2))
            except Exception:  # noqa: BLE001 - one bad ring must not sink the tier
                continue
        if not polys:
            continue
        union = unary_union(polys).buffer(-MERGE_GAP_M, join_style=2)
        parts = list(union.geoms) if hasattr(union, "geoms") else [union]
        # Area-weighted mean height of the band, so one garage cannot drag a
        # row of three-storey houses down.
        total_area = sum(max(1.0, r["area"]) for r in group)
        height = round(sum(r["height"] * max(1.0, r["area"]) for r in group) / total_area, 1)
        for part in parts:
            if part.is_empty or part.area < MIN_FOOTPRINT_M2:
                continue
            # A negative buffer can split a part again; take every piece.
            pieces = list(part.geoms) if hasattr(part, "geoms") else [part]
            for piece in pieces:
                if piece.is_empty or piece.area < MIN_FOOTPRINT_M2:
                    continue
                rec = row_record(piece, band, height, len(merged))
                if rec:
                    merged.append(rec)
    removed = len(low) - len(merged)
    return others + merged, removed


def row_record(piece, band: int, height: float, idx: int) -> dict | None:
    simp = simplify_local(list(piece.exterior.coords)[:-1], 0.7)
    if len(simp) < 3:
        return None
    return {
        "id": f"row-{band}-{idx}",
        "name": None,
        "height": height,
        "min_height": 0.0,
        "source": "merged",
        "area": round(piece.area),
        "poly": simp,
        "tier": tier_of(height),
    }


def simplify_local(points: list, tol_m: float) -> list:
    """Douglas-Peucker on already-metric points."""
    if len(points) < 3:
        return points
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]

    def perp(p, a, b):
        px, py = p[0] - a[0], p[1] - a[1]
        bx, by = b[0] - a[0], b[1] - a[1]
        d = bx * bx + by * by
        t = max(0.0, min(1.0, (px * bx + py * by) / d)) if d else 0.0
        dx, dy = px - t * bx, py - t * by
        return dx * dx + dy * dy

    while stack:
        lo, hi = stack.pop()
        if hi - lo < 2:
            continue
        worst, wi = -1.0, -1
        for i in range(lo + 1, hi):
            d = perp(points[i], points[lo], points[hi])
            if d > worst:
                worst, wi = d, i
        if worst > tol_m * tol_m:
            keep[wi] = True
            stack.append((lo, wi))
            stack.append((wi, hi))
    return [p for p, k in zip(points, keep) if k]


# ---------------------------------------------------------------------------
# Binary packing
#
# One little-endian stream per tier:
#   magic "PHB2", uint32 count, then per building:
#     uint16 nVerts, uint16 heightDm, uint16 minHeightDm, uint8 source, uint8 flags,
#     uint16 constructionYear,
#     nVerts x (int16 x, int16 z)      metres from the zone origin, +x east, +z south
# ---------------------------------------------------------------------------

SOURCE_CODES = {"measured": 0, "levels": 1, "default": 2, "curated": 3, "merged": 4}


YEAR_FLAGS = {"none": 0, "osm": 2, "curated": 4}


def pack_tier(records: list) -> bytes:
    """PHB2: per building n, height dm, min height dm, source, flags, year (0 = undated)."""
    out = bytearray(b"PHB2")
    out += struct.pack("<I", len(records))
    for r in records:
        poly = r["poly"]
        n = len(poly)
        h_dm = min(65535, int(round(r["height"] * 10)))
        mh_dm = min(65535, int(round(r["min_height"] * 10)))
        flags = (1 if r["name"] else 0) | YEAR_FLAGS.get(r.get("year_source", "none"), 0)
        year = min(65535, max(0, int(r.get("year") or 0)))
        out += struct.pack("<HHHBBH", n, h_dm, mh_dm, SOURCE_CODES[r["source"]], flags, year)
        for x, z in poly:
            out += struct.pack("<hh", int(round(x)), int(round(z)))
    return bytes(out)


# ---------------------------------------------------------------------------
# Bridges
# ---------------------------------------------------------------------------

def principal_axis(ring: list) -> tuple:
    """Endpoints of the long axis of a bridge outline, in lon/lat."""
    k = region.METERS_PER_DEG_LON / region.METERS_PER_DEG_LAT
    pts = [(lon * k, lat) for lon, lat in ring]
    cx = sum(p[0] for p in pts) / len(pts)
    cy = sum(p[1] for p in pts) / len(pts)
    sxx = sum((p[0] - cx) ** 2 for p in pts)
    syy = sum((p[1] - cy) ** 2 for p in pts)
    sxy = sum((p[0] - cx) * (p[1] - cy) for p in pts)
    theta = 0.5 * math.atan2(2 * sxy, sxx - syy)
    ux, uy = math.cos(theta), math.sin(theta)
    proj = [((p[0] - cx) * ux + (p[1] - cy) * uy) for p in pts]
    lo, hi = min(proj), max(proj)
    a = ((cx + ux * lo) / k, cy + uy * lo)
    b = ((cx + ux * hi) / k, cy + uy * hi)
    return a, b


def polyline_len_m(points: list) -> float:
    total = 0.0
    for i in range(1, len(points)):
        dx = (points[i][0] - points[i - 1][0]) * region.METERS_PER_DEG_LON
        dy = (points[i][1] - points[i - 1][1]) * region.METERS_PER_DEG_LAT
        total += math.hypot(dx, dy)
    return total


def process_bridges(payload) -> list:
    import re
    out = []
    elements = payload.get("elements", [])
    for spec in BRIDGES:
        pat = re.compile(spec["osm_name"])
        outlines, ways = [], []
        for el in elements:
            tags = el.get("tags", {}) or {}
            if not pat.search(tags.get("name", "")):
                continue
            if tags.get("man_made") == "bridge":
                outlines.extend(outer_rings(el))
            elif el.get("type") == "way" and tags.get("highway"):
                pts = [(g["lon"], g["lat"]) for g in el.get("geometry", []) if g]
                if len(pts) >= 2:
                    ways.append(pts)

        centerline, width, geom_source = None, spec["deck_width_m"], "curated"
        if outlines:
            ring = max(outlines, key=ring_area_m2)
            a, b = principal_axis(ring[:-1] if ring[0] == ring[-1] else ring)
            centerline = [a, b]
            length = polyline_len_m(centerline)
            if length > 0:
                width = max(8.0, min(60.0, ring_area_m2(ring) / length))
            geom_source = "osm-outline"
        elif ways:
            chains = chain_lines(ways)
            longest = max(chains, key=polyline_len_m)
            centerline = simplify(longest, 15.0)
            geom_source = "osm-centerline"
        if not centerline:
            print(f"[structures] bridge {spec['id']}: no OSM geometry found; skipped",
                  flush=True)
            continue

        entry = {k: v for k, v in spec.items() if k != "osm_name"}
        entry["centerline"] = [[round(lon, 6), round(lat, 6)] for lon, lat in centerline]
        entry["length_m"] = round(polyline_len_m(centerline))
        entry["deck_width_m"] = round(width, 1)
        entry["geometry_source"] = geom_source
        out.append(entry)
        print(f"[structures] bridge {spec['id']}: {geom_source}, "
              f"{entry['length_m']} m long, deck {entry['deck_width_m']} m", flush=True)
    return out


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--fetch-only", action="store_true")
    ap.add_argument("--refresh", action="store_true")
    ap.add_argument("--no-merge", action="store_true",
                    help="keep every rowhouse as its own footprint")
    args = ap.parse_args()

    raw = {}
    for zone in ZONES:
        raw[zone["id"]] = fetch_zone(zone, args.refresh)
        time.sleep(3)
    raw_bridges = fetch_bridges(args.refresh)
    if args.fetch_only:
        return 0

    OUT.mkdir(parents=True, exist_ok=True)
    seen: set = set()
    placed_extras: set = set()
    manifest_zones = []
    totals = {"buildings": 0, "vertices": 0, "bytes": 0}
    source_counts: dict[str, int] = {}

    dated_records: list = []
    for zone in ZONES:
        records, origin = process_zone(zone, raw[zone["id"]], seen)
        for r in records:
            source_counts[r["source"]] = source_counts.get(r["source"], 0) + 1

        # Curated extras (City Hall tower) go into the first zone that contains
        # them; zones overlap, and a tower drawn twice is a tower drawn wrong.
        for extra in CURATED_EXTRAS:
            if extra["name"] in placed_extras:
                continue
            if not (zone["west"] <= extra["lon"] <= zone["east"]
                    and zone["south"] <= extra["lat"] <= zone["north"]):
                continue
            placed_extras.add(extra["name"])
            cx, cz = to_local(extra["lon"], extra["lat"], origin)
            hw, hd = extra["w"] / 2, extra["d"] / 2
            records.append({
                "id": "curated-" + extra["name"].lower().replace(" ", "-"),
                "name": extra["name"], "height": float(extra["height"]),
                "min_height": 0.0, "source": "curated", "area": extra["w"] * extra["d"],
                "poly": [(cx - hw, cz - hd), (cx + hw, cz - hd), (cx + hw, cz + hd),
                         (cx - hw, cz + hd)],
                "tier": tier_of(extra["height"]),
                "year": HISTORIC_YEARS.get(extra["name"], 0),
                "year_source": "curated" if extra["name"] in HISTORIC_YEARS else "none",
            })
            source_counts["curated"] = source_counts.get("curated", 0) + 1

        merged_away = 0
        if zone["mode"] == "full" and not args.no_merge:
            records, merged_away = merge_low_rows(records)
        dated_records.extend(records)

        tiers_out = []
        for tier_name, _floor in TIERS:
            rows = [r for r in records if r["tier"] == tier_name]
            # Tallest first, so a draw range prefix is always the skyline.
            rows.sort(key=lambda r: -r["height"])
            if not rows:
                continue
            blob = pack_tier(rows)
            fname = f"{zone['id']}-{tier_name}.bin"
            (OUT / fname).write_bytes(blob)
            verts = sum(len(r["poly"]) for r in rows)
            tiers_out.append({
                "tier": tier_name, "file": fname, "count": len(rows),
                "vertices": verts, "bytes": len(blob),
                "minHeight": min(r["height"] for r in rows),
                "maxHeight": max(r["height"] for r in rows),
                "named": sum(1 for r in rows if r["name"]),
            })
            totals["buildings"] += len(rows)
            totals["vertices"] += verts
            totals["bytes"] += len(blob)
            print(f"[structures] {zone['id']}/{tier_name}: {len(rows)} buildings, "
                  f"{verts} vertices, {len(blob) / 1024:.0f} KB", flush=True)

        notable = sorted((r for r in records if r["name"] and r["height"] >= 60),
                         key=lambda r: -r["height"])[:12]
        manifest_zones.append({
            "id": zone["id"], "label": zone["label"], "mode": zone["mode"],
            "lazy": bool(zone.get("lazy")),
            "bounds": {k: zone[k] for k in ("west", "east", "south", "north")},
            "origin": {"lon": origin[0], "lat": origin[1]},
            "tiers": tiers_out,
            "mergedRowhouses": merged_away,
            "tallest": [{"name": r["name"], "height": r["height"], "source": r["source"]}
                        for r in notable],
        })

    bridges = process_bridges(raw_bridges)
    (OUT / "bridges.json").write_text(json.dumps({
        "attribution": "Deck alignment (c) OpenStreetMap contributors, ODbL 1.0. "
                       "Spans, tower heights and clearances are curated approximations "
                       "from public references; structural form is schematic.",
        "curated": True,
        "bridges": bridges,
    }, indent=1) + "\n")

    manifest = {
        "format": "PHB2",
        "generator": "tools/build_structures.py",
        "attribution": "(c) OpenStreetMap contributors, ODbL 1.0",
        "heightSources": {
            "measured": "OSM height tag (Philadelphia's are largely LiDAR-derived)",
            "levels": "estimated from building:levels at 3.3 m per storey",
            "default": "estimated from building type",
            "curated": "public reference value supplied by this project",
            "merged": "average of a merged rowhouse row",
        },
        "sourceCounts": source_counts,
        "tiers": [{"tier": n, "minHeightM": f} for n, f in TIERS],
        "zones": manifest_zones,
        "totals": totals,
        "bridgesFile": "bridges.json",
        "bridgeCount": len(bridges),
        "replacedByModels": sorted(REPLACED_BY_MODELS),
        "dated": {
            "curated": sum(1 for r in dated_records if r.get("year_source") == "curated"),
            "osm": sum(1 for r in dated_records if r.get("year_source") == "osm"),
            "undated": sum(1 for r in dated_records if not r.get("year")),
            "historicUnmatched": sorted(set(HISTORIC_YEARS) - HISTORIC_MATCHED - REPLACED_BY_MODELS),
            "note": "Years: curated = data/historic-buildings.json (published completion/opening "
                    "year, Wikipedia); osm = OpenStreetMap start_date; undated = no public date "
                    "in the data this map ships. Philadelphia's assessor records carry a "
                    "year_built for every parcel but their licence reserves all database rights, "
                    "so they are not redistributed here.",
        },
        "projection": {
            "metersPerDegLat": round(region.METERS_PER_DEG_LAT, 4),
            "metersPerDegLon": round(region.METERS_PER_DEG_LON, 4),
        },
    }
    (OUT / "buildings.json").write_text(json.dumps(manifest, indent=1) + "\n")
    print(f"[structures] total {totals['buildings']} buildings, {totals['vertices']} vertices, "
          f"{totals['bytes'] / 1024:.0f} KB; sources {source_counts}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
