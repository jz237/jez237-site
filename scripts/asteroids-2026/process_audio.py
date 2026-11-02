"""Asteroids 2026: trim, normalise and re-encode the raw ElevenLabs clips into the game folder."""
import json, os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.environ.get('A26_RAW', os.path.join(tempfile.gettempdir(), 'a26-audio-raw'))
OUT = sys.argv[1]  # .../asteroids-hd/2026
# character voices: the machine gets a metallic ring, the Maw drops an octave-ish
VOICE_FX = {'cipher': 'aecho=0.8:0.7:12:0.45,flanger=delay=2:depth=3:speed=0.6,', 'maw': 'asetrate=44100*0.78,aresample=44100,atempo=1.12,aecho=0.8:0.6:40:0.3,'}

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

info = {}
os.makedirs(os.path.join(OUT, 'audio'), exist_ok=True)
os.makedirs(os.path.join(OUT, 'voice'), exist_ok=True)
os.makedirs(os.path.join(OUT, 'music'), exist_ok=True)
tmp = os.path.join(tempfile.gettempdir(), 'a26-tmp.wav')

for kind in ('sfx', 'voice', 'music'):
    d = os.path.join(RAW, kind)
    for f in sorted(os.listdir(d)):
        name = f[:-4]
        src = os.path.join(d, f)
        if kind == 'music':
            dst = os.path.join(OUT, 'music', name + '.mp3')
            # loudness-normalise, gentle fade-in, 2 s fade-out kept for the loop crossfade
            run(['ffmpeg', '-y', '-hide_banner', '-i', src, '-af', 'loudnorm=I=-15:TP=-1.5:LRA=11', '-ar', '44100', tmp])
            run(['ffmpeg', '-y', '-hide_banner', '-i', tmp, '-c:a', 'libmp3lame', '-b:a', '96k', dst])
        else:
            sub = 'audio' if kind == 'sfx' else 'voice'
            dst = os.path.join(OUT, sub, name + '.mp3')
            # trim leading silence (and trailing for voice), mono
            af = VOICE_FX.get(name.split('_')[0], '') if kind == 'voice' else ''
            af += 'silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.01'
            if kind == 'voice':
                af += ',areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse,afade=t=out:st=0:d=0.0'
                af = af.replace(',afade=t=out:st=0:d=0.0', '')
            run(['ffmpeg', '-y', '-hide_banner', '-i', src, '-af', af, '-ac', '1', '-ar', '44100', tmp])
            g = peak_gain(tmp)
            target = -1.0 if kind == 'voice' else -1.5
            run(['ffmpeg', '-y', '-hide_banner', '-i', tmp, '-af', f'volume={target - g:.2f}dB', '-c:a', 'libmp3lame',
                 '-b:a', '80k' if kind == 'voice' else '96k', dst])
        info[f'{kind}/{name}'] = round(dur(dst), 2)
        print(kind, name, info[f'{kind}/{name}'], flush=True)

os.remove(tmp)
with open(os.path.join(RAW, 'durations.json'), 'w') as fh:
    json.dump(info, fh, indent=1)
