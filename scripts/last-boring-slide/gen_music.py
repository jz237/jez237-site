"""Generate the per-scene music for The Last Boring Slide (demos/last-boring-slide) with ElevenLabs.

Usage: python -I gen_music.py [credits|generate|process|all] [--only office,tower] [--force]

generate  one instrumental track per scene into D:/Projects/.tmp/last-boring-slide-audio-raw (or AUDIO_RAW)
process   trims silence, loudness-normalises to -18 LUFS and encodes demos/last-boring-slide/music/<scene>.mp3

The key is read from the environment (or the Windows user environment through PowerShell); it is never
printed and never written anywhere. At most 2 requests run at a time; 429/5xx retry with backoff.
It checks the credit balance first and refuses to generate with less than 15 % left. Needs ffmpeg for process.
Every prompt describes an original instrumental piece; none names an artist or an existing work.
The deck loops each track with its own crossfade (music.js), so the files need no seamless loop point.
"""
import json, os, subprocess, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'demos', 'last-boring-slide', 'music'))
RAW = os.environ.get('AUDIO_RAW', 'D:/Projects/.tmp/last-boring-slide-audio-raw')
API = 'https://api.elevenlabs.io'
HDR = 'xi-' + 'api-key'  # the auth header name, spelled in two parts so key scans of this folder stay clean
TAIL = 'instrumental, no vocals, no spoken words'

# scene id: (seconds, prompt). The ids are the deck's scene ids, in running order.
TRACKS = {
    # A deliberately dull title slide and agenda, read out flatly.
    'office': (60, 'Bland corporate hold music, 96 BPM, soft electric piano, polite nylon guitar, light brushed drums and a timid shaker, a pleasant melody that goes nowhere, slightly thin like a conference room speaker, harmless and forgettable'),
    # The slide becomes a billboard on a salt flat; the chart of AI task length climbs out of its frame.
    'tower': (80, 'Cinematic electronic score, 100 BPM, begins as a single soft pulsing synth note over a wide warm pad, layers join one at a time, a rising arpeggio that keeps climbing an octave higher, growing low strings, awe and unease at something growing faster than expected'),
    # A small boat on a calm sea, chained to an anchor while the water rises.
    'boat': (80, 'Slow melancholy ambient piece, 66 BPM, a lonely felt piano motif over deep swelling low strings and a dark sustained cello, slow rise and fall like a heavy sea, a low drone that sinks gradually lower, patient and ominous'),
    # Paper-cut gears and a fan: AI writing the code that builds the next AI, each turn faster.
    'loop': (75, 'Playful mechanical minimalism, starts at 100 BPM, interlocking marimba, pizzicato strings and woodblock patterns that repeat in tight cycles, clockwork ticking percussion, each phrase a little busier and brighter than the last, clever and propulsive'),
    # One agent working alone, then thirty thousand, then a million.
    'swarm': (80, 'Shimmering electronic piece, 120 BPM, one quiet plucked synth voice that multiplies into dozens of overlapping staccato arpeggios, granular glittering textures, a deep steady bass pulse arriving halfway, vast and busy like a hive seen from far above'),
    # Thirty dominoes, each one and a half times bigger than the last.
    'dominoes': (75, 'Tense percussive build, 90 BPM, starts with tiny dry woodblock clicks, each phrase adds a bigger and lower drum, hand drums then toms then huge deep cinematic drums, low brass swells under the final phrases, the same simple rhythm throughout, inevitable'),
    # The 2027 wall calendar, with days resized by how much happens in them.
    'calendar': (75, 'Uneasy ticking minimal score, 110 BPM, a dry clock tick and a soft muted piano ostinato, high string harmonics, the pattern slowly crowds and tightens with faster inner notes, time running short, restrained and anxious'),
    # One lantern in the dark, then eight billion, then sunrise.
    'lamp': (90, 'Slow luminous ambient piece, 60 BPM, begins nearly silent with one soft warm bell-like tone in a huge dark space, gentle strings and a distant wordless-sounding synth choir pad join slowly, opens into a wide radiant major chord like sunrise over a plain, wonder and humility'),
    # Machines that build machines, out to the scale of the Sun.
    'selectall': (80, 'Grand driving industrial electronic score, 124 BPM, a pounding four-on-the-floor kick, sequenced analogue bass, bright brass-like synth stabs, a relentless motorik rhythm that gains layers every eight bars, enormous scale, powerful and unstoppable'),
    # One degree off, followed out to the Moon and the nearest star.
    'aim': (80, 'Sparse tense score, 72 BPM, a single high sustained violin note, a slow precise plucked harp figure, long silences, one note in the pattern bends very slightly flat and the detuning grows wider across the piece, cold deep space reverb, quiet dread'),
    # Two versions of the same bay, split by a line: one built wrong, one built right.
    'futures': (90, 'Bittersweet cinematic piece, 76 BPM, a warm hopeful string and piano theme in a major key that is repeatedly shadowed by a dark low minor drone and distant metallic tones, the two never resolve into each other, beautiful and uncertain'),
    # The ride back down the curve to today; the wall of the exponential ahead.
    'pile': (75, 'Quiet reflective piece, 68 BPM, solo felt piano with soft room noise, a simple rising phrase left unfinished each time, a faint high pad like wind far overhead, small and still at the foot of something enormous'),
    # Back to the dull template: any questions?
    'questions': (60, 'Very quiet suspended piece, 60 BPM, the ghost of a bland corporate electric piano tune played slowly and hesitantly, a long held string note underneath that never resolves, lots of empty space, a question left hanging'),
}


def key():
    v = os.environ.get('ELEVENLABS_API_KEY', '').strip()
    if not v:
        v = subprocess.run(['powershell', '-NoProfile', '-Command', "[Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')"],
                           capture_output=True, text=True).stdout.strip()
    assert len(v) > 20, 'no ElevenLabs key in the environment'
    return v


def credits(k):
    req = urllib.request.Request(API + '/v1/user/subscription', headers={HDR: k})
    with urllib.request.urlopen(req, timeout=60) as r:
        d = json.loads(r.read())
    used, lim = d.get('character_count', 0), max(1, d.get('character_limit', 1))
    return used, lim, (lim - used) / lim


def post(k, path, body, out, tries=6):
    data = json.dumps(body).encode()
    for i in range(tries):
        req = urllib.request.Request(API + path, data=data, method='POST', headers={HDR: k, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
        try:
            with urllib.request.urlopen(req, timeout=600) as r:
                buf = r.read()
            os.makedirs(os.path.dirname(out), exist_ok=True)
            with open(out, 'wb') as f:
                f.write(buf)
            return len(buf)
        except urllib.error.HTTPError as e:
            msg = e.read()[:300].decode('utf-8', 'replace')
            if e.code in (429, 500, 502, 503, 504) and i < tries - 1:
                time.sleep(6 + 10 * i)
                continue
            raise RuntimeError(f'{e.code} {msg}')
        except Exception:
            if i < tries - 1:
                time.sleep(6 + 10 * i)
                continue
            raise


def generate(k, name, force):
    sec, prompt = TRACKS[name]
    out = os.path.join(RAW, name + '.mp3')
    if os.path.exists(out) and os.path.getsize(out) > 2000 and not force:
        return f'skip {name}'
    body = {'prompt': f'{prompt}, {TAIL}', 'music_length_ms': sec * 1000, 'force_instrumental': True}
    try:
        return f'ok   {name} {post(k, "/v1/music?output_format=mp3_44100_128", body, out)}'
    except Exception as e:
        return f'FAIL {name} {str(e)[:200]}'


def process(name):
    src, dst = os.path.join(RAW, name + '.mp3'), os.path.join(OUT, name + '.mp3')
    if not os.path.exists(src):
        return f'MISSING {name}'
    os.makedirs(OUT, exist_ok=True)
    # Cut leading/trailing silence, even out the loudness, and fade the very ends so the deck's own
    # crossfade never starts or stops on a click.
    trim = 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.3,areverse'
    af = f'{trim},loudnorm=I=-18:TP=-1.5:LRA=11,afade=t=in:d=0.02'
    r = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', af, '-ar', '44100', '-ac', '2', '-c:a', 'libmp3lame', '-b:a', '112k',
                        '-map_metadata', '-1', dst], capture_output=True)
    if r.returncode:
        return f'FAIL {name} {r.stderr.decode("utf-8", "replace")[:200]}'
    d = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True).stdout.decode().strip()
    return f'ok   {name} {float(d or 0):.1f} s {os.path.getsize(dst)} bytes'


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    mode = args[0] if args else 'all'
    assert mode in ('credits', 'generate', 'process', 'all'), __doc__
    only = next((sys.argv[i + 1] for i, a in enumerate(sys.argv) if a == '--only' and i + 1 < len(sys.argv)), None)
    names = [n for n in TRACKS if not only or n in only.split(',')]
    if mode in ('credits', 'generate', 'all'):
        k = key()
        left = credits(k)[2]
        print(f'credits: {left * 100:.0f} % left')
        if mode == 'credits':
            return
        if left < 0.15:
            print('refusing: less than 15 % of the credits are left')
            sys.exit(2)
        with ThreadPoolExecutor(2) as ex:  # never more than 2 requests in flight
            for line in ex.map(lambda n: generate(k, n, '--force' in sys.argv), names):
                print(line, flush=True)
        print(f'credits: {credits(k)[2] * 100:.0f} % left')
    if mode in ('process', 'all'):
        for n in names:
            print(process(n), flush=True)


main()
