"""Lancewing 2026: trim, normalise and re-encode the raw ElevenLabs clips into the game folder.

Usage: python -I process_audio.py <game folder> [name1,name2]   (e.g. games/2026-11-06/lancewing)
Raw clips come from gen_audio.py (<work>/audio-raw or LW_RAW). Loop clips (wind, surf, rush, hunterloop) get a
crossfaded seamless loop point; one-shots are trimmed of leading silence and peak-normalised; music is
loudness-normalised (-16 LUFS); the frequent wing beat is high-cut a little so it never sounds bright.
Writes <raw>/durations.json.
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np

RAW = os.environ.get('LW_RAW', 'D:/Projects/.tmp/arcade-trio-work/lancewing/audio-raw')
OUT = sys.argv[1]
LOOPS = {'wind', 'surf', 'rush', 'hunterloop'}
# frequent sounds: cut the sub-bass phones cannot play (so the audible body comes up after peak normalising) and keep them dark
SOFT = {'flap': 'highpass=f=110,lowpass=f=5200', 'land': 'highpass=f=90,lowpass=f=6000', 'collect': 'highpass=f=120,lowpass=f=7000',
        'skid': 'lowpass=f=7000', 'chain': 'highpass=f=100', 'core': 'highpass=f=100', 'pickup': 'highpass=f=100', 'spawn': 'highpass=f=90',
        'shieldhit': 'highpass=f=90', 'form': 'highpass=f=90', 'drop': 'highpass=f=90', 'hatch': 'highpass=f=70',
        'thud': 'highpass=f=80,lowpass=f=7000', 'arrive': 'highpass=f=90', 'portal': 'highpass=f=80', 'clatter': 'highpass=f=150'}
ONLY = set(sys.argv[2].split(',')) if len(sys.argv) > 2 else None


def run(args):
    return subprocess.run(args, capture_output=True, text=True)


def peak_gain(path):
    r = run(['ffmpeg', '-hide_banner', '-i', path, '-af', 'volumedetect', '-f', 'null', '-'])
    for line in r.stderr.splitlines():
        if 'max_volume' in line:
            return float(line.split('max_volume:')[1].split('dB')[0])
    return 0.0


def dur(path):
    r = run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path])
    return float(r.stdout.strip() or 0)


def make_loop(src_wav, dst_wav, xf=0.6):
    with wave.open(src_wav) as w:
        sr, n, ch = w.getframerate(), w.getnframes(), w.getnchannels()
        a = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32).reshape(-1, ch)
    X = min(int(sr * xf), len(a) // 4)
    head, mid, tail = a[:X], a[X:len(a) - X], a[len(a) - X:]
    t = np.linspace(0, 1, X)[:, None]
    mixed = tail * np.cos(t * np.pi / 2) + head * np.sin(t * np.pi / 2)
    out = np.concatenate([mixed, mid]).clip(-32768, 32767).astype(np.int16)
    with wave.open(dst_wav, 'wb') as w:
        w.setnchannels(ch); w.setsampwidth(2); w.setframerate(sr); w.writeframes(out.tobytes())


info = {}
for sub in ('audio', 'voice', 'music'):
    os.makedirs(os.path.join(OUT, sub), exist_ok=True)
tmp = os.path.join(tempfile.gettempdir(), 'lw-tmp.wav')
tmp2 = os.path.join(tempfile.gettempdir(), 'lw-tmp2.wav')

for kind in ('sfx', 'voice', 'music'):
    d = os.path.join(RAW, kind)
    if not os.path.isdir(d):
        continue
    for f in sorted(os.listdir(d)):
        if not f.endswith('.mp3'):
            continue
        name = f[:-4]
        if ONLY and name not in ONLY:
            continue
        src = os.path.join(d, f)
        if kind == 'music':
            dst = os.path.join(OUT, 'music', name + '.mp3')
            af = 'loudnorm=I=-16:TP=-1.5:LRA=11'
            if name == 'over':
                af = 'silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.01,afade=t=out:st=5:d=1,' + af
            run(['ffmpeg', '-y', '-hide_banner', '-i', src, '-af', af, '-ar', '44100', tmp])
            run(['ffmpeg', '-y', '-hide_banner', '-i', tmp, '-c:a', 'libmp3lame', '-b:a', '112k', dst])
        else:
            sub = 'audio' if kind == 'sfx' else 'voice'
            dst = os.path.join(OUT, sub, name + '.mp3')
            if name in LOOPS:
                run(['ffmpeg', '-y', '-hide_banner', '-i', src, '-ac', '1', '-ar', '44100', tmp])
                make_loop(tmp, tmp2)
                g = peak_gain(tmp2)
                run(['ffmpeg', '-y', '-hide_banner', '-i', tmp2, '-af', f'volume={-3 - g:.2f}dB', '-c:a', 'libmp3lame', '-b:a', '96k', dst])
            else:
                af = 'silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.01'
                if kind == 'voice':
                    af += ',areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse'
                else:
                    af += ',areverse,silenceremove=start_periods=1:start_threshold=-60dB:start_silence=0.05,areverse'
                if name in SOFT:
                    af += ',' + SOFT[name]
                run(['ffmpeg', '-y', '-hide_banner', '-i', src, '-af', af, '-ac', '1', '-ar', '44100', tmp])
                g = peak_gain(tmp)
                target = -1.0 if kind == 'voice' else -1.5
                run(['ffmpeg', '-y', '-hide_banner', '-i', tmp, '-af', f'volume={target - g:.2f}dB', '-c:a', 'libmp3lame',
                     '-b:a', '80k' if kind == 'voice' else '96k', dst])
        info[f'{kind}/{name}'] = round(dur(dst), 2)
        print(kind, name, info[f'{kind}/{name}'], flush=True)

for p in (tmp, tmp2):
    if os.path.exists(p):
        os.remove(p)
with open(os.path.join(RAW, 'durations.json'), 'w') as fh:
    json.dump(info, fh, indent=1)
