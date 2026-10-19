"""Prepare a species' plates after GPT Image generation.

1. Composite the clean-flank edit into the original plate only inside
   references/<species>-fin-mask.png, so every other pixel stays aligned.
2. Write edge-padded texture copies: backdrop pixels are replaced by the fish's
   own nearby colors, so fin margins never sample the backdrop.

The fish is separated from its plain backdrop by color distance from the
backdrop (median border color), or by a brightness threshold for a dark fish.

  python prepare_plates.py <species> [--edit <raw clean-flank edit.png>] [--luminance 105] [--distance 40]

Without --edit, the stored references/<species>-skin.png is used as is (for
clean flanks finished in more than one pass; see the species' prompts file).
"""
import argparse
import numpy as np
from pathlib import Path
from PIL import Image, ImageFilter

REF = Path(__file__).resolve().parent / 'references'

def backdrop(a, band=24):
    """Quadratic fit of the backdrop from the border band: plates have soft gradients."""
    h, w, _ = a.shape; yy, xx = np.mgrid[0:h, 0:w]; edge = np.zeros((h, w), bool)
    edge[:band] = edge[-band:] = True; edge[:, :band] = edge[:, -band:] = True
    x, y = xx / w - .5, yy / h - .5
    basis = lambda x, y: np.stack([np.ones_like(x), x, y, x * x, y * y, x * y], -1)
    coef, *_ = np.linalg.lstsq(basis(x[edge], y[edge]), a[edge], rcond=None)
    return basis(x, y) @ coef

def fish_mask(img, luminance=None, distance=40):
    from scipy import ndimage
    a = np.asarray(img, dtype=np.float32)
    if luminance is not None:
        mask = a @ [.299, .587, .114] < luminance
    else:
        mask = np.linalg.norm(a - backdrop(a), axis=2) > distance
    mask = Image.fromarray(mask.astype(np.uint8) * 255)
    # Close pinholes (white spines, pale spots) so the silhouette is solid.
    mask = np.asarray(mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))) > 0
    if luminance is None:
        # Keep the fish itself, not stray backdrop texture, then sample its
        # colors from just inside translucent rims that blend with the backdrop.
        labels, count = ndimage.label(mask)
        if count > 1: mask = labels == 1 + np.argmax(ndimage.sum(mask, labels, range(1, count + 1)))
        mask = ndimage.binary_fill_holes(mask) & ndimage.binary_erosion(mask, iterations=3)
    return mask

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

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('species'); parser.add_argument('--edit')
    parser.add_argument('--luminance', type=float); parser.add_argument('--distance', type=float, default=40)
    args = parser.parse_args(); k = args.species
    if args.edit:
        original = Image.open(REF / f'{k}.png').convert('RGB')
        alpha = Image.open(REF / f'{k}-fin-mask.png').filter(ImageFilter.GaussianBlur(5))
        Image.composite(Image.open(args.edit).convert('RGB'), original, alpha).save(REF / f'{k}-skin.png', optimize=True)
    for source, target in [(f'{k}.png', f'{k}-texture.png'), (f'{k}-skin.png', f'{k}-skin-texture.png')]:
        img = Image.open(REF / source).convert('RGB')
        pad(img, fish_mask(img, args.luminance, args.distance)).save(REF / target, optimize=True)
    print(f'Prepared {k}: clean flank and padded textures.')
