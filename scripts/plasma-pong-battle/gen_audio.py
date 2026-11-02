"""Generate Plasma Pong Battle audio with ElevenLabs (music, SFX, announcer, pilot voices).

Usage: python -I gen.py [music|sfx|voice|all] [--only name1,name2] [--force]
Raw mp3s land in ./raw/<kind>/<name>.mp3. The key is read from the Windows user env (never printed).
"""
import json, os, sys, tempfile, time, urllib.request, urllib.error, winreg
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.environ.get('PPB_RAW', os.path.join(tempfile.gettempdir(), 'ppb-audio-raw'))

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
    'title':   (95,  'Epic retro synthwave title theme for a futuristic neon battle arena game, 110 BPM, lush analog pads, heroic soaring lead synth melody, punchy gated-reverb drums, pulsing bass, instrumental, no vocals'),
    'neon':    (120, 'High-energy instrumental synthwave battle track, 128 BPM, driving sixteenth-note analog bassline, bright arpeggiated synths, punchy drums with gated reverb snare, neon arcade sport, no vocals'),
    'horizon': (120, 'Dark cosmic darksynth instrumental, 118 BPM, deep distorted bass pulses, ominous evolving pads, eerie cosmic arpeggios, heavy drums, black hole tension, no vocals'),
    'nebula':  (120, 'Funky futuristic electro instrumental, 122 BPM, slap synth bass, bouncy arpeggios, playful neon pinball arcade energy, crisp drum machine, cowbell accents, no vocals'),
    'warp':    (120, 'Fast cyberpunk electronic instrumental, 140 BPM, breakbeat drums, aggressive reese bass, glittering synth stabs, high-speed warp chase, no vocals'),
    'boss':    (120, 'Epic boss battle instrumental, dark industrial synth and orchestra hybrid, 135 BPM, pounding taiko drums, brass-like synth stabs, ominous choir pads, menacing and climactic, no vocals'),
    'victory': (12,  'Short triumphant synthwave victory fanfare, bright heroic lead synth, big drums, ends on a held chord, instrumental'),
    'defeat':  (9,   'Short melancholic synth defeat jingle, slow descending notes, fading out, instrumental'),
}

# name: (seconds, prompt influence, text)
SFX = {
    'hit1': (0.6, 0.6, 'Punchy futuristic plasma paddle hitting an energy ball, crisp electric thwack, very short, arcade'),
    'hit2': (0.5, 0.6, 'Sharp sci-fi energy ball impact on a metal paddle, bright zap ping, very short'),
    'hit3': (0.6, 0.6, 'Deep thumpy electronic impact, neon arcade ball strike with a short sparkle tail'),
    'wall1': (0.5, 0.6, 'Short glassy electric ping as an energy ball bounces off a neon force-field wall'),
    'wall2': (0.5, 0.6, 'Quick bright synthetic tick and zap, ball ricochet off a glowing rail'),
    'smash': (1.2, 0.5, 'Massive powerful energy smash, electric crack with a booming whoosh, sci-fi sports'),
    'serve': (1.0, 0.5, 'Energy ball materializing, rising electric shimmer then a soft pop'),
    'fire1': (0.5, 0.6, 'Short sci-fi plasma blaster shot, punchy laser pew with a low thump'),
    'fire2': (0.5, 0.6, 'Rapid twin laser blaster burst, futuristic arcade weapon'),
    'stun': (1.0, 0.6, 'Electric shock stun, crackling taser zap with buzzing electricity'),
    'boltcell': (0.6, 0.6, 'Laser bolt hitting an energy shield, sizzling impact'),
    'crack': (0.7, 0.6, 'Cracking energy crystal glass, sharp crystalline crack'),
    'shatter': (1.4, 0.5, 'Shattering crystal energy shield, glass explosion with electronic sparkle'),
    'corehit': (2.5, 0.5, 'Huge sci-fi explosion impact on a reactor core, deep boom, electric crackle, debris'),
    'coreboom': (5.0, 0.5, 'Colossal reactor core meltdown explosion, massive boom with long rumbling tail and electrical discharges'),
    'cheer': (4.0, 0.4, 'Huge futuristic arena crowd roaring and cheering after a big hit'),
    'ooh': (2.5, 0.4, 'Large stadium crowd gasping ooh in excitement'),
    'puspawn': (1.2, 0.5, 'Teleport beam materializing a power-up, ascending sci-fi shimmer'),
    'pucollect': (1.0, 0.5, 'Bright arcade power-up collect chime, rising sparkly synth arpeggio'),
    'multi': (1.0, 0.5, 'Energy ball splitting into three, sci-fi whoosh and triple zap'),
    'titan': (1.2, 0.5, 'Mechanical power up growth, servo whir rising to a heavy clunk'),
    'shrink': (1.2, 0.5, 'Shrink ray, descending warbling sci-fi laser'),
    'nova': (1.2, 0.5, 'Plasma fireball ignition, roaring fire whoosh with electric crackle'),
    'repair': (1.5, 0.5, 'Energy shield rebuilding, digital materializing scan with a soft chime'),
    'drone': (1.3, 0.5, 'Small combat drone deploying and powering up, whirring rotor and beep'),
    'singularity': (2.0, 0.5, 'Black hole opening, deep warping sub-bass whoosh with eerie distortion'),
    'ghost': (1.2, 0.5, 'Ghostly phase shift, eerie reversed shimmer, spectral whoosh'),
    'magnet': (1.0, 0.5, 'Magnetic lock clamp, electromagnetic hum and metallic clank'),
    'barrier': (1.3, 0.5, 'Force field shield activating, deep electric hum swelling up'),
    'storm': (2.0, 0.5, 'Lightning strike thunder crack, close electrical explosion'),
    'chrono': (1.5, 0.5, 'Time slowing down, sci-fi pitch dropping tape-stop whoosh'),
    'scope': (0.8, 0.5, 'Targeting computer lock on, quick futuristic beeps'),
    'overdrive': (2.0, 0.5, 'Massive energy overcharge power up, rising synth scream into a booming hit'),
    'bumper': (0.5, 0.6, 'Electronic pinball bumper hit, bright pop with an electric ring'),
    'portal': (0.9, 0.5, 'Warp portal teleport whoosh, swirling sci-fi swoosh'),
    'beep': (0.5, 0.7, 'Single short clean digital countdown beep'),
    'go': (1.0, 0.5, 'Arena start horn, short punchy synth stab with impact'),
    'uimove': (0.5, 0.7, 'Soft futuristic interface hover tick, tiny and subtle'),
    'uiok': (0.6, 0.6, 'Futuristic interface confirm sound, bright two-tone chime'),
    'uiback': (0.5, 0.6, 'Futuristic interface cancel sound, low soft blip'),
    'whoosh': (0.8, 0.5, 'Fast cinematic whoosh for a camera swoop'),
    'slowmo': (1.5, 0.5, 'Bullet time slow motion effect, deep whoomp with stretched reverb'),
    'alarm': (2.5, 0.5, 'Red alert warning klaxon, sci-fi alarm siren'),
    'bosslaser': (1.5, 0.5, 'Heavy charging laser cannon blast, deep and menacing'),
    'ko': (3.0, 0.5, 'Final knockout hit, giant cinematic boom with a ringing aftermath'),
    'arc': (0.6, 0.6, 'Short electric arc crackle'),
    'bhhum': (6.0, 0.4, 'Low ominous droning hum of a black hole, steady and seamless'),
    'rewind': (1.2, 0.55, 'Fast VHS tape rewind whir with a glitchy sci-fi digital sweep, short, arcade replay transition'),
}

ATLAS = 'zfWx5IjUaWGWTId9hv9t'
ANNOUNCER = {
    'title': 'Plasma Pong!', 'battle': 'Battle Edition!',
    'round1': 'Round one!', 'round2': 'Round two!', 'round3': 'Round three!', 'round4': 'Round four!', 'final': 'Final round!',
    'fight': 'Fight!', 'ready': 'Get ready!', 'breach': 'Core breach!', 'critical': 'Critical damage!', 'shielddown': 'Shield down!',
    'destroyed': 'Core destroyed!', 'ko': 'K. O.!', 'victory': 'Victory!', 'defeat': 'Defeat.', 'p1wins': 'Player one wins!',
    'p2wins': 'Player two wins!', 'perfect': 'Perfect!', 'smash': 'Smash!', 'supersmash': 'Super smash!',
    'multi': 'Multi-ball!', 'titan': 'Titan!', 'shrink': 'Shrink ray!', 'nova': 'Nova!', 'repair': 'Shields repaired!',
    'drone': 'Drone deployed!', 'singularity': 'Singularity!', 'ghost': 'Ghost ball!', 'magnet': 'Magnet!',
    'barrier': 'Barrier up!', 'storm': 'Lightning storm!', 'chrono': 'Chrono field!', 'scope': 'Scope online!',
    'overdrive': 'Overdrive!', 'stunned': 'Stunned!', 'boss': 'Warning! The Monolith approaches!',
    'challenger': 'Here comes a new challenger!', 'demo': 'Demo mode.', 'continue': 'Continue?', 'gameover': 'Game over.',
    'comeback': 'What a comeback!', 'matchpoint': 'Match point!', 'rally': 'What a rally!', 'trickshot': 'Trick shot!',
    'denied': 'Denied!', 'champion': 'You are the champion!', 'three': 'Three!', 'two': 'Two!', 'one': 'One!',
    'replay': 'Instant replay!', 'unlocked': 'New pilot unlocked!', 'pilot': 'Choose your pilot!', 'online': 'Online battle!',
    'found': 'Opponent found!', 'lost': 'Connection lost.',
}

PILOTS = {
    'volt': ('TX3LPaxmHKxFdv7VOQHJ', {
        'intro': "Ready to get zapped? Let's light it up!", 'score': 'Zap! Too slow!', 'hurt': 'Whoa! Lucky shot!',
        'lose': "Okay, okay... you're actually good.", 'win': 'Ha! Shocking, right?', 'taunt': 'Gotcha!'}),
    'nyx': ('FGY2WhTYpPnrIDTdsKH5', {
        'intro': 'Now you see me... now you don\'t.', 'score': "Didn't see that one coming, did you?", 'hurt': 'Mm. Clever little thing.',
        'lose': 'Fading... out...', 'win': 'Lights out, darling.', 'taunt': 'Boo.'}),
    'krank': ('SOYHLrjzK2X1ezoPC6cr', {
        'intro': "I'm gonna SMASH you flat!", 'score': 'SMASHED!', 'hurt': "Raaagh! You'll pay for that!",
        'lose': 'No... NOT POSSIBLE!', 'win': 'KRANK SMASH! KRANK WIN!', 'taunt': 'Hit harder!'}),
    'seraph': ('Xb7hH8MSUJpSbSDYk0k2', {
        'intro': 'Analysis complete. Probability of your victory: zero point three percent.', 'score': 'As predicted.',
        'hurt': 'An anomaly. Recalibrating.', 'lose': 'Error... in my model...', 'win': 'The outcome was never in doubt.',
        'taunt': 'Your movement is predictable.'}),
    'monolith': ('ysswSXp8U9dFpzPJqFje', {
        'intro': 'I am the wall you cannot break.', 'score': 'Kneel.', 'hurt': 'You scratch the stone. Nothing more.',
        'lose': 'Impossible... the Monolith... falls...', 'win': 'Dust. As all before you.', 'taunt': 'Your light fades.',
        'phase2': 'ENOUGH! Witness my true form!'}),
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
                        {'text': text, 'duration_seconds': sec, 'prompt_influence': infl}))
    if kind in ('voice', 'all'):
        for n, text in ANNOUNCER.items():
            out.append(('voice', 'ann_' + n, f'/v1/text-to-speech/{ATLAS}?output_format=mp3_44100_128',
                        {'text': text, 'model_id': 'eleven_multilingual_v2',
                         'voice_settings': {'stability': 0.32, 'similarity_boost': 0.8, 'style': 0.65, 'use_speaker_boost': True}}))
        for p, (vid, lines) in PILOTS.items():
            for n, text in lines.items():
                out.append(('voice', f'{p}_{n}', f'/v1/text-to-speech/{vid}?output_format=mp3_44100_128',
                            {'text': text, 'model_id': 'eleven_multilingual_v2',
                             'voice_settings': {'stability': 0.35, 'similarity_boost': 0.8, 'style': 0.6, 'use_speaker_boost': True}}))
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
