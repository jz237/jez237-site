#!/usr/bin/env python3
"""Generate newsstand thumbnails: media/thumbs/<historicDate>.webp (320px wide)
from each issue's hero image. Skips thumbs already newer than their source and
prunes thumbs for issues that no longer exist. Safe to re-run."""
import json
import os

from PIL import Image

root = os.path.dirname(os.path.abspath(__file__))
data = json.load(open(os.path.join(root, "data", "issues.json")))
thumbs_dir = os.path.join(root, "media", "thumbs")
os.makedirs(thumbs_dir, exist_ok=True)

made = current = no_hero = 0
valid = set()
for issue in data.get("issues", []):
    key = issue.get("historicDate") or ""
    src = (issue.get("heroImage") or {}).get("src") or ""
    hero_path = os.path.join(root, src)
    if not key or not src or not os.path.isfile(hero_path):
        no_hero += 1
        continue
    out = os.path.join(thumbs_dir, f"{key}.webp")
    valid.add(f"{key}.webp")
    if os.path.isfile(out) and os.path.getmtime(out) >= os.path.getmtime(hero_path):
        current += 1
        continue
    img = Image.open(hero_path).convert("RGB")
    width = 320
    height = round(img.height * width / img.width)
    img.resize((width, height), Image.LANCZOS).save(out, "WEBP", quality=78, method=6)
    made += 1

pruned = 0
for name in os.listdir(thumbs_dir):
    if name.endswith(".webp") and name not in valid:
        os.remove(os.path.join(thumbs_dir, name))
        pruned += 1

print(f"Chronicle thumbs ok: {made} made, {current} current, {no_hero} without hero, {pruned} pruned")
