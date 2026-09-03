#!/usr/bin/env python3
"""Build the packed elevation heightmap for the Philadelphia 3D map.

Source: AWS "Terrain Tiles" open data set (terrarium encoding), which is
public-domain / open-licensed and needs no API key. Underlying elevation for
this region comes from USGS 3DEP and SRTM.

  https://registry.opendata.aws/terrain-tiles/

The script downloads the z12 tile mosaic covering the region, decodes it to
float metres, low-passes it to match the output sample spacing, resamples onto
a regular lat/lon grid and writes:

  data/heightmap.png   R = (q >> 8), G = (q & 255), B = 0   where
                       q = round((elev_m - elevMin) / step)
  data/terrain.json    metadata + integrity probes for the runtime decoder

Usage:  python tools/build_terrain.py [--zoom 12] [--grid 2048]
"""
from __future__ import annotations

import argparse
import concurrent.futures
import io
import json
import math
import os
import pathlib
import sys
import time
import urllib.error
import urllib.request

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import region  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
CACHE = pathlib.Path(os.environ.get("PHILLY_TILE_CACHE", "/tmp/philly-terrain-cache"))

TILE_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
TILE_PX = 256
USER_AGENT = "philly-3d-map-build/1.0 (static site asset generator)"


def lon_to_tile_x(lon: float, z: int) -> float:
    return (lon + 180.0) / 360.0 * (1 << z)


def lat_to_tile_y(lat: float, z: int) -> float:
    rad = math.radians(lat)
    return (1.0 - math.asinh(math.tan(rad)) / math.pi) / 2.0 * (1 << z)


def fetch_tile(z: int, x: int, y: int, attempts: int = 4) -> Image.Image:
    cache_path = CACHE / f"{z}_{x}_{y}.png"
    if cache_path.exists() and cache_path.stat().st_size > 0:
        return Image.open(cache_path).convert("RGB")

    url = TILE_URL.format(z=z, x=x, y=y)
    last: Exception | None = None
    for attempt in range(attempts):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=45) as resp:
                blob = resp.read()
            cache_path.parent.mkdir(parents=True, exist_ok=True)
            cache_path.write_bytes(blob)
            return Image.open(io.BytesIO(blob)).convert("RGB")
        except (urllib.error.URLError, OSError) as exc:  # noqa: PERF203
            last = exc
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"failed to fetch {url}: {last}")


def build_mosaic(z: int) -> tuple[np.ndarray, int, int]:
    """Download the tile block covering the region; return elevation metres."""
    x0 = int(math.floor(lon_to_tile_x(region.WEST, z)))
    x1 = int(math.floor(lon_to_tile_x(region.EAST, z)))
    y0 = int(math.floor(lat_to_tile_y(region.NORTH, z)))
    y1 = int(math.floor(lat_to_tile_y(region.SOUTH, z)))

    cols = x1 - x0 + 1
    rows = y1 - y0 + 1
    total = cols * rows
    print(f"[terrain] z{z} mosaic {cols}x{rows} tiles ({total} downloads)", flush=True)

    mosaic = np.zeros((rows * TILE_PX, cols * TILE_PX), dtype=np.float32)
    done = 0

    def job(idx: int):
        ty = y0 + idx // cols
        tx = x0 + idx % cols
        return idx, fetch_tile(z, tx, ty)

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for idx, img in pool.map(job, range(total)):
            arr = np.asarray(img, dtype=np.float32)
            # terrarium: elevation = (R * 256 + G + B / 256) - 32768
            elev = arr[:, :, 0] * 256.0 + arr[:, :, 1] + arr[:, :, 2] / 256.0 - 32768.0
            r = idx // cols
            c = idx % cols
            mosaic[r * TILE_PX:(r + 1) * TILE_PX, c * TILE_PX:(c + 1) * TILE_PX] = elev
            done += 1
            if done % 25 == 0 or done == total:
                print(f"[terrain]   {done}/{total} tiles", flush=True)

    return mosaic, x0, y0


def box_blur(arr: np.ndarray, radius: int) -> np.ndarray:
    """Separable box blur via summed-area style cumulative sums."""
    if radius < 1:
        return arr
    k = 2 * radius + 1
    out = arr
    for axis in (0, 1):
        padded = np.pad(out, [(radius, radius) if a == axis else (0, 0) for a in (0, 1)],
                        mode="edge")
        csum = np.cumsum(padded, axis=axis, dtype=np.float64)
        zero = np.zeros([1 if a == axis else s for a, s in enumerate(csum.shape)])
        csum = np.concatenate([zero, csum], axis=axis)
        hi = np.take(csum, np.arange(k, k + out.shape[axis]), axis=axis)
        lo = np.take(csum, np.arange(0, out.shape[axis]), axis=axis)
        out = ((hi - lo) / k).astype(np.float32)
    return out


def _median_axis(arr: np.ndarray, axis: int, radius: int) -> np.ndarray:
    """Separable running median, computed in row strips to bound memory."""
    k = 2 * radius + 1
    out = np.empty_like(arr)
    strip = 512 if axis == 1 else arr.shape[0]
    for start in range(0, arr.shape[0], strip):
        end = min(start + strip, arr.shape[0])
        if axis == 1:
            block = arr[start:end]
        else:
            block = arr  # full array; one pass
        pad = [(0, 0), (0, 0)]
        pad[axis] = (radius, radius)
        padded = np.pad(block, pad, mode="edge")
        stack = np.stack([
            np.take(padded, np.arange(i, i + block.shape[axis]), axis=axis)
            for i in range(k)
        ])
        res = np.median(stack, axis=0).astype(np.float32)
        if axis == 1:
            out[start:end] = res
        else:
            return res
    return out


def despike(arr: np.ndarray, radius: int = 3, tol_m: float = 40.0) -> np.ndarray:
    """Replace DEM seam artifacts with a local median.

    The public terrain tiles carry occasional stitching seams from the source
    mosaics: 1-3 px wide vertical stripes that shoot several hundred metres
    above the surrounding ground (there is one near Hereford, PA that reaches
    900 m in terrain that is really ~260 m). A separable median approximates a
    2D median cheaply; anything further than `tol_m` from it is replaced.

    Real relief here never deviates that far from its own local median: on a
    uniform slope the median equals the centre sample, and even the sharpest
    feature in the region (the Wissahickon gorge) only reaches ~20 m of
    curvature offset over this window.
    """
    med = _median_axis(_median_axis(arr, 1, radius), 0, radius)
    bad = np.abs(arr - med) > tol_m
    count = int(bad.sum())
    if count:
        pct = 100.0 * count / arr.size
        print(f"[terrain] despiked {count} samples ({pct:.4f}%), "
              f"max deviation {np.abs(arr - med).max():.0f} m", flush=True)
        arr = np.where(bad, med, arr)
    return arr.astype(np.float32)


def bilinear(src: np.ndarray, ys: np.ndarray, xs: np.ndarray) -> np.ndarray:
    h, w = src.shape
    x0 = np.clip(np.floor(xs).astype(np.int64), 0, w - 1)
    y0 = np.clip(np.floor(ys).astype(np.int64), 0, h - 1)
    x1 = np.clip(x0 + 1, 0, w - 1)
    y1 = np.clip(y0 + 1, 0, h - 1)
    fx = (xs - x0).astype(np.float32)[None, :]
    fy = (ys - y0).astype(np.float32)[:, None]
    top = src[np.ix_(y0, x0)] * (1 - fx) + src[np.ix_(y0, x1)] * fx
    bot = src[np.ix_(y1, x0)] * (1 - fx) + src[np.ix_(y1, x1)] * fx
    return top * (1 - fy) + bot * fy


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--zoom", type=int, default=region.TERRAIN_ZOOM)
    ap.add_argument("--grid", type=int, default=region.GRID_W)
    ap.add_argument("--step", type=float, default=region.ELEV_STEP)
    ap.add_argument("--despike", type=float, default=40.0)
    ap.add_argument("--out", default="heightmap.png")
    args = ap.parse_args()

    z = args.zoom
    gw = gh = args.grid

    mosaic, x0, y0 = build_mosaic(z)
    print(f"[terrain] mosaic {mosaic.shape[1]}x{mosaic.shape[0]} px", flush=True)

    # Terrarium encodes ocean as a small negative shelf; clamp the deep-water
    # sentinel values so the Delaware estuary does not punch a hole in the mesh.
    mosaic = np.maximum(mosaic, -5.0)

    mosaic = despike(mosaic, radius=3, tol_m=args.despike)

    # Target sample spacing in source pixels, then low-pass to avoid aliasing.
    src_px_per_out_x = (region.EAST - region.WEST) / 360.0 * (1 << z) * TILE_PX / gw
    ratio = max(1.0, src_px_per_out_x)
    radius = int(round((ratio - 1.0) / 2.0))
    if radius >= 1:
        print(f"[terrain] low-pass radius {radius}px (ratio {ratio:.2f})", flush=True)
        mosaic = box_blur(mosaic, radius)

    # Output grid is regular in lat/lon; row 0 is the NORTH edge.
    lons = np.linspace(region.WEST, region.EAST, gw, dtype=np.float64)
    lats = np.linspace(region.NORTH, region.SOUTH, gh, dtype=np.float64)
    xs = np.array([lon_to_tile_x(v, z) for v in lons]) * TILE_PX - x0 * TILE_PX
    ys = np.array([lat_to_tile_y(v, z) for v in lats]) * TILE_PX - y0 * TILE_PX

    grid = bilinear(mosaic, ys, xs)

    emin = float(np.floor(grid.min()))
    emax = float(np.ceil(grid.max()))
    step = args.step
    levels = int(math.ceil((emax - emin) / step))
    if levels > 65535:
        raise SystemExit(f"quantisation overflow: {levels} levels")

    q = np.clip(np.rint((grid - emin) / step), 0, 65535).astype(np.uint16)
    rgb = np.zeros((gh, gw, 3), dtype=np.uint8)
    rgb[:, :, 0] = (q >> 8).astype(np.uint8)
    rgb[:, :, 1] = (q & 0xFF).astype(np.uint8)

    DATA.mkdir(parents=True, exist_ok=True)
    img = Image.fromarray(rgb, mode="RGB")
    out_path = DATA / args.out
    if out_path.suffix == ".webp":
        # Lossless WebP is bit-exact here and ~32% smaller than optimised PNG,
        # which matters a lot for a 2048^2 hero asset on mobile.
        img.save(out_path, format="WEBP", lossless=True, quality=100, method=6)
    else:
        img.save(out_path, optimize=True, compress_level=9)
    size_kb = out_path.stat().st_size / 1024.0

    verify = np.asarray(Image.open(out_path).convert("RGB"), dtype=np.uint8)
    if not np.array_equal(verify, rgb):
        raise SystemExit("encoder was not lossless; refusing to ship this heightmap")
    print(f"[terrain] wrote {out_path.name} {gw}x{gh} {size_kb:.0f} KB (verified lossless)",
          flush=True)

    # Integrity probes: the runtime re-reads these exact texels after decoding
    # the PNG on a canvas. If a browser's colour management mangles the bytes we
    # find out immediately instead of rendering silently-wrong terrain.
    probes = []
    for (py, px) in [(0, 0), (0, gw - 1), (gh - 1, 0), (gh - 1, gw - 1),
                     (gh // 2, gw // 2), (gh // 3, gw // 4), (2 * gh // 3, 3 * gw // 4)]:
        probes.append({"x": int(px), "y": int(py), "q": int(q[py, px])})

    meta = {
        "generator": "tools/build_terrain.py",
        "source": {
            "name": "AWS Terrain Tiles (terrarium)",
            "url": "https://registry.opendata.aws/terrain-tiles/",
            "zoom": z,
            "underlying": ["USGS 3DEP", "SRTM", "NRCan CDED"],
            "license": "Open data; see AWS Terrain Tiles attribution guidance",
        },
        "width": gw,
        "height": gh,
        "bounds": {"west": region.WEST, "east": region.EAST,
                   "south": region.SOUTH, "north": region.NORTH},
        "elevation": {
            "min": emin,
            "max": emax,
            "step": step,
            "encoding": "elev_m = elevMin + (R * 256 + G) * step",
        },
        "stats": {
            "meanM": round(float(grid.mean()), 3),
            "p02M": round(float(np.percentile(grid, 2)), 3),
            "p98M": round(float(np.percentile(grid, 98)), 3),
            "sampleSpacingM": round(region.WIDTH_M / (gw - 1), 2),
        },
        "projection": {
            "lat0": region.LAT0,
            "lon0": region.LON0,
            "metersPerDegLat": round(region.METERS_PER_DEG_LAT, 4),
            "metersPerDegLon": round(region.METERS_PER_DEG_LON, 4),
            "widthM": round(region.WIDTH_M, 2),
            "heightM": round(region.HEIGHT_M, 2),
        },
        "probes": probes,
    }
    (DATA / "terrain.json").write_text(json.dumps(meta, indent=2) + "\n")
    print(f"[terrain] elevation {emin:.1f}..{emax:.1f} m, "
          f"spacing {meta['stats']['sampleSpacingM']} m", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
