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
import subprocess
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "gallery-data.json"
PROMPTS = ROOT / "prompts.json"
WORLDS = ROOT / "worlds-data.json"
DATA_ARTIFACTS = ROOT / "data-artifacts-data.json"
SUBJECT_ARTIFACTS = ROOT / "subject-artifacts-data.json"
FACTUAL_INFOGRAPHICS = ROOT / "factual-infographics-data.json"
HYBRID_CREATURES = ROOT / "hybrid-creatures-data.json"
CREATURE_DESIGNS = ROOT / "creature-designs-data.json"
RANDOM_RENDERING_STYLES = ROOT / "random-rendering-style-data.json"
WORLD_THAT_NEVER_WAS = ROOT / "world-that-never-was-data.json"
MACHINE_DREAMS = ROOT / "machine-dreams-data.json"
VISUAL_THOUGHT_EXPERIMENTS = ROOT / "visual-thought-experiments-data.json"
IMPOSSIBLE_DOCUMENTARY = ROOT / "impossible-documentary-data.json"
STRANGE_BOTANICALS = ROOT / "strange-botanicals-data.json"
CINEMATIC_CATS = ROOT / "cinematic-cats-data.json"
QUIETLY_UNCANNY_DOMESTIC = ROOT / "quietly-uncanny-domestic-data.json"
IMAGES = ROOT / "images"
THUMBS = ROOT / "thumbs"
MANIFEST = ROOT / "manifest.json"
DEFAULT_R2_ACCOUNT_ID = "ac73a259dff5a3cbeccbb78824ac0db6"
DEFAULT_R2_BUCKET = "jez237-site-media"
DEFAULT_R2_PREFIX = "image-gen-2-benchmark/images"
DEFAULT_R2_THUMB_PREFIX = "image-gen-2-benchmark/thumbs"
DEFAULT_R2_PUBLIC_BASE_URL = "https://pub-26279ae8f18243e38be5748fbfb75f4c.r2.dev/image-gen-2-benchmark/images/"
GENERATED_SOURCE_ROOT = Path("/home/jez237/.openclaw/media/tool-image-generation").resolve()


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


def save_archive_jpeg(src: Path, dest: Path) -> None:
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
            rgba = im.convert("RGBA")
            bg = Image.new("RGB", rgba.size, (255, 255, 255))
            bg.paste(rgba, mask=rgba.getchannel("A"))
            im = bg
        elif im.mode != "RGB":
            im = im.convert("RGB")
        im.save(dest, "JPEG", quality=92, optimize=True, progressive=True, subsampling=0)


def save_thumb(src: Path, dest: Path) -> str:
    """Write a 640px WebP thumbnail and return the image's dominant color."""
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        r, g, b = im.resize((1, 1), Image.LANCZOS).getpixel((0, 0))
        im.thumbnail((640, 640), Image.LANCZOS)
        im.save(dest, "WEBP", quality=78, method=6)
    return f"#{r:02x}{g:02x}{b:02x}"


def rebuild_monthly(data: list[dict]) -> None:
    """Regenerate gallery-YYYY-MM.json chunks + manifest.json from full data."""
    def sort_key(item: dict):
        return (str(item.get("date") or ""), str(item.get("slot") or ""), str(item.get("id") or ""))

    data = sorted(data, key=sort_key, reverse=True)
    months: dict[str, list[dict]] = {}
    for item in data:
        months.setdefault(str(item.get("date") or "")[:7] or "undated", []).append(item)
    manifest: dict = {"total": len(data), "months": []}
    for key, items in months.items():
        fname = f"gallery-{key}.json"
        (ROOT / fname).write_text(json.dumps(items, indent=2, ensure_ascii=False) + "\n")
        dates: dict[str, int] = {}
        for it in items:
            d = str(it.get("date") or "undated")
            dates[d] = dates.get(d, 0) + 1
        manifest["months"].append({
            "key": key,
            "file": fname,
            "count": len(items),
            "dates": [{"date": d, "count": c} for d, c in dates.items()],
        })
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")


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
    ap.add_argument("--artifact-category", default="")
    ap.add_argument("--artifact-description", default="")
    ap.add_argument("--artifact-continuity", default="")
    ap.add_argument("--data-artifact-only", action="store_true", help="Append to data-artifacts-data.json only, not the main prompt gallery")
    ap.add_argument("--subject-kind", default="")
    ap.add_argument("--subject-description", default="")
    ap.add_argument("--subject-continuity", default="")
    ap.add_argument("--subject-artifact-only", action="store_true", help="Append to subject-artifacts-data.json only, not the main prompt gallery")
    ap.add_argument("--factual-topic", default="")
    ap.add_argument("--factual-description", default="")
    ap.add_argument("--factual-source-note", default="")
    ap.add_argument("--factual-infographic-only", action="store_true", help="Append to factual-infographics-data.json only, not the main prompt gallery")
    ap.add_argument("--hybrid-name", default="")
    ap.add_argument("--hybrid-image-kind", choices=["infographic", "wild"], default="infographic")
    ap.add_argument("--hybrid-description", default="")
    ap.add_argument("--hybrid-continuity", default="")
    ap.add_argument("--hybrid-creature-only", action="store_true", help="Append to hybrid-creatures-data.json only, not the main prompt gallery")
    ap.add_argument("--creature-design-name", default="")
    ap.add_argument("--creature-design-description", default="")
    ap.add_argument("--creature-design-template", default="")
    ap.add_argument("--creature-design-only", action="store_true", help="Append to creature-designs-data.json only, not the main prompt gallery")
    ap.add_argument("--random-rendering-style-medium", default="")
    ap.add_argument("--random-rendering-style-description", default="")
    ap.add_argument("--random-rendering-style-template", default="")
    ap.add_argument("--random-rendering-style-only", action="store_true", help="Append to random-rendering-style-data.json only, not the main prompt gallery")
    ap.add_argument("--world-that-never-was-artifact", default="")
    ap.add_argument("--world-that-never-was-description", default="")
    ap.add_argument("--world-that-never-was-template", default="")
    ap.add_argument("--world-that-never-was-only", action="store_true", help="Append to world-that-never-was-data.json only, not the main prompt gallery")
    ap.add_argument("--skip-r2-upload", action="store_true", help="Copy the image locally but do not upload it to Cloudflare R2")
    ap.add_argument(
        "--delete-source-after-success",
        action="store_true",
        help="Delete the exact generated source after JPEG conversion, R2 upload, and archive writes succeed",
    )
    ap.add_argument("--r2-bucket", default=os.environ.get("IMAGE_ARCHIVE_R2_BUCKET", DEFAULT_R2_BUCKET))
    ap.add_argument("--r2-prefix", default=os.environ.get("IMAGE_ARCHIVE_R2_PREFIX", DEFAULT_R2_PREFIX))
    ap.add_argument("--r2-thumb-prefix", default=os.environ.get("IMAGE_ARCHIVE_R2_THUMB_PREFIX", DEFAULT_R2_THUMB_PREFIX))
    ap.add_argument("--r2-public-base-url", default=os.environ.get("IMAGE_ARCHIVE_R2_PUBLIC_BASE_URL", DEFAULT_R2_PUBLIC_BASE_URL))
    ap.add_argument("--wrangler-bin", default=os.environ.get("WRANGLER_BIN", "wrangler"))
    args = ap.parse_args()

    src = Path(args.image).expanduser().resolve()
    if not src.exists():
        raise SystemExit(f"Image not found: {src}")
    if args.delete_source_after_success and GENERATED_SOURCE_ROOT not in src.parents:
        raise SystemExit(
            "Refusing source deletion outside the generated-image directory: "
            f"{GENERATED_SOURCE_ROOT}"
        )

    IMAGES.mkdir(parents=True, exist_ok=True)
    base_slug = slugify(f"{args.date}-{args.slot}-{args.title}")
    dest = IMAGES / f"{base_slug}.jpg"
    n = 2
    while dest.exists():
        dest = IMAGES / f"{base_slug}-{n}.jpg"
        n += 1
    save_archive_jpeg(src, dest)
    THUMBS.mkdir(parents=True, exist_ok=True)
    thumb_dest = THUMBS / f"{dest.stem}.webp"
    color = save_thumb(dest, thumb_dest)
    if args.skip_r2_upload:
        r2_key = ""
    else:
        r2_key = upload_to_r2(dest, args.r2_bucket, args.r2_prefix, args.wrangler_bin)
        upload_to_r2(thumb_dest, args.r2_bucket, args.r2_thumb_prefix, args.wrangler_bin)

    entry = {
        "id": dest.stem,
        "title": args.title,
        "tests": args.tests,
        "prompt": args.prompt,
        "image": f"images/{dest.name}",
        "thumb": f"thumbs/{thumb_dest.name}",
        "color": color,
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
    if args.artifact_category.strip():
        entry["artifact"] = {
            "category": args.artifact_category.strip(),
            "description": args.artifact_description.strip(),
            "continuity": args.artifact_continuity.strip(),
        }
    if args.subject_kind.strip():
        entry["subjectArtifact"] = {
            "kind": args.subject_kind.strip(),
            "description": args.subject_description.strip(),
            "continuity": args.subject_continuity.strip(),
        }
    is_factual_infographic = (
        args.factual_topic.strip()
        or args.slot == "factual-infographic"
        or args.title.lower().startswith("factual infographic:")
    )
    if is_factual_infographic:
        source_note = args.factual_source_note.strip()
        source_urls = re.findall(r"https://[^\s,;]+", source_note)
        if len(source_urls) < 2:
            raise SystemExit(
                "Factual infographics require --factual-source-note with at least two direct https:// source URLs."
            )
        entry["factualInfographic"] = {
            "topic": args.factual_topic.strip() or args.title.removeprefix("Factual infographic:").strip(),
            "description": args.factual_description.strip() or args.tests,
            "sourceNote": source_note,
        }
    if args.hybrid_name.strip() or args.slot in {"hybrid-creature-infographic", "hybrid-creature-wild"}:
        entry["hybridCreature"] = {
            "name": args.hybrid_name.strip() or args.title,
            "imageKind": args.hybrid_image_kind,
            "description": args.hybrid_description.strip() or args.tests,
            "continuity": args.hybrid_continuity.strip(),
        }
    if args.creature_design_name.strip() or args.slot == "creature-design":
        entry["creatureDesign"] = {
            "name": args.creature_design_name.strip() or args.title,
            "description": args.creature_design_description.strip() or args.tests,
            "template": args.creature_design_template.strip(),
        }
    if args.random_rendering_style_medium.strip() or args.slot == "random-image-style":
        entry["randomRenderingStyle"] = {
            "medium": args.random_rendering_style_medium.strip() or args.title,
            "description": args.random_rendering_style_description.strip() or args.tests,
            "template": args.random_rendering_style_template.strip(),
        }
    if args.world_that_never_was_artifact.strip() or args.slot == "world-that-never-was":
        entry["worldThatNeverWas"] = {
            "artifact": args.world_that_never_was_artifact.strip() or args.title,
            "description": args.world_that_never_was_description.strip() or args.tests,
            "template": args.world_that_never_was_template.strip(),
        }

    exclusive = [args.world_only, args.data_artifact_only, args.subject_artifact_only, args.factual_infographic_only, args.hybrid_creature_only, args.creature_design_only, args.random_rendering_style_only, args.world_that_never_was_only]
    if sum(1 for flag in exclusive if flag) > 1:
        raise SystemExit("--world-only, --data-artifact-only, --subject-artifact-only, --factual-infographic-only, --hybrid-creature-only, --creature-design-only, --random-rendering-style-only, and --world-that-never-was-only are mutually exclusive")
    if args.world_only:
        paths = (WORLDS,)
    elif args.data_artifact_only:
        paths = (DATA_ARTIFACTS,)
    elif args.subject_artifact_only:
        paths = (SUBJECT_ARTIFACTS,)
    elif args.factual_infographic_only:
        paths = (FACTUAL_INFOGRAPHICS,)
    elif args.hybrid_creature_only:
        paths = (HYBRID_CREATURES,)
    elif args.creature_design_only:
        paths = (CREATURE_DESIGNS,)
    elif args.random_rendering_style_only:
        paths = (RANDOM_RENDERING_STYLES,)
    elif args.world_that_never_was_only:
        paths = (WORLD_THAT_NEVER_WAS,)
    else:
        paths = (DATA, PROMPTS)
        if entry.get("factualInfographic"):
            paths = (DATA, PROMPTS, FACTUAL_INFOGRAPHICS)
        if entry.get("hybridCreature"):
            paths = (*paths, HYBRID_CREATURES)
        if entry.get("creatureDesign"):
            paths = (*paths, CREATURE_DESIGNS)
        if entry.get("randomRenderingStyle"):
            paths = (*paths, RANDOM_RENDERING_STYLES)
        if entry.get("worldThatNeverWas"):
            paths = (*paths, WORLD_THAT_NEVER_WAS)
        if args.slot == "machine-dream":
            paths = (*paths, MACHINE_DREAMS)
        if args.slot == "visual-thought-experiment":
            paths = (*paths, VISUAL_THOUGHT_EXPERIMENTS)
        if args.slot == "impossible-documentary":
            paths = (*paths, IMPOSSIBLE_DOCUMENTARY)
        if args.slot == "strange-botanical":
            paths = (*paths, STRANGE_BOTANICALS)
        if args.slot == "serious-cinematic-cat":
            paths = (*paths, CINEMATIC_CATS)
        if args.slot == "quietly-uncanny-domestic":
            paths = (*paths, QUIETLY_UNCANNY_DOMESTIC)
    for path in paths:
        data = load(path)
        data.append(entry)
        save(path, data)
        if path == DATA:
            rebuild_monthly(data)

    if args.delete_source_after_success:
        src.unlink()
        print(f"Deleted generated source after successful archive transaction: {src}")

    if r2_key:
        base = args.r2_public_base_url.rstrip("/") + "/"
        print(f"Uploaded image to R2: {base}{dest.name}")
    print(json.dumps(entry, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
