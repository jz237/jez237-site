"""Generate Swarmbreak audio with ElevenLabs (music, SFX, dispatch voice).

Usage: python -I gen_audio.py [music|sfx|voice|all] [--only name1,name2] [--force]
Raw mp3s land in %TEMP%/swarm-audio-raw/<kind>/<name>.mp3 (or SB_RAW). The key is read from the
Windows user env (never printed, never written anywhere).
Then run process_audio.py <game folder> to trim / normalise / encode into the game.
"""
import json, os, sys, tempfile, time, urllib.request, urllib.error, winreg
from concurrent.futures import ThreadPoolExecutor

RAW = os.environ.get('SB_RAW', os.path.join(tempfile.gettempdir(), 'swarm-audio-raw'))

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
    'title': (90, 'Cinematic dystopian city score at dusk, slow and tense, 78 BPM, deep synth drones, distant heartbeat drum, a lonely piano motif, rain-soaked rooftops and a city under siege by machines, hopeful undertone, instrumental, no vocals'),
    's1':    (120, 'Steady cinematic electronic action track, 100 BPM, warm analog bass pulse, crisp drums, bright arpeggios, a lone armoured hero holding a rooftop garden against a swarm of machines at sunset, confident and not too intense, instrumental, no vocals'),
    's2':    (120, 'Dark cinematic electronic action track, 108 BPM, dripping echoing percussion, deep sub bass, metallic synth stabs, a fight in a flooded underground metro station, tense, instrumental, no vocals'),
    's3':    (120, 'Industrial cinematic action track, 116 BPM, heavy hammering metal percussion, distorted bass, furnace roar textures, battle on a molten steel foundry floor, driving, instrumental, no vocals'),
    's4':    (120, 'Cold precise cinematic electronic action track, 122 BPM, glitchy pulsing synths, tight drums, digital textures, a battle among humming server racks in a data vault, urgent, instrumental, no vocals'),
    's5':    (120, 'Epic intense cinematic electronic action score, 130 BPM, huge drums, pounding bass, soaring dark synth leads, choir pads, thunderstorm over a glowing reactor core, final battle, instrumental, no vocals'),
    'boss':  (100, 'Heavy cinematic boss battle score, 136 BPM, pounding war drums, distorted synth bass, brass-like stabs, a giant war machine stomping into the arena, relentless, instrumental, no vocals'),
    'clear': (10, 'Short triumphant cinematic fanfare, bold synth brass and strings, ends on a held major chord, instrumental'),
    'over':  (9, 'Short sombre cinematic sting, low strings and a fading synth pad, quiet ending, instrumental'),
}

# name: (seconds, prompt influence, text)
SFX = {
    'gun':       (0.5, 0.6, 'Single short sci-fi energy blaster shot, tight punchy zap with a bright snap'),
    'hit':       (0.4, 0.6, 'Energy bolt hitting a small robot, sharp metallic tick with a sizzle'),
    'clang':     (0.5, 0.6, 'Energy bolt striking heavy armour plate, dense metallic clang'),
    'pop':       (0.6, 0.6, 'Small robot bursting apart, short electric pop with tinkling metal bits'),
    'boomS':     (1.2, 0.5, 'Small explosion of a robot, sharp blast with crackle and scattering metal'),
    'boomM':     (1.8, 0.5, 'Medium explosion of a heavy machine, punchy blast with rumble and falling metal'),
    'boomL':     (3.0, 0.5, 'Huge explosion of a giant war machine, deep booming blast with metal debris and a long rumbling tail'),
    'scrap':     (0.8, 0.6, 'Robot powering down, descending electronic whine with a soft clunk'),
    'debris':    (1.2, 0.5, 'Small metal debris and bolts raining down onto concrete'),
    'spitcharge':(0.9, 0.6, 'Sci-fi turret charging a shot, short rising electric whine'),
    'spitfire':  (0.6, 0.6, 'Sci-fi plasma bolt launched from a turret, wet zap with a whoosh'),
    'hivetell':  (1.0, 0.5, 'Alien machine hive pulsing before releasing drones, throbbing organic electronic swell'),
    'hivespawn': (0.6, 0.6, 'Small drone launched from a pod, quick pneumatic puff and buzz'),
    'dart':      (2.0, 0.4, 'Small angry flying drone, high whining buzz, steady, seamless loop'),
    'crawl':     (3.0, 0.4, 'Many small metal robot spiders skittering on concrete, clicking legs, steady, seamless loop'),
    'brute':     (3.0, 0.4, 'Heavy tracked loader machine rolling, clanking treads and diesel-electric grumble, seamless loop'),
    'arc':       (2.0, 0.4, 'Continuous high-voltage electric arc crackling between two pylons, seamless loop'),
    'arcon':     (0.8, 0.6, 'Electric arc snapping on between two pylons, sharp crack and buzz'),
    'portal':    (1.4, 0.5, 'Heavy blast door warning, rising mechanical hum with a low alarm tone'),
    'enter':     (0.8, 0.6, 'Robots teleporting in, quick digital materialise shimmer with a thump'),
    'rescue':    (1.0, 0.6, 'Warm pleasant rescue chime, bright two-note bell with a soft shimmer'),
    'rescue5':   (1.4, 0.6, 'Triumphant sparkling chime, rising five-note bell arpeggio with shimmer'),
    'lost':      (0.9, 0.6, 'Sad descending electronic tone with a dull crunch'),
    'pulse':     (1.6, 0.5, 'Massive sci-fi energy pulse shockwave blast, deep whomp with a crackling electric ring'),
    'shieldhit': (0.8, 0.6, 'Energy shield absorbing an impact, electric shimmering thud'),
    'death':     (2.2, 0.5, 'Armoured exo-suit destroyed, metal crunch, electric failure and a fiery blast'),
    'spawn':     (1.2, 0.5, 'Exo-suit teleporting back in, rising shimmer and servo spin-up with a bass thump'),
    'wave':      (1.2, 0.5, 'Sci-fi wave start alert, two deep horn blasts with a synth swell'),
    'waveclear': (1.4, 0.5, 'Pleasant sci-fi all-clear chime, rising three notes with a soft shimmer'),
    'alarm':     (2.0, 0.5, 'Urgent facility alarm klaxon, two-tone warning'),
    'bossroar':  (2.5, 0.5, 'Colossal war machine powering up, deep mechanical groan and hydraulic roar'),
    'bosshit':   (0.5, 0.6, 'Shot hitting the thick armour of a huge machine, heavy metallic clang with sparks'),
    'stomp':     (1.6, 0.5, 'Giant mechanical foot stomping concrete, huge thud with a shockwave rumble'),
    'bosscharge':(1.8, 0.5, 'Giant war machine weapon charging up, rising ominous energy whine'),
    'slam':      (1.4, 0.5, 'Huge metal machine crashing into a concrete wall, massive impact with crumbling debris'),
    'beam':      (2.5, 0.5, 'Powerful sweeping laser beam firing, intense humming roar with crackle'),
    'molten':    (1.6, 0.5, 'Molten metal splashing onto the floor, hissing sizzle and bubbling'),
    'life':      (1.2, 0.5, 'Extra life earned, bright rising arcade-style power-up chime'),
    'upgrade':   (1.0, 0.5, 'Mechanical upgrade installed, servo whir and a bright confirm chime'),
    'medal':     (1.4, 0.5, 'Award medal earned, bright sparkling chime with a soft bell'),
    'warn':      (0.5, 0.7, 'Short soft cockpit warning chirp, two quick tones'),
    'step':      (0.3, 0.7, 'Single heavy robotic exo-suit footstep on concrete, short servo whir and thud'),
    'uimove':    (0.2, 0.7, 'Soft futuristic UI tick, short click'),
    'uiok':      (0.4, 0.6, 'Futuristic UI confirm sound, bright two-note chime'),
    'uiback':    (0.3, 0.6, 'Futuristic UI back sound, soft descending blip'),
    'rewind':    (1.0, 0.5, 'Tape rewind effect, quick reverse warble'),
    'pickup':    (0.9, 0.6, 'Sci-fi power-up collected, bright rising energy chime with a crisp sparkle'),
    'pwend':     (0.7, 0.6, 'Sci-fi power-up running out, short descending electronic blip'),
    'drop':      (1.2, 0.5, 'Supply pod landing, soft pneumatic thump with a rising hum'),
    'warp':      (1.6, 0.5, 'Time slowing down effect, deep descending whoosh with a stretched reverb tail'),
    'surge':     (1.0, 0.6, 'High-voltage electrical surge through flood water, sharp crackling zap with a buzzing hiss'),
    'laser':     (1.2, 0.6, 'Security laser grid switching on, bright humming electronic zap'),
    'thunder':   (1.8, 0.5, 'Close lightning strike, sharp crack followed by a rolling thunder boom'),
    'hazwarn':   (0.8, 0.6, 'Industrial hazard warning, short rising two-tone siren chirp'),
    'leap':      (0.9, 0.6, 'Robotic creature springing into the air, hydraulic hiss and a sharp mechanical whoosh'),
    'reveal':    (1.2, 0.6, 'Disguised robot revealing itself, tearing fabric and a distorted mechanical shriek'),
    'block':     (0.5, 0.6, 'Energy bolt glancing off a heavy riot shield, bright metallic ping with a scrape'),
}

VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'  # calm dispatch
VOICE = {
    'begin': 'Warden, you are on the ground. Get those people out.',
    's2': 'Sector two. The flooded metro.',
    's3': 'Sector three. The foundry floor. Watch the heat.',
    's4': 'Sector four. The data vault.',
    's5': 'Final sector. The storm reactor. Everything they have left.',
    'stand': 'Last stand. Hold the line as long as you can.',
    'boss': 'Something big is coming through.',
    'bossdown': 'It is down. Outstanding work.',
    'clear': 'Sector clear. Come in for a refit.',
    'lastlife': 'That is your last suit, Warden. Careful.',
    'gameover': 'We lost the Warden.',
    'newrecord': 'That is a new record.',
    'champion': 'All five sectors. The city is yours.',
    'replay': 'Instant replay.',
    'partner': 'Your partner is on the line.',
    'halfway': 'Halfway through. Keep them moving.',
    'chain': 'Five in a row. Beautiful.',
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
                         'voice_settings': {'stability': 0.55, 'similarity_boost': 0.8, 'style': 0.2, 'use_speaker_boost': True}}))
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
