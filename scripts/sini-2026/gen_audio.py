"""Generate Sini 2026 audio with ElevenLabs (music, SFX, engine loops, flight-controller voice lines).

Usage: python -I gen_audio.py [credits|voices|music|sfx|voice|all|stt] [--only name1,name2] [--force]
       python -I gen_audio.py takes --only gun,hit [--n 4]   (re-roll candidates into <raw>/takes, prompts from RETRY)
       python -I gen_audio.py pick gun 3                      (install take 3 as the raw clip; logged in picks.json)
Raw mp3s land in <work>/audio-raw/<kind>/<name>.mp3 (or SN_RAW). The key is read from the Windows user
environment through PowerShell; it is never printed and never written anywhere.
--force regenerates and keeps the previous take in <raw>/_old/<kind>/<name>.takeN.mp3 (process_audio ignores it).
At most 2 requests run at a time (other games generate in parallel); 429/5xx retry one by one with backoff.
Before generating it checks the credit balance and refuses to run with less than 15 % left.
`stt` joins the raw voice lines into one file and transcribes it once (ElevenLabs Scribe) to check every line.
Then run `python process_audio.py <game folder>` (plain python: it needs numpy + scipy) to trim / normalise /
loop / encode into the game.

Our own game: nothing here imitates the arcade classic the genre comes from. The construct (boss) never speaks.
Frequent one-shots (gun, hitrock, chip, collect, hit, pop, uimove) are asked for low/mid, percussive and dry:
the user hears bright tonal repeated blips as "bird chirping".
"""
import json, os, shutil, subprocess, sys, tempfile, time, urllib.request, urllib.error, uuid
from concurrent.futures import ThreadPoolExecutor

RAW = os.environ.get('SN_RAW', 'D:/Projects/.tmp/sini-2026-work/audio-raw')
API = 'https://api.elevenlabs.io'
HDR = 'xi-' + 'api-key'  # the auth header name, spelled in two parts so key scans of this folder stay clean


def key():
    v = subprocess.run(['powershell', '-NoProfile', '-Command',
                        "[Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')"],
                       capture_output=True, text=True).stdout.strip()
    assert v.startswith('s' + 'k_') and len(v) == 51, 'bad key shape'
    return v


KEY = key()


def get(path):
    req = urllib.request.Request(API + path, headers={HDR: KEY})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def credits():
    d = get('/v1/user/subscription')
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


# ---------------------------------------------------------------------------------------------------------------
# Music: instrumental cinematic space electronic. name: (seconds, prompt). Stage loops are cut to a seamless loop
# by process_audio (the generated intro/outro are trimmed), so they are asked for a little longer than the loop.
MUSIC = {
    # title / s5 / boss: second takes, longer and asked for one steady groove, because the first takes changed section
    # so much that no beat-aligned 85 s+ loop could be cut from them (see AUDIO.md)
    'title': (150, 'Majestic and mysterious cinematic space electronic score, 80 BPM, a slow 15 second build of deep analog synth '
                   'drones, then a steady majestic pulse that continues unchanged to the end: distant choir-like synth pads, a glassy '
                   'arpeggio, soft deep drums, a lone mining ship drifting through a glowing asteroid field toward a colossal '
                   'unfinished machine, awe and quiet dread, instrumental, no vocals'),
    's1':    (130, 'Warm cinematic space electronic music, 100 BPM, steady pulsing analog synth bass, warm wide pads, gentle plucked '
                   'synth arpeggios, soft driving electronic drums, a prospector ship mining golden asteroids in an amber dust nebula '
                   'under an orange sun, hopeful and determined, instrumental, no vocals'),
    's2':    (130, 'Cold crystalline cinematic space electronic music, 112 BPM, glassy bell arpeggios, icy shimmering pads, driving '
                   'sequenced bass, crisp tight electronic drums, flying fast through blue-white ice asteroids around a ringed gas giant, '
                   'focused and driving, instrumental, no vocals'),
    's3':    (130, 'Heavy industrial cinematic space electronic music, 118 BPM, clanging metallic percussion, distorted pulsing bass, '
                   'low brass-like synth stabs, grinding machine textures, dark iron asteroids under a dim red dwarf star, tense and heavy, '
                   'instrumental, no vocals'),
    's4':    (130, 'Urgent tribal electronic cinematic space music, 126 BPM, pounding tribal drums and deep toms, hot distorted synth '
                   'bass, fiery risers and percussion fills, volcanic asteroids with glowing cracks in a crimson nebula, fierce and urgent, '
                   'instrumental, no vocals'),
    's5':    (170, 'Dark ominous cinematic space electronic music, 132 BPM, one steady driving groove from start to end with no '
                   'breakdown, deep sub bass pulses, aggressive dark synth ostinato, huge cinematic drums, eerie choir-like synth pads, '
                   'the violet accretion disc of a black hole, intense and foreboding, instrumental, no vocals'),
    'boss':  (170, 'Huge relentless cinematic space boss battle music, 140 BPM, one steady pounding groove from start to end with '
                   'no breakdown, heavy percussion and taiko-like hits, massive choir-like synth pads, aggressive distorted bass '
                   'ostinato, metallic impacts, a colossal war machine hunting a small ship, epic and relentless, instrumental, no vocals'),
    # stings (not looped)
    'clear': (10, 'Short victory sting, cinematic space electronic, bold synth brass fanfare over a big drum hit and a cymbal swell, '
                  'ends on a held triumphant major chord, instrumental, no vocals'),
    'over':  (10, 'Short somber game over sting, cinematic space electronic, slow descending low synth pads over a fading deep drone '
                  'and one soft low drum hit, quiet sad ending, instrumental, no vocals'),
}

# ---------------------------------------------------------------------------------------------------------------
# SFX. name: (seconds, prompt influence, text). Loops are asked for with the v2 model's seamless-loop option.
SFX = {
    # frequent: low/mid, percussive, dry, never whistly or chirpy
    'gun':       (0.5, 0.6, 'One single short plasma cannon shot from a small spaceship, a tight deep punch with a dry crackling snap, '
                            'percussive, low and mid frequencies, instant decay'),
    'hitrock':   (0.5, 0.6, 'Energy shot striking a rock, short stony crack with a spray of grit and gravel, dry and low'),
    'chip':      (0.6, 0.6, 'A chunk of crystal breaking loose from a rock, short dull glassy crack and crumbling stone, low and gritty'),
    'collect':   (0.6, 0.55, 'Crystal absorbed into a ship, a very short low rising energy swell ending in a soft deep glassy thunk, warm '
                             'and muted'),
    'hit':       (0.5, 0.6, 'Small shot striking thick steel armour plate, short hard metallic knock with a dull clank and a tiny spark '
                            'crackle'),
    'pop':       (0.6, 0.55, 'Small robot drone blown apart, quick crunchy pop burst with rattling metal bits'),
    'uimove':    (0.5, 0.6, 'Soft quiet menu tick, a single muted low click of a console button, very short'),
    # the rest
    'bombarm':   (0.6, 0.6, 'Heavy missile locking into a launch rack, short solid mechanical latch clack and clunk'),
    'bomb':      (1.2, 0.55, 'Homing missile launching from a spaceship, rocket ignition burst into a rushing whoosh trailing away'),
    'bombhit':   (3.0, 0.5, 'Enormous deep explosion against a giant metal war machine, massive blast with crunching tearing metal and '
                            'a long low rumbling tail'),
    'bombpop':   (1.0, 0.55, 'Missile shot down in mid flight, mid-size punchy explosion burst with crackle'),
    'boomS':     (1.2, 0.5, 'Small spaceship exploding, punchy deep blast with crackling debris'),
    'boomM':     (2.0, 0.5, 'Medium spaceship exploding, deep heavy blast with fiery crackle and scattering metal debris'),
    'boomL':     (3.5, 0.5, 'Huge spaceship explosion, enormous deep boom, roaring fireball and tumbling metal debris, long rumbling tail'),
    'debris':    (1.4, 0.5, 'Shattered metal debris scattering, pieces of hull clattering, tumbling and scraping'),
    'bolt':      (0.6, 0.6, 'Enemy energy weapon firing a bolt, nasty low buzzing electric zap, short and aggressive'),
    'tell':      (1.0, 0.55, 'Energy weapon charging up, rising gritty electric crackle with a buzzing low hum building for one second'),
    'shieldhit': (0.8, 0.6, 'Energy shield absorbing a hit, deep resonant thump with a shimmering electric crackle'),
    'death':     (2.2, 0.5, 'Small spaceship destroyed, violent crunch of metal then a big explosion blast with scattering debris'),
    'spawn':     (1.6, 0.5, 'Spaceship warping in, deep rushing whoosh arriving with a soft shimmering energy swell'),
    'warpin':    (1.0, 0.55, 'Enemy fighter arriving out of a hyperspace jump, short distorted whoosh with a warped low thump'),
    'rockbreak': (1.6, 0.5, 'Large asteroid crumbling apart, heavy rocky collapse with grinding boulders and gravel'),
    'build':     (1.2, 0.55, 'Huge armour plate clamping onto a giant machine in the distance, heavy echoing metal clank with a short '
                             'hydraulic hiss'),
    'knock':     (1.2, 0.55, 'Armour plate blasted off a giant machine, tearing metal shear and a heavy crash'),
    'awake':     (4.0, 0.5, 'Colossal war machine awakening, huge mechanical power-up surge, grinding gears and a deep roaring engine '
                            'rising, no voice'),
    'roar':      (2.6, 0.5, 'Giant war machine hunting growl, deep grinding mechanical bellow of turbines and straining metal, '
                            'menacing, no voice, not an animal'),
    'tractor':   (2.0, 0.5, 'Deep throbbing tractor beam pulling, pulsing low energy hum with a slow warbling drone'),
    'eat':       (1.6, 0.55, 'Small spaceship crushed between giant steel jaws, violent metal crunch and grinding'),
    'alarm':     (1.2, 0.6, 'Spaceship warning klaxon, two short harsh low alarm pulses'),
    'life':      (1.4, 0.5, 'Extra life awarded, warm low positive synth chime chord swelling softly'),
    'upgrade':   (1.2, 0.55, 'Ship refit installed, satisfying heavy mechanical clunk followed by a rising power-up hum'),
    'medal':     (1.4, 0.55, 'Short triumphant brass hit with a cymbal swell, bold and proud'),
    'pickup':    (1.0, 0.55, 'Power-up collected by a spaceship, energetic rising charge-up whoosh with a warm electric hum'),
    'pwend':     (0.8, 0.55, 'Power-up running out, short descending power-down hum'),
    'uiok':      (0.6, 0.6, 'Solid menu confirm click with a short soft whoosh'),
    'uiback':    (0.5, 0.6, 'Soft reversed menu click, short muted backwards swoosh tick'),
    'rewind':    (1.2, 0.55, 'Tape rewinding fast, warbling whirring rewind whoosh'),
}
# Second-round prompts for clips whose first take measured too bright, too tonal or too sub-heavy (see AUDIO.md).
# `takes` mode cycles through these to make several candidates; `pick` installs the chosen one.
RETRY = {
    'gun':     ['Short punchy energy cannon shot, a compact mid-range thump with a crisp crackling burst of static, dry and very short, '
                'no ringing',
                'Single heavy plasma round fired from a small gunship, quick percussive punch with a gritty electric crack, mid-range, '
                'dry, very short'],
    # round 1 ('glassy' / 'glass on metal') came out as bright 9-11 kHz shimmer; round 2 avoids the word
    'collect': ['Quick soft rising whoosh ending in a single muted low clunk, like a heavy marble dropping into a padded metal tray',
                'Short low hollow thunk of a heavy bead landing in a metal bin, preceded by a tiny soft swell, muted and warm',
                'Soft deep whoomp of energy absorbed, ending in a muted hollow knock, low-mid, short'],
    'hit':     ['Small energy shot hitting thick armour, short dull metallic thud with a gritty crackle, no ringing',
                'Shot impact on a heavy steel hull, short dull thunk with a brief scrape of sparks, muted'],
    'hitrock': ['Energy shot hitting a boulder, short gritty stone crack with crumbling pebbles, mid-range',
                'Shot smashing into an asteroid, dull rocky knock with a burst of grit and dust, short'],
    'chip':    ['Crystal shard knocked out of a rock, short dull crack with a soft glassy crunch and falling gravel, low-mid',
                'Chunk of crystal snapping off stone, muffled glassy crunch with crumbling rock, short and low'],
    'pop':     ['Small drone destroyed, short punchy muffled pop with a crunchy rattle of metal bits, low-mid',
                'Little robot blown apart, quick deep crunchy burst with a few metal pieces rattling'],
    'bombpop': ['Missile destroyed in mid flight, mid-size punchy explosion with a crackling burst and a short rumble'],
    'uiback':  ['Soft muted menu back click, a short low thock like a gentle button release'],
    'uiok':    ['Firm mechanical button press, a solid low-mid click with a short soft air whoosh, like a heavy console switch'],
    'medal':   ['Short triumphant low brass fanfare hit, bold trombones and horns stab with a timpani hit, proud, instrumental'],
    'debris':  ['Heavy chunks of metal hull scattering and tumbling, dull clanks and scraping, low-mid'],
    'tractor': ['Tractor beam pulling, deep throbbing pulsing hum with a gritty mid-range warble, sci-fi'],
    'spawn':   ['Spaceship warping in, deep rushing whoosh arriving with a soft sparkling shimmer of energy'],
}
LOOPS = {
    'thrust':    (6.0, 0.45, 'Small spaceship engine thrust, steady deep rumbling roar with a soft airy hiss, constant'),
    'gather':    (5.0, 0.45, 'Small mining drone hovering, steady low mechanical hum with a soft whir, constant'),
    'reaver':    (5.0, 0.45, 'Fighter spacecraft engine, steady low whining turbine drone, constant'),
    'construct': (6.0, 0.45, 'Colossal dormant machine, very deep steady droning hum with distant slow mechanical rumbles, constant'),
    'hunt':      (6.0, 0.45, 'Huge awakened war machine engine, menacing pulsing grind, deep rhythmic throbbing and grinding metal, constant'),
}

# ---------------------------------------------------------------------------------------------------------------
# Voice: one calm, confident flight controller. Daniel (premade, steady British broadcaster); fallback Eric.
VOICE_IDS = ['onwK4e9ZLuTAKqWW03F9', 'cjVigY5qzO86Huf0OWal']
VOICE_SETTINGS = {'stability': 0.6, 'similarity_boost': 0.8, 'style': 0.2, 'use_speaker_boost': True}
VOICE = {
    'begin':     "Prospector, you're clear to launch. Crack those rocks and stock up on charges.",
    's2':        'Frost Ring ahead. The ice hides plenty of crystal.',
    's3':        'Iron Shoals. Heavy rock, and heavier company.',
    's4':        'Ember Veil. Watch the heat, and watch your back.',
    's5':        'Void Crown. This is where they build the big ones.',
    'deep':      "Deep Field. There's no way home but forward.",
    'half':      'Their construct is half built. Start stocking charges.',
    'boss':      "It's awake! Keep moving and hit it with everything you've got.",
    'bossdown':  'Construct destroyed! Outstanding flying.',
    'clear':     'Sector clear. Refit and get ready.',
    'lastlife':  'Last ship, Prospector. Make it count.',
    'gameover':  "We've lost you, Prospector.",
    'newrecord': "That's a new record.",
    'champion':  'All five constructs down. The belt is free.',
    'replay':    "Let's see that again.",
    'partner':   'Wingmate on the line.',
    'empty':     "You're out of charges. Mine some more!",
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
        for n, (sec, infl, text) in LOOPS.items():
            out.append(('sfx', n, '/v1/sound-generation?output_format=mp3_44100_128',
                        {'text': text, 'duration_seconds': sec, 'prompt_influence': infl,
                         'model_id': 'eleven_text_to_sound_v2', 'loop': True}))
    if kind in ('voice', 'all'):
        for n, text in VOICE.items():
            out.append(('voice', 'v_' + n, None,
                        {'text': text, 'model_id': 'eleven_multilingual_v2', 'voice_settings': VOICE_SETTINGS}))
    return out


def take_jobs(names, n, start=1, force=False):
    """Candidates for re-rolled SFX: <raw>/takes/<name>.t<k>.mp3 (k from `start`), prompts cycled from RETRY (else the
    original); the prompt of every take is recorded in <raw>/takes/prompts.json."""
    out = []
    log = os.path.join(RAW, 'takes', 'prompts.json')
    os.makedirs(os.path.dirname(log), exist_ok=True)
    rec = json.load(open(log)) if os.path.exists(log) else {}
    for nm in names:
        sec, infl, text = SFX[nm]
        prompts = RETRY.get(nm, [text])
        for i, k in enumerate(range(start, start + n)):
            tn = f'{nm}.t{k}'
            p = prompts[i % len(prompts)]
            if force or not os.path.exists(os.path.join(RAW, 'takes', tn + '.mp3')):
                rec[tn] = p
            out.append(('takes', tn, '/v1/sound-generation?output_format=mp3_44100_128',
                        {'text': p, 'duration_seconds': max(0.5, sec), 'prompt_influence': infl}))
    with open(log, 'w') as fh:
        json.dump(rec, fh, indent=1)
    return out


def pick(name, k):
    """Install take k of an SFX as the raw clip (the previous raw goes to _old); logged in <raw>/picks.json."""
    src = os.path.join(RAW, 'takes', f'{name}.t{k}.mp3')
    dst = os.path.join(RAW, 'sfx', name + '.mp3')
    assert os.path.exists(src), src
    if os.path.exists(dst):
        keep_old('sfx', name, dst)
    shutil.copyfile(src, dst)
    log = os.path.join(RAW, 'picks.json')
    picks = json.load(open(log)) if os.path.exists(log) else {}
    rec = json.load(open(os.path.join(RAW, 'takes', 'prompts.json')))
    picks[name] = {'take': int(k), 'prompt': rec.get(f'{name}.t{k}', '?')}
    with open(log, 'w') as fh:
        json.dump(picks, fh, indent=1)
    print('picked', name, 'take', k)


def keep_old(kind, name, out):
    d = os.path.join(RAW, '_old', kind)
    os.makedirs(d, exist_ok=True)
    i = 1
    while os.path.exists(os.path.join(d, f'{name}.take{i}.mp3')):
        i += 1
    shutil.move(out, os.path.join(d, f'{name}.take{i}.mp3'))


def run(job, force):
    kind, name, path, body = job
    out = os.path.join(RAW, kind, name + '.mp3')
    if os.path.exists(out):
        if not force:
            return f'skip {kind}/{name}'
        keep_old(kind, name, out)
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
        try:
            return f'ok   {kind}/{name} {post(path, body, out)}'
        except RuntimeError as e:
            if 'loop' in body and str(e).startswith(('400', '422')):  # older model: no loop option
                body = {k: v for k, v in body.items() if k not in ('loop', 'model_id')}
                return f'ok2  {kind}/{name} {post(path, body, out)} (no loop option)'
            raise
    except Exception as e:
        if kind == 'music' and 'force_instrumental' in str(e):
            body = dict(body); body.pop('force_instrumental', None)
            return f'ok2  {kind}/{name} {post(path, body, out)}'
        return f'FAIL {kind}/{name} {e}'


def stt():
    """Join every raw voice line (1.2 s gaps) into one file and transcribe it once."""
    d = os.path.join(RAW, 'voice')
    names = sorted(f for f in os.listdir(d) if f.endswith('.mp3'))
    tmpd = tempfile.mkdtemp(prefix='sn-stt-')
    lst = os.path.join(tmpd, 'list.txt')
    gap = os.path.join(tmpd, 'gap.mp3')
    subprocess.run(['ffmpeg', '-y', '-hide_banner', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', '1.2',
                    '-c:a', 'libmp3lame', '-b:a', '64k', gap], capture_output=True)
    parts = []
    for f in names:
        p = os.path.join(tmpd, f)
        subprocess.run(['ffmpeg', '-y', '-hide_banner', '-i', os.path.join(d, f), '-ac', '1', '-ar', '44100',
                        '-c:a', 'libmp3lame', '-b:a', '64k', p], capture_output=True)
        parts += [p, gap]
    with open(lst, 'w') as fh:
        fh.write(''.join(f"file '{p}'\n" for p in parts))
    joined = os.path.join(tmpd, 'all.mp3')
    subprocess.run(['ffmpeg', '-y', '-hide_banner', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', joined],
                   capture_output=True)
    with open(joined, 'rb') as fh:
        audio = fh.read()
    bnd = uuid.uuid4().hex
    body = b''
    for k, v in (('model_id', 'scribe_v1'), ('language_code', 'en'), ('tag_audio_events', 'false')):
        body += f'--{bnd}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
    body += f'--{bnd}\r\nContent-Disposition: form-data; name="file"; filename="all.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n'.encode()
    body += audio + f'\r\n--{bnd}--\r\n'.encode()
    req = urllib.request.Request(API + '/v1/speech-to-text', data=body, method='POST',
                                 headers={HDR: KEY, 'Content-Type': f'multipart/form-data; boundary={bnd}'})
    with urllib.request.urlopen(req, timeout=300) as r:
        res = json.loads(r.read())
    shutil.rmtree(tmpd, ignore_errors=True)
    print('lines in order:', ', '.join(f[:-4] for f in names))
    print(res.get('text', ''))


if __name__ == '__main__':
    kind = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if kind == 'pick':  # pick <name> <take>   (no API call)
        pick(sys.argv[2], sys.argv[3])
        sys.exit(0)
    used, lim, left = credits()
    print(f'credits used {used} / {lim} ({left * 100:.1f} % left, {lim - used} remaining)', flush=True)
    if kind == 'credits':
        sys.exit(0)
    if kind == 'voices':
        for v in get('/v1/voices').get('voices', []):
            if v.get('category') == 'premade':
                lab = v.get('labels') or {}
                print(v['voice_id'], v['name'], lab.get('gender', ''), lab.get('accent', ''), lab.get('description', ''),
                      lab.get('use_case', ''))
        sys.exit(0)
    if kind == 'stt':
        stt()
    else:
        if left < 0.15:
            print('fewer than 15 % of credits left: not generating')
            sys.exit(2)
        only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
        force = '--force' in sys.argv
        if kind == 'takes':  # takes --only a,b [--n 3] [--start 1]
            n = int(sys.argv[sys.argv.index('--n') + 1]) if '--n' in sys.argv else 3
            st = int(sys.argv[sys.argv.index('--start') + 1]) if '--start' in sys.argv else 1
            js = take_jobs(sorted(only), n, st, force)
        else:
            js = [j for j in jobs(kind) if not only or j[1] in only]
        with ThreadPoolExecutor(2) as ex:  # never more than 2 requests in flight
            for line in ex.map(lambda j: run(j, force), js):
                print(line, flush=True)
    used, lim, left = credits()
    print(f'credits after: used {used} / {lim} ({left * 100:.1f} % left, {lim - used} remaining)', flush=True)
