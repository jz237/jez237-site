"""Restore the original CC0 height map used during Blender authoring only.

Explicit development command; never run by the build or the browser.
"""
import hashlib
import json
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'source/reference/rock_boulder_dry'
URL = 'https://dl.polyhaven.org/file/ph-assets/Textures/exr/2k/rock_boulder_dry/rock_boulder_dry_disp_2k.exr'
MD5 = 'c8a2fd648f4a54123a8d47e51c38b158'
SIZE = 809322


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    file = DEST / 'rock_boulder_dry_disp_2k.exr'
    if file.exists():
        data = file.read_bytes()
    else:
        request = urllib.request.Request(URL, headers={'User-Agent': 'QuarryImpactAssetPreparation/1.0'})
        with urllib.request.urlopen(request, timeout=60) as response:
            data = response.read()
    assert len(data) == SIZE and hashlib.md5(data).hexdigest() == MD5, 'Official asset checksum mismatch'
    file.write_bytes(data)
    record = {
        'source': 'https://polyhaven.com/a/rock_boulder_dry',
        'official_manifest': 'https://api.polyhaven.com/files/rock_boulder_dry',
        'license': 'CC0-1.0', 'license_url': 'https://polyhaven.com/license',
        'file': file.name, 'url': URL, 'bytes': len(data), 'source_md5': MD5,
        'sha256': hashlib.sha256(data).hexdigest(),
        'notes': 'Original unmodified 2k EXR displacement map. Blender authoring input only; not a runtime texture.',
    }
    (DEST / 'displacement-manifest.json').write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(record))


if __name__ == '__main__':
    main()
