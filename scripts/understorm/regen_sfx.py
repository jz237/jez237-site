"""Second pass on the sound effects of Understorm 2026 and Starling 2026.

The first set had measurable faults (slow attacks on firing sounds, explosions that were almost all sub-bass or
almost all hiss, clips far longer than the event they mark). This script generates several takes of each weak
sound with ElevenLabs, measures every take (attack time, effective length, spectral balance) and keeps the take
or takes that best fit the target written next to each prompt. It cannot hear: the pick is by measurement only.

Usage: python -I regen_sfx.py <understorm|starling> [gen|pick|all] [--only a,b] [--takes N]
Takes land in D:/Projects/.tmp/<game>-audio-raw/takes/<name>__<i>.mp3; picks are copied over
D:/Projects/.tmp/<game>-audio-raw/sfx/<name>.mp3 (or <name>1..n.mp3 where a sound has variants).
Then run process_audio.py. The key is read from the environment and never printed or stored.
"""
import json, os, shutil, subprocess, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor
import numpy as np

GAME = sys.argv[1] if len(sys.argv) > 1 else ''
RAW = os.environ.get('AUDIO_RAW', f'D:/Projects/.tmp/{GAME}-audio-raw')
API = 'https://api.elevenlabs.io'
HDR = 'xi-' + 'api-key'

# name: (seconds, variants kept, prompt, target) — target: att = slowest allowed attack in ms, cen = wanted spectral
# centroid range in Hz, sub = largest share of energy allowed below 120 Hz, hi = largest share above 5 kHz,
# len = wanted effective length range in seconds (time the level stays within 20 dB of its peak)
T = lambda att, cen, sub, hi, ln: {'att': att, 'cen': cen, 'sub': sub, 'hi': hi, 'len': ln}
SETS = {
    'understorm': {
        'shot': (0.5, 3, 'Single short laser blaster shot from a small spacecraft, quick punchy pew with a tight snap, dry, close, no reverb, no echo', T(8, (900, 4500), 0.1, 0.45, (0.05, 0.25))),
        'rel1': (0.6, 1, 'Energy cannon firing one bolt, instant punchy thump with a short electric zap, dry, no reverb, no build-up', T(10, (500, 3000), 0.3, 0.3, (0.12, 0.45))),
        'rel2': (1.0, 1, 'Heavy plasma cannon firing a charged blast, instant loud punch followed by a short crackling electric whoosh, no build-up, no reverb', T(12, (400, 2800), 0.35, 0.3, (0.3, 0.8))),
        'rel3': (1.6, 1, 'Massive charged energy cannon discharge, instant huge blast, tearing electric roar and a short sizzling tail, no build-up', T(15, (350, 2600), 0.4, 0.3, (0.6, 1.4))),
        'boom': (0.6, 3, 'Small science fiction explosion, crisp punchy pop with a short burst of debris, mid-range, dry, no reverb, no deep bass rumble', T(8, (500, 3200), 0.25, 0.3, (0.12, 0.5))),
        'boomM': (1.2, 2, 'Explosion of a metal machine heard up close, loud sharp crack and crunch of bursting metal with fiery crackle and debris, bright and punchy, mid and high frequencies, very little bass', T(10, (350, 2400), 0.35, 0.25, (0.35, 0.95))),
        'bigboom': (3.0, 1, 'Gigantic machine blowing apart, loud sharp initial crack, then roaring fire, crackling and tearing sheet metal, rich mid-range detail, long tail', T(15, (250, 1800), 0.45, 0.25, (1.2, 2.8))),
        'hit': (0.5, 1, 'Small energy bolt hitting metal armour, very short dry click-snap, mid-range, no reverb, no ringing', T(6, (900, 4000), 0.08, 0.4, (0.03, 0.2))),
        'hurt': (0.6, 1, 'Harsh electric short-circuit burst, loud crackling buzz with a metallic clang and a quick alarm blip, bright and gritty, short', T(12, (350, 2600), 0.3, 0.3, (0.15, 0.5))),
        'thunk': (0.5, 1, 'Heavy metal object slamming into rock, solid clunk with a gritty crunch, mid-range, dry, short', T(10, (300, 2200), 0.35, 0.25, (0.08, 0.4))),
        'die': (2.0, 1, 'Small spacecraft destroyed, sharp punchy explosion, tearing metal and a falling electrical whine fading out, full frequency range', T(12, (350, 2400), 0.4, 0.25, (0.8, 1.9))),
        'pickup': (0.8, 1, 'Arcade power-up collected, warm bright rising synth chime of two quick notes with a soft sparkle, clean', T(25, (800, 3800), 0.05, 0.4, (0.2, 0.75))),
        'lock': (0.8, 1, 'Weapon overheating and shutting down, descending buzzy power-down tone with a short steam hiss', T(30, (400, 3200), 0.25, 0.45, (0.3, 0.8))),
        'zap': (0.5, 1, 'Short electric arc zap, sharp crackle with a mid-range buzz, dry', T(8, (1200, 5000), 0.05, 0.55, (0.08, 0.4))),
        'shatter': (0.9, 1, 'Large crystal shattering, sharp crack then glass fragments scattering, full-bodied, dry', T(10, (1500, 6000), 0.05, 0.65, (0.25, 0.8))),
        'warn': (1.6, 1, 'Ominous alarm klaxon, two long low horn blasts, loud and sustained the whole time', T(60, (250, 1800), 0.3, 0.2, (0.9, 1.6))),
        'panic': (1.8, 1, 'Enormous gentle sky creature calling out in alarm, long mournful whale song with a clear singing mid-range tone rising in pitch', T(250, (250, 1600), 0.4, 0.15, (0.9, 1.8))),
    },
    'starling': {
        'shot': (0.5, 3, 'Single short laser blaster shot, quick bright pew with a tight snap, dry, close, no reverb, no echo', T(8, (1000, 5000), 0.08, 0.5, (0.05, 0.22))),
        'hit': (0.5, 1, 'Small shot hitting a thin metal shell, very short dry tick, mid-range, no reverb, no ringing', T(6, (900, 4500), 0.08, 0.45, (0.03, 0.18))),
        'boom': (0.5, 3, 'Small science fiction explosion, crisp punchy pop with a light metallic crunch and a short burst of debris, mid-range, dry, no reverb, no deep bass rumble', T(8, (600, 3600), 0.2, 0.35, (0.1, 0.45))),
        'bigboom': (3.0, 1, 'Huge flying machine blowing apart over the sea, loud sharp initial crack, then roaring fire, crackling and tearing metal, rich mid-range detail, long tail', T(15, (250, 1800), 0.45, 0.25, (1.2, 2.8))),
        'die': (2.0, 1, 'Small aircraft destroyed, sharp punchy explosion, tearing metal and a falling whine fading out, full frequency range', T(12, (350, 2400), 0.4, 0.25, (0.8, 1.9))),
        'ember': (0.8, 1, 'Collecting a glowing power-up, instant bright warm chime with a soft airy whoosh, clean', T(25, (800, 4000), 0.05, 0.45, (0.2, 0.75))),
        'beam': (1.8, 1, 'Powerful searchlight beam igniting, electrical surge rising quickly into a bright radiant hum, mid-range and bright, no deep bass', T(80, (400, 3000), 0.3, 0.35, (0.8, 1.7))),
    },
}


def key():
    v = os.environ.get('ELEVENLABS_API_KEY', '').strip()
    if not v:
        v = subprocess.run(['powershell', '-NoProfile', '-Command', "[Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')"], capture_output=True, text=True).stdout.strip()
    assert len(v) > 20, 'no ElevenLabs key in the environment'
    return v


def credits(k):
    with urllib.request.urlopen(urllib.request.Request(API + '/v1/user/subscription', headers={HDR: k}), timeout=60) as r:
        d = json.loads(r.read())
    used, lim = d.get('character_count', 0), max(1, d.get('character_limit', 1))
    return (lim - used) / lim


def post(k, body, out, tries=6):
    data = json.dumps(body).encode()
    for i in range(tries):
        req = urllib.request.Request(API + '/v1/sound-generation?output_format=mp3_44100_128', data=data, method='POST', headers={HDR: k, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                buf = r.read()
            with open(out, 'wb') as f:
                f.write(buf)
            return len(buf)
        except urllib.error.HTTPError as e:
            msg = e.read()[:200].decode('utf-8', 'replace')
            if e.code in (429, 500, 502, 503, 504) and i < tries - 1:
                time.sleep(6 + 10 * i); continue
            raise RuntimeError(f'{e.code} {msg}')
        except Exception:
            if i < tries - 1:
                time.sleep(6 + 10 * i); continue
            raise


# the high-pass each sound gets in process_audio.py: takes are measured after it, because what matters is what is left to hear
HP = {'shot': 250, 'hit': 300, 'boom': 110, 'boomM': 80, 'bigboom': 45, 'hurt': 110, 'thunk': 100, 'die': 60, 'rel1': 90, 'rel2': 70, 'rel3': 55, 'zap': 200, 'pickup': 150, 'ember': 150, 'lock': 100, 'shatter': 200, 'warn': 70, 'panic': 90, 'beam': 90}


def measure(path, hp=50):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-af', f'highpass=f={hp}', '-ac', '1', '-ar', '44100', '-f', 's16le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
    if len(a) < 2000:
        return None
    w = 221; env = np.sqrt(np.convolve(a * a, np.ones(w) / w, 'same')); pk = env.max()
    if pk < 1e-4:
        return None
    start = np.where(env > pk * 0.05)[0][0]  # where the sound begins
    att = (np.where(env > pk * 0.6)[0][0] - start) / 44.1
    above = np.where(env > pk * 0.1)[0]; ln = (above[-1] - above[0]) / 44100
    sp = np.abs(np.fft.rfft(a)) ** 2; f = np.fft.rfftfreq(len(a), 1 / 44100); tot = sp.sum() + 1e-12
    return {'att': att, 'len': ln, 'cen': float((sp * f).sum() / tot), 'sub': float(sp[f < 120].sum() / tot), 'hi': float(sp[f > 5000].sum() / tot)}


def score(m, t):
    if m is None:
        return 99.0
    s = max(0.0, m['att'] - t['att']) / 15 + max(0.0, m['sub'] - t['sub']) * 8 + max(0.0, m['hi'] - t['hi']) * 6
    lo, hi = t['cen']; s += 3 * (np.log2(lo / m['cen']) if m['cen'] < lo else np.log2(m['cen'] / hi) if m['cen'] > hi else 0)
    lo, hi = t['len']; s += 2 * (np.log2(lo / max(0.01, m['len'])) if m['len'] < lo else 0.5 * np.log2(m['len'] / hi) if m['len'] > hi else 0)  # too long is cheap: it gets trimmed
    return float(s)


def main():
    assert GAME in SETS, __doc__
    mode = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith('--') else 'all'
    arg = lambda n, d: next((sys.argv[i + 1] for i, a in enumerate(sys.argv) if a == n and i + 1 < len(sys.argv)), d)
    only, takes = arg('--only', None), int(arg('--takes', 4))
    names = [n for n in SETS[GAME] if not only or n in only.split(',')]
    tdir, sdir = os.path.join(RAW, 'takes'), os.path.join(RAW, 'sfx'); os.makedirs(tdir, exist_ok=True); os.makedirs(sdir, exist_ok=True)
    if mode in ('gen', 'all'):
        k = key(); left = credits(k); print(f'credits: {left * 100:.0f} % left')
        if left < 0.15:
            print('refusing: less than 15 % of the credits are left'); sys.exit(2)
        todo = []
        for n in names:
            sec, keep, prompt, _ = SETS[GAME][n]
            for i in range(1, max(takes, keep + 2) + 1):
                out = os.path.join(tdir, f'{n}__{i}.mp3')
                if not (os.path.exists(out) and os.path.getsize(out) > 2000):
                    todo.append((out, {'text': prompt, 'duration_seconds': max(0.5, sec), 'prompt_influence': 0.7}))

        def one(j):
            try:
                return f'ok   {os.path.basename(j[0])} {post(k, j[1], j[0])}'
            except Exception as e:
                return f'FAIL {os.path.basename(j[0])} {str(e)[:160]}'
        with ThreadPoolExecutor(2) as ex:  # never more than 2 requests in flight
            for line in ex.map(one, todo):
                print(line, flush=True)
        print(f'credits: {credits(k) * 100:.0f} % left')
    if mode in ('pick', 'all'):
        for n in names:
            sec, keep, prompt, t = SETS[GAME][n]
            c = []
            for f in sorted(os.listdir(tdir)):
                if f.startswith(n + '__') and f.endswith('.mp3'):
                    m = measure(os.path.join(tdir, f), HP.get(n, 50)); c.append((score(m, t), f, m))
            c.sort(key=lambda x: x[0])
            for sc, f, m in c:
                print(f'  {f:18} score {sc:5.2f}  ' + ('' if m is None else f"attack {m['att']:4.0f}ms len {m['len']:.2f}s centroid {m['cen']:5.0f} sub {m['sub'] * 100:3.0f}% hi {m['hi'] * 100:3.0f}%"))
            if len(c) < keep:
                print(f'NOT ENOUGH TAKES for {n}'); continue
            for i in range(keep):
                dst = os.path.join(sdir, f'{n}{i + 1}.mp3' if keep > 1 else f'{n}.mp3'); shutil.copyfile(os.path.join(tdir, c[i][1]), dst)
            if keep > 1 and os.path.exists(os.path.join(sdir, n + '.mp3')):
                os.remove(os.path.join(sdir, n + '.mp3'))  # replaced by numbered variants
            print(f'{n}: kept ' + ', '.join(f'{x[1]} ({x[0]:.2f})' for x in c[:keep]))


main()
