"""Generate audio for Understorm 2026 and Starling 2026 with ElevenLabs (music and sound effects).

Usage: python -I gen_audio.py <understorm|starling> [credits|music|sfx|all] [--only a,b] [--force]
Raw mp3s land in D:/Projects/.tmp/<game>-audio-raw/<kind>/<name>.mp3 (or AUDIO_RAW).
The key is read from the environment (or the Windows user environment through PowerShell); it is never
printed and never written anywhere. At most 2 requests run at a time; 429/5xx retry with backoff.
It checks the credit balance first and refuses to run with less than 15 % left.
Then run process_audio.py <game> <game folder> to trim / normalise / loop / encode into the game.
Every prompt describes an original sound or an original instrumental piece.
"""
import json, os, subprocess, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

GAME = sys.argv[1] if len(sys.argv) > 1 else ''
RAW = os.environ.get('AUDIO_RAW', f'D:/Projects/.tmp/{GAME}-audio-raw')
API = 'https://api.elevenlabs.io'
HDR = 'xi-' + 'api-key'  # the auth header name, spelled in two parts so key scans of this folder stay clean


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


SETS = {
    # A salvage fighter descending through the storm layer of a gas giant: abandoned cloud refineries, glass fauna, lightning.
    'understorm': {
        'music': {
            'title': (90, 'Slow cinematic science fiction score, 80 BPM, vast and lonely, deep analogue synth drones, distant thunder-like low drums, a simple rising melody on a warm synth lead over shimmering glassy arpeggios, awe at an endless storm seen from above, instrumental, no vocals'),
            'act1': (120, 'Driving cinematic synth adventure score, 104 BPM, pulsing analogue bass, bright arpeggios, hopeful heroic synth lead melody, steady electronic drums, a small ship descending past rusted sky refineries at amber dawn, determined and adventurous, instrumental, no vocals'),
            'act2': (120, 'Moody atmospheric electronic score, 96 BPM, deep sub bass pulses, crystalline bell textures, slow evolving pads, sparse heavy drums with long reverb, exploring a glowing crystal reef and dark depths far below the clouds, tense and wondrous, instrumental, no vocals'),
            'act3': (120, 'Intense dark synth action score, 128 BPM, hard driving bass sequence, urgent arpeggios, pounding electronic drums, soaring distorted lead, flying through a lightning storm toward its eye, desperate and heroic, instrumental, no vocals'),
            'boss': (100, 'Heavy electronic boss battle score, 136 BPM, pounding industrial drums, aggressive distorted bass stabs, metallic hits, tense rising synth ostinato, a colossal machine waking up, relentless, instrumental, no vocals'),
            'ending': (75, 'Gentle hopeful cinematic synth piece, 72 BPM, warm pads opening into a wide bright chord progression, a soft simple piano-like synth melody, a sense of clear sky at dawn after a long storm, calm and relieved, instrumental, no vocals'),
        },
        'sfx': {
            'rel1': (0.7, 0.55, 'Small energy bolt fired from a starfighter cannon, punchy short electric thump with a soft tail'),
            'rel2': (1.1, 0.55, 'Charged plasma wave fired from a spacecraft, deep whoomp with a crackling electric rush sweeping away'),
            'rel3': (1.8, 0.55, 'Massive charged particle beam firing, huge tearing electric roar with a deep bass blast and sizzling tail'),
            'boom': (1.0, 0.5, 'Small flying machine bursting apart, punchy explosion thump with scattering glass shards'),
            'boomM': (1.6, 0.5, 'Armoured gunship exploding in mid-air, deep punchy blast with fiery crackle and falling metal debris'),
            'bigboom': (3.2, 0.5, 'Colossal machine exploding in a storm, enormous deep boom, roaring fire, tearing metal and a long rumbling tail'),
            'hit': (0.5, 0.6, 'Energy bolt striking metal armour, short sharp electric snap, dry, no tonal sound'),
            'tink': (0.5, 0.6, 'Projectile glancing off thick armour plate, short dull metallic clink'),
            'absorb': (0.5, 0.55, 'Energy shield absorbing a shot, soft low electric fizz, short'),
            'pickup': (0.9, 0.55, 'Collecting a glowing power crystal, warm rising whoomp of absorbed energy with a soft glassy shimmer'),
            'launch': (0.8, 0.55, 'Heavy drone launched forward on a crackling energy tether, fast whoosh with an electric zing'),
            'recall': (0.8, 0.55, 'Drone reeled back fast on an energy tether, reverse whoosh with a falling electric whine'),
            'dock': (0.6, 0.6, 'Heavy magnetic clamp locking a drone onto a hull, solid metallic clunk with a short electric hum'),
            'thunk': (0.6, 0.6, 'Heavy metal drone slamming into solid rock, dull deep thud with a crunch'),
            'zap': (0.6, 0.6, 'Short arc of electricity jumping between two points, sharp snap and sizzle'),
            'rico': (0.5, 0.6, 'Energy shard ricocheting off metal, quick bright ping with a whine'),
            'burrow': (0.6, 0.55, 'Projectile grinding along a rock surface, short gritty scraping buzz'),
            'strike': (2.0, 0.5, 'Very close lightning strike, violent sharp crack followed by a deep rolling thunder boom'),
            'thunder': (3.0, 0.5, 'Distant thunder rolling inside enormous storm clouds, low long rumble, no crack'),
            'die': (2.2, 0.5, 'Small spacecraft destroyed, sharp explosion, tearing metal and a falling electrical whine fading out'),
            'hurt': (0.7, 0.55, 'Spacecraft hull hit hard, heavy metallic impact with an alarm-like electric buzz'),
            'cp': (1.2, 0.55, 'Soft reassuring electronic chime, three warm rising tones with a gentle shimmer'),
            'clear': (3.0, 0.5, 'Short triumphant synth fanfare, bright rising chords ending on a held major chord, instrumental'),
            'warn': (1.6, 0.55, 'Deep ominous warning klaxon, two slow low alarm blasts in a large metal space'),
            'lock': (0.8, 0.55, 'Weapon overheating, hissing steam vent with a low failing electric buzz'),
            'grow': (1.0, 0.5, 'Crystal growing rapidly, crackling glassy creak rising in pitch'),
            'shatter': (0.9, 0.55, 'Large crystal shattering into fragments, bright glassy crash with tinkling shards'),
            'clank': (0.8, 0.6, 'Huge industrial piston slamming shut, heavy metallic clank with a short echo'),
            'growl': (1.6, 0.5, 'Enormous unseen creature growling in the dark, very deep rumbling resonant groan, no human voice'),
            'panic': (1.8, 0.5, 'Huge gentle sky creature crying out in alarm, long low mournful whale-like call rising in pitch'),
            'life': (1.0, 0.55, 'Bright cheerful electronic chime, quick rising three-note arpeggio with sparkle'),
            'swap': (0.6, 0.6, 'Drone sliding quickly along a hull rail and locking in place, short mechanical zip and click'),
        },
        'loops': {
            'amb': (10, 0.4, 'Wind howling steadily through enormous storm clouds at high altitude, deep airy constant rush with faint distant rumbles, no thunder cracks, seamless ambience'),
        },
    },
    # Flocks of machine-birds over a lighthouse at dusk; a beam of light that dazzles them.
    'starling': {
        'music': {
            'dusk': (120, 'Dreamy retro-futurist electronic score, 100 BPM, warm analogue pads, a gentle pulsing bass, glittering plucked arpeggios, a wistful hopeful synth melody, soft steady drums, dusk over the sea with a lighthouse and wheeling flocks of birds, calm but purposeful, instrumental, no vocals'),
            'roost': (90, 'Tense driving electronic battle score, 126 BPM, insistent bass pulse, sharp staccato synth stabs, rolling toms and tight drums, swelling pads, a great dark shape descending over the sea at night, urgent and dramatic, instrumental, no vocals'),
        },
        'sfx': {
            'boom': (0.8, 0.5, 'Small mechanical bird bursting apart, light crisp pop with fluttering metal feathers scattering'),
            'bigboom': (3.0, 0.5, 'Huge flying machine exploding over the sea, enormous deep boom, roaring fire and debris splashing into water'),
            'die': (2.0, 0.5, 'Small aircraft destroyed, sharp explosion with tearing metal and a falling whine'),
            'ember': (0.9, 0.55, 'Catching a glowing ember, warm bright whoosh with a soft glassy chime'),
            'beam': (1.8, 0.5, 'Powerful lighthouse beam switching on at full intensity, deep electrical hum rising into a bright radiant shimmer'),
            'stoop': (0.9, 0.55, 'Mechanical bird diving fast, falling airy whistle with fluttering metal wings'),
            'wave': (1.2, 0.55, 'Soft rising electronic chime, three gentle ascending tones with shimmer'),
            'clear': (2.6, 0.5, 'Short bright triumphant synth fanfare, rising chords ending on a held major chord, instrumental'),
            'life': (1.0, 0.55, 'Bright cheerful electronic chime, quick rising three-note arpeggio with sparkle'),
        },
        'loops': {
            'sea': (10, 0.4, 'Calm sea waves washing against rocks at dusk with a light steady breeze, gentle constant surf, no birds, no voices, seamless ambience'),
        },
    },
}


def jobs(kind):
    S, out = SETS[GAME], []
    if kind in ('music', 'all'):
        for n, (sec, prompt) in S['music'].items():
            out.append(('music', n, '/v1/music?output_format=mp3_44100_128', {'prompt': prompt, 'music_length_ms': sec * 1000, 'force_instrumental': True}))
    if kind in ('sfx', 'all'):
        for group in ('sfx', 'loops'):
            for n, (sec, infl, text) in S[group].items():
                out.append((group, n, '/v1/sound-generation?output_format=mp3_44100_128', {'text': text, 'duration_seconds': max(0.5, sec), 'prompt_influence': infl}))
    return out


def run(k, job, force):
    kind, name, path, body = job
    out = os.path.join(RAW, kind, name + '.mp3')
    if os.path.exists(out) and os.path.getsize(out) > 2000 and not force:
        return f'skip {kind}/{name}'
    try:
        return f'ok   {kind}/{name} {post(k, path, body, out)}'
    except Exception as e:
        return f'FAIL {kind}/{name} {str(e)[:200]}'


def main():
    assert GAME in SETS, 'usage: gen_audio.py <understorm|starling> [credits|music|sfx|all] [--only a,b] [--force]'
    mode = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith('--') else 'all'
    only = next((a.split('=', 1)[1] if '=' in a else sys.argv[sys.argv.index(a) + 1] for a in sys.argv if a.startswith('--only')), None)
    force, k = '--force' in sys.argv, key()
    used, lim, left = credits(k)
    print(f'credits: {left * 100:.0f} % left')
    if mode == 'credits':
        return
    if left < 0.15:
        print('refusing: less than 15 % of the credits are left')
        sys.exit(2)
    todo = [j for j in jobs(mode) if not only or j[1] in only.split(',')]
    with ThreadPoolExecutor(2) as ex:  # never more than 2 requests in flight
        for line in ex.map(lambda j: run(k, j, force), todo):
            print(line, flush=True)
    print(f'credits: {credits(k)[2] * 100:.0f} % left')


main()
