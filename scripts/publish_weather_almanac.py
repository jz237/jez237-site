#!/usr/bin/env python3
"""Publish the newest generated Philly weather almanac image into the site.

This does not generate art. It copies the newest OpenClaw GPT Image output named
philly-weather-almanac-*.png into weather/almanac/ so GitHub Pages can serve it.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import shutil
from pathlib import Path


DEFAULT_MEDIA_DIR = Path("/home/jez237/.openclaw/media/tool-image-generation")
SITE_ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = SITE_ROOT / "weather" / "almanac"


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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--media-dir", type=Path, default=DEFAULT_MEDIA_DIR)
    parser.add_argument("--source", type=Path, default=None)
    args = parser.parse_args()

    source = (args.source or newest_almanac(args.media_dir)).resolve()
    day = date_from_name(source)
    archive_name = f"philly-weather-almanac-{day.isoformat()}.png"

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    latest = OUT_DIR / "latest.png"
    archive = OUT_DIR / archive_name
    if source != latest.resolve():
        shutil.copy2(source, latest)
    if source != archive.resolve():
        shutil.copy2(source, archive)

    manifest = {
        "title": "Philly Weather Almanac",
        "location": "Philly 19111",
        "date": formatted_date(day),
        "image": "almanac/latest.png",
        "archiveImage": f"almanac/{archive_name}",
        "source": "GPT Image 2 weather almanac",
    }
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Published {source} -> {latest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
