#!/usr/bin/env python3
"""Append one generated GPT Image 2 prompt entry to archive JSON.

Usage:
  append-entry.py --title "..." --prompt "..." --image /path/to/generated.png \
    --tests "..." --slot morning
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import mimetypes
import os
import re
import shlex
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "gallery-data.json"
PROMPTS = ROOT / "prompts.json"
WORLDS = ROOT / "worlds-data.json"
IMAGES = ROOT / "images"
DEFAULT_R2_ACCOUNT_ID = "ac73a259dff5a3cbeccbb78824ac0db6"
DEFAULT_R2_BUCKET = "jez237-site-media"
DEFAULT_R2_PREFIX = "image-gen-2-benchmark/images"
DEFAULT_R2_PUBLIC_BASE_URL = "https://pub-26279ae8f18243e38be5748fbfb75f4c.r2.dev/image-gen-2-benchmark/images/"


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


def upload_to_r2(dest: Path, bucket: str, prefix: str, wrangler_bin: str) -> str:
    key = f"{prefix.strip('/')}/{dest.name}"
    content_type = mimetypes.guess_type(dest.name)[0] or "application/octet-stream"
    cmd = [
        *shlex.split(wrangler_bin),
        "r2",
        "object",
        "put",
        f"{bucket}/{key}",
        "--file",
        str(dest),
        "--remote",
        "--content-type",
        content_type,
        "--cache-control",
        "public, max-age=31536000, immutable",
    ]
    env = os.environ.copy()
    env.setdefault("CLOUDFLARE_ACCOUNT_ID", DEFAULT_R2_ACCOUNT_ID)
    subprocess.run(cmd, check=True, env=env)
    return key


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
    ap.add_argument("--world-name", default="")
    ap.add_argument("--world-description", default="")
    ap.add_argument("--world-continuity", default="")
    ap.add_argument("--world-entry-description", default="")
    ap.add_argument("--world-only", action="store_true", help="Append to worlds-data.json only, not the main prompt gallery")
    ap.add_argument("--skip-r2-upload", action="store_true", help="Copy the image locally but do not upload it to Cloudflare R2")
    ap.add_argument("--r2-bucket", default=os.environ.get("IMAGE_ARCHIVE_R2_BUCKET", DEFAULT_R2_BUCKET))
    ap.add_argument("--r2-prefix", default=os.environ.get("IMAGE_ARCHIVE_R2_PREFIX", DEFAULT_R2_PREFIX))
    ap.add_argument("--r2-public-base-url", default=os.environ.get("IMAGE_ARCHIVE_R2_PUBLIC_BASE_URL", DEFAULT_R2_PUBLIC_BASE_URL))
    ap.add_argument("--wrangler-bin", default=os.environ.get("WRANGLER_BIN", "wrangler"))
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
    if args.skip_r2_upload:
        r2_key = ""
    else:
        r2_key = upload_to_r2(dest, args.r2_bucket, args.r2_prefix, args.wrangler_bin)

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
    if args.world_name.strip():
        entry["world"] = {
            "name": args.world_name.strip(),
            "description": args.world_description.strip(),
            "continuity": args.world_continuity.strip(),
            "entryDescription": args.world_entry_description.strip() or args.tests,
        }

    paths = (WORLDS,) if args.world_only else (DATA, PROMPTS)
    for path in paths:
        data = load(path)
        data.append(entry)
        save(path, data)

    if r2_key:
        base = args.r2_public_base_url.rstrip("/") + "/"
        print(f"Uploaded image to R2: {base}{dest.name}")
    print(json.dumps(entry, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
