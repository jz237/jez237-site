"""Prepare a species' plates after GPT Image generation.

1. Composite the clean-flank edit into the original plate only inside
   references/<species>-fin-mask.png, so every other pixel stays aligned.
2. Write edge-padded texture copies: backdrop pixels are replaced by the fish's
   own nearby colors, so fin margins never sample the backdrop.

The fish is separated from its plain backdrop by color distance from the
backdrop (median border color), or by a brightness threshold for a dark fish.

  python prepare_plates.py <species> [--edit <raw clean-flank edit.png>] [--luminance 105] [--distance 40]
      [--paint-scalpel cx,cy,rx,ry] [--tint-fins] [--extend-patch x0,x1,y0,y1] [--saturation 1.4]

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

def paint_scalpel(img, cx, cy, rx, ry):
    """A surgeonfish's caudal spine sits in a white sheath (Zebrasoma rostratum:
    'a white patch around the spine'). Plates often show only a sliver of it."""
    a = np.asarray(img, dtype=np.float32).copy(); h, w, _ = a.shape
    yy, xx = np.mgrid[0:h, 0:w]
    # Teardrop: fuller toward the head, tapering toward the tail.
    u = (xx - cx) / rx; ry_local = ry * (0.75 + 0.25 * np.clip(u, -1, 1))
    q = np.sqrt(u ** 2 + ((yy - cy) / ry_local) ** 2)
    alpha = np.clip((1 - q) / 0.18, 0, 1)
    shade = 0.80 + 0.17 * np.clip(1 - q, 0, 1) - 0.08 * np.clip((yy - cy) / ry, 0, 1)
    white = np.stack([238 * shade, 236 * shade, 228 * shade], -1)
    a = a * (1 - alpha[..., None]) + white * alpha[..., None]
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))

def interp_edge(points, x):
    return np.interp(x, [p[0] for p in points], [p[1] for p in points])

def tint_fins(img, profile, ramp=4, floor=105):
    """Unpaired fins photographed over the dark backdrop read olive-gray through
    their translucent membranes. Recolor every pixel outside the traced body
    outline (dorsal, anal and caudal fins; the head end is left alone) to the
    body's lemon yellow at its own lifted brightness, so ray and membrane detail
    stays but the fins read yellow like the living fish. Only the fin spans are
    tinted: above the head and below the throat the padding stays as it was.
    The brightness floor turns backdrop seen between an overhanging lobe and the
    peduncle into membrane rather than dark water."""
    a = np.asarray(img, dtype=np.float32); h, w, _ = a.shape
    begin, end = profile['range']; xs = np.arange(w)
    top = interp_edge(profile['top'], xs); bottom = interp_edge(profile['bottom'], xs)
    yy = np.arange(h)[:, None]
    dorsal_end = profile['dorsal'][-1][0]; anal_end = profile.get('analRibbon', profile['fins'][2])[-1][0]
    above = np.where(xs < dorsal_end + ramp, top, -1e9)[None, :] - yy
    below = yy - np.where(xs < anal_end + ramp, bottom, 1e9)[None, :]
    behind = np.clip(begin - xs, 0, None)[None, :]
    weight = np.clip(np.maximum.reduce([above, below, np.broadcast_to(behind, above.shape)]) / ramp, 0, 1)
    luma = a @ [.299, .587, .114]
    lifted = np.maximum(255 * (luma / 255) ** .8, floor)
    yellow = np.array([1, .82, .08], np.float32); tinted = yellow * (lifted / (yellow @ [.299, .587, .114]))[..., None]
    tinted = .85 * tinted + .15 * a
    out = a * (1 - weight[..., None]) + tinted * weight[..., None]
    return Image.fromarray(out.clip(0, 255).astype(np.uint8))

def extend_patch(img, x0, x1, y0, y1, strip=28, feather=6):
    """Repeat the strip of skin just behind column x0 forward over [x0, x1] x
    [y0, y1], with a feathered border: replaces a pale feature at the snout tip
    with the dark skin just behind it."""
    a = np.asarray(img, dtype=np.float32).copy(); h, w, _ = a.shape
    x0, x1, y0, y1 = map(int, (x0, x1, y0, y1)); patch = a.copy()
    for x in range(x0, min(x1, w)): patch[:, x] = a[:, x0 - strip + (x - x0) % strip]
    yy, xx = np.mgrid[0:h, 0:w]
    inside = np.minimum.reduce([xx - x0 + feather, x1 - xx, yy - y0, y1 - yy]).astype(np.float32)
    alpha = np.clip(inside / feather, 0, 1)[..., None]
    return Image.fromarray((a * (1 - alpha) + patch * alpha).clip(0, 255).astype(np.uint8))

def membrane_pectoral(img, polygon, color=(236, 230, 196), radius=3):
    """A translucent pectoral photographed over a boldly striped flank carries the
    stripes in its texture. Inside the traced fan, keep the fin's own fine rays
    (thin bright lines: positive fine-scale detail, tinted yellow) and its
    saturated yellow base, and replace the gray, black and white flank seen
    through it with a pale membrane; stripe edges do not carry over."""
    from PIL import ImageDraw
    a = np.asarray(img, dtype=np.float32); h, w, _ = a.shape
    region = Image.new('L', (w, h), 0); ImageDraw.Draw(region).polygon([tuple(q) for q in polygon], fill=255)
    region = np.asarray(region.filter(ImageFilter.GaussianBlur(4)), dtype=np.float32) / 255
    luma = a @ [.299, .587, .114]
    low = np.asarray(Image.fromarray(luma.clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32)
    detail = np.clip(luma - low, 0, 40)
    saturation = (a.max(2) - a.min(2)) / np.maximum(a.max(2), 1)
    keep = np.clip((saturation - .25) / .3, 0, 1)
    membrane = np.array(color, np.float32)[None, None, :] + 1.4 * detail[..., None] * np.array([1.05, .95, .35], np.float32)
    out = a * keep[..., None] + membrane * (1 - keep[..., None])
    weight = region[..., None]
    return Image.fromarray((a * (1 - weight) + out * weight).clip(0, 255).astype(np.uint8))

def saturate(img, amount):
    """Scale color saturation (HSV), for plates whose colors read dull under the
    aquarium's blue light."""
    h, s, v = img.convert('HSV').split()
    s = s.point(lambda q: min(255, round(q * amount)))
    return Image.merge('HSV', (h, s, v)).convert('RGB')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('species'); parser.add_argument('--edit')
    parser.add_argument('--luminance', type=float); parser.add_argument('--distance', type=float, default=40)
    parser.add_argument('--paint-scalpel', help='cx,cy,rx,ry: paint the white caudal-spine sheath into the skin texture')
    parser.add_argument('--saturation', type=float, help='scale the color saturation of both textures by this factor')
    parser.add_argument('--tint-fins', action='store_true', help="tint the skin texture's dorsal, anal and caudal fins yellow (needs the species in profiles.json)")
    parser.add_argument('--extend-patch', help='x0,x1,y0,y1: repeat the skin just behind x0 forward over this box in the skin texture')
    parser.add_argument('--membrane-pectoral', action='store_true', help="rebuild the pectoral fan of the plate texture as a pale membrane (needs the species' pec outline in trace-specs.json)")
    args = parser.parse_args(); k = args.species
    if args.edit:
        original = Image.open(REF / f'{k}.png').convert('RGB')
        alpha = Image.open(REF / f'{k}-fin-mask.png').filter(ImageFilter.GaussianBlur(5))
        Image.composite(Image.open(args.edit).convert('RGB'), original, alpha).save(REF / f'{k}-skin.png', optimize=True)
    for source, target in [(f'{k}.png', f'{k}-texture.png'), (f'{k}-skin.png', f'{k}-skin-texture.png')]:
        img = Image.open(REF / source).convert('RGB')
        out = pad(img, fish_mask(img, args.luminance, args.distance))
        if args.saturation: out = saturate(out, args.saturation)
        if args.paint_scalpel and target.endswith('-skin-texture.png'): out = paint_scalpel(out, *map(float, args.paint_scalpel.split(',')))
        if args.tint_fins and target.endswith('-skin-texture.png'):
            import json
            profile = json.loads((REF.parent / 'profiles.json').read_bytes().decode('utf-8'))[k]
            out = tint_fins(out, profile)
        if args.extend_patch and target.endswith('-skin-texture.png'): out = extend_patch(out, *map(float, args.extend_patch.split(',')))
        if args.membrane_pectoral and target == f'{k}-texture.png':
            import json
            out = membrane_pectoral(out, json.loads((REF / 'trace-specs.json').read_text(encoding='utf-8'))[k]['pec'])
        out.save(REF / target, optimize=True)
    print(f'Prepared {k}: clean flank and padded textures.')
