# Glimmer Grotto placeholder asset generator.
# Produces detailed shaded pixel-art PNGs into ../assets, plus manifest.json and
# ../ASSET_PROMPTS.md (GPT Image 2 painterly upgrade path).
# Run: python gen_assets.py   (from the tools/ folder)

import json, math, os
import numpy as np
from PIL import Image, ImageDraw
import sprites_data

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, "..", "assets"))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
os.makedirs(ASSETS, exist_ok=True)

SCALE = 4          # nearest-neighbor upscale baked into PNGs
rng = np.random.default_rng(20260610)

# painterly drop-ins are never clobbered by the placeholder generator
PAINTERLY = set()
_pf = os.path.join(ASSETS, "PAINTERLY.txt")
if os.path.exists(_pf):
    PAINTERLY = {l.strip() for l in open(_pf, encoding="utf-8")
                 if l.strip() and not l.startswith("#")}

MANIFEST = {}      # name -> entry
PROMPT_ORDER = []

BAYER = np.array([[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]], float) / 16.0

def hex2rgba(s):
    s = s.lstrip("#")
    if len(s) == 6: s += "ff"
    return tuple(int(s[i:i+2], 16) for i in (0, 2, 4, 6))

def canvas(w, h):
    return np.zeros((h, w, 4), np.uint8)

def put(img, x, y, c):
    h, w = img.shape[:2]
    if 0 <= x < w and 0 <= y < h:
        a = c[3] / 255.0
        if a >= 1.0:
            img[y, x] = c
        else:
            bg = img[y, x].astype(float)
            out = bg[:3] * (1 - a) + np.array(c[:3], float) * a
            img[y, x, :3] = out.astype(np.uint8)
            img[y, x, 3] = max(img[y, x, 3], c[3])

def vnoise(w, h, freq, seed, periodic_x=True, periodic_y=True):
    """Periodic value noise in [0,1]."""
    r = np.random.default_rng(seed)
    g = r.random((freq + 1, freq + 1))
    if periodic_x: g[:, -1] = g[:, 0]
    if periodic_y: g[-1, :] = g[0, :]
    ys = np.linspace(0, freq, h, endpoint=False)
    xs = np.linspace(0, freq, w, endpoint=False)
    xi = xs.astype(int); yi = ys.astype(int)
    xf = xs - xi; yf = ys - yi
    sx = xf * xf * (3 - 2 * xf); sy = yf * yf * (3 - 2 * yf)
    g00 = g[np.ix_(yi, xi)]; g10 = g[np.ix_(yi, xi + 1)]
    g01 = g[np.ix_(yi + 1, xi)]; g11 = g[np.ix_(yi + 1, xi + 1)]
    top = g00 * (1 - sx) + g10 * sx
    bot = g01 * (1 - sx) + g11 * sx
    return top * (1 - sy[:, None]) + bot * sy[:, None]

def fbm(w, h, base_freq, octaves, seed, periodic_x=True, periodic_y=True):
    total = np.zeros((h, w)); amp = 1.0; norm = 0.0
    for o in range(octaves):
        total += amp * vnoise(w, h, base_freq * (2 ** o), seed + o * 977, periodic_x, periodic_y)
        norm += amp; amp *= 0.55
    return total / norm

def ramp_fill(img, values, ramp, dither=0.10):
    """Map value field [0,1] -> dithered indexed colors from ramp (dark->light)."""
    h, w = values.shape
    n = len(ramp)
    cols = np.array([hex2rgba(c) for c in ramp], np.uint8)
    d = np.tile(BAYER, (h // 4 + 1, w // 4 + 1))[:h, :w]
    idx = np.clip(((values + (d - 0.5) * dither) * n).astype(int), 0, n - 1)
    img[..., :3] = cols[idx][..., :3]
    img[..., 3] = 255

def outline(img, color="#1a1208", alpha=255):
    """Draw 1px outline just inside the silhouette edge (keeps size)."""
    c = hex2rgba(color); c = (c[0], c[1], c[2], alpha)
    a = img[..., 3] > 40
    pad = np.pad(a, 1)
    nb = pad[:-2, 1:-1] & pad[2:, 1:-1] & pad[1:-1, :-2] & pad[1:-1, 2:]
    edge = a & ~nb
    img[edge] = c
    return img

def upscale_save(name, img, category, transparent, tiling, prompt, desc):
    h, w = img.shape[:2]
    path = os.path.join(ASSETS, name + ".png")
    if name in PAINTERLY and os.path.exists(path):
        with Image.open(path) as im:
            fw, fh = im.size          # keep the painterly file & its dims
    else:
        pil = Image.fromarray(img, "RGBA").resize((w * SCALE, h * SCALE), Image.NEAREST)
        pil.save(path)
        fw, fh = w * SCALE, h * SCALE
    ar = fw / fh
    gen = "1536x1024" if ar > 1.3 else ("1024x1536" if ar < 0.77 else "1024x1024")
    MANIFEST[name] = {
        "file": name + ".png", "w": fw, "h": fh, "native": [w, h],
        "category": category, "transparent": bool(transparent),
        "tiling": bool(tiling), "genSize": gen, "desc": desc, "prompt": prompt,
    }
    PROMPT_ORDER.append(name)
    return img

# ---------------------------------------------------------------- string art
def render_string_sprite(name, spec, category, prompt, desc):
    rows = spec["rows"]; pal = {k: hex2rgba(v) for k, v in spec["pal"].items()}
    w = max(len(r) for r in rows); h = len(rows)
    img = canvas(w, h)
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            if ch != "." and ch in pal:
                img[y, x] = pal[ch]
    upscale_save(name, img, category, True, False, prompt, desc)
    return img

# ---------------------------------------------------------------- tiles
T = 32

def speckle(img, n, colors, seed):
    r = np.random.default_rng(seed)
    h, w = img.shape[:2]
    for _ in range(n):
        x, y = int(r.integers(0, w)), int(r.integers(0, h))
        put(img, x, y, hex2rgba(colors[int(r.integers(0, len(colors)))]))

def pebbles(img, n, body, hi, lo, seed):
    r = np.random.default_rng(seed)
    h, w = img.shape[:2]
    for _ in range(n):
        cx, cy = int(r.integers(2, w - 2)), int(r.integers(2, h - 2))
        rw, rh = int(r.integers(1, 3)), int(r.integers(1, 2))
        for dy in range(-rh, rh + 1):
            for dx in range(-rw, rw + 1):
                if (dx / (rw + .5)) ** 2 + (dy / (rh + .5)) ** 2 <= 1:
                    px, py = (cx + dx) % w, (cy + dy) % h
                    img[py, px] = hex2rgba(body)
        put(img, (cx - rw // 2) % w, (cy - rh) % h, hex2rgba(hi))
        put(img, (cx) % w, (cy + rh) % h, hex2rgba(lo))

def cracks(img, n, dark, light, seed):
    r = np.random.default_rng(seed)
    h, w = img.shape[:2]
    for _ in range(n):
        x, y = int(r.integers(0, w)), int(r.integers(0, h))
        dx = int(r.choice([-1, 1])); dy = int(r.choice([0, 1]))
        for _ in range(int(r.integers(4, 9))):
            img[y % h, x % w] = hex2rgba(dark)
            put(img, (x + 1) % w, (y + 1) % h, hex2rgba(light))
            x += dx if r.random() < .8 else 0
            y += dy if r.random() < .7 else int(r.choice([-1, 1]))

def gen_tile(name, ramp, seed, *, pebble=None, crack=None, glint=None,
             moss=None, dither=0.10, freq=3, octs=3, prompt="", desc=""):
    img = canvas(T, T)
    v = fbm(T, T, freq, octs, seed)
    v = (v - v.min()) / (np.ptp(v) + 1e-6)
    ramp_fill(img, v, ramp, dither)
    if pebble: pebbles(img, 7, *pebble, seed + 5)
    if crack: cracks(img, 3, *crack, seed + 9)
    if glint:
        r = np.random.default_rng(seed + 13)
        for _ in range(10):
            x, y = int(r.integers(0, T)), int(r.integers(0, T))
            put(img, x, y, hex2rgba(glint))
            if r.random() < .5: put(img, x + 1, y, hex2rgba(glint))
    if moss:
        m = fbm(T, T, 4, 2, seed + 21)
        for y in range(T):
            for x in range(T):
                if m[y, x] > 0.74:
                    img[y, x] = hex2rgba(moss[0])
                elif m[y, x] > 0.66:
                    img[y, x] = hex2rgba(moss[1])
    upscale_save(name, img, "tile", False, True, prompt, desc)
    return img

def gen_brick_tile(name, mortar, faces, seed, chip, prompt, desc):
    img = canvas(T, T)
    v = fbm(T, T, 4, 2, seed)
    ramp_fill(img, v, faces, 0.08)
    mc = hex2rgba(mortar)
    bh = 8
    r = np.random.default_rng(seed + 3)
    for row in range(T // bh):
        y = row * bh
        img[y, :] = mc
        off = (row % 2) * 8
        for bx in range(0, T, 16):
            x = (bx + off) % T
            img[y:y + bh, x] = mc
        # per-brick light top edge
        for x in range(T):
            put(img, x, y + 1, hex2rgba(faces[-1]))
    for _ in range(14):
        x, y = int(r.integers(0, T)), int(r.integers(0, T))
        put(img, x, y, hex2rgba(chip))
    upscale_save(name, img, "tile", False, True, prompt, desc)
    return img

def gen_grass_tile(name, dirt_ramp, seed, prompt, desc):
    img = canvas(T, T)
    v = fbm(T, T, 3, 3, seed)
    v = (v - v.min()) / (np.ptp(v) + 1e-6)
    ramp_fill(img, v, dirt_ramp, 0.1)
    pebbles(img, 5, "#7a5230", "#9a7048", "#4e3320", seed + 5)
    g_dark, g_mid, g_hi = "#3f6b2e", "#558a3b", "#7ab35a"
    r = np.random.default_rng(seed + 7)
    surf = [4 + int(round(2 * math.sin(x * math.tau / T * 2) + r.random())) for x in range(T)]
    for x in range(T):
        for y in range(0, surf[x] + 3):
            if y < surf[x]: img[y, x] = hex2rgba(g_mid if y > 1 else g_hi)
            elif y < surf[x] + 2: img[y, x] = hex2rgba(g_dark)
    for x in range(0, T, 3):  # blade tufts
        bh = int(r.integers(1, 4))
        for k in range(bh):
            put(img, x + int(r.integers(0, 2)), surf[x] - 1 - k - 1, hex2rgba(g_hi if k == bh - 1 else g_mid))
    for _ in range(6):  # tiny flowers
        x = int(r.integers(0, T))
        put(img, x, max(0, surf[x] - 2), hex2rgba(["#ffd87f", "#e0667e", "#e8e2c8"][int(r.integers(0, 3))]))
    upscale_save(name, img, "tile", False, True, prompt, desc)
    return img

# ---------------------------------------------------------------- gems
GEM_SHAPES = {
    "round":    [(0.5,0.04),(0.82,0.2),(0.96,0.55),(0.78,0.88),(0.5,0.97),(0.22,0.88),(0.04,0.55),(0.18,0.2)],
    "kite":     [(0.5,0.03),(0.9,0.4),(0.5,0.97),(0.1,0.4)],
    "hex":      [(0.3,0.05),(0.7,0.05),(0.95,0.5),(0.7,0.95),(0.3,0.95),(0.05,0.5)],
    "emeraldcut":[(0.2,0.08),(0.8,0.08),(0.95,0.3),(0.95,0.7),(0.8,0.92),(0.2,0.92),(0.05,0.7),(0.05,0.3)],
    "teardrop": [(0.5,0.02),(0.78,0.36),(0.9,0.65),(0.68,0.94),(0.32,0.94),(0.1,0.65),(0.22,0.36)],
    "brilliant":[(0.18,0.1),(0.82,0.1),(0.97,0.34),(0.5,0.97),(0.03,0.34)],
    "shard":    [(0.42,0.02),(0.72,0.18),(0.88,0.6),(0.6,0.96),(0.3,0.86),(0.12,0.42)],
}

def lerp_c(c1, c2, t):
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))

def draw_gem(size, shape, dark, mid, light, spark, seed, squash=1.0):
    img = canvas(size, size)
    pts = [(x * (size - 2) + 1, (y * squash + (1 - squash) * 0.5) * (size - 2) + 1)
           for x, y in GEM_SHAPES[shape]]
    cx = sum(p[0] for p in pts) / len(pts); cy = sum(p[1] for p in pts) / len(pts)
    r = np.random.default_rng(seed)
    cd, cm, cl, cs = hex2rgba(dark), hex2rgba(mid), hex2rgba(light), hex2rgba(spark)
    light_dir = (-0.55, -0.83)
    n = len(pts)
    pil = Image.new("RGBA", (size, size))
    d = ImageDraw.Draw(pil)
    for i in range(n):
        a, b = pts[i], pts[(i + 1) % n]
        mxx, mxy = (a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy
        l = math.hypot(mxx, mxy) + 1e-6
        shade = (mxx / l) * light_dir[0] + (mxy / l) * light_dir[1]
        t = 0.5 + 0.5 * shade + (r.random() - 0.5) * 0.25
        t = max(0, min(1, t))
        col = lerp_c(cd, cm, t * 2) if t < 0.5 else lerp_c(cm, cl, (t - 0.5) * 2)
        d.polygon([a, b, (cx, cy)], fill=col)
    # inner core glow
    d.polygon([( (p[0]-cx)*0.42+cx, (p[1]-cy)*0.42+cy) for p in pts], fill=lerp_c(cm, cl, 0.75))
    arr = np.array(pil)
    img[arr[..., 3] > 0] = arr[arr[..., 3] > 0]
    outline(img, dark)
    # specular sparkles
    top = min(pts, key=lambda p: p[1])
    for (sx, sy) in [(int(top[0]), int(top[1]) + 2), (int(cx - size * .2), int(cy - size * .15))]:
        put(img, sx, sy, cs); put(img, sx + 1, sy, cs); put(img, sx, sy + 1, cs)
        put(img, sx - 1, sy, (cs[0], cs[1], cs[2], 140)); put(img, sx, sy - 1, (cs[0], cs[1], cs[2], 140))
    return img

GEMS = {
    # name: (shape, dark, mid, light, spark)
    "gem_amber":    ("teardrop", "#7a3d12", "#d8862a", "#ffc46b", "#fff3d0"),
    "gem_quartz":   ("hex",      "#9a7f96", "#d9c3d4", "#f6ecf4", "#ffffff"),
    "gem_amethyst": ("kite",     "#4a2580", "#8a54c0", "#c79df0", "#f0e2ff"),
    "gem_emerald":  ("emeraldcut","#0e5a36", "#2c9c63", "#6fd99c", "#d8ffe8"),
    "gem_sapphire": ("round",    "#15356e", "#2e63b8", "#6fa3e8", "#dceaff"),
    "gem_ruby":     ("brilliant","#6e1024", "#c22746", "#ef6b82", "#ffd6dd"),
    "gem_diamond":  ("brilliant","#4e7d8e", "#9fd3df", "#e6f9fc", "#ffffff"),
}

def gen_vein(name, gemdef, seed, prompt, desc):
    img = canvas(T, T)
    shape, dark, mid, light, spark = gemdef
    r = np.random.default_rng(seed)
    for i in range(int(r.integers(3, 5))):
        s = int(r.integers(7, 12))
        g = draw_gem(s, "shard" if i % 2 else "kite", dark, mid, light, spark, seed + i, squash=1.0)
        x, y = int(r.integers(1, T - s - 1)), int(r.integers(1, T - s - 1))
        # dark pocket behind shard
        for dy in range(-1, s + 1):
            for dx in range(-1, s + 1):
                if 0 <= x+dx < T and 0 <= y+dy < T and g[min(max(dy,0),s-1), min(max(dx,0),s-1), 3] > 0:
                    put(img, x + dx, y + dy, hex2rgba("#17100cdd"))
        m = g[..., 3] > 0
        img[y:y + s, x:x + s][m] = g[m]
    upscale_save(name, img, "vein", True, False, prompt, desc)

def gen_cluster(name, dark, mid, light, spark, seed, prompt, desc):
    w, h = 26, 24
    img = canvas(w, h)
    r = np.random.default_rng(seed)
    # rock base
    for x in range(2, w - 2):
        hh = 3 + int(2 * abs(math.sin(x * 0.7)))
        for y in range(h - hh, h):
            img[y, x] = hex2rgba("#4a4038" if (x + y) % 3 else "#3a322b")
    shards = [(w//2 - 4, 12, 0.0, 1.0), (w//2 + 3, 10, 0.25, 0.85), (w//2 - 9, 9, -0.3, 0.8), (w//2 + 9, 8, 0.45, 0.7)]
    for (bx, sh, tilt, _sc) in shards:
        g = draw_gem(sh + 4, "shard", dark, mid, light, spark, seed + bx)
        gh, gw = g.shape[:2]
        ox, oy = bx - gw // 2, h - 5 - gh + int(tilt * 2)
        for yy in range(gh):
            for xx in range(gw):
                if g[yy, xx, 3] > 0:
                    put(img, ox + xx + int(tilt * yy * 0.5), oy + yy, tuple(g[yy, xx]))
    outline(img, "#171008")
    upscale_save(name, img, "decor", True, False, prompt, desc)

# ---------------------------------------------------------------- decor
def gen_stalactite(name, flip, seed, prompt, desc):
    w, h = 14, 24
    img = canvas(w, h)
    r = np.random.default_rng(seed)
    ramp = ["#3c3530", "#564c44", "#6f6359", "#867a6e"]
    for y in range(h):
        t = y / (h - 1)
        half = max(1, (w // 2 - 1) * (1 - t) + r.random() * 1.2)
        for x in range(w):
            d = abs(x - w / 2 + 0.5)
            if d <= half:
                shade = 0.75 - d / (half + 1) * 0.5 + (r.random() - .5) * .15
                shade = max(0, min(1, shade + (0.12 if x < w / 2 else -0.08)))
                img[y, x] = hex2rgba(ramp[int(shade * (len(ramp) - 1) + .5)])
    put(img, w // 2, h - 1, hex2rgba("#a8e0e8"))  # drip
    outline(img, "#1a1410")
    if flip: img = img[::-1].copy()
    upscale_save(name, img, "decor", True, False, prompt, desc)

def gen_strands(name, w, h, n, cols, leaf=None, seed=1, prompt="", desc=""):
    img = canvas(w, h)
    r = np.random.default_rng(seed)
    for i in range(n):
        x = float(r.integers(2, w - 2)); y = 0
        ph = r.random() * 6
        while y < h - 1 - r.integers(0, h // 3):
            c = cols[int(r.integers(0, len(cols)))]
            put(img, int(x), y, hex2rgba(c))
            if r.random() < .3: put(img, int(x) + 1, y, hex2rgba(cols[0]))
            if leaf and r.random() < 0.22 and y > 2:
                lc, lh = leaf
                side = 1 if r.random() < .5 else -1
                put(img, int(x) + side, y, hex2rgba(lc))
                put(img, int(x) + side * 2, y, hex2rgba(lh))
                put(img, int(x) + side, y - 1, hex2rgba(lh))
            x += math.sin(y * 0.45 + ph) * 0.7 + (r.random() - .5) * .6
            x = max(1, min(w - 2, x)); y += 1
    upscale_save(name, img, "decor", True, False, prompt, desc)

def gen_fern(name, seed, prompt, desc):
    w, h = 24, 16
    img = canvas(w, h)
    r = np.random.default_rng(seed)
    cx = w / 2
    for k, lean in enumerate([-1.0, -0.5, 0.0, 0.5, 1.0]):
        ln = h - 3 - abs(lean) * 4 + r.random() * 1.5
        for s in range(int(ln)):
            t = s / ln
            x = int(cx + lean * t * t * 9)
            y = h - 1 - s
            put(img, x, y, hex2rgba("#3f6b2e"))
            if s > 1 and s % 2 == 0:   # leaflet pairs
                side = 1 if (s // 2) % 2 else -1
                ll = max(1, int((1 - t) * 3))
                for i in range(1, ll + 1):
                    put(img, x + side * i, y, hex2rgba("#558a3b" if i < ll else "#7ab35a"))
                    put(img, x - side * i, y + (1 if i == 1 else 0), hex2rgba("#558a3b"))
            if s == int(ln) - 1:
                put(img, x, y - 1, hex2rgba("#7ab35a"))
    outline(img, "#1c2e12", 150)
    upscale_save(name, img, "decor", True, False, prompt, desc)

def gen_flower(name, seed, prompt, desc):
    w, h = 12, 14
    img = canvas(w, h)
    for y in range(7, 13): put(img, 6, y, hex2rgba("#3f6b2e"))
    put(img, 5, 9, hex2rgba("#558a3b")); put(img, 7, 11, hex2rgba("#558a3b"))
    petals = [(6, 3), (4, 4), (8, 4), (5, 6), (7, 6)]
    for (x, y) in petals:
        for dx, dy in ((0, 0), (1, 0), (0, 1), (1, 1)):
            put(img, x + dx - 0, y + dy - 0, hex2rgba("#9fd3df"))
    put(img, 6, 4, hex2rgba("#ffffff")); put(img, 7, 5, hex2rgba("#e6f9fc"))
    put(img, 6, 5, hex2rgba("#fff6c4"))
    outline(img, "#1c3038", 150)
    upscale_save(name, img, "decor", True, False, prompt, desc)

def gen_tree(name, seed, prompt, desc):
    w, h = 36, 52
    img = canvas(w, h)
    r = np.random.default_rng(seed)
    # trunk
    for y in range(h - 14, h):
        for x in range(w // 2 - 2, w // 2 + 2):
            img[y, x] = hex2rgba("#6b4226" if x < w // 2 else "#523722")
    put(img, w // 2 - 2, h - 10, hex2rgba("#8a5a33"))
    # foliage tiers
    tiers = [(8, 15, 0), (6, 13, 10), (4, 10, 19), (2, 7, 27)]
    g = ["#274d22", "#3f6b2e", "#558a3b", "#7ab35a"]
    for (top, half, dy) in [(t[2], t[1], 0) for t in []] or []:
        pass
    yy = 4
    for half, rows, _ in [(6, 9, 0), (9, 10, 0), (12, 11, 0), (14, 9, 0)]:
        for ry in range(rows):
            t = ry / rows
            span = int(half * (0.25 + 0.75 * t)) + int(r.integers(0, 2))
            for x in range(w // 2 - span, w // 2 + span + 1):
                shade = 0.8 - t * 0.45 + (0.18 if x < w // 2 - span // 2 else 0) + (r.random() - .5) * .2
                shade = max(0, min(1, shade))
                put(img, x, yy + ry, hex2rgba(g[int(shade * 3 + .5)]))
        yy += rows - 3
    outline(img, "#14240f")
    upscale_save(name, img, "decor", True, False, prompt, desc)

def gen_pillar(name, seed, prompt, desc):
    w, h = 20, 44
    img = canvas(w, h)
    r = np.random.default_rng(seed)
    ramp = ["#6e5a30", "#94793f", "#b8994f", "#d4b86a"]
    for y in range(4, h):
        for x in range(3, w - 3):
            t = 1 - abs(x - w / 2 + .5) / (w / 2 - 2.5)
            shade = 0.35 + t * 0.5 + (r.random() - .5) * .18
            img[y, x] = hex2rgba(ramp[int(max(0, min(1, shade)) * 3 + .5)])
    # broken jagged top
    for x in range(3, w - 3):
        cut = int(r.integers(0, 5))
        for y in range(4, 4 + cut):
            img[y, x] = (0, 0, 0, 0)
    # capital + base
    for y in (10, 11):
        for x in range(2, w - 2): img[y, x] = hex2rgba("#7e6736" if y == 11 else "#caa958")
    for y in (h - 4, h - 3, h - 2, h - 1):
        for x in range(1, w - 1): img[y, x] = hex2rgba("#94793f" if y < h - 2 else "#6e5a30")
    cracks(img, 4, "#4e3f1e", "#caa958", seed + 4)
    # moss tufts
    for _ in range(6):
        x, y = int(r.integers(3, w - 3)), int(r.integers(12, h - 5))
        put(img, x, y, hex2rgba("#558a3b")); put(img, x + 1, y, hex2rgba("#3f6b2e"))
    outline(img, "#241c08")
    upscale_save(name, img, "decor", True, False, prompt, desc)

# ---------------------------------------------------------------- scenery
def gen_mural(name, seed, motif, prompt, desc):
    """Ochre cave-painting panel on lighter rock."""
    w, h = 40, 28
    img = canvas(w, h)
    v = fbm(w, h, 3, 2, seed)
    ramp_fill(img, v, ["#4a4036", "#5a4e40", "#6a5c4a"], 0.08)
    ochre = hex2rgba("#c97a3a"); cream = hex2rgba("#d8c8a0"); dark = hex2rgba("#8a4a2a")
    r = np.random.default_rng(seed)
    def stick_miner(x0, y0):
        for (dx, dy) in [(0,0),(0,1),(0,2),(-1,3),(1,3),(0,1)]: put(img, x0+dx, y0+dy+1, ochre)
        put(img, x0, y0, cream)                       # head
        put(img, x0-1, y0+2, ochre); put(img, x0+1, y0+2, ochre)  # arms
        put(img, x0+2, y0+1, dark)                    # pick
    def gem_glyph(x0, y0, c):
        for (dx, dy) in [(0,0),(-1,1),(1,1),(0,2)]: put(img, x0+dx, y0+dy, c)
        put(img, x0, y0+1, hex2rgba("#fff6c4"))
    def spiral(x0, y0):
        pts = [(0,0),(1,0),(1,1),(0,1),(-1,1),(-1,0),(-1,-1),(0,-1),(1,-1),(2,-1),(2,0),(2,1),(2,2),(1,2),(0,2),(-1,2),(-2,2)]
        for (dx, dy) in pts[:int(r.integers(9, 17))]: put(img, x0+dx, y0+dy, ochre)
    def beast(x0, y0):
        for dx in range(5): put(img, x0+dx, y0, ochre)
        for (dx, dy) in [(0,1),(4,1),(1,1),(3,1)]: put(img, x0+dx, y0+dy, ochre)
        put(img, x0+5, y0-1, ochre); put(img, x0+6, y0-2, dark)
    def hands(x0, y0):
        for k in range(int(r.integers(2, 4))):
            hx, hy = x0+k*4, y0+int(r.integers(-1, 2))
            for (dx, dy) in [(0,0),(1,0),(0,1),(1,1),(0,-1),(1,-1),(-1,0),(2,0)]:
                put(img, hx+dx, hy+dy, cream if k % 2 else ochre)
    if motif == 0:
        stick_miner(8, 8); stick_miner(15, 9)
        gem_glyph(24, 10, hex2rgba("#b07ae0")); gem_glyph(30, 8, hex2rgba("#50d890"))
        spiral(33, 18)
    elif motif == 1:
        beast(8, 12); beast(20, 9); hands(28, 18); spiral(6, 20)
    else:
        hands(8, 8); gem_glyph(12, 18, hex2rgba("#f05060")); stick_miner(24, 14)
        gem_glyph(30, 17, hex2rgba("#5890e8")); spiral(18, 20)
    # worn edges
    for _ in range(26):
        x, y = int(r.integers(0, w)), int(r.integers(0, h))
        if r.random() < .5: img[y, x] = hex2rgba("#4a4036")
    outline(img, "#2b2218", 180)
    upscale_save(name, img, "decor", True, False, prompt, desc)

def gen_support_beam(name, seed, prompt, desc):
    w, h = 40, 58
    img = canvas(w, h)
    r = np.random.default_rng(seed)
    wood = ["#52432f", "#6e5a40", "#82684a"]
    for x0 in (4, w - 9):              # tall posts
        for y in range(4, h):
            for dx in range(5):
                shade = wood[1 if dx in (1, 2, 3) else 0]
                if dx == 2 and r.random() < .3: shade = wood[2]
                put(img, x0 + dx, y, hex2rgba(shade))
    for y in range(0, 6):              # crossbeam
        for x in range(0, w):
            shade = wood[2 if y == 1 else (1 if y < 4 else 0)]
            put(img, x, y, hex2rgba(shade))
    for x0 in (4, w - 9):              # diagonal braces
        sgn = 1 if x0 == 4 else -1
        for k in range(10):
            put(img, x0 + (5 if sgn == 1 else -1) + sgn * k, 6 + k, hex2rgba(wood[0]))
            put(img, x0 + (5 if sgn == 1 else -1) + sgn * k, 7 + k, hex2rgba(wood[1]))
    for x in (7, w - 7):               # joint pegs
        put(img, x, 2, hex2rgba("#2c241e")); put(img, x, 3, hex2rgba("#2c241e"))
    for _ in range(14):                # grain nicks
        x, y = int(r.integers(0, w)), int(r.integers(0, h))
        put(img, x, y, hex2rgba("#41352a"))
    outline(img, "#241c12", 160)
    upscale_save(name, img, "decor", True, False, prompt, desc)

def gen_boulder(name, seed, prompt, desc):
    w, h = 22, 17
    img = canvas(w, h)
    r = np.random.default_rng(seed)
    v = fbm(w, h, 3, 2, seed)
    for y in range(h):
        for x in range(w):
            dx, dy = (x - w/2 + .5) / (w/2), (y - h/2 + .5) / (h/2)
            if dx*dx + dy*dy*1.3 <= 1 + (v[y, x] - .5) * .35:
                t = .62 - dy * .3 - dx * .14 + (v[y, x] - .5) * .4
                ramp = ["#3b4148", "#4c545d", "#5d6770", "#707b85"]
                img[y, x] = hex2rgba(ramp[int(max(0, min(1, t)) * 3 + .5)])
    cracks(img, 2, "#2b3036", "#7e8a94", seed + 2)
    for _ in range(3):
        x, y = int(r.integers(3, w-3)), int(r.integers(1, 4))
        put(img, x, y, hex2rgba("#558a3b"))
    outline(img, "#1a1d22")
    upscale_save(name, img, "decor", True, False, prompt, desc)

def gen_cairn(name, seed, prompt, desc):
    w, h = 16, 18
    img = canvas(w, h)
    r = np.random.default_rng(seed)
    ramp = ["#5a3328", "#6e4030", "#824e38", "#965c40"]
    yb = h - 1
    for sw in (12, 9, 6, 4):           # stacked stones, biggest first
        sh = max(2, sw // 3 + 1)
        x0 = (w - sw) // 2 + int(r.integers(-1, 2))
        for yy in range(sh):
            for xx in range(sw - abs(yy - sh // 2)):
                t = .7 - yy / sh * .4 + (r.random() - .5) * .25
                put(img, x0 + xx + abs(yy - sh // 2) // 2, yb - yy,
                    hex2rgba(ramp[int(max(0, min(1, t)) * 3 + .5)]))
        yb -= sh
    outline(img, "#2c1812")
    upscale_save(name, img, "decor", True, False, prompt, desc)

def gen_shelf_fungi(name, seed, prompt, desc):
    w, h = 14, 18
    img = canvas(w, h)
    r = np.random.default_rng(seed)
    for k, yy in enumerate((3, 9, 14)):
        sw = int(r.integers(7, 11))
        for y in range(3):
            for x in range(sw - y * 2):
                t = .8 - y * .3
                c = lerp_c(hex2rgba("#2a8a7e"), hex2rgba("#aef5ea"), t * (0.5 + 0.5 * (x / max(1, sw))))
                put(img, x, yy + y, c)
        put(img, sw - 2, yy, hex2rgba("#e8e2c8"))
    outline(img, "#10201e", 200)
    upscale_save(name, img, "decor", True, False, prompt, desc)

def gen_flowers_patch(name, seed, prompt, desc):
    w, h = 22, 11
    img = canvas(w, h)
    r = np.random.default_rng(seed)
    for x in range(1, w - 1):          # grass blades
        if r.random() < .75:
            bh = int(r.integers(2, 6))
            for y in range(bh):
                put(img, x, h - 1 - y, hex2rgba("#558a3b" if y < bh - 1 else "#7ab35a"))
    for _ in range(4):                 # flowers
        x = int(r.integers(2, w - 2)); y = h - int(r.integers(5, 8))
        c = ["#ffd87f", "#e0667e", "#e8e2c8", "#b07ae0"][int(r.integers(0, 4))]
        put(img, x, y, hex2rgba(c)); put(img, x + 1, y, hex2rgba(c))
        put(img, x, y + 1, hex2rgba(c)); put(img, x + 1, y + 1, hex2rgba("#fff6c4"))
        put(img, x, y + 2, hex2rgba("#3f6b2e"))
    upscale_save(name, img, "decor", True, False, prompt, desc)

def gen_bush(name, seed, prompt, desc):
    w, h = 24, 15
    img = canvas(w, h)
    v = fbm(w, h, 3, 2, seed)
    r = np.random.default_rng(seed)
    for y in range(h):
        for x in range(w):
            dx, dy = (x - w/2 + .5) / (w/2), (y - h + 2) / h
            if dx*dx + dy*dy*1.6 <= 1 + (v[y, x] - .5) * .5:
                t = .7 - (y / h) * .45 + (v[y, x] - .5) * .5
                ramp = ["#274d22", "#3f6b2e", "#558a3b", "#7ab35a"]
                img[y, x] = hex2rgba(ramp[int(max(0, min(1, t)) * 3 + .5)])
    for _ in range(4):
        x, y = int(r.integers(3, w - 3)), int(r.integers(2, h - 4))
        if img[y, x, 3]: put(img, x, y, hex2rgba("#e0667e"))
    outline(img, "#14240f", 170)
    upscale_save(name, img, "decor", True, False, prompt, desc)

def gen_great_mushroom(name, seed, prompt, desc):
    w, h = 48, 58
    img = canvas(w, h)
    r = np.random.default_rng(seed)
    v = fbm(w, h, 4, 2, seed)
    capH = 26
    for y in range(capH):              # huge domed cap
        t = y / capH
        half = int((w / 2 - 2) * math.sqrt(max(0.05, t)))
        for x in range(w // 2 - half, w // 2 + half + 1):
            sh = .78 - t * .35 - abs(x - w/2) / w * .5 + (v[y, x] - .5) * .25
            ramp = ["#1f6159", "#2a8a7e", "#3fbfae", "#74e0d2"]
            img[y, x] = hex2rgba(ramp[int(max(0, min(1, sh)) * 3 + .5)])
    for _ in range(10):                # pale spots
        x, y = int(r.integers(6, w - 6)), int(r.integers(4, capH - 3))
        if img[y, x, 3]:
            for (dx, dy) in [(0,0),(1,0),(0,1),(1,1)]:
                put(img, x+dx, y+dy, hex2rgba("#aef5ea"))
    for x in range(w // 2 - 20, w // 2 + 21):     # gills under rim
        if 0 <= x < w and img[capH - 1, x, 3]:
            put(img, x, capH, hex2rgba("#16453f" if x % 2 else "#1f6159"))
    for y in range(capH + 1, h):       # thick stem
        tt = (y - capH) / (h - capH)
        half = int(5 + tt * 3)
        for x in range(w // 2 - half, w // 2 + half + 1):
            sh = .72 - abs(x - w/2) / (half + 1) * .45 + (v[y, x] - .5) * .2
            ramp = ["#9a937c", "#c4bda0", "#e8e2c8"]
            img[y, x] = hex2rgba(ramp[int(max(0, min(1, sh)) * 2 + .5)])
    outline(img, "#0e2a26")
    upscale_save(name, img, "decor", True, False, prompt, desc)

# ---------------------------------------------------------------- UI
def gen_panel(name, prompt, desc):
    s = 48
    img = canvas(s, s)
    v = fbm(s, s, 3, 2, 808)
    ramp_fill(img, v, ["#2b2018", "#33271d", "#3b2d22"], 0.06)
    wood = ["#6b4226", "#7e5128", "#8a5a33"]
    for i in range(s):
        for b in range(5):
            for (x, y) in ((i, b), (i, s - 1 - b), (b, i), (s - 1 - b, i)):
                img[y, x] = hex2rgba(wood[(b + (x + y) % 2) % 3])
    for i in range(s):  # carved inner edge
        for (x, y) in ((i, 5), (i, s - 6), (5, i), (s - 6, i)):
            img[y, x] = hex2rgba("#1a1208")
    for (x, y) in ((2, 2), (s - 4, 2), (2, s - 4), (s - 4, s - 4)):  # corner studs
        for dx in range(2):
            for dy in range(2): img[y + dy, x + dx] = hex2rgba("#caa958")
        put(img, x, y, hex2rgba("#ffd87f"))
    upscale_save(name, img, "ui", False, False, prompt, desc)

def stone_disc(s, seed):
    img = canvas(s, s)
    r = np.random.default_rng(seed)
    c = s / 2 - .5
    v = fbm(s, s, 3, 2, seed)
    for y in range(s):
        for x in range(s):
            d = math.hypot(x - c, y - c)
            if d <= c:
                t = 0.55 + (v[y, x] - .5) * .3 - (y - c) / s * .3
                ramp = ["#4a4640", "#5d5851", "#6f6962", "#827b73"]
                img[y, x] = hex2rgba(ramp[int(max(0, min(1, t)) * 3 + .5)])
                if c - 1.6 < d: img[y, x] = hex2rgba("#33302b")
                elif c - 3 < d <= c - 1.6 and y < c: img[y, x] = hex2rgba("#8f877e")
    outline(img, "#16130f")
    return img

def gen_button(name, glyph, seed, prompt, desc):
    s = 30
    img = stone_disc(s, seed)
    gold, dark = hex2rgba("#ffd87f"), hex2rgba("#2b2014")
    if glyph == "pick":
        for i in range(12):
            put(img, 8 + i, 21 - i, dark)
            put(img, 9 + i, 21 - i, gold)
        for i in range(9):
            put(img, 11 + i, 8 + (i * i) // 9, gold)
            put(img, 11 + i, 9 + (i * i) // 9, dark)
    elif glyph == "up":
        for i in range(7):
            for x in range(15 - i, 16 + i): put(img, x, 9 + i, gold if i < 6 else dark)
        for y in range(16, 22):
            for x in range(13, 18): put(img, x, y, gold if x in (14, 15, 16) else dark)
    elif glyph == "hand":
        # four-point sparkle/star glyph
        cx, cy = 15, 14
        for i in range(-6, 7):
            t = 6 - abs(i)
            for ww in range(-(t // 3), t // 3 + 1):
                put(img, cx + i, cy + ww, gold if abs(ww) < max(1, t // 3) else dark)
                put(img, cx + ww, cy + i, gold if abs(ww) < max(1, t // 3) else dark)
        put(img, cx, cy, hex2rgba("#fff6c4"))
        put(img, cx - 1, cy - 1, hex2rgba("#fff6c4"))
    upscale_save(name, img, "ui", True, False, prompt, desc)

def gen_joystick(prompt_base):
    s = 44
    img = canvas(s, s)
    c = s / 2 - .5
    v = fbm(s, s, 3, 2, 909)
    for y in range(s):
        for x in range(s):
            d = math.hypot(x - c, y - c)
            if c - 7 <= d <= c:
                t = 0.55 + (v[y, x] - .5) * .35 - (y - c) / s * .25
                ramp = ["#4a4640", "#5d5851", "#6f6962", "#827b73"]
                img[y, x] = hex2rgba(ramp[int(max(0, min(1, t)) * 3 + .5)])
    for (dx, dy) in ((0, -1), (0, 1), (-1, 0), (1, 0)):  # notches
        x, y = int(c + dx * (c - 2.5)), int(c + dy * (c - 2.5))
        for ddx in range(-1, 2):
            for ddy in range(-1, 2): put(img, x + ddx, y + ddy, hex2rgba("#ffd87f"))
    outline(img, "#16130f", 200)
    upscale_save("joystick_base", img, "ui", True, False,
                 prompt_base + " A carved stone ring pad with four small golden direction notches, seen top-down.",
                 "Virtual joystick base ring (touch controls)")
    s2 = 22
    knob = canvas(s2, s2)
    c2 = s2 / 2 - .5
    v2 = fbm(s2, s2, 2, 2, 910)
    for y in range(s2):
        for x in range(s2):
            d = math.hypot(x - c2, y - c2)
            if d <= c2:
                t = 0.6 + (v2[y, x] - .5) * .3 - (y - c2) / s2 * .5
                ramp = ["#523722", "#6b4226", "#8a5a33", "#a06a3a"]
                knob[y, x] = hex2rgba(ramp[int(max(0, min(1, t)) * 3 + .5)])
    put(knob, int(c2 - 2), int(c2 - 3), hex2rgba("#c9905a"))
    put(knob, int(c2 - 3), int(c2 - 2), hex2rgba("#c9905a"))
    outline(knob, "#16130f")
    upscale_save("joystick_thumb", knob, "ui", True, False,
                 prompt_base + " A round polished wooden knob with visible grain and a soft top-left highlight, top-down.",
                 "Virtual joystick thumb knob (touch controls)")

# ---------------------------------------------------------------- backgrounds
def gen_bg(name, kind, prompt, desc):
    w, h = 480, 270
    img = canvas(w, h)
    if kind == "sky":
        top = hex2rgba("#2e3f66"); midc = hex2rgba("#d98a6e"); bot = hex2rgba("#ffd9a0")
        for y in range(h):
            t = y / (h - 1)
            c = lerp_c(top, midc, min(1, t * 1.6)) if t < .62 else lerp_c(midc, bot, (t - .62) / .38)
            img[y, :, :3] = c[:3]; img[y, :, 3] = 255
        cl = fbm(w, h, 5, 3, 31, True, False)
        m = (cl > 0.58) & (np.arange(h)[:, None] < h * .7)
        img[..., :3][m] = np.minimum(255, img[..., :3][m].astype(int) + 38).astype(np.uint8)
        hills = vnoise(w, 4, 6, 77, True, False)[0]
        hl = (h * .78 + hills * h * .14).astype(int)
        for x in range(w):
            img[hl[x]:, x, :3] = hex2rgba("#4e5a3a")[:3]
            img[hl[x] + 8:, x, :3] = hex2rgba("#3a4430")[:3]
        sun_x, sun_y, rr = int(w * .72), int(h * .30), 70
        ys, xs = np.ogrid[:h, :w]
        dd = np.sqrt((xs - sun_x) ** 2 + (ys - sun_y) ** 2)
        glow = np.clip(1 - dd / rr, 0, 1) ** 2 * 90
        img[..., :3] = np.minimum(255, img[..., :3] + glow[..., None]).astype(np.uint8)
    else:
        n = fbm(w, h, {"far": 4, "mid": 6, "near": 5}[kind], 4, {"far": 41, "mid": 42, "near": 43}[kind], True, False)
        if kind == "far":
            for y in range(h):
                t = y / h
                img[y, :, :3] = lerp_c(hex2rgba("#382a20"), hex2rgba("#1a120c"), t)[:3]
            img[..., 3] = 255
            m = n > 0.55
            img[..., :3][m] = np.array(hex2rgba("#46352a")[:3])
            m2 = n > 0.68
            img[..., :3][m2] = np.array(hex2rgba("#544130")[:3])
            r = np.random.default_rng(5)
            for _ in range(60):  # faint distant crystals
                x, y = int(r.integers(0, w)), int(r.integers(h // 4, h))
                img[y, x, :3] = np.minimum(255, img[y, x, :3].astype(int) + 60).astype(np.uint8)
        else:
            top1d = vnoise(w, 4, {"mid": 8, "near": 5}[kind], 99 if kind == "mid" else 98, True, False)[0]
            bot1d = vnoise(w, 4, {"mid": 9, "near": 6}[kind], 199 if kind == "mid" else 198, True, False)[0]
            col = hex2rgba("#1a1210" if kind == "mid" else "#0c0806")
            tl = (top1d * h * (.42 if kind == "mid" else .3)).astype(int)
            bl = (h - bot1d * h * (.5 if kind == "mid" else .36)).astype(int)
            for x in range(w):
                img[:tl[x], x] = col
                img[bl[x]:, x] = col
                if n[min(tl[x], h - 1), x] > .5: img[:min(tl[x] + 4, h), x] = col
                # occasional full column
                if kind == "near" and n[h // 2, x] > 0.72:
                    img[:, x] = col
            # soft edge: 1px半透明
            a = img[..., 3].copy()
            pad = np.pad(a > 0, 1)
            edge = (a > 0) & ~(pad[:-2, 1:-1] & pad[2:, 1:-1] & pad[1:-1, :-2] & pad[1:-1, 2:])
            img[edge, 3] = 160
    pil = Image.fromarray(img, "RGBA").resize((w * 2, h * 2), Image.NEAREST)
    pil.save(os.path.join(ASSETS, name + ".png"))
    MANIFEST[name] = {"file": name + ".png", "w": w * 2, "h": h * 2, "native": [w, h],
                      "category": "background", "transparent": kind not in ("sky", "far"),
                      "tiling": True, "genSize": "1536x1024", "desc": desc, "prompt": prompt}
    PROMPT_ORDER.append(name)

# ---------------------------------------------------------------- prompts
PREAMBLE = (
    "Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, "
    "warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette "
    "(amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable "
    "silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than "
    "black outlines, whimsical calm mood like a beloved children's book about a tiny miner, "
    "high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text."
)

def tile_prompt(material):
    return (f"A seamless square texture tile of {material}, viewed flat-on. Must tile perfectly on all "
            "four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).")

def sprite_prompt(subject):
    return (f"{subject} Single centered object on a plain flat light-grey background for easy cut-out, "
            "no cast shadow on the ground, no border, object fills ~80% of the frame.")

# ---------------------------------------------------------------- build all
def main():
    SD = sprites_data.SPRITES
    render_string_sprite("miner", SD["miner"], "character",
        sprite_prompt("A tiny cheerful miner character seen from the side facing right: round amber hard-hat with a small glowing head-lamp, warm beige face with rosy cheek and a chestnut beard, teal canvas jacket with a leather satchel strap, brown trousers and sturdy dark boots."),
        "Player character (single pose; the game animates by bobbing/tilting/squash)")
    render_string_sprite("pickaxe", SD["pickaxe"], "character",
        sprite_prompt("A sturdy miner's pickaxe held diagonally: curved polished steel head with bright top highlight, worn oak handle."),
        "Pickaxe, drawn in the miner's hands and swung by rotation")
    render_string_sprite("lantern", SD["lantern"], "prop",
        sprite_prompt("A small brass camp lantern with a warm amber glass globe glowing softly, wire handle on top."),
        "Lantern prop (also used at rest spots)")
    render_string_sprite("campfire", SD["campfire"], "prop",
        sprite_prompt("A cozy little campfire: ring of grey stones, crossed oak logs, lively amber-yellow flame with a bright core and a few rising embers."),
        "Campfire rest spot")
    render_string_sprite("minecart", SD["minecart"], "prop",
        sprite_prompt("An old wooden mine cart with iron rim and two iron wheels, heaped with colourful raw gems spilling over the top."),
        "Mine-cart hub prop / deposit point")
    render_string_sprite("tent", SD["tent"], "prop",
        sprite_prompt("A small terracotta canvas camping tent with a dark inviting entrance and a wooden ridge pole."),
        "Surface camp tent (shop)")
    render_string_sprite("crate", SD["crate"], "prop",
        sprite_prompt("A small worn wooden supply crate with cross planks and pale wood highlights."),
        "Camp decoration crate")
    render_string_sprite("geode_closed", SD["geode_closed"], "pickup",
        sprite_prompt("A round lumpy grey geode stone, unbroken, with subtle mineral banding."),
        "Closed geode pickup (cracks open when collected)")
    render_string_sprite("geode_open", SD["geode_open"], "pickup",
        sprite_prompt("A cracked-open geode half, grey stone shell revealing sparkling violet amethyst teeth inside."),
        "Open geode (journal & pop effect)")
    render_string_sprite("fossil_ammonite", SD["fossil_ammonite"], "pickup",
        sprite_prompt("A sandy stone slab with a beautifully preserved spiral ammonite fossil imprint in cream tones."),
        "Ammonite fossil curiosity")
    render_string_sprite("fossil_fern", SD["fossil_fern"], "pickup",
        sprite_prompt("A grey-green stone slab with a delicate fossilized fern frond imprint."),
        "Fern fossil curiosity")
    render_string_sprite("fossil_fish", SD["fossil_fish"], "pickup",
        sprite_prompt("A wide stone slab with a small fossilized fish skeleton, fine cream bones on warm grey."),
        "Fish fossil curiosity")
    render_string_sprite("mushroom_glow_big", SD["mushroom_glow_big"], "decor",
        sprite_prompt("A tall bioluminescent teal mushroom with a softly glowing aqua cap, pale spotted top and cream stem."),
        "Large glowing mushroom (emits light)")
    render_string_sprite("mushroom_glow_small", SD["mushroom_glow_small"], "decor",
        sprite_prompt("A tiny bioluminescent teal mushroom with a glowing cap and cream stem."),
        "Small glowing mushroom (emits light)")
    render_string_sprite("icon_bag", SD["icon_bag"], "ui",
        sprite_prompt("A tiny leather satchel icon, drawstring open showing a golden glow inside, crisp game-icon styling."),
        "HUD icon: bag capacity")
    render_string_sprite("icon_energy", SD["icon_energy"], "ui",
        sprite_prompt("A tiny warm golden lightning-bolt energy icon with a soft cream highlight, crisp game-icon styling."),
        "HUD icon: energy")
    render_string_sprite("icon_journal", SD["icon_journal"], "ui",
        sprite_prompt("A tiny leather-bound journal icon, russet cover, cream pages, small golden gem inlay, crisp game-icon styling."),
        "HUD icon: collection journal")

    # gems + veins
    gem_names = {
        "gem_amber": "a polished teardrop of warm honey amber",
        "gem_quartz": "a soft rose-white quartz crystal point",
        "gem_amethyst": "a violet amethyst kite-cut crystal",
        "gem_emerald": "a deep green emerald-cut emerald",
        "gem_sapphire": "a round cornflower-blue sapphire cabochon",
        "gem_ruby": "a brilliant-cut crimson ruby",
        "gem_diamond": "a brilliant-cut icy white diamond",
    }
    for i, (name, gd) in enumerate(GEMS.items()):
        img = draw_gem(22, gd[0], gd[1], gd[2], gd[3], gd[4], 100 + i)
        upscale_save(name, img, "pickup", True, False,
            sprite_prompt(f"A faceted gemstone: {gem_names[name]}, glowing softly from within, bright specular sparkles, painterly facets."),
            f"Collectible gem: {name.split('_')[1]}")
        gen_vein("vein_" + name.split("_")[1], gd, 300 + i,
            sprite_prompt(f"A cluster of 3-4 small raw {name.split('_')[1]} crystal shards embedded in dark rock pockets, glowing softly, transparent around the cluster."),
            f"Embedded {name.split('_')[1]} vein overlay drawn on rock tiles")

    # tiles
    gen_tile("tile_dirt", ["#4e3320", "#5e4128", "#6e4c30", "#7d5938", "#8a6440"], 11,
             pebble=("#7a5230", "#9a7048", "#3e2817"), prompt=tile_prompt("warm amber packed earth with small embedded pebbles and faint root threads"), desc="Soft dirt tile (easy to dig)")
    gen_tile("tile_dirt2", ["#4a3020", "#5a3e26", "#6a482e", "#795636", "#86603c"], 12,
             pebble=("#7a5230", "#9a7048", "#3e2817"), prompt=tile_prompt("warm amber packed earth, slightly darker variant with scattered pebbles"), desc="Soft dirt tile variant")
    gen_tile("tile_stone", ["#3b4148", "#4c545d", "#5d6770", "#6e7983", "#7e8a94"], 13,
             crack=("#2b3036", "#8a96a0"), prompt=tile_prompt("cool blue-grey cave stone with thin cracks and chipped facets"), desc="Stone tile (medium hardness)")
    gen_tile("tile_stone2", ["#384047", "#48515a", "#59636c", "#69747e", "#79858f"], 14,
             crack=("#2b3036", "#8a96a0"), prompt=tile_prompt("cool blue-grey cave stone variant with mineral flecks"), desc="Stone tile variant")
    gen_tile("tile_hardstone", ["#23262e", "#2f3340", "#3b4052", "#484e63", "#555c74"], 15,
             crack=("#171a20", "#5f6880"), glint="#9fb4e8", freq=2,
             prompt=tile_prompt("dense dark slate-blue granite with angular faces and tiny pale glints"), desc="Hard stone (needs upgraded pickaxe)")
    gen_grass_tile("tile_grass", ["#4e3320", "#5e4128", "#6e4c30", "#7d5938", "#8a6440"], 16,
             prompt=tile_prompt("meadow surface: lush mossy green grass blades with tiny wildflowers on top third, warm earth below"), desc="Surface grass-topped earth")
    gen_tile("tile_crystal", ["#2a2040", "#3a2c58", "#4a3870", "#5a4488", "#6a50a0"], 17,
             glint="#c79df0", crack=("#1e1730", "#8a6fc0"),
             prompt=tile_prompt("deep violet crystal-bearing rock with embedded angular amethyst glints"), desc="Crystal cavern rock")
    gen_tile("tile_mushroom", ["#2e3328", "#3a4232", "#46523c", "#525f46", "#5e6c50"], 18,
             moss=("#3fbfae", "#2a8a7e"), pebble=("#5e6c50", "#748464", "#232a1e"),
             prompt=tile_prompt("dark mossy loam flecked with teal bioluminescent moss patches"), desc="Mushroom hollow soil")
    gen_brick_tile("tile_ruins", "#4e3f1e", ["#6e5a30", "#86703a", "#9c8344", "#b0954e"], 19, "#d4b86a",
             prompt=tile_prompt("ancient golden sandstone bricks with worn mortar lines, chips and warm highlights"), desc="Ancient ruins brick")
    gen_tile("tile_spring", ["#5a3328", "#6e4030", "#824e38", "#965c40", "#a86a48"], 20,
             crack=("#46261e", "#b87a58"), glint="#e8c8a0",
             prompt=tile_prompt("smooth warm terracotta hot-spring rock with pale mineral veins"), desc="Hot-spring terracotta rock")

    # backdrops (cave wall behind dug-out space)
    bk = [("backdrop_dirt",  ["#2a1c12", "#332316", "#3a2818"], "warm dark earth cave wall, very dim"),
          ("backdrop_stone", ["#20242a", "#272c33", "#2e343c"], "dim blue-grey stone cave wall"),
          ("backdrop_crystal", ["#1c1530", "#241c3e", "#2c224c"], "dim violet crystal cave wall with faint sparkle"),
          ("backdrop_mushroom", ["#1c2420", "#222c26", "#28342c"], "dim mossy teal-green cave wall"),
          ("backdrop_ruins", ["#332a16", "#3c321c", "#453a22"], "dim golden sandstone wall with faint brick shadows"),
          ("backdrop_spring", ["#33201a", "#3c2620", "#452c26"], "dim warm terracotta cave wall with steam stains")]
    for i, (nm, ramp, d) in enumerate(bk):
        img = canvas(T, T)
        v = fbm(T, T, 3, 3, 500 + i)
        v = (v - v.min()) / (np.ptp(v) + 1e-6)
        ramp_fill(img, v, ramp, 0.08)
        if nm == "backdrop_ruins":
            for row in range(4):
                img[row * 8, :] = hex2rgba("#241c08")
        if nm == "backdrop_crystal":
            r2 = np.random.default_rng(600 + i)
            for _ in range(5):
                x, y = int(r2.integers(0, T)), int(r2.integers(0, T))
                put(img, x, y, hex2rgba("#564080"))
        upscale_save(nm, img, "tile", False, True, tile_prompt(d), f"Backdrop wall: {d}")

    # decor
    gen_cluster("crystal_cluster_violet", "#4a2580", "#8a54c0", "#c79df0", "#f0e2ff", 700,
        sprite_prompt("A cluster of four violet amethyst crystal shards growing from a small dark rock base, glowing softly."),
        "Violet crystal cluster (emits light)")
    gen_cluster("crystal_cluster_teal", "#0e5a5a", "#2c9c9c", "#6fd9d9", "#d8ffff", 701,
        sprite_prompt("A cluster of four teal aquamarine crystal shards growing from a small dark rock base, glowing softly."),
        "Teal crystal cluster (emits light)")
    gen_stalactite("stalactite", False, 702,
        sprite_prompt("A tapering limestone stalactite hanging point-down with a single glistening water drip at the tip."),
        "Hanging stalactite")
    gen_stalactite("stalagmite", True, 703,
        sprite_prompt("A tapering limestone stalagmite rising point-up from the cave floor, banded mineral texture."),
        "Floor stalagmite")
    gen_strands("roots", 30, 20, 8, ["#6b4226", "#8a5a33", "#523722"], leaf=None, seed=704,
        prompt=sprite_prompt("A tangle of slender tree roots hanging from a cave ceiling, earthy browns with fine root hairs."),
        desc="Hanging roots (shallow depths)")
    gen_strands("vine", 12, 34, 2, ["#3f6b2e", "#558a3b"], leaf=("#558a3b", "#7ab35a"), seed=705,
        prompt=sprite_prompt("A slender hanging cave vine with small paired leaves, moss green with light tips."),
        desc="Hanging vine")
    gen_fern("fern", 706,
        sprite_prompt("A small arching cave fern with five fronds, moss green with pale highlights."),
        "Cave fern tuft")
    gen_flower("flower_glow", 707,
        sprite_prompt("A tiny magical cave flower with pale aqua petals and a softly glowing cream core on a thin green stem."),
        "Glowing cave flower (emits faint light)")
    gen_tree("tree_pine", 708,
        sprite_prompt("A small stylised pine tree with four tiers of layered moss-green foliage and a short brown trunk."),
        "Surface pine tree")
    gen_pillar("ruins_pillar", 709,
        sprite_prompt("A broken ancient sandstone column with a carved capital, cracked golden stone and small moss tufts."),
        "Ruins pillar decoration")

    # scenery & landmark props
    render_string_sprite("statue_owl", SD["statue_owl"], "decor",
        sprite_prompt("A weathered stone owl statue on a square plinth, carved round eyes, small moss tufts, warm grey stone."),
        "Owl shrine statue (Gilded Ruins landmark)")
    render_string_sprite("urn", SD["urn"], "decor",
        sprite_prompt("A small ancient terracotta amphora with two handles and a chipped rim."),
        "Ruins urn decoration")
    render_string_sprite("sunken_boat", SD["sunken_boat"], "decor",
        sprite_prompt("An old sunken wooden rowboat resting on a lake bed, broken ribs, waterlogged planks, faint teal algae."),
        "Sunken rowboat (Still Lake landmark)")
    render_string_sprite("cart_wreck", SD["cart_wreck"], "decor",
        sprite_prompt("A tipped-over broken wooden mine cart, one iron wheel detached, splintered planks."),
        "Wrecked cart (Old Workings landmark)")
    for nm, subject, dsc in [
        ("relic_compass", "an antique brass pocket compass with a cream face and red needle", "Relic: the Wayfarer's Compass"),
        ("relic_locket", "a small golden heart locket on a fine chain, rose-tinted picture inside", "Relic: the Miner's Locket"),
        ("relic_coin", "an ancient gold coin stamped with a worn owl glyph", "Relic: an ancient coin"),
        ("relic_idol", "a tiny carved jade dragon idol with a golden eye", "Relic: the jade dragon idol"),
        ("relic_bottle", "a sealed glass bottle with a rolled paper message inside, corked", "Relic: message in a bottle"),
    ]:
        render_string_sprite(nm, SD[nm], "pickup", sprite_prompt(f"A treasure curio: {subject}."), dsc)
    render_string_sprite("glowcap_jelly", SD["glowcap_jelly"], "pickup",
        sprite_prompt("A small corked glass jar of luminous golden glowcap jelly, soft inner light, a pale shine on the glass."),
        "Glowcap Jelly — eaten on pickup, grants a 25s Glimmer Rush (fast, effortless digging)")
    render_string_sprite("moth", SD["moth"], "critter",
        sprite_prompt("A small cream cave moth with spread patterned wings, seen from above."),
        "Cave moth (flutters near glowing flora)")
    render_string_sprite("snail", SD["snail"], "critter",
        sprite_prompt("A little amber-shelled snail with a cream body, side view."),
        "Cave snail")
    render_string_sprite("bat", SD["bat"], "critter",
        sprite_prompt("A tiny round fruit bat with spread dusk-purple wings and amber eyes, front view, friendly."),
        "Cave bat (flutters away when approached)")
    render_string_sprite("fish", SD["fish"], "critter",
        sprite_prompt("A small plump teal cave fish with pale belly, side view."),
        "Lake fish")
    render_string_sprite("bird", SD["bird"], "critter",
        sprite_prompt("A small round robin-like bird with a rust-red breast, side view, perched."),
        "Surface bird (flies off when approached)")
    render_string_sprite("spore_plant", SD["spore_plant"], "decor",
        sprite_prompt("A cluster of teal puffball spore pods on thin green stems, softly glowing."),
        "Spore puffballs (mushroom hollows)")
    render_string_sprite("reeds", SD["reeds"], "decor",
        sprite_prompt("A tuft of slender dark-teal underwater reeds swaying gently."),
        "Lake reeds")
    render_string_sprite("spring_lily", SD["spring_lily"], "decor",
        sprite_prompt("A floating green lily pad with a single small pink-cream blossom, top-down three-quarter view."),
        "Hot-spring lily pad")
    gen_mural("mural_miners", 901, 0,
        sprite_prompt("A cave-painting panel on lighter rock: ochre stick-figure miners beside violet and green gem glyphs and a spiral, prehistoric style."),
        "Cave mural: the miners (Painted Dark landmark)")
    gen_mural("mural_beasts", 902, 1,
        sprite_prompt("A cave-painting panel on lighter rock: ochre long-bodied beasts, cream handprints and a spiral, prehistoric style."),
        "Cave mural: the beasts")
    gen_mural("mural_hands", 903, 2,
        sprite_prompt("A cave-painting panel on lighter rock: cream and ochre handprints, gem glyphs and a small miner figure, prehistoric style."),
        "Cave mural: the hands")
    gen_support_beam("support_beam", 904,
        sprite_prompt("An old timber mine support: two upright posts and a crossbeam of worn oak with dark joint pegs."),
        "Timber mine support (Old Workings landmark)")
    gen_boulder("boulder", 905,
        sprite_prompt("A rounded grey-blue boulder with thin cracks and a little moss on top."),
        "Scatter boulder")
    gen_cairn("cairn", 906,
        sprite_prompt("A small stacked stone cairn of four warm terracotta stones."),
        "Stone cairn (hot springs)")
    gen_shelf_fungi("shelf_fungi", 907,
        sprite_prompt("Three teal shelf-fungus brackets growing in a column from a cave wall, glowing rims."),
        "Wall shelf fungi")
    gen_flowers_patch("flowers_patch", 908,
        sprite_prompt("A small patch of meadow grass blades with four tiny wildflowers in gold, rose and violet."),
        "Surface wildflowers")
    gen_bush("bush", 909,
        sprite_prompt("A small rounded leafy shrub in layered moss greens with a few tiny rose berries."),
        "Surface bush")
    gen_great_mushroom("great_mushroom", 910,
        sprite_prompt("A towering ancient bioluminescent mushroom: huge glowing teal domed cap with pale spots and gills, thick cream stem."),
        "The Elder Cap (mushroom hollows landmark)")

    # UI
    gen_panel("ui_panel",
        sprite_prompt("A square wooden UI panel frame: carved oak border with golden corner studs around a dark leather center. Designed to be 9-sliced."),
        "9-slice panel for HUD/shop/journal (CSS border-image)")
    gen_button("btn_dig", "pick", 801,
        sprite_prompt("A round carved stone game button engraved with a golden pickaxe glyph, beveled rim, top-down."),
        "Touch button: dig")
    gen_button("btn_jump", "up", 802,
        sprite_prompt("A round carved stone game button engraved with a golden up-arrow glyph, beveled rim, top-down."),
        "Touch button: jump")
    gen_button("btn_action", "hand", 803,
        sprite_prompt("A round carved stone game button engraved with a golden open-hand glyph, beveled rim, top-down."),
        "Touch button: interact")
    gen_joystick(sprite_prompt(""))

    # backgrounds
    gen_bg("bg_sky", "sky",
        "A wide painterly dawn sky for a cozy mining village: deep indigo fading through rose to warm gold at the horizon, soft clouds, a gentle sun glow upper-right, distant mossy hills along the bottom. Must tile seamlessly left-to-right. Full-bleed.",
        "Surface sky parallax backdrop")
    gen_bg("bg_far", "far",
        "A very dark warm cavern wall seen far away: vast soft rock masses in deep umber and near-black, faint distant crystal glints. Low contrast, must tile seamlessly left-to-right. Full-bleed.",
        "Far cave parallax layer (tinted per biome in-game)")
    gen_bg("bg_mid", "mid",
        "Mid-distance cave silhouettes: dark rock formations, hanging stalactite fringe along the top and rising stalagmites along the bottom, transparent in the middle. Must tile seamlessly left-to-right. Transparent background between formations.",
        "Mid cave parallax layer (tinted per biome in-game)")
    gen_bg("bg_near", "near",
        "Foreground cave silhouettes: a few massive near-black rock columns and ceiling teeth, mostly transparent elsewhere. Must tile seamlessly left-to-right. Transparent background.",
        "Near cave parallax layer (tinted per biome in-game)")

    # ---- write manifest + prompts
    with open(os.path.join(ASSETS, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump({"version": 1, "generated": "2026-06-10", "styleTarget": "painterly",
                   "stylePreamble": PREAMBLE,
                   "sprites": {k: MANIFEST[k] for k in PROMPT_ORDER}}, f, indent=1)

    lines = ["# Glimmer Grotto — Painterly Asset Prompts (GPT Image 2)", "",
             "Generate each sprite with **GPT Image 2** at the listed *generation size*, then downscale",
             "to the *final size* and (where marked transparent) cut the object out from its plain",
             "background. Save over the placeholder file in `assets/` **with the exact same filename** —",
             "the game hot-swaps whatever exists there, no code changes needed.", "",
             "## Style preamble — prepend to EVERY prompt below", "", f"> {PREAMBLE}", ""]
    cats = {}
    for k in PROMPT_ORDER:
        cats.setdefault(MANIFEST[k]["category"], []).append(k)
    for cat in ["character", "pickup", "vein", "tile", "decor", "critter", "prop", "background", "ui"]:
        if cat not in cats: continue
        lines.append(f"## {cat.title()}s\n")
        for k in cats[cat]:
            e = MANIFEST[k]
            t = "transparent — cut out after generation" if e["transparent"] else "full-bleed (no cut-out)"
            tile = " · **must tile seamlessly**" if e["tiling"] else ""
            lines.append(f"### `{e['file']}`")
            lines.append(f"*{e['desc']}*  ")
            lines.append(f"Final size: **{e['w']}×{e['h']}** · Generate at: **{e['genSize']}** · {t}{tile}")
            lines.append("")
            lines.append(f"```\n{PREAMBLE} {e['prompt']}\n```")
            lines.append("")
    with open(os.path.join(ROOT, "ASSET_PROMPTS.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    # ---- contact sheet for review
    names = [n for n in PROMPT_ORDER if not n.startswith("bg_")]
    cell = 140; cols = 9
    rows_n = (len(names) + cols - 1) // cols
    sheet = Image.new("RGBA", (cols * cell, rows_n * cell), (24, 20, 28, 255))
    for i, n in enumerate(names):
        im = Image.open(os.path.join(ASSETS, n + ".png"))
        im.thumbnail((cell - 12, cell - 12), Image.NEAREST)
        x = (i % cols) * cell + (cell - im.width) // 2
        y = (i // cols) * cell + (cell - im.height) // 2
        sheet.alpha_composite(im, (x, y))
    sheet.save(os.path.join(HERE, "contact_sheet.png"))
    print(f"OK: {len(MANIFEST)} assets -> {ASSETS}")
    print("contact sheet -> tools/contact_sheet.png")

if __name__ == "__main__":
    main()
