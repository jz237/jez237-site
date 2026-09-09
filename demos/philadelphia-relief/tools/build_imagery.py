#!/usr/bin/env python3
"""Bake a georeferenced USGS orthoimagery texture for Philadelphia Relief.

The National Map's USGSImageryOnly service is public domain and permits tile
export.  The export is requested in EPSG:4326 over the exact terrain bounds,
so texture UVs and the map's regular lon/lat terrain grid coincide without a
runtime reprojection or third-party request.

Usage:  python tools/build_imagery.py [--size 4096] [--quality 82]
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import pathlib
import urllib.parse
import urllib.request
from datetime import UTC, datetime

from PIL import Image

import region


ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
SERVICE = (
    "https://basemap.nationalmap.gov/arcgis/rest/services/"
    "USGSImageryOnly/MapServer/export"
)
SOURCE_PAGE = (
    "https://basemap.nationalmap.gov/arcgis/rest/services/"
    "USGSImageryOnly/MapServer"
)
USER_AGENT = "Philadelphia-Relief/1.0 (public-data static asset generator)"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--size", type=int, default=4096)
    parser.add_argument("--quality", type=int, default=82)
    parser.add_argument("--out", default="imagery.webp")
    args = parser.parse_args()

    if not 512 <= args.size <= 4096:
        raise SystemExit("--size must be between 512 and the service limit of 4096")
    if not 50 <= args.quality <= 95:
        raise SystemExit("--quality must be between 50 and 95")

    bounds = {
        "west": region.WEST,
        "east": region.EAST,
        "south": region.SOUTH,
        "north": region.NORTH,
    }
    image_height = round(args.size * (region.NORTH - region.SOUTH) / (region.EAST - region.WEST))
    params = {
        "bbox": f"{region.WEST},{region.SOUTH},{region.EAST},{region.NORTH}",
        "bboxSR": "4326",
        "imageSR": "4326",
        "size": f"{args.size},{image_height}",
        "format": "jpg",
        "transparent": "false",
        "f": "image",
    }
    url = f"{SERVICE}?{urllib.parse.urlencode(params)}"
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    print(f"[imagery] requesting {args.size}x{image_height} USGS orthoimagery", flush=True)
    with urllib.request.urlopen(request, timeout=180) as response:
        blob = response.read()

    image = Image.open(io.BytesIO(blob)).convert("RGB")
    if image.size != (args.size, image_height):
        raise SystemExit(f"service returned {image.size}, expected {(args.size, image_height)}")

    out = DATA / args.out
    image.save(out, "WEBP", quality=args.quality, method=6)
    payload = out.read_bytes()
    digest = hashlib.sha256(payload).hexdigest()
    meta = {
        "generator": "tools/build_imagery.py",
        "source": {
            "name": "USGS Imagery Only",
            "agency": "USDA / U.S. Geological Survey, National Geospatial Program",
            "url": SOURCE_PAGE,
            "service": SERVICE,
            "description": (
                "Public-domain orthoimagery from The National Map; principally "
                "USDA National Agriculture Imagery Program imagery in this region."
            ),
            "credit": "USDA, USGS The National Map: Orthoimagery",
            "license": "Public domain",
        },
        "bounds": bounds,
        "projection": "EPSG:4326",
        "width": image.width,
        "height": image.height,
        "format": "webp",
        "quality": args.quality,
        "bytes": len(payload),
        "sha256": digest,
        "builtAt": datetime.now(UTC).isoformat(timespec="seconds"),
    }
    meta_out = DATA / "imagery.json"
    meta_out.write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")
    print(f"[imagery] wrote {out.relative_to(ROOT)} ({len(payload):,} bytes)")
    print(f"[imagery] wrote {meta_out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
