"""Restore the CC0 source files referenced by the two fir download manifests,
plus editable Blender scenes too large for the repository.

Run manually before rebuilding the Blender scenes. Matching local files are
reused; runtime builds never download these authoring inputs.
"""
import hashlib
import json
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parents[1]

for asset in ("fir_sapling", "fir_sapling_medium"):
    directory = ROOT / "source" / "reference" / asset
    records = json.loads((directory / "manifest.json").read_text(encoding="utf-8"))
    for record in records:
        target = (directory / record["file"]).resolve()
        if not target.is_relative_to(directory.resolve()):
            raise ValueError("Source manifest path leaves its asset directory")
        expected = record["sha256"]
        if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest() == expected:
            print("Verified", asset, record["file"])
            continue
        request = urllib.request.Request(record["url"], headers={"User-Agent": "QuarryImpact-asset-restoration"})
        with urllib.request.urlopen(request, timeout=180) as response:
            data = response.read()
        if hashlib.sha256(data).hexdigest() != expected:
            raise ValueError(f"Source hash mismatch: {asset}/{record['file']}")
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        print("Restored", asset, record["file"])

# Editable scenes over the static host's 25 MiB per-file limit are kept in the
# site's R2 bucket instead of the repository (Cloudflare Pages rejects any
# deployment containing a larger file).
LARGE_SCENES = [
    ("source/models/fir-medium.blend",
     "https://pub-26279ae8f18243e38be5748fbfb75f4c.r2.dev/source-assets/quarry-impact/fir-medium.blend",
     "2871cdbac3191c6794a2f9a76ba24fda34f8a1b9a9b49d62a05dab3f89a46914"),
]
for relative, url, expected in LARGE_SCENES:
    target = ROOT / relative
    if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest() == expected:
        print("Verified", relative)
        continue
    request = urllib.request.Request(url, headers={"User-Agent": "QuarryImpact-asset-restoration"})
    with urllib.request.urlopen(request, timeout=600) as response:
        data = response.read()
    if hashlib.sha256(data).hexdigest() != expected:
        raise ValueError(f"Scene hash mismatch: {relative}")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    print("Restored", relative)
