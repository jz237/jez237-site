#!/usr/bin/env python3
"""Append one generated GPT Image 2 prompt entry to gallery-data.json.

Usage:
  append-entry.py --title "..." --prompt "..." --image /path/to/generated.png \
    --tests "..." --slot morning
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "gallery-data.json"
PROMPTS = ROOT / "prompts.json"
IMAGES = ROOT / "images"


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")[:70] or "daily-prompt"


def load(path: Path) -> list[dict]:
    if not path.exists():
        return []
    return json.loads(path.read_text())


def save(path: Path, data: list[dict]) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--title", required=True)
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--image", required=True, help="Path to generated image file")
    ap.add_argument("--tests", default="")
    ap.add_argument("--date", default=dt.datetime.now().astimezone().date().isoformat())
    ap.add_argument("--slot", default=dt.datetime.now().astimezone().strftime("%H%M"))
    ap.add_argument("--batch", default="Daily Prompt")
    ap.add_argument("--model", default="openai/gpt-image-2")
    ap.add_argument("--size", default="1024x1024")
    args = ap.parse_args()

    src = Path(args.image).expanduser().resolve()
    if not src.exists():
        raise SystemExit(f"Image not found: {src}")

    IMAGES.mkdir(parents=True, exist_ok=True)
    base_slug = slugify(f"{args.date}-{args.slot}-{args.title}")
    dest = IMAGES / f"{base_slug}{src.suffix.lower() or '.png'}"
    n = 2
    while dest.exists():
        dest = IMAGES / f"{base_slug}-{n}{src.suffix.lower() or '.png'}"
        n += 1
    shutil.copy2(src, dest)

    entry = {
        "id": dest.stem,
        "title": args.title,
        "tests": args.tests,
        "prompt": args.prompt,
        "image": f"images/{dest.name}",
        "date": args.date,
        "batch": args.batch,
        "slot": args.slot,
        "model": args.model,
        "size": args.size,
    }

    for path in (DATA, PROMPTS):
        data = load(path)
        data.append(entry)
        save(path, data)

    print(json.dumps(entry, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
