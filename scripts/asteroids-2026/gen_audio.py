"""Generate Asteroids 2026 audio with ElevenLabs (music, SFX, announcer, pilot voices).

Usage: python -I gen_audio.py [music|sfx|voice|all] [--only name1,name2] [--force]
Raw mp3s land in %TEMP%/a26-audio-raw/<kind>/<name>.mp3 (or A26_RAW). The key is read from the
Windows user env (never printed).
"""
import json, os, sys, tempfile, time, urllib.request, urllib.error, winreg
from concurrent.futures import ThreadPoolExecutor

RAW = os.environ.get('A26_RAW', os.path.join(tempfile.gettempdir(), 'a26-audio-raw'))

def key():
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, 'Environment') as k:
        v, _ = winreg.QueryValueEx(k, 'ELEVENLABS_API_KEY')
    assert v.startswith('sk_') and len(v) == 51, 'bad key shape'
    return v

KEY = key()
API = 'https://api.elevenlabs.io'

def post(path, body, out, tries=6):
    data = json.dumps(body).encode()
    for i in range(tries):
        req = urllib.request.Request(API + path, data=data, method='POST',
                                     headers={'xi-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
        try:
            with urllib.request.urlopen(req, timeout=600) as r:
                buf = r.read()
            os.makedirs(os.path.dirname(out), exist_ok=True)
            with open(out, 'wb') as f:
                f.write(buf)
            return len(buf)
        except urllib.error.HTTPError as e:
            msg = e.read()[:300].decode('utf-8', 'replace')
            if e.code in (429, 500, 502, 503) and i < tries - 1:
                time.sleep(4 + 6 * i)
                continue
            raise RuntimeError(f'{e.code} {msg}')
        except Exception:
            if i < tries - 1:
                time.sleep(4 + 6 * i)
                continue
            raise

MUSIC = {
    'title':   (95,  'Epic cinematic space synthwave title theme, 108 BPM, vast shimmering analog pads, heroic soaring lead synth melody over a pulsing bassline, big gated-reverb drums, sense of drifting through a glittering asteroid belt, instrumental, no vocals'),
    'drift':   (120, 'Driving space-synth action instrumental, 124 BPM, rolling sixteenth-note analog bass, bright arpeggios, crisp electronic drums, adventurous asteroid field dogfight, no vocals'),
    'storm':   (120, 'Electric high-tension darksynth instrumental, 132 BPM, crackling distorted bass stabs, stuttering arpeggios, thunderous drums, ion storm in deep space, no vocals'),
    'horizon': (120, 'Dark cosmic ambient-techno instrumental, 118 BPM, deep sub bass pulses, eerie evolving pads, slow menacing arpeggio, heavy kick, black hole dread, no vocals'),
    'comet':   (120, 'Fast euphoric space chase instrumental, 140 BPM, breakbeat drums, soaring supersaw chords, racing arpeggios, comets streaking past, no vocals'),
    'boss':    (120, 'Colossal sci-fi boss battle instrumental, industrial synth and orchestral hybrid, 136 BPM, pounding war drums, roaring brass-like synths, ominous choir pads, alien monster attack, no vocals'),
    'victory': (12,  'Short triumphant space synthwave victory fanfare, bright heroic lead, big drums, ends on a held major chord, instrumental'),
    'defeat':  (9,   'Short melancholic synth defeat jingle, slow descending notes drifting into space, fading out, instrumental'),
}

# name: (seconds, prompt influence, text)
SFX = {
    'shot1': (0.4, 0.6, 'Short punchy retro-futuristic spaceship blaster shot, bright laser pew'),
    'shot2': (0.4, 0.6, 'Quick sci-fi plasma cannon shot, crisp zap with a subtle low thump'),
    'rail': (0.9, 0.6, 'Powerful railgun discharge, electric charge snap and a piercing beam whoosh'),
    'missile': (1.0, 0.5, 'Small homing missile launch, sharp ignition hiss and rising whoosh'),
    'boom_big': (2.2, 0.5, 'Huge asteroid exploding in space, deep rumbling rock blast with crumbling debris'),
    'boom_mid': (1.4, 0.5, 'Medium asteroid shattering explosion, crunchy stone burst with rubble'),
    'boom_small': (0.8, 0.6, 'Small rock shattering, quick crunchy crack and scattering pebbles'),
    'rockhit': (0.4, 0.6, 'Laser bolt striking solid rock, short gritty impact chip'),
    'crystal': (1.2, 0.5, 'Crystal asteroid shattering, glassy chime explosion with sparkles'),
    'gold': (1.4, 0.5, 'Golden treasure asteroid bursting open, shimmering coin chimes and magical sparkle'),
    'ice': (1.0, 0.5, 'Ice asteroid shattering, crisp frozen crack with tinkling ice shards'),
    'thrust': (2.0, 0.4, 'Continuous spaceship engine thrust, steady rocket rumble with an airy hiss, seamless loop'),
    'dash': (0.7, 0.6, 'Spaceship afterburner dash, quick powerful whoosh with a jet burst'),
    'shieldhit': (0.7, 0.6, 'Energy shield absorbing an impact, electric shimmering thud'),
    'hullhit': (0.8, 0.6, 'Spaceship hull taking damage, metallic clang with sparks and a warning chirp'),
    'shipboom': (3.0, 0.5, 'Spaceship exploding, big fiery blast with metal debris and electric crackle'),
    'ko': (4.0, 0.5, 'Colossal final spaceship destruction, massive explosion with a long cinematic rumbling tail'),
    'bump': (0.5, 0.6, 'Spaceship bouncing off a rock, heavy dull thud with a metal scrape'),
    'puspawn': (1.0, 0.5, 'Power-up capsule materializing, rising shimmering sci-fi chime'),
    'pucollect': (0.9, 0.5, 'Bright arcade power-up collected, rising sparkly synth arpeggio'),
    'shieldup': (1.0, 0.5, 'Energy shield bubble powering on, rising hum with crystalline shimmer'),
    'repair': (1.2, 0.5, 'Robotic hull repair, servo whirs and welding zaps, positive chime'),
    'nova': (2.0, 0.5, 'Massive nova bomb shockwave in space, deep boom with an expanding whoosh'),
    'phase': (1.0, 0.5, 'Phase cloak activating, ethereal reversed whoosh with ghostly shimmer'),
    'chrono': (1.2, 0.5, 'Time slowing down effect, descending warped whoosh with a ticking clock'),
    'drone': (1.0, 0.5, 'Small combat drone deploying, mechanical whir and a friendly beep'),
    'mine': (0.6, 0.6, 'Proximity mine dropped, metallic clunk with a beeping arm sound'),
    'mineboom': (1.4, 0.5, 'Space mine detonating, sharp explosive blast'),
    'magnet': (1.0, 0.5, 'Magnetic field humming on, electric magnet buzz rising'),
    'well': (2.5, 0.5, 'Gravity well forming, deep swirling bass vortex rumble'),
    'portal': (0.9, 0.6, 'Warp gate teleport, quick sci-fi zap and warp'),
    'storm': (1.6, 0.5, 'Electric lightning strike in space, sharp crack and sizzling discharge'),
    'comet': (2.0, 0.5, 'Comet streaking past, fiery roaring whoosh'),
    'alarm': (2.0, 0.5, 'Spaceship red alert klaxon, urgent warning siren'),
    'bosscharge': (2.0, 0.5, 'Giant alien weapon charging up, rising ominous energy whine'),
    'bossbeam': (2.0, 0.5, 'Massive alien energy beam firing, roaring searing laser blast'),
    'bossroar': (2.5, 0.5, 'Colossal alien space monster roar, deep guttural mechanical growl'),
    'spawn': (1.2, 0.5, 'Spaceship warping in, rising teleport shimmer and engine ignition'),
    'overdrive': (1.4, 0.5, 'Spaceship overdrive powering up, rising turbine scream and energy surge'),
    'beep': (0.25, 0.7, 'Single short countdown beep, clean digital tone'),
    'go': (0.8, 0.6, 'Launch go signal, bright synth stab with a whoosh'),
    'uimove': (0.2, 0.7, 'Soft futuristic UI tick, short click'),
    'uiok': (0.4, 0.6, 'Futuristic UI confirm sound, bright two-note chime'),
    'uiback': (0.3, 0.6, 'Futuristic UI back sound, soft descending blip'),
    'whoosh': (1.0, 0.5, 'Fast cinematic sci-fi whoosh transition'),
    'rewind': (1.0, 0.5, 'Tape rewind effect, quick reverse warble'),
    'wave': (2.0, 0.5, 'Distant rumble of an approaching asteroid swarm, low ominous rumble'),
    'radio': (0.5, 0.6, 'Short radio static squelch, pilot comm click'),
}

BRIAN = 'nPczCjzI2devNBz1zQrb'
ANNOUNCER = {
    'title': 'Asteroids twenty twenty-six!', 'engage': 'Engage!', 'final': 'Final round!',
    'victory': 'Victory!', 'defeat': 'Defeat.', 'p1wins': 'Player one wins!', 'p2wins': 'Player two wins!',
    'perfect': 'Flawless!', 'comeback': 'What a comeback!', 'boss': 'Warning! The Maw has awakened!',
    'challenger': 'Here comes a new challenger!', 'demo': 'Demo mode.', 'continue': 'Continue?', 'gameover': 'Game over.',
    'champion': 'You are the champion of the belt!', 'replay': 'Instant replay!', 'unlocked': 'New pilot unlocked!',
    'pilot': 'Choose your pilot!', 'online': 'Online battle!', 'found': 'Opponent found!', 'lost': 'Connection lost.',
    'overdrive': 'Overdrive!', 'critical': 'Hull critical!', 'shardstrike': 'Shard strike!', 'comet': 'Comet shower!',
    'storm': 'Ion storm!', 'wave': 'Incoming!', 'goldrock': 'Gold rock!', 'newrecord': 'New high score!',
    'stageclear': 'Sector clear!', 'stolen': 'Stolen!',
    'triple': 'Triple shot!', 'rapid': 'Rapid fire!', 'shield': 'Shields up!', 'missiles': 'Missiles!', 'magnet': 'Magnet!',
    'repair': 'Hull repaired!', 'nova': 'Nova bomb!', 'phase': 'Phase shift!', 'chrono': 'Chrono field!',
    'drone': 'Drone deployed!', 'mines': 'Mines away!', 'rail': 'Railgun!', 'well': 'Gravity well!',
}

PILOTS = {
    'razor': ('IKne3meq5aSn9XLyUdCD', {
        'intro': 'Razor here. Try to keep up, rookie!', 'score': "Ha! Felt that one, didn't ya?", 'hurt': 'Oi! Watch the paint!',
        'lose': 'No way... you actually flew circles round me.', 'win': 'Too slow, mate. Way too slow!', 'taunt': "Is that all you've got?"}),
    'lyra': ('pFZP5JQG7iQjIQuC4Bku', {
        'intro': 'Lyra. One shot is all I ever need.', 'score': 'Clean hit.', 'hurt': 'Hm. You got lucky.',
        'lose': "Impressive... I never saw you coming.", 'win': 'Target eliminated.', 'taunt': 'Breathe... and squeeze.'}),
    'grit': ('N2lVS1w4EtoT3dr4eOWO', {
        'intro': "Forty years I've mined this belt. You're just another rock to crack.", 'score': 'Cracked ya open!',
        'hurt': "Argh! You'll pay for that, kid!", 'lose': "Heh... the belt's yours now, kid.", 'win': 'Back to the scrap heap with you!',
        'taunt': 'Mind the rocks, kid!'}),
    'cipher': ('cjVigY5qzO86Huf0OWal', {
        'intro': 'Cipher online. Calculating your trajectory.', 'score': 'Impact confirmed.', 'hurt': 'Damage detected. Adapting.',
        'lose': 'Error... critical... failure...', 'win': 'Outcome: as calculated.', 'taunt': 'Your evasion pattern is predictable.'}),
    'maw': ('SOYHLrjzK2X1ezoPC6cr', {
        'intro': 'I devour worlds. You are... a crumb.', 'score': 'Feed!', 'hurt': 'You... sting.',
        'lose': 'No... the void... calls me back...', 'win': 'Consumed. Like all the others.', 'taunt': 'Closer, little ship...',
        'phase2': 'Enough! Now you face my true hunger!'}),
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
        for n, text in ANNOUNCER.items():
            out.append(('voice', 'ann_' + n, f'/v1/text-to-speech/{BRIAN}?output_format=mp3_44100_128',
                        {'text': text, 'model_id': 'eleven_multilingual_v2',
                         'voice_settings': {'stability': 0.34, 'similarity_boost': 0.8, 'style': 0.6, 'use_speaker_boost': True}}))
        for p, (vid, lines) in PILOTS.items():
            for n, text in lines.items():
                out.append(('voice', f'{p}_{n}', f'/v1/text-to-speech/{vid}?output_format=mp3_44100_128',
                            {'text': text, 'model_id': 'eleven_multilingual_v2',
                             'voice_settings': {'stability': 0.36, 'similarity_boost': 0.8, 'style': 0.55, 'use_speaker_boost': True}}))
    return out

def run(job, force):
    kind, name, path, body = job
    out = os.path.join(RAW, kind, name + '.mp3')
    if os.path.exists(out) and not force:
        return f'skip {kind}/{name}'
    try:
        n = post(path, body, out)
        return f'ok   {kind}/{name} {n}'
    except Exception as e:
        if kind == 'music' and 'force_instrumental' in str(e):
            body = dict(body); body.pop('force_instrumental', None)
            return f'ok2  {kind}/{name} {post(path, body, out)}'
        return f'FAIL {kind}/{name} {e}'

if __name__ == '__main__':
    kind = sys.argv[1] if len(sys.argv) > 1 else 'all'
    only = None
    if '--only' in sys.argv:
        only = set(sys.argv[sys.argv.index('--only') + 1].split(','))
    force = '--force' in sys.argv
    js = [j for j in jobs(kind) if not only or j[1] in only]
    workers = 3 if kind == 'music' else 5
    with ThreadPoolExecutor(workers) as ex:
        for line in ex.map(lambda j: run(j, force), js):
            print(line, flush=True)
