"""Bake small, complete neighborhood cells from a downloaded BBBike OSM XML extract.

python tools/build_neighborhoods.py /path/Philadelphia.osm.gz --date 2026-10-18

Uses only Python's standard library. The source stays outside the repository;
user/edit metadata is discarded. Each cell matches street-detail.js's query grid.
"""
from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import math
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SOURCE_URL = "https://download.bbbike.org/osm/bbbike/Philadelphia/Philadelphia.osm.gz"
ATTRIBUTION = "OpenStreetMap contributors · ODbL 1.0"
KEYS = set("name highway oneway lanes width bridge tunnel layer building height min_height "
           "building:levels roof:shape roof:height roof:levels roof:orientation roof:direction "
           "roof:colour building:colour building:material natural leaf_type "
           "addr:housenumber addr:street".split())
# Center City, University City, the museum district and the sports complex.
AREAS = [(-75.216, 39.928, -75.136, 39.979), (-75.200, 39.892, -75.148, 39.916)]


def cell_xy(x, y):
    lon, lat = round(-75.8 + x * .004, 4), round(39.7 + y * .003, 4)
    return {"key": f"{lon:.4f},{lat:.4f}", "lon": lon, "lat": lat,
            "bounds": {"west": round(lon - .004, 4), "east": round(lon + .004, 4),
                       "south": round(lat - .003, 4), "north": round(lat + .003, 4)}}


def selected_cells():
    cells = {}
    for west, south, east, north in AREAS:
        for x in range(math.ceil((west + 75.8) / .004 - 1e-8), math.floor((east + 75.8) / .004 + 1e-8) + 1):
            for y in range(math.ceil((south - 39.7) / .003 - 1e-8), math.floor((north - 39.7) / .003 + 1e-8) + 1):
                cells[x, y] = cell_xy(x, y)
    return cells


def cells_for_point(lon, lat, cells):
    x, y = (lon + 75.8) / .004, (lat - 39.7) / .003
    for i in range(math.ceil(x - 1 - 1e-8), math.floor(x + 1 + 1e-8) + 1):
        for j in range(math.ceil(y - 1 - 1e-8), math.floor(y + 1 + 1e-8) + 1):
            if (i, j) in cells:
                yield i, j


def build(source, date):
    cells = selected_cells()
    elements = {key: [] for key in cells}
    nodes = {}
    retained = {"building": 0, "street": 0, "address": 0, "tree": 0}
    with gzip.open(source, "rb") as stream:
        parser = ET.iterparse(stream, events=("start", "end"))
        _, root = next(parser)
        for event, item in parser:
            if event != "end" or item.tag not in ("node", "way", "relation", "bounds"):
                continue
            tags = {tag.get("k"): tag.get("v", "")[:160] for tag in item.findall("tag")
                    if tag.get("k") in KEYS and tag.get("v")}
            feature, matches = None, set()
            if item.tag == "bounds":
                # Never claim complete coverage beyond the source extract.
                for cell in cells.values():
                    b = cell["bounds"]
                    assert (float(item.get("minlon")) <= b["west"] < b["east"] <= float(item.get("maxlon"))
                            and float(item.get("minlat")) <= b["south"] < b["north"] <= float(item.get("maxlat")))
            elif item.tag == "node":
                lon, lat = float(item.get("lon")), float(item.get("lat"))
                nodes[int(item.get("id"))] = (lon, lat)
                if tags.get("addr:housenumber") or tags.get("natural") == "tree":
                    matches.update(cells_for_point(lon, lat, cells))
                    feature = {"id": int(item.get("id")), "type": "node", "lon": lon, "lat": lat, "tags": tags}
                    if matches:
                        retained["tree" if tags.get("natural") == "tree" else "address"] += 1
            elif item.tag == "way" and ((tags.get("building") and tags["building"] != "no")
                    or (tags.get("highway") and not any(t.get("k") == "area" and t.get("v") == "yes" for t in item.findall("tag")))):
                refs = [int(nd.get("ref")) for nd in item.findall("nd")]
                geometry = [nodes[n] for n in refs if n in nodes]
                for lon, lat in geometry:
                    matches.update(cells_for_point(lon, lat, cells))
                if matches:
                    if len(geometry) != len(refs) or len(geometry) > 1200:
                        raise ValueError(f"Incomplete/oversized way {item.get('id')}; refusing partial cells")
                    feature = {"id": int(item.get("id")), "type": "way", "geometry": geometry, "tags": tags}
                    retained["building" if tags.get("building") else "street"] += 1
            if feature:
                for key in matches:
                    elements[key].append(feature)
            root.clear()
    print(f"Read {len(nodes):,} coordinates; selected {retained}", flush=True)
    output = ROOT / "data" / "neighborhoods" / date
    output.mkdir(parents=True, exist_ok=True)
    with open(source, "rb") as stream:
        source_hash = hashlib.file_digest(stream, "sha256").hexdigest()
    manifest = {"date": date, "source": ATTRIBUTION, "sourceUrl": SOURCE_URL,
                "sourceSha256": source_hash,
                "generator": "tools/build_neighborhoods.py", "features": retained, "cells": {}}
    for key, cell in sorted(cells.items()):
        features = sorted(elements[key], key=lambda e: (e["type"], e["id"]))
        if len(features) > 6000:
            raise ValueError(f"Oversized cell {cell['key']} ({len(features)}); refusing incomplete coverage")
        doc = {**cell, "source": ATTRIBUTION, "snapshotDate": date, "elements": features}
        body = (json.dumps(doc, separators=(",", ":"), ensure_ascii=False) + "\n").encode("utf-8")
        if len(body) > 8 * 1024 * 1024:
            raise ValueError(f"Cell {cell['key']} exceeds response limit")
        name = cell["key"].replace(",", "_") + ".json"
        (output / name).write_bytes(body)
        manifest["cells"][cell["key"]] = {"file": name, "elements": len(features), "bytes": len(body),
                                          "sha256": hashlib.sha256(body).hexdigest()}
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    module = ROOT.parents[1] / "functions" / "demos" / "philadelphia-relief" / "_lib" / "neighborhood-snapshot.js"
    module.parent.mkdir(parents=True, exist_ok=True)
    module.write_text("// Generated by tools/build_neighborhoods.py; see the published manifest for provenance.\n"
                      f"export const snapshotDate = {json.dumps(date)};\n"
                      "export const snapshotCells = new Set(" + json.dumps(sorted(manifest["cells"])) + ");\n", encoding="utf-8")
    sizes = [c["bytes"] for c in manifest["cells"].values()]
    print(json.dumps({"cells": len(sizes), "bytes": sum(sizes), "maxCellBytes": max(sizes), "features": retained}), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--date", required=True, help="YYYY-MM-DD of the downloaded extract")
    args = parser.parse_args()
    from datetime import date as date_type
    date_type.fromisoformat(args.date)
    build(args.source, args.date)
