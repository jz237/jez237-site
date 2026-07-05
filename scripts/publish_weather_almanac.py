#!/usr/bin/env python3
"""Publish the newest generated Philly weather almanac image into the site.

This does not generate art. It copies the newest OpenClaw GPT Image output named
philly-weather-almanac-*.png into weather/almanac/ as optimized JPG files so
GitHub Pages can serve it efficiently.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
from pathlib import Path

from PIL import Image


DEFAULT_MEDIA_DIR = Path("/home/jez237/.openclaw/media/tool-image-generation")
SITE_ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = SITE_ROOT / "weather" / "almanac"

# The page renders latest.jpg at <=760px wide; ship it small. The dated
# archive copy keeps full resolution.
LATEST_MAX_WIDTH = 800
LATEST_QUALITY = 80


def newest_almanac(media_dir: Path) -> Path:
    candidates = sorted(
        media_dir.glob("philly-weather-almanac-*.png"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    if not candidates:
        raise SystemExit(f"No philly-weather-almanac-*.png files found in {media_dir}")
    return candidates[0]


def date_from_name(path: Path) -> dt.date:
    match = re.search(r"(20\d{2}-\d{2}-\d{2})", path.name)
    if match:
        return dt.date.fromisoformat(match.group(1))
    return dt.datetime.fromtimestamp(path.stat().st_mtime).date()


def formatted_date(day: dt.date) -> str:
    # Avoid %-d, which is not portable across all strftime implementations.
    return f"{day.strftime('%A, %B')} {day.day}, {day.year}"


def _load_rgb(source: Path, max_width: int | None = None) -> Image.Image:
    with Image.open(source) as image:
        rgb = image.convert("RGB")
    if max_width and rgb.width > max_width:
        rgb = rgb.resize((max_width, round(rgb.height * max_width / rgb.width)), Image.LANCZOS)
    return rgb


def save_jpeg(source: Path, target: Path, *, quality: int = 92, max_width: int | None = None) -> None:
    _load_rgb(source, max_width).save(
        target,
        "JPEG",
        quality=quality,
        optimize=True,
        progressive=True,
        subsampling=1,
    )


def save_webp(source: Path, target: Path, *, quality: int = 80, max_width: int | None = None) -> None:
    _load_rgb(source, max_width).save(target, "WEBP", quality=quality, method=6)


def remove_old_archives(current_archive: Path) -> list[Path]:
    removed = []
    for pattern in ("philly-weather-almanac-*.png", "philly-weather-almanac-*.jpg"):
        for path in OUT_DIR.glob(pattern):
            if path == current_archive:
                continue
            path.unlink()
            removed.append(path)
    for path in (OUT_DIR / "latest.png",):
        if path == current_archive:
            continue
        if path.exists():
            path.unlink()
            removed.append(path)
    return removed


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--media-dir", type=Path, default=DEFAULT_MEDIA_DIR)
    parser.add_argument("--source", type=Path, default=None)
    args = parser.parse_args()

    source = (args.source or newest_almanac(args.media_dir)).resolve()
    day = date_from_name(source)
    archive_name = f"philly-weather-almanac-{day.isoformat()}.jpg"

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    latest = OUT_DIR / "latest.jpg"
    latest_webp = OUT_DIR / "latest.webp"
    archive = OUT_DIR / archive_name
    if source != latest.resolve():
        save_jpeg(source, latest, quality=LATEST_QUALITY, max_width=LATEST_MAX_WIDTH)
        save_webp(source, latest_webp, quality=LATEST_QUALITY, max_width=LATEST_MAX_WIDTH)
    if source != archive.resolve():
        save_jpeg(source, archive)
    removed = remove_old_archives(archive)

    manifest = {
        "title": "Philly Weather Almanac",
        "location": "Philly 19111",
        "date": formatted_date(day),
        "image": "almanac/latest.jpg",
        "imageWebp": "almanac/latest.webp",
        "archiveImage": f"almanac/{archive_name}",
        "source": "GPT Image 2 weather almanac",
    }
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Published {source} -> {latest}")
    if removed:
        print("Removed old archive(s):")
        for path in removed:
            print(f"- {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
