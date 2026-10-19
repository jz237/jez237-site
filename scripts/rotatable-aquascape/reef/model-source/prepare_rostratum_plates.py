"""Prepare the black tang plates after GPT Image generation.

1. Composite the clean-flank edit into the original plate only inside the
   paired-fin mask, so every other pixel stays exactly aligned.
2. Write edge-padded texture copies: the mid-gray backdrop that made the black
   silhouette traceable is replaced by the fish's own nearby colors, so fin
   margins never sample a light fringe.

  python prepare_rostratum_plates.py <raw clean-flank edit.png>
"""
import sys
import numpy as np
from pathlib import Path
from PIL import Image, ImageFilter

REF = Path(__file__).resolve().parent / 'references'

def fish_mask(img):
    lum = np.asarray(img, dtype=np.float32) @ [.299, .587, .114]
    mask = Image.fromarray((lum < 105).astype(np.uint8) * 255)
    # Close pinholes such as the white scalpel so the silhouette is solid.
    return np.asarray(mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))) > 0

def pad(img, mask, steps=48):
    a = np.asarray(img, dtype=np.float32).copy(); known = mask.copy()
    for _ in range(steps):
        acc = np.zeros_like(a); count = np.zeros(known.shape, np.float32)
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                k = np.roll(np.roll(known, dy, 0), dx, 1)
                acc += np.roll(np.roll(a, dy, 0), dx, 1) * k[..., None]; count += k
        grow = ~known & (count > 0); a[grow] = acc[grow] / count[grow][:, None]; known |= grow
    a[~known] = a[mask].mean(0)
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))

original = Image.open(REF / 'rostratum.png').convert('RGB')
edit = Image.open(sys.argv[1]).convert('RGB')
alpha = Image.open(REF / 'rostratum-fin-mask.png').filter(ImageFilter.GaussianBlur(5))
Image.composite(edit, original, alpha).save(REF / 'rostratum-skin.png', optimize=True)
for source, target in [('rostratum.png', 'rostratum-texture.png'), ('rostratum-skin.png', 'rostratum-skin-texture.png')]:
    img = Image.open(REF / source).convert('RGB')
    pad(img, fish_mask(img)).save(REF / target, optimize=True)
print('Prepared clean flank and padded textures.')
