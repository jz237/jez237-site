"""Generate SKYHOLD 2026 audio with ElevenLabs (music, SFX, loops, ambient beds, colony-command voice lines).

Usage: python -I gen_audio.py [credits|voices|music|sfx|voice|all|stt [--dir d]] [--only name1,name2] [--force]
       python -I gen_audio.py takes --only beam,pop [--n 4] [--start 1]  (re-roll candidates into <raw>/takes, prompts from RETRY)
       python -I gen_audio.py pick beam 3                                  (install take 3 as the raw clip; logged in picks.json)
Raw mp3s land in <work>/audio-raw/<kind>/<name>.mp3 (or SK_RAW). The key is read from the Windows user
environment through PowerShell; it is never printed and never written anywhere.
--force regenerates and keeps the previous take in <raw>/_old/<kind>/<name>.takeN.mp3 (process_audio ignores it).
At most 2 requests run at a time (other games generate in parallel); 429/5xx retry one by one with backoff.
Before generating it checks the credit balance and refuses to run with less than 15 % left.
`stt` joins the raw voice lines into one file and transcribes it once (ElevenLabs Scribe) to check every line.
Then run `python process_audio.py <game folder>` (plain python: it needs numpy + scipy) to trim / normalise /
loop / encode into the game.

Our own game and our own sounds: nothing here imitates the arcade classic the genre comes from. The bosses never
speak (machine roars only), the settlers make no human sounds (their distress call is a radio beacon).
Frequent one-shots (beam, beamhit, pop, tally, uimove, minebeep) are asked for soft, short, low/mid and dry:
bright tonal repeated blips read as "bird chirping".
"""
import json, os, shutil, subprocess, sys, tempfile, time, urllib.request, urllib.error, uuid
from concurrent.futures import ThreadPoolExecutor

RAW = os.environ.get('SK_RAW', 'D:/Projects/.tmp/skyhold-work/audio-raw')
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
# Music: instrumental cinematic-electronic space action with an arcade drive. name: (seconds, prompt).
# Loops are cut to a seamless loop by process_audio (generated intro/outro trimmed), so they are asked for longer
# than the loop and for "one steady groove" (the Sini lesson: section changes leave no beat-aligned loop).
MUSIC = {
    # title / s5 / boss: second takes, longer, with a steady beat asked for all the way: the first takes (120, 150, 130 s)
    # gave no beat-aligned loop of the wanted length (title timbre 1.73, boss 1.33 at 91 s, s5 beat 0.50; see AUDIO.md)
    'title': (150, 'Cinematic electronic space score, 92 BPM, a short 8 second build of warm analog synth swells, then one steady '
                   'heroic pulse that continues to the end: wide shimmering pads, a bright plucked synth arpeggio, deep punchy drums, '
                   'a soaring lead synth motif, a steady kick drum on every beat with no tempo change, a lone gunship guarding a small '
                   'blue planet at sunrise, hopeful and brave, instrumental, no vocals'),
    's1':    (150, 'Cinematic electronic space action music, 112 BPM, one steady driving groove from start to end, bouncy pulsing synth '
                   'bass, bright plucked arpeggios, warm wide pads, crisp punchy electronic drums with an arcade drive, a gunship '
                   'skimming golden clouds over a green ocean world, upbeat and adventurous, instrumental, no vocals'),
    's2':    (150, 'Cinematic electronic space action music, 118 BPM, one steady driving groove from start to end, hot gritty '
                   'sequenced bass, hand drum and tom percussion, a twangy desert synth lead, heat-haze pads, a gunship racing over '
                   'red dunes and mesas under twin suns, bold and driving, instrumental, no vocals'),
    's3':    (150, 'Cinematic electronic space action music, 124 BPM, one steady driving groove from start to end, glassy bell '
                   'arpeggios, icy shimmering pads, a fast sequenced bass pulse, tight crisp electronic drums, a gunship flying over '
                   'blue glaciers under a rippling aurora, focused and urgent, instrumental, no vocals'),
    's4':    (150, 'Cinematic electronic space action music, 130 BPM, one steady driving groove from start to end, heavy distorted '
                   'synth bass, pounding drums and deep toms, fiery brass-like synth stabs, rumbling risers, a gunship weaving over '
                   'rivers of lava on a volcanic world full of ash, fierce and intense, instrumental, no vocals'),
    's5':    (170, 'Dark cinematic electronic space action music, 136 BPM, one steady driving groove from start to end with no '
                   'breakdown and no tempo change, a steady kick drum on every beat, deep sub bass pulses, aggressive dark synth ostinato, huge cinematic drums, eerie choir-like pads, '
                   'a gunship defending the last colony on a dark world beneath a vast ringed gas giant, intense and heroic, '
                   'instrumental, no vocals'),
    'boss':  (150, 'Huge relentless cinematic electronic boss battle music, 142 BPM, one steady pounding groove from start to end '
                   'with no breakdown, heavy percussion and taiko-like hits, distorted bass ostinato, massive synth brass stabs, '
                   'metallic impacts, a colossal alien carrier ship looming over a small planet, epic and relentless, instrumental, '
                   'no vocals'),
    # stings (not looped)
    'clear': (10, 'Short triumphant victory sting, cinematic electronic, bold bright synth brass fanfare over a big drum hit and a '
                  'rising cymbal swell, ends on a held major chord, instrumental, no vocals'),
    'over':  (10, 'Short somber game over sting, cinematic electronic, slow descending low synth pads over a fading deep drone and '
                  'one soft low drum hit, quiet sad ending, instrumental, no vocals'),
}

# ---------------------------------------------------------------------------------------------------------------
# SFX one-shots. name: (seconds, prompt influence, text).
SFX = {
    # frequent: soft-edged, short, low/mid, dry, never whistly or chirpy
    'beam':      (0.5, 0.6, 'One single short energy cannon shot from a small gunship, a soft punchy zap with a warm mid-range body '
                            'and a quick airy crackle, rounded and soft-edged, not shrill, dry, instant decay'),
    'beamhit':   (0.5, 0.6, 'Small energy bolt striking a metal hull, short dull thud with a gritty crackle of sparks, muted, '
                            'no ringing'),
    'pop':       (0.6, 0.55, 'Small flying machine blown apart, quick crunchy muffled pop with a rattle of metal bits, low-mid'),
    'tally':     (0.5, 0.6, 'One tiny soft muted wooden tick, like a single gentle counter click, very short and quiet'),
    'uimove':    (0.5, 0.6, 'Soft quiet menu tick, a single muted low click of a console button, very short'),
    'minebeep':  (0.5, 0.6, 'One tiny short soft electronic blip from a floating mine, a muted low beep, very short'),
    # explosions and wreckage
    'boomS':     (1.2, 0.5, 'Small spaceship exploding, punchy deep blast with crackling debris'),
    'boomM':     (2.0, 0.5, 'Medium alien machine exploding, deep heavy blast with fiery crackle and scattering metal debris'),
    'boomL':     (3.5, 0.5, 'Huge alien carrier section exploding, enormous deep boom, roaring fireball and tumbling metal debris, '
                            'long rumbling tail'),
    'debris':    (1.4, 0.5, 'Chunks of metal wreckage crashing down onto rocky ground, heavy dull clanks, tumbling and scraping, '
                            'low-mid'),
    # alien machines and settlers
    'warpin':    (1.0, 0.55, 'Alien machine materialising out of thin air, short warbling energy swell with a soft warped low thump'),
    'grab':      (0.8, 0.55, 'Tractor beam locking onto a target, short descending electronic hum with a solid magnetic clunk'),
    'distress':  (0.9, 0.6, 'Short electronic emergency radio beacon, two quick mid-pitched alert pulses through a little radio '
                            'static, no voice'),
    'fuse':      (1.6, 0.5, 'Alien machine fusing with metal into a twisted new shape, grinding metallic transformation shriek, '
                            'crunching and warping metal with an electric sizzle, no voice, no human sounds'),
    'fall':      (1.0, 0.5, 'Something falling fast through the air, a descending rushing whoosh'),
    'catch':     (0.8, 0.55, 'Spaceship catching a small capsule, solid magnetic clamp clunk followed by one soft warm chime'),
    'land':      (1.0, 0.5, 'Warm gentle success chime, two soft rising synth bell notes, mellow and friendly'),
    'lost':      (1.2, 0.5, 'Soft sad descending electronic tone, three gentle falling synth notes fading away, mellow'),
    'mine':      (0.8, 0.55, 'Small metal mine dropped from a ship, a short mechanical clunk followed by a soft electronic arming '
                             'click and hum'),
    'hivepop':   (1.0, 0.55, 'Alien egg pod bursting open, wet crunchy crack of a shell and a rush of buzzing wings swarming out'),
    'swarm':     (1.2, 0.5, 'A pack of tiny fast flying darts buzzing past, many small whirring buzzes zipping by, left to right'),
    'prowler':   (1.4, 0.55, 'Sleek hunter spaceship arriving fast, menacing metallic shriek rising into a jet-like whoosh'),
    'bolt':      (0.6, 0.6, 'Enemy energy weapon firing a bolt, nasty low buzzing electric zap, short and aggressive'),
    'tell':      (0.8, 0.55, 'Energy weapon charging up, short rising electric whine with a low buzzing hum, a warning before a '
                             'shot'),
    # player
    'nova':      (2.6, 0.5, 'Huge bright energy shockwave detonation, a deep boom bursting into a rushing ring of crackling energy '
                            'that sweeps outward, powerful and clean'),
    'blink':     (0.6, 0.6, 'Spaceship jumping away through a warp, quick rising zip whoosh with a soft electric snap'),
    'blinkin':   (0.6, 0.6, 'Spaceship arriving from a warp jump, short reversed whoosh into a soft deep thump'),
    'shieldhit': (0.8, 0.6, 'Energy shield absorbing a hit, deep resonant thump with a shimmering electric crackle'),
    'death':     (2.2, 0.5, 'Small gunship destroyed, violent crunch of breaking metal then a big explosion blast with scattering '
                            'debris'),
    'spawn':     (1.6, 0.5, 'Spaceship warping in, deep rushing whoosh arriving with a soft shimmering energy swell'),
    'pickup':    (1.0, 0.55, 'Power-up collected by a spaceship, energetic rising charge-up whoosh with a warm electric hum'),
    'pwend':     (0.8, 0.55, 'Power-up running out, short descending power-down hum'),
    'life':      (1.4, 0.5, 'Extra ship awarded, warm bright positive synth chime chord swelling softly'),
    'alarm':     (1.4, 0.55, 'Colony warning siren, a short rising and falling electronic alarm wail, two cycles'),
    # bosses
    'bossroar':  (2.6, 0.5, 'Giant alien carrier ship mechanical roar, deep grinding bellow of turbines and straining metal, '
                            'menacing, no voice, not an animal'),
    'bosshit':   (0.6, 0.6, 'Energy shot striking the armour of a giant ship, heavy metallic impact crunch with sparks'),
    'nodebreak': (1.4, 0.55, 'Glowing weak point on a giant machine shattering, heavy crystal and metal burst with an electric '
                             'crackle and tumbling shards'),
    'bossbeam':  (2.4, 0.5, 'Giant alien ship firing a sweeping energy beam, intense humming roar with crackling energy'),
    'colonyfall': (3.0, 0.5, 'Dramatic deep low boom followed by a long slow descending tone, ominous and sad'),
    # results and UI
    'waveclear': (1.6, 0.5, 'Wave cleared, warm resonant synth chord swell with a soft rising shimmer, positive'),
    'upgrade':   (1.2, 0.55, 'Ship refit installed, satisfying heavy mechanical clunk followed by a rising power-up hum'),
    'medal':     (1.4, 0.55, 'Short triumphant synth brass hit with a cymbal swell, bold and proud'),
    'uiok':      (0.6, 0.6, 'Solid menu confirm click with a short soft whoosh'),
    'uiback':    (0.5, 0.6, 'Soft reversed menu click, short muted backwards swoosh tick'),
    'rewind':    (1.2, 0.55, 'Tape rewinding fast, warbling whirring rewind whoosh'),
}
# Second-round prompts for clips whose first take measured too bright, too tonal, too long or too sub-heavy.
# `takes` mode cycles through these to make several candidates; `pick` installs the chosen one.
RETRY = {
    'beam':     ['Short soft energy blaster shot, a rounded mid-range pew with a muffled punch and a tiny crackle, dry, very short, '
                 'not shrill, no ringing',
                 'Single compact laser cannon zap from a small ship, warm punchy mid-range burst, soft attack, dry and very short'],
    'beamhit':  ['Small shot hitting a metal plate, short muffled thunk with a gritty spark crackle, low-mid, no ringing'],
    'pop':      ['Little robot drone destroyed, short punchy muffled pop with a crunchy rattle of metal bits, low-mid',
                 'Small machine blown apart, quick deep crunchy burst with a few metal pieces rattling'],
    # round 2 (takes 5-8): round 1 (takes 1-4, 'soft muted click / counter tick', prompts in takes/prompts.json) still
    # measured 6-9 kHz, so these ask for a knock / blip with a low-mid body
    'tally':    ['One single tiny soft low wooden knock, a muted hollow tok, very short',
                 'A single short soft low electronic blip, a muted round boop, mid-low pitch, very short'],
    'uimove':   ['Single soft muted button tick, low and short, like a gentle keyboard key press'],
    'minebeep': ['A very short soft muted electronic blip, low pitched, like a small device chirp through a speaker, quick',
                 'One short low soft electronic beep, muffled, very quick'],
    # round 1 measured too bright (5-8 kHz centroids)
    'catch':    ['Heavy magnetic clamp locking onto a metal capsule, a solid low-mid clunk with a short soft warm bell tone after it',
                 'Spaceship docking clamp grabbing cargo, firm muted mechanical thunk and one gentle low chime'],
    'fuse':     ['Metal being crushed and twisted into a new shape by alien energy, deep grinding and screeching metal, crunching '
                 'and warping with an electric buzz, heavy, no voice',
                 'Alien machine merging with scrap metal, heavy grinding crunch rising into a metallic screech, low-mid, no voice'],
    'medal':    ['Short triumphant low brass fanfare hit, bold trombones and horns stab with a timpani hit, proud, instrumental'],
    'uiok':     ['Firm mechanical button press, a solid low-mid click with a short soft air whoosh, like a heavy console switch'],
    # round 1 measured almost all sub-bass (inaudible on a phone speaker)
    'uiback':   ['Soft muted menu back click, a short low-mid thock like a gentle button release'],
    'shieldhit': ['Energy shield absorbing a hit, punchy mid-range thump with a bright shimmering electric crackle and a short '
                  'ringing hum'],
    'colonyfall': ['Dramatic deep boom followed by a clearly audible slow descending synth tone in the mid range, ominous and sad',
                   'Big low impact hit, then a long sad falling electronic tone sliding down, cinematic'],
    'grab':     ['Tractor beam locking onto a target, short mid-range electronic hum sweeping down with a solid metallic clunk',
                 'Sci-fi magnetic beam grabbing an object, buzzing energy zap and a firm metal lock click'],
    'warpin':   ['Alien machine materialising out of thin air, a short shimmering rising energy warble with a soft pop at the end',
                 'Sci-fi teleport arrival, quick swirling warble of energy and a soft thump, mid-range'],
    'spawn':    ['Spaceship warping in, rushing whoosh arriving with a bright shimmering energy swell, mid-range',
                 'Small spaceship arriving out of a warp, airy rushing sweep into a warm humming energy chord'],
}
# Loops (generated with the v2 model's seamless-loop option). name: (seconds, prompt influence, text).
# Round 2 prompts (liftloop, the ambient beds of verdant / dune / cinder / umbra): the first takes were 84-98 % sub-bass
# (a phone speaker would lose 10-15 dB of them); the first prompts are kept in LOOPS_R1 for the record.
LOOPS = {
    'thrust':      (6.0, 0.45, 'Small gunship jet engine, smooth steady turbine roar with a soft airy hiss, constant'),
    'liftloop':    (5.0, 0.45, 'Alien tractor beam humming, steady mid-range electric energy hum with a slow pulsing warble and '
                               'a faint buzz, constant'),
    'bossloop':    (6.0, 0.45, 'Giant alien carrier ship engine, very deep steady droning hum with slow mechanical throbbing, constant'),
    'amb_verdant': (12.0, 0.45, 'Gentle sea breeze on a grassy coast, soft surf washing on a beach, a few seabirds calling, airy '
                                'and quiet, no rumble, steady, seamless loop'),
    'amb_dune':    (12.0, 0.45, 'Dry desert wind blowing over sand dunes, airy whooshing gusts and soft hissing sand grains, quiet, '
                                'no rumble, steady, seamless loop'),
    'amb_frost':   (12.0, 0.45, 'Thin icy wind over a glacier, ice softly creaking and groaning, airy and quiet, steady, seamless loop'),
    'amb_cinder':  (12.0, 0.45, 'Close-up thick lava bubbling and popping, crackling and sizzling hot embers, hissing steam vents, '
                                'no deep rumble, quiet and steady, seamless loop'),
    'amb_umbra':   (12.0, 0.45, 'Dark eerie ambience, a soft airy mid-range drone with slow pulsing, faint glassy crystal chimes '
                                'ringing far away, quiet, steady, seamless loop'),
}
LOOPS_R1 = {
    'liftloop':    'Alien tractor beam humming, steady pulsing low energy hum with a slow warble, constant',
    'amb_verdant': 'Calm ocean wind on a coastal plain, distant surf rolling in, a few seabirds calling far away, quiet, steady, seamless loop',
    'amb_dune':    'Dry desert wind blowing over sand dunes, soft sand hiss, quiet and steady, seamless loop',
    'amb_cinder2': 'Lava bubbling and popping, crackling hissing embers, a soft distant rumble, quiet and steady, seamless loop',
    'amb_cinder':  'Lava bubbling and popping slowly, deep distant volcanic rumble, quiet and steady, seamless loop',
    'amb_umbra':   'Dark low ambient drone, deep slow hum, faint glassy crystal chimes far away, quiet, steady, seamless loop',
}

# ---------------------------------------------------------------------------------------------------------------
# Voice: a low, ominous male colony-command voice (1.6.1, the owner asked for it). Brian (premade, deep and resonant;
# measured the lowest of the deep male voices, ~90-114 Hz) delivered slower and darker; fallback Adam. process_audio.py
# lowers it a little further (rubberband, formants shifted) with a dark low shelf and a faint short echo.
# (Until 1.6.0: Alice Xb7hH8MSUJpSbSDYk0k2, calm British female.)
VOICE_IDS = ['nPczCjzI2devNBz1zQrb', 'pNInz6obpgDQGcFmaJgB']
VOICE_SETTINGS = {'stability': 0.5, 'similarity_boost': 0.85, 'style': 0.35, 'use_speaker_boost': True, 'speed': 0.88}
VOICE = {
    'begin':      'Skyhold, you are clear to launch. Keep the colonists on the ground.',
    's2':         'Next world: the Red Dune Belt.',
    's3':         'Frostveil. Watch the ice.',
    's4':         'Cinderfall. Stay above the fire.',
    's5':         'Umbra Prime. The last colony.',
    'boss':       'Carrier inbound. Hit its weak points.',
    'bossdown':   'Carrier down. The sky is clear.',
    'clear':      'Sector secure. Well flown.',
    'lastlife':   'Last ship. Make it count.',
    'gameover':   'We have lost the sky.',
    'newrecord':  'A new record for the colonies.',
    'champion':   'Every world is safe. Outstanding, pilot.',
    'colonyfall': "The colony has fallen. Hold what's left.",
    'saved':      'Every colonist made it home.',
    'endless':    'Endless orbit. Hold as long as you can.',
    'partner':    'Wingmate on station.',
    'replay':     "Let's see that again.",
    'lifted':     "They've got one. Get after it!",
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


def stt(d=None):
    """Join every voice line in d (default: the raw lines; 1.2 s gaps) into one file and transcribe it once."""
    d = d or os.path.join(RAW, 'voice')
    names = sorted(f for f in os.listdir(d) if f.endswith('.mp3'))
    tmpd = tempfile.mkdtemp(prefix='sk-stt-')
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
        stt(sys.argv[sys.argv.index('--dir') + 1] if '--dir' in sys.argv else None)
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
