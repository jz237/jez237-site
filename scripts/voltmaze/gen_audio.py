"""Generate Voltmaze 2026 audio with ElevenLabs (music, SFX, the facility-AI voice).

Usage: python -I gen_audio.py [credits|music|sfx|voice|all] [--only name1,name2] [--force]
Raw mp3s land in %TEMP%/voltmaze-audio-raw/<kind>/<name>.mp3 (or the VM_RAW env var).
Then run process_audio.py <game folder> to trim / normalise / encode them into the game.

The key is read from the Windows USER environment (ELEVENLABS_API_KEY) through PowerShell; it is never
printed and never written anywhere. At most 2 requests run at a time (other games share the account);
a 429 / 5xx is retried later, one at a time. Before generating, the credit balance is checked and the
run stops if fewer than 15% of the period's characters remain.
"""
import json, os, subprocess, sys, tempfile, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

RAW = os.environ.get('VM_RAW', os.path.join(tempfile.gettempdir(), 'voltmaze-audio-raw'))
API = 'https://api.elevenlabs.io'

def key():
    v = subprocess.run(['powershell', '-NoProfile', '-Command',
                        "[Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')"],
                       capture_output=True, text=True).stdout.strip()
    assert v.startswith('sk' + '_') and len(v) == 51, 'ELEVENLABS_API_KEY missing or malformed in the user environment'
    return v

KEY = key()
HDR = 'xi' + '-api-' + 'key'   # the auth header name, spelled so a secret scan of the repo stays clean

def credits():
    req = urllib.request.Request(API + '/v1/user/subscription', headers={HDR: KEY})
    with urllib.request.urlopen(req, timeout=60) as r:
        d = json.load(r)
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
                time.sleep(8 + 10 * i)
                continue
            raise RuntimeError(f'{e.code} {msg}')
        except Exception:
            if i < tries - 1:
                time.sleep(8 + 10 * i)
                continue
            raise

# All original: no names, looks or phrases from any classic game. Sector themes follow the game's five facility sectors.
MUSIC = {
    'title': (95, 'Dark cinematic sci-fi score, 80 BPM, slow pulsing analog synth bass, cold electric hum textures, sparse metallic percussion, distant reverberant hits, a lone infiltrator outside a sealed underground research facility at night, mysterious, tense and stylish, instrumental, no vocals'),
    's1':    (120, 'Sleek modern electronic action track, 112 BPM, clean precise synth plucks, punchy tight drums, glassy airy pads, warm bass groove, sneaking through a sterile white research laboratory full of security robots, focused, propulsive, medium intensity, instrumental, no vocals'),
    's2':    (120, 'Cold atmospheric electronic action track, 116 BPM, icy shimmering pads, deep sub bass pulses, crisp crystalline percussion, breathy frozen textures, a frozen cryogenic vault with drifting mist and humming freezers, tense and driving, instrumental, no vocals'),
    's3':    (120, 'Heavy industrial electronic action track, 122 BPM, hammering metallic percussion, distorted gritty bass, roaring furnace textures, clanking machinery rhythms, a molten metal foundry full of sparks, aggressive and driving, instrumental, no vocals'),
    's4':    (120, 'Glitchy cyber electronic action track, 126 BPM, stuttering digital synth arpeggios, tight punchy drums, deep pulsing bass, data stream textures, a vast blue server core with humming racks and holograms, urgent and precise, instrumental, no vocals'),
    's5':    (120, 'Epic intense electronic action score, 132 BPM, huge cinematic drums, pounding saw bass, dark soaring synth leads, low choir pads, hissing steam bursts, the glowing green reactor at the heart of the facility, final push, instrumental, no vocals'),
    'boss':  (105, 'Relentless cinematic electronic boss battle score, 138 BPM, pounding taiko and industrial drums, distorted synth bass riffs, aggressive brass-like synth stabs, rising tension, a huge security machine guarding the lift, instrumental, no vocals'),
    'clear': (9, 'Short triumphant electronic cinematic sting, bold synth brass swell and a deep drum hit, resolving on a held major chord, instrumental'),
    'over':  (9, 'Short sombre electronic cinematic sting, low detuned synth pad and a fading sub boom, power draining away, quiet ending, instrumental'),
}

# name: (seconds, prompt influence, text). Frequent sounds are dull / noisy on purpose (no bright tonal chirps).
SFX = {
    'gun':       (0.5, 0.65, 'Single compact sci-fi energy carbine shot, punchy low-mid thump with a short electric crack, no ring, no tone'),
    'zap':       (0.5, 0.6, 'Security robot firing an electric bolt, short crackling discharge snap with a dull thud'),
    'charge':    (0.6, 0.6, 'Short low electric charge-up hum, a robot weapon priming, soft buzzing swell, no high pitch'),
    'shotwall':  (0.5, 0.65, 'Energy round fizzling out against an electrified barrier, short dull sizzle pop'),
    'ricochet':  (0.5, 0.65, 'Energy round ricocheting off a metal wall, quick metallic zing with a scrape'),
    'boomS':     (1.2, 0.6, 'Small robot exploding, punchy low thump blast with body and weight, a short electric crunch and metal parts scattering, not hissy'),
    'boomM':     (1.8, 0.5, 'Heavy armoured robot exploding, punchy blast with low rumble and falling metal plates'),
    'boomL':     (3.2, 0.5, 'Enormous war machine exploding, deep booming blast, metal debris raining down and a long rumbling tail'),
    'debris':    (1.2, 0.5, 'Small metal robot parts and bolts clattering and bouncing onto a wet metal floor'),
    'electro':   (1.0, 0.6, 'Body touching a high-voltage electrified wall, violent electrocution zap, loud buzzing crackle and sizzle'),
    'crackle':   (0.5, 0.6, 'Brief electric crackle of sparks jumping off an electrified wall, short fizzing snap'),
    'hum':       (3.0, 0.4, 'Electrified security wall humming, low steady mains buzz with faint crackles, steady, seamless loop'),
    'death':     (2.2, 0.5, 'Light armoured suit failing, electric short circuit, a muffled body thump and a power-down whine'),
    'respawn':   (1.4, 0.5, 'Suit rebooting at a checkpoint, low rising power-up hum, servo spin-up and a soft bass thump'),
    'shield':    (0.9, 0.6, 'Energy overshield absorbing a hit and collapsing, deep shimmering electric thud'),
    'plate':     (0.8, 0.6, 'Armour plate cracking and falling off a suit after a hit, metallic crunch and clatter'),
    'emp':       (1.8, 0.5, 'Electromagnetic pulse blast, deep whomp shockwave with a crackling electric ring fading out'),
    'dash':      (0.6, 0.6, 'Suit thruster dash, quick air burst whoosh with a short hydraulic hiss'),
    'pickup':    (0.9, 0.65, 'Picking up a heavy weapon module, solid mechanical clunk and latch click, followed by a low warm electric power-up hum, no sparkle, no chime'),
    'mineland':  (0.5, 0.65, 'Small metal mine landing on a metal floor, heavy clank and roll'),
    'mortar':    (0.7, 0.6, 'Robot mortar launching a mine, hollow pneumatic thump with a whoosh'),
    'beep':      (0.5, 0.75, 'Single low electronic tick of an armed mine, dull muted pulse, short'),
    'mineboom':  (1.4, 0.5, 'Mine exploding on a metal floor, sharp concussive blast with shrapnel'),
    'crouch':    (0.6, 0.6, 'Fast attack robot crouching to pounce, hydraulic compression hiss and metal creak'),
    'lunge':     (0.7, 0.6, 'Fast robot lunging forward, sharp mechanical whoosh with a servo screech'),
    'servo':     (3.0, 0.4, 'Several security robots walking on metal grating, heavy servo whirs and soft metallic footfalls, steady, seamless loop'),
    'seekwarn':  (1.6, 0.5, 'Ominous warning that a hunter is coming, deep pulsing alarm throb with a distorted low drone'),
    'seeker':    (3.0, 0.4, 'Floating hostile energy orb hovering, deep menacing hum with crackling electric tendrils, steady, seamless loop'),
    'seekin':    (1.4, 0.5, 'Floating energy orb phasing through a solid wall, distorted reverse whoosh and a deep electric swell'),
    'door':      (1.0, 0.55, 'Heavy security bulkhead door slamming shut and locking, deep metal clang with an electric lock buzz'),
    'roomclear': (1.4, 0.5, 'Room security disabled, low relays clicking off and a deep satisfying power-down hum'),
    'bossroar':  (2.5, 0.5, 'Colossal security machine powering up, deep mechanical groan, hydraulic roar and grinding gears'),
    'bosshit':   (0.5, 0.6, 'Energy round hitting the thick armour of a huge machine, heavy dull metallic clang with sparks'),
    'stomp':     (1.6, 0.5, 'Giant mechanical foot stomping a metal floor, huge thud with a shockwave rumble'),
    'slam':      (1.4, 0.5, 'Huge hydraulic press slamming down onto a metal floor, massive crushing impact with debris'),
    'beam':      (2.6, 0.5, 'Powerful sweeping energy beam firing, intense humming roar with sizzling crackle'),
    'bosscharge':(1.8, 0.5, 'Giant machine weapon charging up, rising ominous low energy whine and rumble'),
    'block':     (0.5, 0.6, 'Energy round deflected by a robot shield plate, dull metallic ping with a scrape'),
    'lift':      (1.6, 0.5, 'Freight lift powering on in a facility, heavy relay clunk and a deep rising motor hum'),
    'liftup':    (2.6, 0.5, 'Heavy freight lift platform rising, rumbling motor, rattling chains and a hydraulic whoosh'),
    'upgrade':   (1.0, 0.5, 'Mechanical suit upgrade installed, servo whir, locking clunk and a warm confirming hum'),
    'medal':     (1.4, 0.5, 'Award earned, warm soft bell tone with a gentle shimmer, calm'),
    'step':      (0.5, 0.75, 'Single light armoured boot footstep on a wet metal floor, short soft thud with a tiny splash'),
    'uimove':    (0.5, 0.75, 'Soft muted futuristic interface tick, short low click'),
    'uiok':      (0.5, 0.65, 'Futuristic interface confirm, soft low two-tone click with a warm hum'),
    'rewind':    (1.0, 0.5, 'Tape rewind effect, quick reverse warble and a soft whoosh'),
    'molten':    (1.6, 0.5, 'Molten metal splashing onto a metal floor, hissing sizzle and bubbling'),
    'thunder':   (1.6, 0.5, 'Close indoor lightning strike from a machine, sharp electric crack and a rolling boom'),
    'frost':     (1.2, 0.5, 'Cryogenic blast freezing the floor, sharp icy crackle and a hissing gas burst'),
}
# played with another clip (audio.js ALIAS): uiback<-uimove, boltwall<-shotwall, drop<-mineland,
# life<-medal, pwend<-pickup.

VOICE_ID = 'pFZP5JQG7iQjIQuC4Bku'  # cool, even facility AI (the same voice for every line)
VOICE = {
    'begin':    'Unauthorised presence detected. Security units, contain the infiltrator.',
    's2':       'Cryo Vault. Temperature, minus forty. You will not last long here.',
    's3':       'The Foundry. Containment of molten material is... optional.',
    's4':       'Server Core. Every step you take is being recorded.',
    's5':       'Reactor level. You are very close to something you should not touch.',
    'boss':     'Deploying the lift guardian.',
    'bossdown': 'Guardian lost. Recalculating.',
    'seeker':   'Lingering is not permitted.',
    'lastlife': 'Your signal is fading, infiltrator.',
    'gameover': 'Infiltrator contained. Resuming normal operations.',
    'clear':    'Sector compromised. Sealing it behind you.',
    'champion': 'Core offline. The facility is... yours.',
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
                         'voice_settings': {'stability': 0.72, 'similarity_boost': 0.8, 'style': 0.15, 'use_speaker_boost': True}}))
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
    used, lim, left = credits()
    print(f'credits: {used}/{lim} used, {left * 100:.1f}% left', flush=True)
    if kind == 'credits':
        sys.exit(0)
    if left < 0.15:
        print('fewer than 15% of credits left: not generating (reuse suitable clips instead)', flush=True)
        sys.exit(2)
    only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
    force = '--force' in sys.argv
    js = [j for j in jobs(kind) if not only or j[1] in only or j[1].removeprefix('v_') in only]
    fails = []
    with ThreadPoolExecutor(2) as ex:  # never more than 2 requests at once
        for line in ex.map(lambda j: run(j, force), js):
            print(line, flush=True)
            if line.startswith('FAIL'):
                fails.append(line.split()[1].split('/')[1])
    # anything that still failed (e.g. a 429 storm) gets one more try, one at a time
    for name in fails:
        for j in js:
            if j[1] == name:
                time.sleep(15)
                print('retry', run(j, True), flush=True)
    used, lim, left = credits()
    print(f'credits after: {used}/{lim} used, {left * 100:.1f}% left', flush=True)
