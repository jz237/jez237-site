"""Restore the CC0 source files referenced by the two fir download manifests.

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
