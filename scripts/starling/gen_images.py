"""Starling 2026: generate the painted far backdrops with fal (FLUX 1.1 pro ultra) and encode them for the game.

Usage: python gen_images.py gen [--only name] [--force]    make the raw PNGs (D:/Projects/.tmp/starling-img-raw)
       python gen_images.py build                           crop and encode games/2026-11-21/starling/img/*.webp
The shared caller is scripts/understorm/fal_image.py; the key comes from FAL_KEY and is never printed or stored.
Every prompt describes an original scene. The model often adds black letterbox bars: `build` finds and removes
them, then keeps the part of each picture from TOP down to HORIZON (fractions of the bar-free height), because
the game lines the bottom edge of the picture up with its own sea line and draws the sea itself.
"""
import os, subprocess, sys
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'understorm'))
RAW = os.environ.get('IMG_RAW', 'D:/Projects/.tmp/starling-img-raw')
OUT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'games', '2026-11-21', 'starling', 'img'))
COMMON = ', no sun, no moon, no birds, no boats, no lighthouse, no buildings, no people, no text, full bleed, no letterbox, no border, soft painterly matte painting, atmospheric perspective, gentle contrast'
IMAGES = {
    # name: (prompt, seed, top, horizon, shipped file) — top/horizon are set by eye after looking at the raw picture
    'dusk': ('Very wide view of a calm open sea at dusk seen from just above the water, the horizon line low in the frame, a few small distant rocky sea stacks and low islands silhouetted on the horizon, towering layered cloud banks lit from below in orange, rose and magenta, deep violet and indigo sky above fading to dark blue at the top' + COMMON, 11, 0.0, 0.772, 'dusk.webp'),
    'night': ('Very wide view of a calm open sea on a clear night seen from just above the water, the horizon line low in the frame, a few small distant rocky sea stacks and low islands silhouetted on the horizon, scattered low cloud banks edged in silver light, deep navy and indigo sky with a faint band of the milky way and many stars, darkest at the top' + COMMON, 31, 0.0, 0.69, 'night.webp'),
    'dawn': ('Very wide view of a calm open sea at the first light of dawn seen from just above the water, the horizon line low in the frame, a few small distant rocky sea stacks and low islands silhouetted on the horizon, soft layered clouds glowing peach, gold and pale pink along the horizon, the sky rising through pale turquoise to soft blue at the top, gentle pastel light' + COMMON, 47, 0.0, 0.675, 'dawn.webp'),
    'roost': ('Very wide view of a dark open sea at nightfall under a gathering storm seen from just above the water, the horizon line low in the frame, a few small distant rocky sea stacks silhouetted on the horizon, heavy towering anvil clouds with ember-red and crimson underglow, a faint glow of far lightning inside the clouds, near-black indigo sky at the top' + COMMON, 23, 0.0, 0.72, 'roost.webp'),
}


def bars(path):
    """Rows of the picture that are not letterbox: returns (width, height, first row, last row + 1)."""
    info = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout.strip().split(',')
    w, h = int(info[0]), int(info[1])
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', 'scale=64:-1:flags=area,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
    g = np.frombuffer(raw, dtype=np.uint8).reshape(-1, 64).astype(np.float32); rows = np.where(g.max(axis=1) > 6)[0]  # a real bar is pure black right across
    k = h / g.shape[0]; return w, h, int(rows[0] * k) + 2, int((rows[-1] + 1) * k) - 2


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else ''
    only = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else None
    if mode == 'gen':
        from fal_image import generate
        for name, (prompt, seed, *_rest) in IMAGES.items():
            out = os.path.join(RAW, name + '.png')
            if (only and name not in only) or (os.path.exists(out) and '--force' not in sys.argv):
                print('skip', name); continue
            print('ok', name, generate(prompt, out, '21:9', seed), flush=True)
    elif mode == 'build':
        os.makedirs(OUT, exist_ok=True)
        for name, (_p, _s, top, hor, dst) in IMAGES.items():
            src = os.path.join(RAW, name + '.png')
            if not os.path.exists(src):
                print('missing', name); continue
            w, h, y0, y1 = bars(src); ch = y1 - y0; a, b = y0 + int(ch * top), y0 + int(ch * hor)
            out = os.path.join(OUT, dst)
            subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-vf', f'crop={w}:{b - a}:0:{a},scale=1792:-2:flags=lanczos', '-c:v', 'libwebp', '-q:v', '90', '-preset', 'picture', out], check=True)
            print(f'{dst}: bars removed {y0}..{y1} of {h}, kept rows {a}..{b}, {os.path.getsize(out) // 1024} KB')
    else:
        print(__doc__)


main()
