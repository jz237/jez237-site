#!/usr/bin/env python3
"""Objective checks for the loop. Usage: python3 tools/score.py iterations/itNN
Needs poster.png and assembled.png in the folder; eval.json (screwPixels) is optional."""
import json, re, sys, pathlib
import numpy as np
from PIL import Image, ImageFilter

root = pathlib.Path(__file__).resolve().parent.parent
it = pathlib.Path(sys.argv[1])

def load(p, size=None):
    im = Image.open(p).convert('RGB')
    return im.resize(size, Image.LANCZOS) if size else im

def hue_hist(im, bins=12):
    a = np.asarray(im.convert('HSV')).astype(float)
    m = (a[..., 1] > 110) & (a[..., 2] > 70)
    h = np.histogram(a[..., 0][m] / 255, bins=bins, range=(0, 1))[0].astype(float)
    return h / max(h.sum(), 1), m.mean()

def overlap(a, b):
    return float(np.minimum(a, b).sum())

ref = load(root / 'reference/infographic-exploded.png')
poster = load(it / 'poster.png', ref.size)
out = {}

# 1. poster layout: edge-structure correlation on the flower column (x 180..760)
def edges(im):
    g = im.convert('L').filter(ImageFilter.GaussianBlur(6)).resize((112, 140))
    return np.asarray(g, float)
box = (180, 60, 760, 1330)
ea, eb = edges(ref.crop(box)), edges(poster.crop(box))
ea, eb = ea - ea.mean(), eb - eb.mean()
out['poster_structure_corr'] = round(float((ea * eb).sum() / np.sqrt((ea ** 2).sum() * (eb ** 2).sum())), 3)

# 2. saturated-colour distribution of petals/leaves vs the reference poster
hr, sr = hue_hist(ref.crop(box)); hp, sp = hue_hist(poster.crop(box))
out['poster_hue_overlap'] = round(overlap(hr, hp), 3)
out['poster_saturated_cover'] = [round(sr, 3), round(sp, 3)]

# 3. assembled render vs the assembled photo palette
photo = load(root / 'reference/photo-assembled.png')
asm = load(it / 'assembled.png')
ha, _ = hue_hist(photo); hb, _ = hue_hist(asm.crop((0, 200, 920, 1100)))
out['assembled_hue_overlap'] = round(overlap(ha, hb), 3)

# 4. screw anchors (px error vs reference positions)
ev = it / 'eval.json'
if ev.exists():
    px = json.loads(ev.read_text())
    src = (root / 'src/layout.js').read_text()
    body = src.split('export const SCREWS_PX = [')[1].split('];')[0]
    ref_px = [(float(x), float(y)) for x, y in re.findall(r'\[\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*[,\]]', body)]
    n = min(len(px), len(ref_px))
    err = [float(np.hypot(px[i][0] - ref_px[i][0], px[i][1] - ref_px[i][1])) for i in range(n)]
    out['screw_count'] = [len(px), len(ref_px)]
    out['screw_err_px_median'] = round(float(np.median(err)), 2)
    out['screw_err_px_max'] = round(max(err), 2)

print(json.dumps(out, indent=2))
(it / 'score.json').write_text(json.dumps(out, indent=2))
