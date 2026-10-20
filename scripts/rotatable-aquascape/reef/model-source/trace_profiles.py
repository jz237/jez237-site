"""Trace species profiles into profiles.json from references/trace-specs.json.

Silhouette edges, the caudal fin, the outer edges of the dorsal and anal fins
and the top-view widths are measured from the plates. The spec supplies what
the eye must judge: fin-base lines over the body, eye, mouth, gill margin,
paired-fin outlines, and the top-view spans to bridge (spread pectorals, eyes).
Top-view x maps to the side view by the caudal tip and snout tip of each
silhouette. Only the width shape is used; 'width' sets the peak half-width in
body lengths, because GPT Image tends to widen fish seen from above.

  python trace_profiles.py [species ...]
Writes each entry and proofs/<species>-trace.png for review.
"""
import json, sys
import numpy as np
from pathlib import Path
from PIL import Image, ImageDraw
from prepare_plates import fish_mask

ROOT = Path(__file__).resolve().parent
REF = ROOT / 'references'
SPECS = json.loads((REF / 'trace-specs.json').read_text(encoding='utf-8'))

def column_edges(mask, x):
    ys = np.where(mask[:, x])[0]
    return (int(ys.min()), int(ys.max())) if len(ys) else None

def merged_edge(mask, edge, spec, which):
    """Manual fin-base points plus sampled silhouette spans, sorted by x."""
    points = [list(p) for p in spec['manual']]
    for x0, x1 in spec.get('silhouette', []):
        for x in list(range(x0, x1, 25)) + [x1]:
            e = column_edges(mask, x)
            if e: points.append([x, e[0] if which == 'top' else e[1]])
    points.sort(key=lambda p: p[0])
    out = []
    for p in points:
        if out and abs(out[-1][0] - p[0]) < 6: continue
        out.append(p)
    return out

def interp(points, x):
    xs = [p[0] for p in points]; ys = [p[1] for p in points]
    return float(np.interp(x, xs, ys))

def trace(k):
    spec = SPECS[k]; distance = spec.get('distance', 40)
    side = Image.open(REF / f'{k}-skin.png').convert('RGB')
    mask = fish_mask(side, None, distance)
    if 'headDistance' in spec:
        # A dark face against a dark backdrop needs a lower threshold; keep the
        # normal one elsewhere so backdrop noise cannot fill a forked tail.
        near, x0 = spec['headDistance']; mask[:, x0:] |= fish_mask(side, None, near)[:, x0:]
    if 'tailDistance' in spec:
        # Translucent caudal rays fade into the backdrop; trace them more finely.
        near, x1 = spec['tailDistance']; mask[:, :x1] |= fish_mask(side, None, near)[:, :x1]
    begin, end = spec['range']
    top = merged_edge(mask, 'top', spec['top'], 'top'); bottom = merged_edge(mask, 'bottom', spec['bottom'], 'bottom')
    top = [p for p in top if begin <= p[0] <= end]; bottom = [p for p in bottom if begin <= p[0] <= end]
    top.append([end, spec['endGap'][0]]); bottom.append([end, spec['endGap'][1]])
    # Caudal fin: silhouette left of the peduncle, closed at the fin root.
    xs = np.where(mask.any(0))[0]; tail = int(xs.min()); root = begin + 18
    rt, rb = round(interp(top, begin)), round(interp(bottom, begin))
    # The tail is the run of fish through the body's mid-line in each column, so
    # soft dorsal and anal lobes overhanging the peduncle are not swallowed.
    # Translucent fins can leave empty columns; sample only measured ones.
    mid = (rt + rb) // 2
    def run(x):
        # Well behind the peduncle only the tail remains: use the full column,
        # which also follows forked lobes past the notch.
        if x < begin - 60: return column_edges(mask, x)
        if not mask[mid, x]: return None
        col = mask[:, x]; t = mid; b = mid
        while t > 0 and col[t - 1]: t -= 1
        while b < len(col) - 1 and col[b + 1]: b += 1
        return t, b
    # Each lobe ends at its own tip: the upper edge runs to the upper tip and the
    # lower edge from the lower tip, with the trailing margin (or fork) between.
    top_tip = int(np.where(mask[:mid, :root].any(0))[0].min()); bottom_tip = int(np.where(mask[mid:, :root].any(0))[0].min())
    upper = [[x, e[0]] for x in range(root - 10, top_tip, -30) if (e := run(x))] + [[top_tip, int(np.where(mask[:mid, top_tip])[0].min())]]
    lower = [[bottom_tip, mid + int(np.where(mask[mid:, bottom_tip])[0].max())]] + [[x, e[1]] for x in range(bottom_tip + 10, root - 4, 30) if (e := run(x))]
    lo, hi = upper[-1][1], lower[0][1]
    trailing = [[int(np.where(mask[y, :root])[0].min()), y] for y in range(lo + 20, hi - 19, 30) if mask[y, :root].any()]
    caudal = [[root, rt]] + upper + trailing + lower + [[root, rb]]
    # Dorsal ribbon: silhouette top inside fin spans, the body edge between them.
    # Soft rear lobes overhanging the peduncle start at 'lobes' and root along
    # the peduncle line, so each fin ends in its real trailing margin instead of
    # a vertical cut where the body outline ends.
    lobe_d, lobe_a = spec.get('lobes', [None, None])
    d0, d1 = (lobe_d or spec['dorsal'][0][0]), spec['dorsal'][-1][1]; dorsal = []
    for x in list(range(d0, d1, 20)) + [d1]:
        inside = x < begin or any(a <= x <= b for a, b in spec['dorsal'])
        e = column_edges(mask, x)
        dorsal.append([x, e[0] if inside and e else round(interp(top, x)) + 3])
    # Anal fin: root along the body bottom, outer edge from the silhouette. A rear
    # lobe behind the body end roots along the peduncle line.
    a0, a1 = spec['anal']; a0 = lobe_a or a0; anal = []
    anal = [[x, rb] for x in range(a0, begin, 25)] if lobe_a else []
    anal += [[x, round(interp(bottom, x))] for x in list(range(begin if lobe_a else a0, a1, 50)) + [a1]]
    anal += [[x, e[1]] for x in range(a1, a0 - 1, -40) if (e := column_edges(mask, x))]
    # Width along the body from the top view.
    top_view = Image.open(REF / f'{k}-dorsal.jpg').convert('RGB'); tm = fish_mask(top_view, None, spec.get('dorsalDistance', 40))
    txs = np.where(tm.any(0))[0]; t_tail, t_snout = int(txs.min()), int(txs.max()); snout = int(xs.max())
    widths = {}
    for x in range(t_tail, t_snout, 12):
        if any(a <= x <= b for a, b in spec.get('bridge', [])): continue
        ys = np.where(tm[:, x])[0]
        if len(ys): widths[x] = int(ys.max() - ys.min())
    wx = sorted(widths); wv = [widths[x] for x in wx]; peak = max(wv)
    to_side = lambda x: tail + (x - t_tail) * (snout - tail) / (t_snout - t_tail)
    thickness = [[round(to_side(x)), round(w / peak, 3)] for x, w in zip(wx, wv) if begin - 40 <= to_side(x) <= end + 40]
    profile = {'range': [begin, end], 'cy': spec['cy'], 'width': spec['width'], 'crossPower': spec.get('crossPower', 1),
               'thickness': thickness, 'texture': spec.get('texture', f'{k}-texture.png'), 'skinTexture': f'{k}-skin-texture.png',
               'eye': spec['eye'], 'eyeDome': spec.get('eyeDome', .0018), 'mouth': spec['mouth'], 'gill': spec['gill'],
               'pec': spec['pec'], 'pelvic': spec['pelvic'], 'top': top, 'bottom': bottom, 'dorsal': dorsal,
               'fins': [caudal, [], anal], 'rings': spec.get('rings', 120), 'sides': spec.get('sides', 64),
               'dorsalFade': spec.get('dorsalFade', [.045, .045])}
    if 'pelvicTexture' in spec: profile['pelvicTexture'] = spec['pelvicTexture']
    for key in ('eyeTop', 'perch'):
        if key in spec: profile[key] = spec[key]
    data = json.loads((ROOT / 'profiles.json').read_bytes().decode('utf-8')); data[k] = profile
    (ROOT / 'profiles.json').write_bytes((json.dumps(data, indent=2) + '\n').replace('\n', '\r\n').encode('utf-8'))
    im = Image.open(REF / f'{k}.png').convert('RGB'); d = ImageDraw.Draw(im)
    for pts, c, closed in [(top, (255, 60, 60), 0), (bottom, (255, 60, 60), 0), (dorsal, (60, 255, 60), 0), (caudal, (255, 220, 0), 1),
                           (anal, (0, 200, 255), 1), (spec['pec'], (255, 0, 255), 1), (spec['pelvic'], (255, 140, 0), 1)]:
        d.line([tuple(p) for p in pts] + ([tuple(pts[0])] if closed else []), fill=c, width=3)
    x, y, r = spec['eye']; d.ellipse([x - r, y - r, x + r, y + r], outline=(0, 255, 255), width=3)
    gx, g0, g1 = spec['gill']; L = end - begin
    d.line([(gx - .036 * L, g0), (gx - .036 * L + .025 * L, (g0 + g1) / 2), (gx - .036 * L, g1)], fill=(255, 255, 255), width=3)
    mx, my = spec['mouth']; d.ellipse([mx - 6, my - 6, mx + 6, my + 6], fill=(255, 255, 0))
    (ROOT / 'proofs').mkdir(exist_ok=True); im.resize((1152, 768)).save(ROOT / 'proofs' / f'{k}-trace.png')
    print(k, 'traced:', len(top), 'top,', len(bottom), 'bottom,', len(thickness), 'width samples')

for k in sys.argv[1:] or [k for k in SPECS if not k.startswith('_')]:
    trace(k)
