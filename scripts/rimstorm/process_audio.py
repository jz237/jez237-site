"""Rimstorm 2026: trim, normalise and re-encode the raw ElevenLabs clips into the game folder.

Usage: python -P -E process_audio.py <game folder> [name1,name2]   (e.g. games/2026-11-06/rimstorm)
(-P -E rather than -I: numpy lives in the user site-packages; -P still keeps the cwd off sys.path)
Raw clips come from gen_audio.py (%TEMP%/rimstorm-audio-raw or RS_RAW).
- SFX: leading silence trimmed, mono 44.1 kHz, peak -1.5 dB (frequent clips a little lower), 96 kb/s.
  Very frequent clips (fire, hit, uimove...) get a 4-pole low-pass so they never sound like a chirp.
- Loop clips (crackle) get a crossfaded seamless loop point.
- Voice: both ends trimmed, peak -1 dB, 80 kb/s.  Music: EBU loudness -16 LUFS, 112 kb/s.
Writes durations and a brightness report (spectral centroid) to <raw>/durations.json.
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np

RAW = os.environ.get('RS_RAW', os.path.join(tempfile.gettempdir(), 'rimstorm-audio-raw'))
OUT = sys.argv[1]
ONLY = set(sys.argv[2].split(',')) if len(sys.argv) > 2 else None
LOOPS = {'crackle'}
# played many times a minute: keep them dull (no bright tonal one-shots)
SOFT = {'pod': 6000, 'fire': 5200, 'hit': 6000, 'uimove': 3000, 'tell': 4000, 'rim': 5000, 'chip': 7000, 'boltpop': 6000, 'clank': 7000, 'bosshit': 7000, 'reflect': 7000}
GAIN = {'fire': -4.0, 'hit': -3.0, 'uimove': -6.0, 'tell': -3.0}


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


def centroid(wav_path):
    with wave.open(wav_path) as w:
        sr, n, ch = w.getframerate(), w.getnframes(), w.getnchannels()
        a = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32).reshape(-1, ch).mean(axis=1)
    if len(a) < 1024:
        return 0
    spec = np.abs(np.fft.rfft(a * np.hanning(len(a))))
    f = np.fft.rfftfreq(len(a), 1 / sr)
    return float((spec * f).sum() / max(1e-9, spec.sum()))


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


info, bright = {}, {}
for sub in ('audio', 'voice', 'music'):
    os.makedirs(os.path.join(OUT, sub), exist_ok=True)
tmp = os.path.join(tempfile.gettempdir(), 'rs-tmp.wav')
tmp2 = os.path.join(tempfile.gettempdir(), 'rs-tmp2.wav')

for kind in ('sfx', 'voice', 'music'):
    d = os.path.join(RAW, kind)
    if not os.path.isdir(d):
        continue
    for f in sorted(os.listdir(d)):
        name = f[:-4]
        if ONLY and name not in ONLY:
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
                bright[name] = round(centroid(tmp2))
            else:
                af = 'silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.01'
                if kind == 'voice':
                    af += ',areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse'
                else:
                    af += ',areverse,silenceremove=start_periods=1:start_threshold=-60dB:start_silence=0.08,areverse'
                if name in SOFT:
                    af += f',lowpass=f={SOFT[name]},lowpass=f={SOFT[name]}'
                run(['ffmpeg', '-y', '-hide_banner', '-i', src, '-af', af, '-ac', '1', '-ar', '44100', tmp])
                g = peak_gain(tmp)
                target = -1.0 if kind == 'voice' else -1.5 + GAIN.get(name, 0)
                # a short fade at the end so trimmed clips never click
                L = dur(tmp)
                tail = f',afade=t=out:st={max(0, L - 0.04):.3f}:d=0.04' if kind == 'sfx' and L > 0.1 else ''
                run(['ffmpeg', '-y', '-hide_banner', '-i', tmp, '-af', f'volume={target - g:.2f}dB{tail}', '-c:a', 'libmp3lame',
                     '-b:a', '80k' if kind == 'voice' else '96k', dst])
                if kind == 'sfx':
                    bright[name] = round(centroid(tmp))
        info[f'{kind}/{name}'] = round(dur(dst), 2)
        print(kind, name, info[f'{kind}/{name}'], ('centroid %d Hz' % bright[name]) if name in bright else '', flush=True)

for p in (tmp, tmp2):
    if os.path.exists(p):
        os.remove(p)
with open(os.path.join(RAW, 'durations.json'), 'w') as fh:
    json.dump({'durations': info, 'centroid_hz': bright}, fh, indent=1)
