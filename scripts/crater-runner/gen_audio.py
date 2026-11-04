"""Generate Crater Runner audio with ElevenLabs (music, SFX, mission-control voice).

Usage: python -I gen_audio.py [music|sfx|voice|all] [--only name1,name2] [--force]
Raw mp3s land in %TEMP%/crater-audio-raw/<kind>/<name>.mp3 (or CR_RAW). The key is read from the
Windows user env (never printed, never written anywhere).
Then run process_audio.py <game folder> to trim / normalise / encode into the game.
"""
import json, os, sys, tempfile, time, urllib.request, urllib.error, winreg
from concurrent.futures import ThreadPoolExecutor

RAW = os.environ.get('CR_RAW', os.path.join(tempfile.gettempdir(), 'crater-audio-raw'))

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
    'title':  (90,  'Cinematic lunar ambient score, slow and vast, 80 BPM, warm analog synth pads, distant piano motif, soft taiko pulse, feeling of looking at Earth from the Moon, hopeful and lonely, instrumental, no vocals'),
    's1':     (120, 'Relaxed cinematic electronic driving music, 96 BPM, warm pulsing synth bass, gentle arpeggios, soft drums, a rover cruising across bright grey lunar highlands at dawn, calm and adventurous, instrumental, no vocals'),
    's2':     (120, 'Moody cinematic electronic track, 104 BPM, deep rolling bass, dark synth pads, steady electronic drums, driving across dark basalt lunar plains, quiet tension, instrumental, no vocals'),
    's3':     (120, 'Crystalline cinematic electronic track, 112 BPM, glassy plucked synths, shimmering pads, crisp drums, icy crater rim at the lunar pole, cold and focused, instrumental, no vocals'),
    's4':     (120, 'Industrial cinematic action track, 120 BPM, metallic percussion, gritty pulsing bass, tense string-like synths, abandoned mining base ruins, danger rising, instrumental, no vocals'),
    's5':     (120, 'Intense nocturnal cinematic electronic action score, 128 BPM, heavy pulsing bass, urgent arpeggios, big drums, dark choir pads, night drive across the far side of the Moon lit by blue earthshine, instrumental, no vocals'),
    'boss':   (100, 'Heavy cinematic boss battle score, 132 BPM, pounding drums, distorted synth bass, brass-like synth stabs, huge alien war machine attacking on the Moon, instrumental, no vocals'),
    'clear':  (10,  'Short warm triumphant cinematic fanfare, synth brass and strings, ends on a held major chord, instrumental'),
    'over':   (9,   'Short sombre cinematic sting, low strings and a fading synth pad, quiet ending, instrumental'),
}

# name: (seconds, prompt influence, text)
SFX = {
    'engine':   (4.0, 0.4, 'Continuous electric rover drive motor hum with gear whine and a low rumble, steady, seamless loop'),
    'tyres':    (4.0, 0.4, 'Continuous crunching of rubber-mesh wheels rolling over dry gravel and fine dust, steady, seamless loop'),
    'jump':     (0.7, 0.6, 'Heavy vehicle suspension springing up, hydraulic thump and a short whoosh'),
    'land':     (0.8, 0.6, 'Heavy six-wheeled rover landing on gravel, deep suspension thud with crunching stones'),
    'landsoft': (0.6, 0.6, 'Soft vehicle landing on dusty ground, muffled thump and a light gravel crunch'),
    'bump':     (0.4, 0.6, 'Vehicle wheel hitting a small rock, short dull knock with suspension creak'),
    'cannon':   (0.5, 0.6, 'Short punchy compact cannon shot, sharp crack with a metallic snap'),
    'flak':     (0.4, 0.6, 'Quick upward anti-air gun shot, tight pop with a rising zip'),
    'boomS':    (1.2, 0.5, 'Small explosion, sharp blast with crackle and scattering debris'),
    'boomM':    (1.8, 0.5, 'Medium explosion, punchy blast with rumble and falling rocks'),
    'boomL':    (3.0, 0.5, 'Huge explosion of a war machine, deep booming blast with metal debris and a long rumbling tail'),
    'rockcrack':(1.0, 0.5, 'Boulder shattering from a shot, crunchy stone crack with rubble falling'),
    'rockhit':  (0.4, 0.6, 'Projectile chipping a rock, short gritty impact'),
    'wallbreak':(1.6, 0.5, 'Stone wall collapsing after a blast, heavy crumbling rocks'),
    'mineboom': (1.4, 0.5, 'Landmine detonating, sharp explosive blast with dirt thrown up'),
    'minebeep': (0.3, 0.7, 'Single short electronic beep from an armed landmine'),
    'tankfire': (0.8, 0.6, 'Small tank cannon firing, deep thump with a whoosh'),
    'tankmove': (3.0, 0.4, 'Small tracked vehicle rolling, clanking treads and engine grumble, seamless loop'),
    'shellhit': (0.6, 0.6, 'Tank shell striking metal armor, heavy clang'),
    'bomb':     (1.6, 0.5, 'Bomb falling, descending whistle'),
    'bombhit':  (1.6, 0.5, 'Bomb impact on rocky ground, thumping blast that tears up the dirt'),
    'flyer':    (3.0, 0.4, 'Alien hover craft engine, pulsing whirring hum, seamless loop'),
    'drone':    (2.0, 0.5, 'Small homing drone, high whining buzz rising in pitch'),
    'alarm':    (2.0, 0.5, 'Vehicle proximity warning, two-tone urgent alarm'),
    'warn':     (0.5, 0.7, 'Short soft cockpit warning chirp, two quick tones'),
    'checkpoint':(1.4, 0.5, 'Pleasant sci-fi checkpoint chime, rising three notes with a soft shimmer'),
    'shieldhit':(0.8, 0.6, 'Energy shield absorbing an impact, electric shimmering thud'),
    'shieldup': (1.0, 0.5, 'Energy shield powering on, rising hum with crystalline shimmer'),
    'crash':    (2.5, 0.5, 'Rover crashing and exploding, metal crunch, fiery blast and tumbling debris'),
    'bosscharge':(2.0, 0.5, 'Giant war machine weapon charging up, rising ominous energy whine'),
    'bossroar': (2.5, 0.5, 'Colossal war machine powering up, deep mechanical groan and hydraulic roar'),
    'bosshit':  (0.6, 0.6, 'Shot hitting heavy armor plating, dense metallic clang with sparks'),
    'spawn':    (1.2, 0.5, 'Rover respawn, rising teleport shimmer and motor spin-up'),
    'upgrade':  (1.0, 0.5, 'Mechanical upgrade installed, servo whir and a bright confirm chime'),
    'medal':    (1.4, 0.5, 'Award medal earned, bright sparkling chime with a soft bell'),
    'beep':     (0.25, 0.7, 'Single short countdown beep, clean digital tone'),
    'go':       (0.8, 0.6, 'Launch go signal, bright synth stab with a whoosh'),
    'uimove':   (0.2, 0.7, 'Soft futuristic UI tick, short click'),
    'uiok':     (0.4, 0.6, 'Futuristic UI confirm sound, bright two-note chime'),
    'uiback':   (0.3, 0.6, 'Futuristic UI back sound, soft descending blip'),
    'whoosh':   (1.0, 0.5, 'Fast cinematic whoosh transition'),
    'rewind':   (1.0, 0.5, 'Tape rewind effect, quick reverse warble'),
    'debris':   (1.2, 0.5, 'Small rocks and metal debris raining down onto gravel'),
}

GEORGE = 'JBFqnCBsd6RMkjVDRZzb'  # calm mission control
VOICE = {
    'title': 'Crater Runner.',
    'begin': 'Rover deployed. Nice and easy out there.',
    's2': 'Sector two. The dark maria.',
    's3': 'Sector three. Ice on the crater rim.',
    's4': 'Sector four. The old mining base.',
    's5': 'Final sector. Night run. Earthshine only.',
    'longhaul': 'Long Haul. See how far you can go.',
    'boss': 'Heads up. Something big ahead.',
    'bossdown': 'Target down. Outstanding driving.',
    'clear': 'Sector clear. Bring her in for upgrades.',
    'lastlife': 'Last rover. Take it steady.',
    'gameover': 'We lost the signal.',
    'newrecord': 'That is a new record.',
    'champion': 'All five sectors. You made it across.',
    'demo': 'Demo run.',
    'replay': 'Instant replay.',
    'partner': 'Your partner is on the line.',
    'halfway': 'Halfway. Keep it rolling.',
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
            out.append(('voice', 'v_' + n, f'/v1/text-to-speech/{GEORGE}?output_format=mp3_44100_128',
                        {'text': text, 'model_id': 'eleven_multilingual_v2',
                         'voice_settings': {'stability': 0.55, 'similarity_boost': 0.8, 'style': 0.25, 'use_speaker_boost': True}}))
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
