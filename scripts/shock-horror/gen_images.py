"""Shock Horror: generate the jump-scare faces and wall photographs with fal (FLUX). The key is read from the
FAL_KEY environment variable and never printed. Raw PNGs go to <work>/img-raw; process with ffmpeg into
games/2026-11-07/shock-horror/img/*.webp (see the bottom of this file).

Usage: python -I gen_images.py [--only name1,name2] [--force]
"""
import json, os, subprocess, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor

RAW = 'D:/Projects/.tmp/shock-horror-work/img-raw'
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'games', '2026-11-07', 'shock-horror', 'img')
KEY = os.environ.get('FAL_KEY', '')
assert len(KEY) > 20, 'no FAL_KEY'
MODEL = 'fal-ai/flux-pro/v1.1'

STYLE = ', extreme close-up horror movie still, lit from below by a single dim lantern, pitch black background, film grain, ultra detailed skin texture, photorealistic, 35mm, terrifying'
IMAGES = {
    # jump-scare faces (square, filling the frame)
    'f_woman':  'a pale dead woman with long wet black hair over half her face, hollow black eye sockets with tiny white pupils, mouth stretched open in a scream' + STYLE,
    'f_miner':  'a rotting dead coal miner from 1911 wearing a dented helmet with a broken lamp, grey cracked skin, milky white eyes, jaw hanging open screaming, coal dust' + STYLE,
    'f_ghoul':  'an emaciated grey ghoul with no lips, all teeth bared, sunken cheeks, bulging bloodshot eyes staring straight at the camera' + STYLE,
    'f_doll':   'a cracked antique porcelain doll face with black empty eyes, a crack running through its painted smile, cobwebs, dust' + STYLE,
    'f_drowned':'a bloated drowned corpse face, pale blue wrinkled skin, wet strands of hair, milky eyes wide open, water dripping, mouth gaping' + STYLE,
    'f_skull':  'a human skull with living bloodshot eyes still in its sockets, damp moss and roots, teeth chattering' + STYLE,
    'f_many':   'a monstrous face with too many eyes clustered across grey flesh and a round mouth of human teeth in rings' + STYLE,
    'f_stitch': 'an old foreman with his mouth sewn shut with thick black thread, bulging white eyes, blood at the stitches, coal dust' + STYLE,
    'f_hollow': 'a pale featureless figure whose face is smooth stretched skin with no eyes or nose, only a gaping black mouth tearing open in a scream' + STYLE,
    'f_burnt':  'a charred burnt face with glowing ember cracks in the skin and empty white eyes, smoke' + STYLE,
    # wall photographs (sepia, landscape)
    'p_shift':  'a faded 1911 sepia photograph of a group of twelve coal miners standing at a mine entrance holding lamps, their faces scratched out with a nail, old damaged print, stains',
    'p_family': 'a faded 1900s sepia portrait photograph of a mother and a little girl in Victorian dress, the mother has no face, old damaged print with water stains',
    'p_shaft':  'a faded 1911 sepia photograph looking down a dark mine shaft with a ladder, a pale figure is standing at the bottom looking up, old damaged print',
}
LANDSCAPE = {'p_shift', 'p_shaft'}


def gen(name, prompt, force):
    out = os.path.join(RAW, name + '.png')
    if os.path.exists(out) and not force:
        return f'skip {name}'
    body = {'prompt': prompt, 'image_size': 'landscape_4_3' if name in LANDSCAPE else 'square_hd', 'num_images': 1,
            'safety_tolerance': '5', 'output_format': 'png'}
    if name == 'p_family':
        body['image_size'] = 'portrait_4_3'
    req = urllib.request.Request('https://fal.run/' + MODEL, data=json.dumps(body).encode(), method='POST',
                                 headers={'Authorization': 'Key ' + KEY, 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            d = json.loads(r.read())
        url = d['images'][0]['url']
        os.makedirs(RAW, exist_ok=True)
        with urllib.request.urlopen(url, timeout=120) as r, open(out, 'wb') as f:
            f.write(r.read())
        return f'ok   {name} nsfw={d.get("has_nsfw_concepts")}'
    except Exception as e:
        return f'FAIL {name} {str(e)[:200]}'


if __name__ == '__main__':
    only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
    force = '--force' in sys.argv
    jobs = [(n, p) for n, p in IMAGES.items() if not only or n in only]
    with ThreadPoolExecutor(3) as ex:
        for line in ex.map(lambda j: gen(j[0], j[1], force), jobs):
            print(line, flush=True)
    # encode: faces 768 px webp, photos 640 px webp
    os.makedirs(OUT, exist_ok=True)
    for n in IMAGES:
        src = os.path.join(RAW, n + '.png')
        if not os.path.exists(src):
            continue
        w = 768 if n.startswith('f_') else 640
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-vf', f'scale={w}:-2:flags=lanczos',
                        '-c:v', 'libwebp', '-q:v', '86', '-preset', 'picture', os.path.join(OUT, n + '.webp')])
    print('encoded', len(os.listdir(OUT)), 'files into', os.path.abspath(OUT))
