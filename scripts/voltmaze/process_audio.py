"""Voltmaze 2026: trim, normalise and re-encode the raw ElevenLabs clips into the game folder.

Usage: python -I process_audio.py <game folder> [name1,name2]   (e.g. games/2026-11-06/voltmaze)
Raw clips come from %TEMP%/voltmaze-audio-raw (or the VM_RAW env var), written by gen_audio.py.
Loop clips (hum, servo, seeker) get a crossfaded seamless loop point. Voice lines get a light
facility-PA treatment (band-limited, a short slap echo) so the AI sounds like it is in the walls.
Needs ffmpeg/ffprobe on PATH and numpy.
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np

RAW = os.environ.get('VM_RAW', os.path.join(tempfile.gettempdir(), 'voltmaze-audio-raw'))
OUT = sys.argv[1]
LOOPS = {'hum', 'servo', 'seeker'}
ONLY = set(sys.argv[2].split(',')) if len(sys.argv) > 2 else None
VOICE_FX = 'highpass=f=140,lowpass=f=8000,aecho=0.8:0.55:32|61:0.16|0.08,acompressor=threshold=-18dB:ratio=3:attack=5:release=120'

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

def make_loop(src_wav, dst_wav, xf=0.35):
    with wave.open(src_wav) as w:
        sr, n, ch = w.getframerate(), w.getnframes(), w.getnchannels()
        a = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32).reshape(-1, ch)
    X = int(sr * xf)
    head, mid, tail = a[:X], a[X:len(a) - X], a[len(a) - X:]
    t = np.linspace(0, 1, X)[:, None]
    mixed = tail * np.cos(t * np.pi / 2) + head * np.sin(t * np.pi / 2)
    out = np.concatenate([mixed, mid]).clip(-32768, 32767).astype(np.int16)
    with wave.open(dst_wav, 'wb') as w:
        w.setnchannels(ch); w.setsampwidth(2); w.setframerate(sr); w.writeframes(out.tobytes())

info = {}
for sub in ('audio', 'voice', 'music'):
    os.makedirs(os.path.join(OUT, sub), exist_ok=True)
tmp = os.path.join(tempfile.gettempdir(), 'vm-tmp.wav')
tmp2 = os.path.join(tempfile.gettempdir(), 'vm-tmp2.wav')

for kind in ('sfx', 'voice', 'music'):
    d = os.path.join(RAW, kind)
    if not os.path.isdir(d):
        continue
    for f in sorted(os.listdir(d)):
        if not f.endswith('.mp3'):
            continue
        name = f[:-4]
        if ONLY and name not in ONLY and name.removeprefix('v_') not in ONLY:
            continue
        src = os.path.join(d, f)
        if kind == 'music':
            dst = os.path.join(OUT, 'music', name + '.mp3')
            run(['ffmpeg', '-y', '-hide_banner', '-i', src, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', tmp])
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
                    af += ',areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse,apad=pad_dur=0.25,' + VOICE_FX
                else:  # a short fade so a clip never ends on a click
                    af += ',areverse,afade=t=in:d=0.03,areverse'
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
