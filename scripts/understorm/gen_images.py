"""Understorm 2026: paint the far backdrop of every stage with fal (FLUX 1.1 pro ultra), then crop and encode.

Usage: python gen_images.py [gen|encode|all] [--only s01,s07] [--force]
Raw PNGs (3136x1344) go to D:/Projects/.tmp/understorm-img-raw (or IMG_RAW); the game gets
games/2026-11-20/understorm/img/bg_<stage>.webp at 2048 px wide. The model often adds black letterbox bars, so
bars are detected and cropped before encoding. The key comes from FAL_KEY and is never printed or stored.
Each prompt describes only the distant scenery: the game draws its own ships, terrain and weather in front.
"""
import os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fal_image import generate

RAW = os.environ.get('IMG_RAW', 'D:/Projects/.tmp/understorm-img-raw')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'games', '2026-11-20', 'understorm', 'img')
TAIL = ('. Wide panoramic matte painting of distant scenery only: everything is far away and softened by atmospheric haze, even detail from left to right, '
        'no close foreground objects, no aircraft, no spacecraft, no people, no text, no logo, no border, no letterbox bars, full bleed image, light coming from the upper right with no visible sun disc, '
        'painterly cinematic science fiction concept art, highly detailed')
SCENES = {
    's01': 'Colossal rusted cloud refineries, skyhook pylons, storage tanks and gantry towers floating in the upper atmosphere of a gas giant at amber dawn, far towers fading into warm peach haze, deep teal-blue sky at the top, amber and gold near the horizon, violet-grey cloud shadows',
    's02': 'Towering canyon walls sculpted from dense pale cloud and floating sandstone mesas, layered misty ravines receding into fog, cream, khaki and soft grey with a pale blue-grey sky',
    's03': 'The vast flank of a derelict cargo hauler the size of a city drifting among clouds at sunset, rows of dark hull plating, cranes and container racks seen from far away, burnt orange sky, slate-blue shadows',
    's04': 'An immense industrial rain-harvesting works hanging under storm clouds, forests of pipes, cisterns, spillways and catwalks, sheets of heavy rain, sea-green and teal light, wet metal',
    's05': 'A floating reef of giant translucent crystal spires and glass coral glowing lavender and cyan from within, drifting shards, deep indigo and violet twilight sky',
    's06': 'Open sky above an endless sea of clouds, a migrating herd of enormous gentle whale-like sky creatures far in the distance, mint green and teal air with pale gold light on the cloud tops',
    's07': 'The interior of an infernal sky foundry, rivers and falls of molten metal, colossal furnaces, crucibles and chains in silhouette, dark red and black with fierce orange glow and smoke',
    's08': 'A pitch black abyss far below the clouds, barely visible colossal rock pillars and hanging roots, a few faint teal bioluminescent specks, almost entirely black and very dark navy',
    's09': 'The towering curved eye wall of a colossal hurricane seen from inside the eye, a vast cliff of spiralling storm cloud lit from within by lightning, steel blue and slate with pale gold edges',
    's10': 'A graveyard of wrecked warships and broken aircraft hulls drifting in dark green storm clouds, tangled wreckage silhouettes, dim red warning lights, murky green-grey air',
    's11': 'Looking along a colossal vortex tunnel of spiralling crimson and magenta storm cloud, ribbed swirling walls streaked with pink light, a darker centre',
    's12': 'The core of the storm: a colossal ancient machine heart of dark metal ribs and rings wrapped in violet plasma and arcs of teal lightning, purple and black clouds',
    's13': 'A serene clear dawn above a calm sea of soft clouds, wide blue sky fading to a peach and gold horizon, a few gentle whale-like sky creatures far away, peaceful and bright',
}


def crop_box(path):
    """Rows and columns of the picture that are not black bars, as (x, y, w, h) in source pixels."""
    w, h = 392, 168
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'scale={w}:{h},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.uint8).reshape(h, w).astype(np.float32)
    rows, cols = np.where(a.mean(axis=1) > 14)[0], np.where(a.mean(axis=0) > 14)[0]
    if len(rows) < h * 0.4 or len(cols) < w * 0.4:
        return None
    return cols[0] / w, (rows[0] + 1) / h, (cols[-1] - cols[0] + 1) / w, (rows[-1] - rows[0] - 1) / h


def encode(name):
    src = os.path.join(RAW, name + '.png')
    if not os.path.exists(src):
        return f'missing {name}'
    box = crop_box(src) or (0, 0, 1, 1)
    vf = f'crop=iw*{box[2]:.4f}:ih*{box[3]:.4f}:iw*{box[0]:.4f}:ih*{box[1]:.4f},scale=2048:-2:flags=lanczos'
    dst = os.path.join(OUT, f'bg_{name}.webp'); os.makedirs(OUT, exist_ok=True)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-vf', vf, '-c:v', 'libwebp', '-q:v', '80', '-preset', 'picture', dst])
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout.strip()
    return f'{name} {r} {os.path.getsize(dst) // 1024} KB crop y {box[1]:.2f}+{box[3]:.2f}'


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else 'all'
    only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
    force = '--force' in sys.argv
    names = [n for n in SCENES if not only or n in only]
    if mode in ('gen', 'all'):
        def one(n):
            out = os.path.join(RAW, n + '.png')
            if os.path.exists(out) and not force:
                return f'skip {n}'
            try:
                return f'ok   {n} {generate(SCENES[n] + TAIL, out, "21:9")}'
            except Exception as e:
                return f'FAIL {n} {str(e)[:200]}'
        with ThreadPoolExecutor(3) as ex:
            for line in ex.map(one, names):
                print(line, flush=True)
    if mode in ('encode', 'all'):
        for n in names:
            print(encode(n), flush=True)


main()
