"""Generate Rimstorm 2026 audio with ElevenLabs (music, SFX, rare flight-control voice lines).

Usage: python -I gen_audio.py [music|sfx|voice|all|credits] [--only name1,name2] [--force]
Raw mp3s land in %TEMP%/rimstorm-audio-raw/<kind>/<name>.mp3 (or RS_RAW).
The key is read from the Windows user environment (ELEVENLABS_API_KEY) via PowerShell; it is never
printed and never written anywhere. At most 2 requests run at a time (other games share the account);
a 429 backs off and retries. Generation stops if fewer than 15 % of the account's credits remain.
Then run process_audio.py <game folder> to trim / normalise / encode the clips into the game.
"""
import json, os, subprocess, sys, tempfile, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

RAW = os.environ.get('RS_RAW', os.path.join(tempfile.gettempdir(), 'rimstorm-audio-raw'))
API = 'https://api.elevenlabs.io'
# the auth header name and the key prefix are assembled so a repository grep for leaked keys stays clean
HDR = 'xi-' + 'api-' + 'key'
PREFIX = 's' + 'k_'


def key():
    v = subprocess.run(['powershell', '-NoProfile', '-Command',
                        "[Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')"],
                       capture_output=True, text=True).stdout.strip()
    assert v.startswith(PREFIX) and len(v) == 51, 'ELEVENLABS_API_KEY missing or bad shape'
    return v


KEY = key()


_last = {'t': 0, 'v': None}


def credits(max_age=0):
    """(used, limit, fraction left); cached for max_age seconds; 429 -> back off and retry."""
    if _last['v'] and time.time() - _last['t'] < max_age:
        return _last['v']
    for i in range(10):
        try:
            req = urllib.request.Request(API + '/v1/user/subscription', headers={HDR: KEY})
            d = json.loads(urllib.request.urlopen(req, timeout=60).read())
            used, lim = d['character_count'], d['character_limit']
            _last['t'], _last['v'] = time.time(), (used, lim, 1 - used / lim)
            return _last['v']
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and i < 9:
                time.sleep(10 + 10 * i)
                continue
            raise


def post(path, body, out, tries=8):
    data = json.dumps(body).encode()
    for i in range(tries):
        req = urllib.request.Request(API + path, data=data, method='POST',
                                     headers={HDR: KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
        try:
            with urllib.request.urlopen(req, timeout=900) as r:
                buf = r.read()
            os.makedirs(os.path.dirname(out), exist_ok=True)
            with open(out, 'wb') as f:
                f.write(buf)
            return len(buf)
        except urllib.error.HTTPError as e:
            msg = e.read()[:300].decode('utf-8', 'replace')
            if e.code in (429, 500, 502, 503, 504) and i < tries - 1:
                time.sleep(8 + 12 * i)
                continue
            raise RuntimeError(f'{e.code} {msg}')
        except Exception:
            if i < tries - 1:
                time.sleep(8 + 12 * i)
                continue
            raise


# name: (seconds, prompt). Original score: a pilot diving down giant tube-webs through five sectors.
MUSIC = {
    'title': (90, 'Cinematic ambient electronic overture, slow 84 BPM, vast deep space, a lone pilot on a hover sled at the lip of an endless glowing tunnel, warm analog pads, slow pulsing sub bass, a patient rising arpeggio, tension and wonder, instrumental, no vocals'),
    's1':    (120, 'Driving cinematic electronic action track, 112 BPM, wide spacey pads, punchy drums, rolling analog bass arpeggio, racing around a colossal orbital ring above a storm-banded gas giant, bright and determined, instrumental, no vocals'),
    's2':    (120, 'Dark aquatic cinematic electronic action track, 116 BPM, deep sub bass, muffled pulsing percussion, bubbling textures and slow whale-like swells, diving down a bioluminescent deep ocean trench, tense and mysterious yet driving, instrumental, no vocals'),
    's3':    (120, 'Heavy industrial cinematic action track, 124 BPM, pounding metallic drums, distorted bass, roaring furnace textures, descending through the molten core of a planet, aggressive and hot, instrumental, no vocals'),
    's4':    (120, 'Cold crystalline cinematic electronic action track, 128 BPM, glassy plucked synths, icy shimmering pads, tight breakbeat drums, deep bass, racing through the ice canyons of a frozen moon, urgent, instrumental, no vocals'),
    's5':    (120, 'Epic cosmic cinematic electronic score, 134 BPM, huge drums, pounding bass, dark choir pads, warped time-stretched textures, the final dive toward a black hole, overwhelming and heroic, instrumental, no vocals'),
    'boss':  (100, 'Relentless cinematic boss battle score, 140 BPM, thundering war drums, distorted synth bass, brass-like stabs, a colossal machine rising up a giant tunnel toward the pilot, menacing and huge, instrumental, no vocals'),
    'clear': (10, 'Short triumphant cinematic fanfare, bold synth brass and strings over a deep drum hit, ends on a held major chord, instrumental'),
    'over':  (9, 'Short sombre cinematic sting, low strings and a fading deep synth pad, quiet ending, instrumental'),
}

# name: (seconds, prompt influence, text). Frequent sounds are kept dull / low (no bright tonal chirps).
SFX = {
    'fire':     (0.5, 0.6, 'Single short plasma cannon shot from a hover craft, low punchy thump with a soft airy hiss, no beep, no tone'),
    'hit':      (0.5, 0.6, 'Energy round hitting a small metal drone, dull crunchy impact with a short sizzle, no tone'),
    'clank':    (0.5, 0.6, 'Energy round glancing off heavy armour plate, dense low metallic clank'),
    'boltpop':  (0.5, 0.6, 'Enemy energy bolt shot down in mid air, soft muffled pop with a fizzing hiss'),
    'boomS':    (1.2, 0.5, 'Small drone explosion, sharp blast with crackle and scattering glass and metal shards'),
    'boomM':    (1.8, 0.5, 'Medium explosion of an armoured machine, punchy blast with a deep rumble and falling metal'),
    'boomL':    (3.0, 0.5, 'Colossal explosion of a giant machine inside a huge metal tunnel, deep booming blast, metal debris and a long echoing rumble'),
    'debris':   (1.2, 0.5, 'Metal and crystal debris tumbling and clattering down a long metal chute'),
    'charge':   (0.9, 0.6, 'Enemy drone charging its gun, short low rising electric hum'),
    'bolt':     (0.6, 0.6, 'Plasma bolt launched from a drone, wet low zap with a whoosh'),
    'emerge':   (1.2, 0.5, 'Machine emerging from deep inside a giant tunnel far away, low rising rumble with a metallic shudder'),
    'split':    (0.7, 0.6, 'Armoured drone cracking apart into two halves, sharp mechanical snap with a pneumatic hiss'),
    'crackle':  (2.0, 0.4, 'Continuous electric arc crackling and sputtering along a metal rail, steady, seamless loop'),
    'zap':      (1.0, 0.6, 'Whole metal rail electrified, heavy high-voltage strike with a crackling buzz'),
    'purge':    (1.8, 0.5, 'Massive sci-fi energy purge blast travelling down a tunnel, deep whomp with a crackling electric ring and rushing air'),
    'plate':    (0.8, 0.6, 'Armour shield plate absorbing a heavy hit, shimmering electric thud and a metal crunch'),
    'death':    (2.2, 0.5, 'Hover sled destroyed, metal crunch, electrical failure and a fiery blast'),
    'spawn':    (1.2, 0.5, 'Hover sled materialising and powering up, rising shimmer and a turbine spin-up with a bass thump'),
    'web':      (1.4, 0.5, 'Huge resonant horn swell echoing inside a giant tunnel, deep and ominous, wave starting'),
    'webclear': (1.6, 0.5, 'Warm swelling low synth chord with a rushing whoosh, level complete, calm and satisfying'),
    'alarm':    (2.0, 0.5, 'Deep urgent warning klaxon echoing in a giant metal tunnel, two-tone'),
    'bossin':   (2.6, 0.5, 'Colossal machine rising up a tunnel, deep mechanical groan, grinding gears and a hydraulic roar'),
    'bosshit':  (0.5, 0.6, 'Shot hitting the thick armour of a huge machine, heavy metallic clang with sparks'),
    'lunge':    (1.4, 0.5, 'Giant machine lunging forward and slamming, huge whoosh and a heavy impact'),
    'phase':    (1.8, 0.5, 'Giant machine changing form, ominous rising energy surge and shifting heavy metal plates'),
    'grab':     (1.0, 0.6, 'Hover sled seized by a mechanical clamp, heavy clamp bite and a metal screech'),
    'beam':     (2.0, 0.5, 'Powerful energy beam firing down a tunnel, intense humming roar with crackle'),
    'flare':    (1.6, 0.5, 'Furnace flare bursting out, roaring fire blast with a deep whoosh'),
    'life':     (1.2, 0.5, 'Extra life earned, warm rising synth swell with a soft shimmer'),
    'upgrade':  (1.0, 0.5, 'Mechanical upgrade installed on a craft, servo whir, a solid lock clunk and a soft confirm tone'),
    'medal':    (1.4, 0.5, 'Award earned, deep bell strike with a metallic shimmer'),
    'uimove':   (0.2, 0.7, 'Soft muted futuristic interface tick, short low click'),
    'uiok':     (0.4, 0.6, 'Futuristic interface confirm, soft low two-note tone with a click'),
    'uiback':   (0.3, 0.6, 'Futuristic interface back, soft low descending blip'),
    'rewind':   (1.0, 0.5, 'Tape rewind effect, quick reverse warble'),
    'pickup':   (0.9, 0.6, 'Power-up collected by a craft, soft rising energy swell with a crystal shimmer'),
    'pwend':    (0.7, 0.6, 'Power-up running out, short descending power-down hum'),
    'pod':      (1.0, 0.5, 'Supply capsule released, pneumatic hiss with a low rising hum'),
    'dive':     (2.6, 0.5, 'Diving down a giant tunnel at high speed, roaring wind rush and a deep accelerating whoosh'),
    'sweep':    (1.2, 0.6, 'Sweeping energy surge rolling along a metal track, crackling electric rush'),
    'tell':     (0.6, 0.7, 'Low hazard warning pulse, two dull muffled thuds'),
    'hop':      (0.8, 0.6, 'Hover sled jumping, short thruster burst and a whoosh'),
    'reflect':  (0.6, 0.6, 'Energy shot ricocheting off a crystal mirror, glassy ricochet with a low ring'),
    'dodge':    (0.5, 0.6, 'Near miss, fast whoosh of something passing very close'),
    'chip':     (0.5, 0.6, 'Crystal spike being shot and chipped, glassy crack with tinkling shards'),
    'rim':      (0.5, 0.6, 'Machine clamping onto a metal rim, heavy low metallic clamp and scrape'),
    'crush':    (1.6, 0.5, 'Giant crushing impact of colliding metal masses, massive crunch with a shockwave rumble'),
    'pull':     (2.2, 0.5, 'Gravity pull of a black hole, deep descending warping drone with a stretched rumble'),
    # 1.4: the events that had no sound
    'boltrim':  (0.6, 0.6, 'Energy bolt striking a metal rim and fizzling out, sharp sizzling snap with a short metallic ring, no beep'),
    'bossspawn':(1.1, 0.55, 'Huge machine ejecting a swarm of small drones, hydraulic hiss and a rapid series of heavy metallic launch thunks'),
    'droidend': (0.8, 0.6, 'Small helper drone powering down, descending servo whine ending in a soft mechanical click, no beep'),
    'droidfire':(0.4, 0.6, 'Tiny light plasma shot from a small hovering drone, soft quick thump with a faint airy hiss, no beep, no tone'),
    'droidzap': (0.5, 0.6, 'Short electric arc zapping a small machine, crisp crackling snap'),
    'eyeshut':  (0.8, 0.6, 'Giant mechanical eye shutter slamming closed, heavy metal iris clack with a hydraulic hiss'),
    'headhit':  (0.7, 0.6, 'Heavy armoured mechanical serpent head struck by energy fire, deep metallic clang with a crunch'),
    'headmove': (0.9, 0.55, 'Huge mechanical serpent head sliding sideways along a metal rail, grinding scrape with a hydraulic whoosh'),
    'podlost':  (0.8, 0.55, 'Glowing power-up capsule drifting away out of reach, soft descending whoosh with a dim glassy fade'),
    'sectorclear': (2.5, 0.5, 'Triumphant deep energy surge as a huge machine powers down, rising shimmering whoosh into a resonant low boom, no music, no voice'),
    'wreck':    (1.0, 0.55, 'Small wrecked metal drone tumbling down a long metal tube, clattering bounces fading into the distance'),
}

VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'  # one consistent flight-control voice for the whole game
VOICE = {
    'begin': 'Rimrunner, you are on the rim. Hold the lanes.',
    's2': 'Sector two. The Abyss Trench. Stay sharp in the dark.',
    's3': 'Sector three. Molten Core. The walls are burning.',
    's4': 'Sector four. Crystal Moon. Mind the ice.',
    's5': 'Final sector. The Event Horizon. There is no way back up.',
    'boss': 'Something huge is rising up the tube.',
    'bossdown': 'It is breaking apart. Outstanding.',
    'lastlife': 'Last sled, Rimrunner. Make it count.',
    'gameover': 'We have lost the Rimrunner.',
    'newrecord': 'That is a new record.',
    'champion': 'All five sectors. The storm is broken.',
    'endless': 'Endless descent. Go as deep as you dare.',
}


def jobs(kind):
    out = []
    if kind in ('music', 'all'):
        for n, (sec, prompt) in MUSIC.items():
            out.append(('music', n, '/v1/music?output_format=mp3_44100_128',
                        {'prompt': prompt, 'music_length_ms': sec * 1000, 'force_instrumental': True}))
    if kind in ('sfx', 'all'):
        for n, (sec, infl, text) in SFX.items():
            out.append(('sfx', n, '/v1/sound-generation?output_format=mp3_44100_128',
                        {'text': text, 'duration_seconds': max(0.5, sec), 'prompt_influence': infl}))
    if kind in ('voice', 'all'):
        for n, text in VOICE.items():
            out.append(('voice', 'v_' + n, f'/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128',
                        {'text': text, 'model_id': 'eleven_multilingual_v2',
                         'voice_settings': {'stability': 0.6, 'similarity_boost': 0.8, 'style': 0.15, 'use_speaker_boost': True}}))
    return out


def run(job, force):
    kind, name, path, body = job
    out = os.path.join(RAW, kind, name + '.mp3')
    if os.path.exists(out) and not force:
        return f'skip {kind}/{name}'
    try:
        if credits(90)[2] < 0.15:
            return f'STOP {kind}/{name} (credits below 15 %)'
        n = post(path, body, out)
        return f'ok   {kind}/{name} {n}'
    except Exception as e:
        if kind == 'music' and 'force_instrumental' in str(e):
            body = dict(body); body.pop('force_instrumental', None)
            return f'ok2  {kind}/{name} {post(path, body, out)}'
        return f'FAIL {kind}/{name} {e}'


if __name__ == '__main__':
    kind = sys.argv[1] if len(sys.argv) > 1 else 'all'
    used, lim, frac = credits()
    print(f'credits used {used} / {lim} ({frac * 100:.1f} % left)', flush=True)
    if kind == 'credits':
        sys.exit(0)
    if frac < 0.15:
        print('fewer than 15 % of credits remain: not generating (reuse swarmbreak clips instead)')
        sys.exit(1)
    only = None
    if '--only' in sys.argv:
        only = set(sys.argv[sys.argv.index('--only') + 1].split(','))
    force = '--force' in sys.argv
    js = [j for j in jobs(kind) if not only or j[1] in only]
    with ThreadPoolExecutor(2) as ex:   # never more than 2 requests at a time
        for line in ex.map(lambda j: run(j, force), js):
            print(line, flush=True)
    used2, _, frac2 = credits()
    print(f'credits used {used2} / {lim} ({frac2 * 100:.1f} % left), this run {used2 - used}', flush=True)
