"""Pack the approved transparent Mantaflow renders; no runtime generation."""
from pathlib import Path
from PIL import Image
import hashlib
import json
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'outputs/structural-realism/fluid-bake'
DEST = ROOT / 'public/assets/fx'
DEST.mkdir(parents=True, exist_ok=True)
manifest = json.loads((OUT / 'render-manifest.json').read_bytes())
for asset in manifest['assets']:
    atlas = Image.new('RGBA', (2048, 2048))
    frames = []
    for index, number in enumerate(asset['frames']):
        path = OUT / asset['kind'] / f'{number:04}.png'
        raw = path.read_bytes()
        data = np.array(Image.open(path).convert('RGBA'))
        assert data.shape == (256, 256, 4) and data[:, :, 3].max() > 0
        if asset['kind'] == 'fire':
            # Transparent volume emission is almost invisible when composed as
            # ordinary RGBA. Recover coverage from the rendered emission, keeping
            # the baked fuel field and RGB; remove the dark residual smoke.
            intensity = data[:, :, :3].max(axis=2) / 255.
            data[:, :, 3] = (np.clip((intensity - .10) / .8, 0, 1) ** 1.6 * 255).astype('uint8')
        else:
            data[:, :, 3] = np.clip(data[:, :, 3].astype('float32') * 2.8, 0, 235).astype('uint8')
        # Two clear pixels per tile plus an inset sampler prevent frame bleeding.
        data[:2, :, 3] = data[-2:, :, 3] = data[:, :2, 3] = data[:, -2:, 3] = 0
        atlas.paste(Image.fromarray(data), ((index % 8) * 256, (index // 8) * 256))
        frames.append({'frame': number, 'renderSha256': hashlib.sha256(raw).hexdigest(),
                       'packedPixelSha256': hashlib.sha256(data.tobytes()).hexdigest(),
                       'coveredPixels': int((data[:, :, 3] > 0).sum())})
    assert len({f['packedPixelSha256'] for f in frames}) == 64
    path = ROOT / 'public' / asset['file']
    atlas.save(path, optimize=True)
    asset.update({'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'bytes': path.stat().st_size,
                  'frameAudit': frames, 'insetPixels': 2, 'mipmaps': False})
manifest.update({'packing': 'Fire emission-derived alpha: clamp((maxRGB/255 - .10)/.8)^1.6. Smoke alpha x2.8, capped235. RGB retains rendered lighting. Two-pixel clear border, linear filtering without mipmaps. Adjacent frames blend; last eight frames crossfade to the beginning.',
                 'atlasPixels': [2048, 2048], 'authoringBlendSha256': hashlib.sha256((ROOT / 'source/fx/vehicle-fluids.blend').read_bytes()).hexdigest(),
                 'packingScriptSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest()})
for path in [DEST / 'manifest.json', ROOT / 'source/fx/manifest.json']:
    path.write_bytes((json.dumps(manifest, indent=2) + '\n').encode())
(DEST / 'LICENSE.txt').write_text('CC0 1.0 Universal\nOriginal Quarry Impact Mantaflow simulation and rendered fire/smoke atlases.\nhttps://creativecommons.org/publicdomain/zero/1.0/\nAuthoring: tools/bake-vehicle-fluids.py and source/fx/vehicle-fluids.blend.\n', encoding='utf-8')
print(json.dumps({a['kind']: {'bytes': a['bytes'], 'frames': len(a['frameAudit'])} for a in manifest['assets']}))
