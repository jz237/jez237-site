#!/usr/bin/env python3
"""Upload garden images to Cloudflare R2 and print GitHub-safe public URLs.

Examples:
  scripts/upload_garden_image_to_r2.py photos/garden/images/2026/06/example.jpg
  scripts/upload_garden_image_to_r2.py /path/to/photo.jpg --date 2026-06-17 --slug redbud-after-rain
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import mimetypes
import os
import re
import shlex
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_R2_ACCOUNT_ID = "ac73a259dff5a3cbeccbb78824ac0db6"
DEFAULT_R2_BUCKET = "jez237-site-media"
DEFAULT_PUBLIC_BASE_URL = "https://pub-26279ae8f18243e38be5748fbfb75f4c.r2.dev/"
GARDEN_PREFIX = "photos/garden/images"


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")[:80] or "garden-photo"


def infer_key(src: Path, args: argparse.Namespace) -> str:
    try:
        rel = src.resolve().relative_to(ROOT)
    except ValueError:
        rel = None

    if rel and str(rel).startswith(f"{GARDEN_PREFIX}/"):
        return rel.as_posix()

    if args.key:
        key = args.key.strip().lstrip("/")
        if not key.startswith(f"{GARDEN_PREFIX}/"):
            raise SystemExit(f"--key must start with {GARDEN_PREFIX}/")
        return key

    date = dt.date.fromisoformat(args.date) if args.date else dt.date.today()
    slug = slugify(args.slug or src.stem)
    suffix = src.suffix.lower() or ".jpg"
    return f"{GARDEN_PREFIX}/{date:%Y/%m}/{slug}-{date.isoformat()}{suffix}"


def upload_to_r2(src: Path, key: str, bucket: str, wrangler_bin: str) -> None:
    content_type = mimetypes.guess_type(src.name)[0] or "application/octet-stream"
    cmd = [
        *shlex.split(wrangler_bin),
        "r2",
        "object",
        "put",
        f"{bucket}/{key}",
        "--file",
        str(src),
        "--remote",
        "--content-type",
        content_type,
        "--cache-control",
        "public, max-age=31536000, immutable",
    ]
    env = os.environ.copy()
    env.setdefault("CLOUDFLARE_ACCOUNT_ID", DEFAULT_R2_ACCOUNT_ID)
    subprocess.run(cmd, check=True, env=env)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("image", help="Image path to upload")
    ap.add_argument("--key", help=f"Explicit R2 key, starting with {GARDEN_PREFIX}/")
    ap.add_argument("--date", help="Photo date for external images, YYYY-MM-DD")
    ap.add_argument("--slug", help="Slug for external images")
    ap.add_argument("--r2-bucket", default=os.environ.get("GARDEN_R2_BUCKET", DEFAULT_R2_BUCKET))
    ap.add_argument("--public-base-url", default=os.environ.get("GARDEN_R2_PUBLIC_BASE_URL", DEFAULT_PUBLIC_BASE_URL))
    ap.add_argument("--wrangler-bin", default=os.environ.get("WRANGLER_BIN", "wrangler"))
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    src = Path(args.image).expanduser()
    if not src.exists() or not src.is_file():
        raise SystemExit(f"Image not found: {src}")

    key = infer_key(src, args)
    public_url = args.public_base_url.rstrip("/") + "/" + key

    if not args.dry_run:
        upload_to_r2(src, key, args.r2_bucket, args.wrangler_bin)

    print(json.dumps({
        "uploaded": not args.dry_run,
        "bucket": args.r2_bucket,
        "key": key,
        "public_url_for_site_pages": public_url,
        "site_relative_path": key,
        "public_url": public_url,
    }, indent=2))


if __name__ == "__main__":
    main()
