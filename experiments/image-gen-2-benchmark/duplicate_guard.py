#!/usr/bin/env python3
"""Deterministic duplicate gate for the scheduled image archive.

The language model still invents candidates, but this module makes archive-wide
uniqueness a machine-enforced condition before generation and again before an
entry can be appended.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import unicodedata
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageOps


ARCHIVE_FILENAMES = (
    "gallery-data.json",
    "prompts.json",
    "worlds-data.json",
    "data-artifacts-data.json",
    "subject-artifacts-data.json",
    "factual-infographics-data.json",
    "hybrid-creatures-data.json",
    "creature-designs-data.json",
    "random-rendering-style-data.json",
    "world-that-never-was-data.json",
    "machine-dreams-data.json",
    "visual-thought-experiments-data.json",
    "impossible-documentary-data.json",
    "strange-botanicals-data.json",
    "cinematic-cats-data.json",
    "quietly-uncanny-domestic-data.json",
    "ocean-scenes-data.json",
    "galactic-pictures-data.json",
)

TITLE_PREFIX_RE = re.compile(
    r"^(?:random rendering style|factual infographic|outer space exploration|"
    r"ocean exploration|intense phobia situation|machine dream|near[- ]future "
    r"technology documentary)\s*[:\-–—]+\s*",
    re.IGNORECASE,
)

STYLE_ALIASES: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("wax-crayon-sgraffito", (r"wax[ -]?crayon\s+sgraffito",)),
    ("scratchboard", (r"scratchboard", r"scraperboard")),
    ("claymation", (r"claymation", r"plasticine\s+stop[ -]?motion")),
    ("stop-motion-miniature", (r"stop[ -]?motion(?:\s+miniature)?",)),
    ("voxel-art", (r"\bvoxel(?:s|ized)?\b", r"block[ -]?art")),
    ("pixel-art", (r"\bpixel[ -]?art\b", r"\b\d{1,3}[ -]?bit pixel")),
    ("needle-felt", (r"needle[ -]?felt", r"felted wool")),
    ("embroidery", (r"\bembroidery\b", r"\bstumpwork\b")),
    ("linocut", (r"lino[ -]?cut", r"linoleum cut", r"reduction linocut")),
    ("woodcut", (r"\bwoodcut\b", r"woodblock print")),
    ("screen-print", (r"screen[ -]?print", r"silkscreen")),
    ("risograph", (r"\brisograph\b", r"\briso print")),
    ("mosaic", (r"\bmosaic\b", r"\btessera(?:e)?\b")),
    ("stained-glass", (r"stained[ -]?glass", r"leaded glass")),
    ("marquetry", (r"\bmarquetry\b", r"\bparquetry\b")),
    ("cyanotype", (r"\bcyanotype\b", r"sun[ -]?print", r"blueprint photogram")),
    ("cut-paper", (r"cut[ -]?paper", r"papercut", r"paper[ -]?cut")),
    ("collage", (r"\bcollage\b", r"photomontage")),
    ("low-poly-3d", (r"low[ -]?poly",)),
    ("rubber-hose-animation", (r"rubber[ -]?hose",)),
    ("retro-animation", (r"retro animation", r"hand[ -]?painted cel")),
    ("newspaper-comic", (r"newspaper comic", r"comic strip")),
    ("vector-flat-design", (r"vector flat", r"flat vector")),
    ("technical-airbrush", (r"technical airbrush",)),
    ("holographic-sticker", (r"holographic sticker",)),
    ("watercolor", (r"watercolou?r",)),
    ("gouache", (r"\bgouache\b",)),
    ("oil-pastel", (r"oil pastel",)),
    ("charcoal", (r"\bcharcoal\b",)),
    ("ballpoint-pen", (r"ballpoint",)),
    ("ink-wash", (r"ink wash", r"sumi[ -]?e")),
    ("stippling", (r"\bstippl(?:e|ed|ing)\b", r"pencil dots")),
    ("marker-illustration", (r"marker illustration", r"alcohol marker")),
    ("etching", (r"\betching\b", r"intaglio")),
    ("lithograph", (r"\blithograph",)),
)

STOPWORDS = {
    "a", "an", "and", "as", "at", "for", "from", "in", "into", "of",
    "on", "the", "to", "with", "image", "style", "rendering", "random",
    "factual", "infographic", "scene", "study", "view", "project",
}

TOKEN_ALIASES = {
    "census": "survey", "count": "survey", "counted": "survey", "counting": "survey",
    "spillway": "floodgate", "sluice": "floodgate", "gate": "floodgate",
    "salmon": "fish", "fishes": "fish",
    "apiaries": "apiary", "beehive": "apiary", "beehives": "apiary",
    "rooftops": "rooftop", "greenhouses": "greenhouse",
    "observatories": "observatory", "laboratories": "laboratory", "labs": "laboratory",
}


def ascii_text(value: object) -> str:
    text = unicodedata.normalize("NFKD", str(value or ""))
    return text.encode("ascii", "ignore").decode("ascii").casefold()


def normalize_key(value: object) -> str:
    return "-".join(re.findall(r"[a-z0-9]+", ascii_text(value)))


def core_title(value: object) -> str:
    text = " ".join(str(value or "").split())
    return normalize_key(TITLE_PREFIX_RE.sub("", text))


def concept_tokens(value: object) -> set[str]:
    return {
        TOKEN_ALIASES.get(token, token)
        for token in re.findall(r"[a-z0-9]+", ascii_text(value))
        if len(token) > 2 and token not in STOPWORDS
    }


def canonical_style_keys(value: object) -> set[str]:
    text = ascii_text(value)
    found = {
        key
        for key, patterns in STYLE_ALIASES
        if any(re.search(pattern, text, re.IGNORECASE) for pattern in patterns)
    }
    return found


def canonical_declared_style(value: object) -> str:
    known = canonical_style_keys(value)
    if known:
        return sorted(known)[0]
    return normalize_key(value)


def load_entries(root: Path) -> list[dict]:
    entries: list[dict] = []
    seen: set[str] = set()
    for filename in ARCHIVE_FILENAMES:
        path = root / filename
        if not path.is_file():
            continue
        payload = json.loads(path.read_text())
        if not isinstance(payload, list):
            raise ValueError(f"Archive must be a top-level array: {path}")
        for entry in payload:
            if not isinstance(entry, dict):
                continue
            identity = str(entry.get("id") or "") or json.dumps(entry, sort_keys=True)
            if identity in seen:
                continue
            seen.add(identity)
            entries.append(entry)
    return entries


def entry_style_keys(entry: dict) -> set[str]:
    dedup = entry.get("dedup") if isinstance(entry.get("dedup"), dict) else {}
    random_style = (
        entry.get("randomRenderingStyle")
        if isinstance(entry.get("randomRenderingStyle"), dict)
        else {}
    )
    if not dedup.get("styleFamily") and not random_style and entry.get("slot") != "random-image-style":
        return set()
    # Prompts often name prohibited/recent media in negative instructions, so
    # only the positive medium metadata (or legacy title fallback) is evidence.
    declared = dedup.get("styleFamily") or random_style.get("medium") or entry.get("title")
    keys = canonical_style_keys(declared)
    if declared:
        keys.add(canonical_declared_style(declared))
    return {key for key in keys if key}


def hamming(left: str, right: str) -> int:
    return (int(left, 16) ^ int(right, 16)).bit_count()


def image_fingerprint(path: Path) -> str:
    with Image.open(path) as image:
        gray = ImageOps.exif_transpose(image).convert("L").resize((9, 8), Image.Resampling.LANCZOS)
        pixels = list(gray.getdata())
    bits = 0
    for row in range(8):
        for col in range(8):
            bits = (bits << 1) | (pixels[row * 9 + col] > pixels[row * 9 + col + 1])
    return f"{bits:016x}"


def image_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def archive_image_fingerprint(root: Path, entry: dict) -> str | None:
    dedup = entry.get("dedup") if isinstance(entry.get("dedup"), dict) else {}
    stored = str(dedup.get("imageDHash") or "")
    if re.fullmatch(r"[0-9a-f]{16}", stored):
        return stored
    image = entry.get("image")
    if not isinstance(image, str) or not image:
        return None
    path = (root / image).resolve()
    try:
        path.relative_to(root.resolve())
    except ValueError:
        return None
    if not path.is_file():
        return None
    try:
        return image_fingerprint(path)
    except OSError:
        return None


def find_duplicates(
    root: Path,
    *,
    title: str,
    prompt: str,
    slot: str,
    concept_key: str,
    style_family: str = "",
    image: Path | None = None,
) -> list[dict]:
    candidate_core = core_title(title)
    candidate_key = normalize_key(concept_key)
    candidate_key_tokens = concept_tokens(candidate_key)
    candidate_tokens = concept_tokens(candidate_core)
    candidate_style_keys: set[str] = set()
    if slot == "random-image-style":
        if not style_family.strip():
            return [{"reason": "missing-style-family", "message": "Random rendering styles require a canonical style family."}]
        candidate_style_keys.add(canonical_declared_style(style_family))
        # Scheduled random-style titles must name the positive medium. Do not
        # mine the prompt because negative clauses deliberately name old media.
        candidate_style_keys.update(canonical_style_keys(f"{style_family} {title}"))
    if len(candidate_key_tokens) < 3:
        return [{"reason": "weak-concept-key", "message": "Concept key must contain at least three meaningful terms."}]

    candidate_hash = image_fingerprint(image) if image else None
    duplicates: list[dict] = []
    for entry in load_entries(root):
        entry_id = str(entry.get("id") or "unknown")
        entry_title = str(entry.get("title") or "")
        entry_core = core_title(entry_title)
        dedup = entry.get("dedup") if isinstance(entry.get("dedup"), dict) else {}
        existing_keys = {
            normalize_key(dedup.get("conceptKey")),
            entry_core,
        }
        if candidate_key in existing_keys:
            duplicates.append({"reason": "concept-key", "id": entry_id, "title": entry_title})
        elif candidate_core and candidate_core == entry_core:
            duplicates.append({"reason": "title", "id": entry_id, "title": entry_title})
        else:
            existing_tokens = concept_tokens(entry_core)
            common = candidate_tokens & existing_tokens
            if len(common) >= 3 and len(common) / max(1, min(len(candidate_tokens), len(existing_tokens))) >= 0.80:
                duplicates.append({"reason": "near-title", "id": entry_id, "title": entry_title})

        # The explicit key is intentionally compact. Requiring all of its
        # canonical subject/action/setting terms to be absent from every old
        # record catches renamed and lightly paraphrased concepts.
        existing_concept_blob = " ".join(str(value or "") for value in (
            entry_title,
            entry.get("prompt"),
            entry.get("tests"),
            (entry.get("factualInfographic") or {}).get("topic")
            if isinstance(entry.get("factualInfographic"), dict) else "",
        ))
        existing_title_tokens = concept_tokens(entry_title)
        if (
            candidate_key_tokens <= concept_tokens(existing_concept_blob)
            and len(candidate_key_tokens & existing_title_tokens) >= 2
        ):
            duplicates.append({"reason": "concept-contained", "id": entry_id, "title": entry_title})

        if candidate_style_keys and candidate_style_keys & entry_style_keys(entry):
            duplicates.append({
                "reason": "rendering-style-family",
                "id": entry_id,
                "title": entry_title,
                "styleFamilies": sorted(candidate_style_keys & entry_style_keys(entry)),
            })

        if candidate_hash:
            existing_hash = archive_image_fingerprint(root, entry)
            if existing_hash and hamming(candidate_hash, existing_hash) <= 2:
                duplicates.append({
                    "reason": "visual-image-fingerprint",
                    "id": entry_id,
                    "title": entry_title,
                    "distance": hamming(candidate_hash, existing_hash),
                })

    unique: list[dict] = []
    seen: set[tuple[str, str]] = set()
    for duplicate in duplicates:
        identity = (str(duplicate.get("reason")), str(duplicate.get("id")))
        if identity not in seen:
            seen.add(identity)
            unique.append(duplicate)
    return unique


def build_metadata(concept_key: str, style_family: str, image: Path) -> dict:
    result = {
        "conceptKey": normalize_key(concept_key),
        "imageSha256": image_sha256(image),
        "imageDHash": image_fingerprint(image),
    }
    if style_family.strip():
        result["styleFamily"] = canonical_declared_style(style_family)
    return result


def assert_unique_candidate(*args, **kwargs) -> None:
    duplicates = find_duplicates(*args, **kwargs)
    if duplicates:
        raise SystemExit("Duplicate archive candidate rejected: " + json.dumps(duplicates, ensure_ascii=False))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--archive-root", type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument("--title", required=True)
    parser.add_argument("--prompt", default="")
    parser.add_argument("--prompt-file", type=Path)
    parser.add_argument("--slot", required=True)
    parser.add_argument("--concept-key", required=True)
    parser.add_argument("--style-family", default="")
    parser.add_argument("--image", type=Path)
    args = parser.parse_args()
    prompt = args.prompt_file.read_text() if args.prompt_file else args.prompt
    duplicates = find_duplicates(
        args.archive_root.resolve(),
        title=args.title,
        prompt=prompt,
        slot=args.slot,
        concept_key=args.concept_key,
        style_family=args.style_family,
        image=args.image.resolve() if args.image else None,
    )
    print(json.dumps({"unique": not duplicates, "duplicates": duplicates}, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
