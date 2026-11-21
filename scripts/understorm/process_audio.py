"""Trim, shape, normalise and re-encode the raw ElevenLabs clips for Understorm 2026 or Starling 2026.

Usage: python process_audio.py <understorm|starling> <game folder> [name1,name2]
Raw clips come from gen_audio.py and regen_sfx.py (D:/Projects/.tmp/<game>-audio-raw or AUDIO_RAW).
One-shots: sub-bass and tone are shaped per sound (SHAPE), the clip is cut to start on its attack, faded to
the length the event needs and peak-normalised. Loops get a crossfaded seamless loop point. Music is
loudness-normalised to -16 LUFS. Needs ffmpeg and numpy. Writes audio/*.mp3 and music/*.mp3 into the game
folder and prints what it measured.
"""
import os, re, subprocess, sys, tempfile, wave
import numpy as np

GAME, OUT = sys.argv[1], sys.argv[2]
RAW = os.environ.get('AUDIO_RAW', f'D:/Projects/.tmp/{GAME}-audio-raw')
ONLY = set(sys.argv[3].split(',')) if len(sys.argv) > 3 else None
# per sound: hp = high-pass in Hz (phones and laptops cannot play the sub-bass, and it muddies everything else),
# shelf = low-shelf gain in dB at 140 Hz, lp = low-pass in Hz, max = longest the clip may run in seconds,
# drive = dB of gain into a soft clipper: it lifts the body and tail of a blast up towards its first crack, which
# is what makes an explosion sound dense instead of like a click followed by a whisper.
# Sounds that fire many times a second are kept short and narrow so they never pile up.
SHAPE = {
    'shot': dict(hp=250, max=0.16, drive=4), 'hit': dict(hp=300, lp=7000, max=0.12), 'tink': dict(hp=300, lp=7000, max=0.2), 'absorb': dict(hp=150, lp=6000, max=0.25),
    'rel1': dict(hp=90, max=0.4, drive=5), 'rel2': dict(hp=70, max=0.75, drive=6), 'rel3': dict(hp=55, max=1.4, drive=6),
    'boom': dict(hp=110, max=0.45, drive=12), 'boomM': dict(hp=80, max=0.9, drive=10), 'bigboom': dict(hp=45, shelf=-4, max=2.6, drive=8), 'die': dict(hp=60, shelf=-4, max=1.9, drive=7),
    'hurt': dict(hp=110, max=0.45, drive=8), 'thunk': dict(hp=100, max=0.35), 'zap': dict(hp=200, max=0.35), 'rico': dict(hp=300, lp=8000, max=0.3), 'burrow': dict(hp=120, lp=6000, max=0.4),
    'dock': dict(hp=90), 'swap': dict(hp=120), 'stoop': dict(hp=200, lp=7000), 'pickup': dict(hp=150, max=0.75), 'ember': dict(hp=150, max=0.75), 'lock': dict(hp=100),
    'shatter': dict(hp=200, max=0.8), 'warn': dict(hp=70), 'panic': dict(hp=90, shelf=-3), 'beam': dict(hp=90, shelf=-4), 'growl': dict(hp=50, shelf=-4), 'launch': dict(hp=90), 'clank': dict(hp=70),
}
SR = 44100


def run(args):
    return subprocess.run(args, capture_output=True)


def dur(path):
    r = run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path])
    return float(r.stdout.decode().strip() or 0)


def decode(src, af=None):
    r = run(['ffmpeg', '-v', 'error', '-i', src] + (['-af', af] if af else []) + ['-ac', '1', '-ar', str(SR), '-f', 's16le', '-'])
    return np.frombuffer(r.stdout, dtype=np.int16).astype(np.float32) / 32768


def write_wav(path, a):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes())


def envelope(a, ms=5):
    w = max(1, int(SR * ms / 1000)); return np.sqrt(np.convolve(a * a, np.ones(w) / w, 'same'))


def shape_oneshot(src, name):
    base = re.sub(r'\d+$', '', name); sh = SHAPE.get(base, {})
    af = [f"highpass=f={sh.get('hp', 50)}"]
    if sh.get('shelf'): af.append(f"bass=g={sh['shelf']}:f=140:w=0.7")
    if sh.get('lp'): af.append(f"lowpass=f={sh['lp']}")
    a = decode(src, ','.join(af)); env = envelope(a); pk = env.max()
    if pk < 1e-4: return a, 0
    on = np.where(env > pk * 0.08)[0]; start = max(0, on[0] - int(SR * 0.002)); end = min(len(a), np.where(env > pk * 0.012)[0][-1] + int(SR * 0.03))
    a = a[start:end].copy(); n = len(a)
    if sh.get('drive'):  # gain is set from the loudest 30 ms, not the peak, so takes of one sound come out equally dense
        g = 10 ** (sh['drive'] / 20) * 0.2 / max(1e-6, envelope(a, 30).max()); a = np.tanh(a * g)
    mx = sh.get('max')
    if mx and n > mx * SR:  # ease the tail out over the last 45 % of the allowed length
        n = int(mx * SR); a = a[:n]; f = int(n * 0.45); a[n - f:] *= np.cos(np.linspace(0, np.pi / 2, f)) ** 2
    fi, fo = int(SR * 0.0015), min(n // 4, int(SR * 0.012)); a[:fi] *= np.linspace(0, 1, fi); a[n - fo:] *= np.linspace(1, 0, fo)
    a *= 10 ** (-1.5 / 20) / max(1e-6, np.abs(a).max())
    env = envelope(a); att = (np.where(env > env.max() * 0.6)[0][0]) / SR * 1000
    return a, att


def make_loop(a, xf=1.0):
    X = min(int(SR * xf), len(a) // 4); head, mid, tail = a[:X], a[X:len(a) - X], a[len(a) - X:]; t = np.linspace(0, 1, X)
    return np.concatenate([tail * np.cos(t * np.pi / 2) + head * np.sin(t * np.pi / 2), mid])


for sub in ('audio', 'music'):
    os.makedirs(os.path.join(OUT, sub), exist_ok=True)
tmp = os.path.join(tempfile.gettempdir(), f'{GAME}-tmp.wav')
for kind in ('sfx', 'loops', 'music'):
    d = os.path.join(RAW, kind)
    if not os.path.isdir(d):
        continue
    for f in sorted(os.listdir(d)):
        name = f[:-4]
        if not f.endswith('.mp3') or (ONLY and name not in ONLY and re.sub(r'\d+$', '', name) not in ONLY):
            continue
        src, note = os.path.join(d, f), ''
        if kind == 'music':
            dst = os.path.join(OUT, 'music', name + '.mp3')
            run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', str(SR), tmp])
            run(['ffmpeg', '-y', '-v', 'error', '-i', tmp, '-c:a', 'libmp3lame', '-b:a', '112k', dst])
        else:
            dst = os.path.join(OUT, 'audio', name + '.mp3')
            if kind == 'loops':
                a = make_loop(decode(src, 'highpass=f=40')); a *= 10 ** (-3 / 20) / max(1e-6, np.abs(a).max())
            else:
                a, att = shape_oneshot(src, name); note = f'attack {att:.0f}ms'
            write_wav(tmp, a)
            run(['ffmpeg', '-y', '-v', 'error', '-i', tmp, '-c:a', 'libmp3lame', '-b:a', '96k', dst])
        print(kind, name, round(dur(dst), 2), os.path.getsize(dst), note, flush=True)
if os.path.exists(tmp):
    os.remove(tmp)
