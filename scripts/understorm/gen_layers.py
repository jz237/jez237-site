"""Understorm 2026: the middle-distance painted layer of each stage, and the painted hull texture.

Usage: python gen_layers.py [gen|encode|all] [--only s01,hull] [--force]
Each middle layer is painted by fal (FLUX 1.1 pro ultra) as a row of subjects on a flat chroma-key background
(green, or magenta where the subject itself is green), then keyed to transparency here, cropped to its
content and encoded as webp with alpha into games/2026-11-20/understorm/img/mid_<stage>.webp. The game slides
it across the lower part of the sky faster than the far painting, which is what gives the scene depth.
`hull` is a tiling painted-metal texture with stripes and stencils, used on enemy and boss hulls.
Raw PNGs go to D:/Projects/.tmp/understorm-img-raw (or IMG_RAW). The key comes from FAL_KEY and is never printed.
"""
import os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fal_image import generate

RAW = os.environ.get('IMG_RAW', 'D:/Projects/.tmp/understorm-img-raw')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'games', '2026-11-20', 'understorm', 'img')
KEYS = {'g': 'a perfectly flat uniform pure green chroma key background, green screen', 'm': 'a perfectly flat uniform pure magenta chroma key background, magenta screen'}
TAIL = ', seen in side view at middle distance, standing along the bottom of the frame with gaps between them, isolated on {key}, no sky, no clouds, no ground plane, no shadows on the background, no text, no border, full bleed, science fiction concept art, highly detailed'
MID = {  # stage: (key colour, subject)
    's01': ('g', 'A row of colossal rusted industrial refinery towers, storage tanks, gantries and cranes, weathered orange and brown metal with warm rim light'),
    's02': ('g', 'A row of tall eroded sandstone rock spires, hoodoos and narrow mesas, pale cream and khaki stone with soft shadows'),
    's03': ('g', 'A row of huge cargo cranes, container stacks and deck gantries of a giant freighter, dark slate metal with burnt orange light'),
    's04': ('m', 'A row of massive industrial pipe manifolds, cisterns, valve towers and spillways, wet teal and sea-green metal'),
    's05': ('g', 'A row of giant translucent crystal spires and glass coral growths glowing lavender, violet and cyan from within'),
    's06': ('m', 'A row of small floating islands of pale rock with trailing roots and vines, mint green and pale gold light'),
    's07': ('g', 'A row of colossal black iron furnaces, crucibles, chimneys and chain hoists with fierce orange molten glow in their openings'),
    's08': ('g', 'A row of very dark rock pillars and stalagmites with a few faint teal bioluminescent growths, almost black, navy shadows'),
    's09': ('g', 'A row of floating jagged storm rock shards and broken stone arches, steel blue and slate with pale gold edge light'),
    's10': ('m', 'A row of wrecked warship hull sections, broken masts and tangled aircraft wreckage, dark grey-green metal with dim red lamps'),
    's11': ('g', 'A row of twisted ribbed rock arches and spiral horns like the inside of a throat, crimson and deep magenta'),
    's12': ('g', 'A row of colossal dark metal machine ribs, rings and pylons with violet plasma glowing in their joints'),
}
WHITE_BG, FLOATING = {'s08'}, {'s06'}
HULL = ('Seamless tiling texture of a weathered painted starship hull seen straight on, flat orthographic view, gunmetal grey armour plates with panel seams and rivets, '
        'faded yellow and black hazard stripes, white stencilled numbers and warning triangles, an orange band, rust streaks, scratches and soot, evenly lit, no perspective, no shadows, highly detailed')


def rgb(path, w, h):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'scale={w}:{h}:flags=lanczos', '-pix_fmt', 'rgb24', '-f', 'rawvideo', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.uint8).reshape(h, w, 3).astype(np.float32) / 255


def encode_mid(name):
    src = os.path.join(RAW, 'mid_' + name + '.png')
    if not os.path.exists(src):
        return f'missing {name}'
    w, h = 2048, 878; a = rgb(src, w, h); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    if name in WHITE_BG:  # the model ignored the key colour and painted a dark subject on white
        k = np.minimum(np.minimum(r, g), b) - 0.7; out = a
    elif MID[name][0] == 'g':
        k = g - np.maximum(r, b); g2 = np.minimum(g, np.maximum(r, b) + 0.02); out = np.stack([r, g2, b], -1)       # how green; then take the green spill out
    else:
        k = np.minimum(r, b) - g; m = np.minimum(np.minimum(r, b), g + 0.02); out = np.stack([np.where(k > 0, m, r), g, np.where(k > 0, m, b)], -1)
    alpha = 1 - np.clip((k - 0.10) / 0.22, 0, 1)
    if name in FLOATING:  # drop the floor strip the model put under floating subjects
        cov = alpha.mean(axis=1); floor = np.where(cov > 0.9)[0]
        if len(floor): alpha[max(0, floor[0] - 6):] = 0
    rows = np.where(alpha.mean(axis=1) > 0.02)[0]
    if len(rows) < 20:
        return f'{name}: key failed'
    y0, y1 = max(0, rows[0] - 4), rows[-1] + 1
    alpha[y0:y0 + 3] *= 0  # no hard edge at the crop
    rgba = (np.concatenate([out, alpha[..., None]], -1)[y0:y1] * 255).clip(0, 255).astype(np.uint8)
    dst = os.path.join(OUT, f'mid_{name}.webp'); os.makedirs(OUT, exist_ok=True)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{w}x{y1 - y0}', '-i', '-', '-c:v', 'libwebp', '-q:v', '74', '-preset', 'picture', dst], input=rgba.tobytes())
    return f'{name} 2048x{y1 - y0} {os.path.getsize(dst) // 1024} KB cover {alpha[y0:y1].mean() * 100:.0f}%'


def encode_hull():
    src = os.path.join(RAW, 'hull.png')
    if not os.path.exists(src):
        return 'missing hull'
    dst = os.path.join(OUT, 'hull.webp')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-vf', 'scale=1024:1024:flags=lanczos', '-c:v', 'libwebp', '-q:v', '80', dst])
    return f'hull {os.path.getsize(dst) // 1024} KB'


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else 'all'
    only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
    force = '--force' in sys.argv
    names = [n for n in list(MID) + ['hull'] if not only or n in only]
    if mode in ('gen', 'all'):
        def one(n):
            out = os.path.join(RAW, ('hull' if n == 'hull' else 'mid_' + n) + '.png')
            if os.path.exists(out) and not force:
                return f'skip {n}'
            try:
                if n == 'hull':
                    return f'ok   hull {generate(HULL, out, "1:1")}'
                return f'ok   {n} {generate(MID[n][1] + TAIL.format(key=KEYS[MID[n][0]]), out, "21:9")}'
            except Exception as e:
                return f'FAIL {n} {str(e)[:200]}'
        with ThreadPoolExecutor(3) as ex:
            for line in ex.map(one, names):
                print(line, flush=True)
    if mode in ('encode', 'all'):
        for n in names:
            print(encode_hull() if n == 'hull' else encode_mid(n), flush=True)


main()
