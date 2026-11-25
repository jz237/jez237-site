#!/usr/bin/env python3
"""Topic groups for factual infographics.

Each entry in factual-infographics-data.json carries
factualInfographic.group, one of GROUPS. append-entry.py sets it for new
entries (from --factual-group, or classify() when that is omitted), and the
topic pages (themed-collection.js) read it.

Run this file to backfill entries that have no group yet:
    python3 factual_groups.py            # report only
    python3 factual_groups.py --write    # update the data file
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

GROUPS = (
    "cats", "insects", "phobias", "health", "reef-fish",
    "earth-space", "how-things-work", "nature-science",
)

# The daily job's "factual_subtype: <name>" note decides the group when it names a specific series.
SUBTYPE_GROUPS = {
    "cat-infographic": "cats",
    "bizarre-insect-life": "insects",
    "rare-insect": "insects",
    "phobia-infographic": "phobias",
    "medical-health-infographic": "health",
    "reef-fish-infographic": "reef-fish",
}

# General entries fall back to title keywords; anything unmatched is nature-science.
KEYWORD_GROUPS = (
    ("insects", re.compile(
        r"beetle|honeybee|\bbees?\b|wasp|\bfly\b|\bants?\b|termite|\bmoth\b|phasmid|insect|cricket|cicada|"
        r"grasshopper|mayfly|antlion|hangingfly|nymph|weevil|\bbug\b|lacewing|scorpionfly|dobsonfly|"
        r"salmonfly|spittlebug|water scorpion|glow-worm", re.I)),
    ("how-things-work", re.compile(
        r"decal|receipt|sprinkler|watch|freehub|refrigerator|can opener|zipper|pencil|battery|smart glass|"
        r"vinyl|heat shield|solar sail|gravitational-wave|ferrofluid|radiocarbon|cherenkov", re.I)),
    ("earth-space", re.compile(
        r"heat dome|frost|sprite|basalt|lightning|fulgurite|hailstone|atmospheric river|pyrocumulonimbus|"
        r"volcanic|snow crystal|aurora|tsunami|cave pearl|enceladus|pulsar|geyser|pillow lava|\bopal\b|"
        r"saharan dust|soil crust|upwelling|internal waves|brinicle|black smoker|hydrothermal", re.I)),
)

_SUBTYPE = re.compile(r"(?:^|;)\s*factual_subtype:\s*([a-z-]+)(?=;|\s|$)")


def classify(title: str, tests: str = "") -> str:
    """Return the topic group for an entry from its notes and title."""
    tag = _SUBTYPE.search(tests or "")
    if tag and tag.group(1) in SUBTYPE_GROUPS:
        return SUBTYPE_GROUPS[tag.group(1)]
    for group, pattern in KEYWORD_GROUPS:
        if pattern.search(title or ""):
            return group
    return "nature-science"


def backfill(items: list[dict]) -> int:
    changed = 0
    for item in items:
        info = item.get("factualInfographic")
        if isinstance(info, dict) and info.get("group") not in GROUPS:
            info["group"] = classify(str(item.get("title") or ""), str(item.get("tests") or ""))
            changed += 1
    return changed


def main() -> None:
    path = Path(__file__).resolve().parent / "factual-infographics-data.json"
    raw = path.read_bytes().decode("utf-8")
    newline = "\r\n" if "\r\n" in raw else "\n"
    items = json.loads(raw)
    changed = backfill(items)
    counts: dict[str, int] = {}
    for item in items:
        group = (item.get("factualInfographic") or {}).get("group", "(none)")
        counts[group] = counts.get(group, 0) + 1
    print(f"{len(items)} entries, {changed} without a group: {counts}")
    if changed and "--write" in sys.argv:
        text = json.dumps(items, indent=2, ensure_ascii=False) + "\n"
        path.write_bytes(text.replace("\n", newline).encode("utf-8"))
        print("written")


if __name__ == "__main__":
    main()
