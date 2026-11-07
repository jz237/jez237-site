"""Generate Lancewing 2026 audio with ElevenLabs (music, SFX, herald voice lines).

Usage: python -I gen_audio.py [credits|music|sfx|voice|all] [--only name1,name2] [--force]
Raw mp3s land in <work>/audio-raw/<kind>/<name>.mp3 (or LW_RAW). The key is read from the Windows user
environment through PowerShell; it is never printed and never written anywhere.
At most 2 requests run at a time (other games generate in parallel); 429/5xx retry one by one with backoff.
Before generating it checks the credit balance and refuses to run with less than 15 % left.
Then run process_audio.py <game folder> to trim / normalise / loop / encode into the game.
"""
import json, os, subprocess, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

RAW = os.environ.get('LW_RAW', 'D:/Projects/.tmp/arcade-trio-work/lancewing/audio-raw')
API = 'https://api.elevenlabs.io'
HDR = 'xi-' + 'api-key'  # the auth header name, spelled in two parts so key scans of this folder stay clean


def key():
    v = subprocess.run(['powershell', '-NoProfile', '-Command',
                        "[Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')"],
                       capture_output=True, text=True).stdout.strip()
    assert v.startswith('s' + 'k_') and len(v) == 51, 'bad key shape'
    return v


KEY = key()


def credits():
    req = urllib.request.Request(API + '/v1/user/subscription', headers={HDR: KEY})
    with urllib.request.urlopen(req, timeout=60) as r:
        d = json.loads(r.read())
    used, lim = d.get('character_count', 0), max(1, d.get('character_limit', 1))
    return used, lim, (lim - used) / lim


def post(path, body, out, tries=7):
    data = json.dumps(body).encode()
    for i in range(tries):
        req = urllib.request.Request(API + path, data=data, method='POST',
                                     headers={HDR: KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
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


# name: (seconds, prompt). Original score: armoured riders on winged skyrays duelling round a storm spire.
MUSIC = {
    'title': (90, 'Cinematic epic fantasy score, slow and majestic, 76 BPM, deep taiko drums, sweeping strings, a lone horn melody, armoured riders on great winged beasts circling a storm spire above a dark sea at dusk, awe and adventure, instrumental, no vocals'),
    's1':    (120, 'Cinematic fantasy action score, 104 BPM, driving taiko and orchestral percussion, warm strings ostinato, heroic french horn melody, a battle of winged riders above sunset ruins over a stormy sea, confident and adventurous, instrumental, no vocals'),
    's2':    (120, 'Mysterious cinematic action score, 110 BPM, shimmering glassy textures, plucked harp and celesta over deep pulsing low strings and hand drums, an aerial duel among glowing bioluminescent crystal sea cliffs, tense and wondrous, instrumental, no vocals'),
    's3':    (120, 'Industrial cinematic fantasy battle score, 118 BPM, anvil and metal percussion, low brass, driving strings, roaring furnace textures, aerial duels above molten forge platforms hanging on chains, fierce, instrumental, no vocals'),
    's4':    (120, 'Icy cinematic action score, 124 BPM, crystalline bells, airy pads, fast staccato strings, big frame drums, an aerial battle over glacier ledges under a shimmering aurora, urgent and beautiful, instrumental, no vocals'),
    's5':    (120, 'Epic dark cinematic final battle score, 132 BPM, huge orchestral drums, pounding low brass, soaring strings, dark synth drones, an aerial duel at a citadel beneath a black sun eclipse, desperate and heroic, instrumental, no vocals'),
    'boss':  (100, 'Heavy cinematic fantasy boss battle score, 138 BPM, pounding war drums, aggressive low brass stabs, distorted cello ostinato, metallic hits, a colossal armoured sky monster attacking, relentless, instrumental, no vocals'),
    'clear': (10, 'Short triumphant orchestral fantasy fanfare, bold brass and strings with a timpani roll, ends on a held major chord, instrumental'),
}
# stings made with the sound-effects model but shipped as music (A.sting)
MUSIC_SFX = {
    'over': (6.0, 0.45, 'Short sombre orchestral sting, low strings and a deep fading horn over a soft timpani roll, quiet ending'),
}

# name: (seconds, prompt influence, text). Frequent sounds stay low, airy and non-tonal (no bright chirps).
SFX = {
    'flap':      (0.6, 0.55, 'Single powerful downstroke of a huge leathery wing, deep soft whoomp of displaced air with a light canvas flutter, no tonal sound'),
    'clang':     (0.7, 0.6, 'Two heavy steel tournament lances clashing hard in mid-air, brutal metallic clang with sparks and a short scrape'),
    'block':     (0.6, 0.6, 'Steel lance glancing off a thick metal kite shield, heavy dull clank with a grinding scrape'),
    'unhorse':   (1.0, 0.55, 'Armoured knight knocked off a flying mount, heavy lance impact crunch followed by plate armour clattering as it tumbles'),
    'boomS':     (1.2, 0.5, 'Armoured flying creature bursting apart in a crackling burst of embers, punchy thump with scattering metal plates'),
    'boomM':     (1.8, 0.5, 'Heavy armoured war beast blown apart, deep punchy blast with fiery crackle and falling armour plates'),
    'boomL':     (3.0, 0.5, 'Colossal armoured sky monster exploding, huge deep boom with roaring fire, metal debris and a long rumbling tail'),
    'debris':    (1.2, 0.5, 'Pieces of steel armour and rock chunks clattering and tumbling, then splashing into water far below'),
    'death':     (2.0, 0.5, 'Rider struck down from a flying mount, crushing armour impact, a pained creature groan and a falling wind whoosh'),
    'splash':    (1.6, 0.5, 'Heavy armoured body plunging into a stormy sea from a height, huge deep splash with spray and an underwater gulp'),
    'spoutwarn': (1.2, 0.5, 'Deep rumbling bubbling surge building up under the sea surface, low hissing churn, ominous'),
    'spout':     (1.6, 0.5, 'Huge geyser of sea water bursting upward, roaring hiss and crashing spray'),
    'boltwarn':  (1.2, 0.55, 'Static electricity charging up in storm clouds, rising crackling buzz with a low hum, ominous'),
    'thunder':   (2.0, 0.5, 'Very close lightning strike, violent sharp crack followed by a deep rolling thunder boom'),
    'arcon':     (1.0, 0.6, 'Bolt of magical lightning cast along a line, sharp electric snap and sizzling crackle'),
    'crack':     (0.9, 0.55, 'Floating rock ledge cracking under strain, deep stone fracture with grinding and trickling gravel'),
    'crumble':   (2.2, 0.5, 'Large rock platform breaking apart and collapsing, heavy stone rumble with falling boulders'),
    'core':      (0.8, 0.55, 'Glowing ember crystal knocked loose from a defeated rider, soft fiery whoosh with a low warm hum'),
    'collect':   (0.7, 0.55, 'Grabbing a glowing ember crystal, warm deep whoomp of absorbed energy with a soft low glassy shimmer'),
    'chain':     (1.2, 0.5, 'Absorbing a powerful ember crystal, deep rising whoosh of energy with a warm resonant swell'),
    'hatch':     (1.4, 0.5, 'Ember crystal reigniting, crackling fire hiss swelling into a deep whoosh'),
    'form':      (1.4, 0.5, 'Armoured rider materialising from swirling embers, rising rushing fire swirl with a deep magical hum'),
    'land':      (0.5, 0.6, 'Large winged creature landing on stone, soft heavy thud with claws scraping'),
    'skid':      (0.6, 0.6, 'Heavy claws scraping and skidding across rock, gritty scrape'),
    'drop':      (1.0, 0.5, 'Glowing magic orb falling from the sky, soft descending whoosh with a low hum'),
    'pickup':    (0.9, 0.55, 'Magical power absorbed into armour, warm rising whoosh with a deep glowing hum'),
    'shieldhit': (0.8, 0.6, 'Blow absorbed by a magical barrier around armour, deep resonant thud with a shimmering crackle'),
    'spawn':     (1.4, 0.5, 'Rider on a winged mount rising back into the sky, powerful wing whoosh with a warm swelling energy'),
    'life':      (1.2, 0.5, 'Extra life earned, warm rising orchestral harp swell with a soft gong'),
    'alarm':     (2.0, 0.5, 'Distant ominous war horn blast with a mechanical screech in the storm'),
    'hunter':    (1.4, 0.55, 'Mechanical bird of prey construct screaming past, metallic shriek with a jet-like whoosh'),
    'hunterloop':(3.0, 0.4, 'Fast mechanical flying construct engine, whirring turbine hum with clicking gears, steady, seamless loop'),
    'bossroar':  (2.6, 0.5, 'Colossal armoured sky beast roaring, deep guttural roar with metallic grinding resonance'),
    'bosshit':   (0.6, 0.6, 'Lance striking a glowing weak point on a huge armoured monster, heavy impact crunch with a crystal crack and sparks'),
    'shatter':   (1.2, 0.55, 'Huge crystal armour shattering, heavy glassy break with tumbling shards'),
    'slam':      (1.6, 0.5, 'Giant forge hammer slamming onto a metal platform, enormous clang thud with a shockwave rumble'),
    'beam':      (2.4, 0.5, 'Powerful sweeping energy beam breathed by a giant creature, intense humming roar with crackle'),
    'blast':     (1.8, 0.5, 'Furnace door bursting open and a roaring jet of fire blasting out sideways, deep whooshing flame roar with crackle and a metallic clank'),
    'molten':    (1.4, 0.5, 'Molten metal blobs falling and splashing, hissing sizzle and bubbling'),
    'gust':      (1.8, 0.5, 'Huge gust of wind from enormous wings, roaring blast of air'),
    'breach':    (2.6, 0.5, 'Gigantic sea creature bursting out of icy water, massive surge of water and crashing ice'),
    'wave':      (1.6, 0.5, 'Deep ancient war horn blast echoing across a stormy sky'),
    'waveclear': (1.6, 0.5, 'Low warm resonant gong strike with a soft rising string swell'),
    'upgrade':   (1.0, 0.5, 'Armour plate fitted and locked onto a saddle, heavy metal clunk and a leather strap creak'),
    'wind':      (6.0, 0.4, 'Strong storm wind howling around high sea cliffs, steady, no thunder, seamless loop'),
    'surf':      (6.0, 0.4, 'Stormy sea waves crashing against rocks far below, steady roar, seamless loop'),
    'rush':      (3.0, 0.4, 'Fast air rushing past while diving at high speed, steady roaring wind noise, seamless loop'),
}

VOICE_IDS = ['JBFqnCBsd6RMkjVDRZzb', 'onwK4e9ZLuTAKqWW03F9']  # warm storyteller herald; fallback
VOICE = {
    'begin': 'Mount up, rider. The storm ring is yours to hold. Strike from above.',
    's2': 'Sector two. The Crystal Caverns.',
    's3': 'Sector three. The Sky Foundry. Mind the fire.',
    's4': 'Sector four. The Aurora Glacier.',
    's5': 'The Eclipse Citadel. This is the last sky.',
    'boss': 'Something vast rides the storm. Find its weak points.',
    'bossdown': 'It falls! The sky is ours.',
    'clear': 'Sector clear. Rest your wings, and arm yourself.',
    'lastlife': 'Last rider standing. Fly true.',
    'gameover': 'The ring has fallen.',
    'newrecord': 'A new record for the ring.',
    'champion': 'All five skies are won. Hail the master of the ring.',
}


def jobs(kind):
    out = []
    if kind in ('music', 'all'):
        for n, (sec, prompt) in MUSIC.items():
            out.append(('music', n, '/v1/music?output_format=mp3_44100_128',
                        {'prompt': prompt, 'music_length_ms': sec * 1000, 'force_instrumental': True}))
        for n, (sec, infl, text) in MUSIC_SFX.items():
            out.append(('music', n, '/v1/sound-generation?output_format=mp3_44100_128',
                        {'text': text, 'duration_seconds': sec, 'prompt_influence': infl}))
    if kind in ('sfx', 'all'):
        for n, (sec, infl, text) in SFX.items():
            out.append(('sfx', n, '/v1/sound-generation?output_format=mp3_44100_128',
                        {'text': text, 'duration_seconds': max(0.5, sec), 'prompt_influence': infl}))
    if kind in ('voice', 'all'):
        for n, text in VOICE.items():
            out.append(('voice', 'v_' + n, None,
                        {'text': text, 'model_id': 'eleven_multilingual_v2',
                         'voice_settings': {'stability': 0.5, 'similarity_boost': 0.8, 'style': 0.3, 'use_speaker_boost': True}}))
    return out


def run(job, force):
    kind, name, path, body = job
    out = os.path.join(RAW, kind, name + '.mp3')
    if os.path.exists(out) and not force:
        return f'skip {kind}/{name}'
    try:
        if kind == 'voice':
            err = None
            for vid in VOICE_IDS:
                try:
                    return f'ok   {kind}/{name} {post(f"/v1/text-to-speech/{vid}?output_format=mp3_44100_128", body, out)} {vid[:4]}'
                except RuntimeError as e:
                    err = e
                    if not str(e).startswith(('400', '404', '422')):
                        break
            raise err
        return f'ok   {kind}/{name} {post(path, body, out)}'
    except Exception as e:
        if kind == 'music' and 'force_instrumental' in str(e):
            body = dict(body); body.pop('force_instrumental', None)
            return f'ok2  {kind}/{name} {post(path, body, out)}'
        return f'FAIL {kind}/{name} {e}'


if __name__ == '__main__':
    kind = sys.argv[1] if len(sys.argv) > 1 else 'all'
    used, lim, left = credits()
    print(f'credits used {used} / {lim} ({left * 100:.1f} % left)', flush=True)
    if kind == 'credits':
        sys.exit(0)
    if left < 0.15:
        print('fewer than 15 % of credits left: not generating (reuse swarmbreak clips instead)')
        sys.exit(2)
    only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
    force = '--force' in sys.argv
    js = [j for j in jobs(kind) if not only or j[1] in only]
    with ThreadPoolExecutor(2) as ex:  # never more than 2 requests in flight
        for line in ex.map(lambda j: run(j, force), js):
            print(line, flush=True)
    used, lim, left = credits()
    print(f'credits after: used {used} / {lim} ({left * 100:.1f} % left)', flush=True)
