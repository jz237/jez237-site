"""Generate Gold Digger audio with ElevenLabs (music, SFX, ambient beds, the old prospector's voice lines).

Usage: python -I gen_audio.py [credits|music|sfx|voice|all] [--only name1,name2] [--force]
Raw mp3s land in <work>/audio-raw/<kind>/<name>.mp3 (or GD_RAW). The key is read from the Windows user
environment through PowerShell; it is never printed and never written anywhere.
At most 2 requests run at a time; 429/5xx retry one by one with backoff.
Before generating it checks the credit balance and refuses to run with less than 15 % left.
Then run process_audio.py <game folder> to trim / normalise / loop / encode into the game.
"""
import json, os, subprocess, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

RAW = os.environ.get('GD_RAW', 'D:/Projects/.tmp/gold-digger-work/audio-raw')
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


# Original score: a lone prospector with a helmet lamp exploring ever deeper caverns.
MUSIC = {
    'title': (90, 'Cinematic adventure score, slow and full of wonder, 72 BPM, warm acoustic guitar and dulcimer melody over deep cello drones, soft frame drum, distant echoing choir pad, a lone prospector with a lantern at the mouth of a vast mountain cave, mystery and promise of gold, instrumental, no vocals'),
    'd1':    (120, 'Warm exploratory adventure score, 92 BPM, plucked banjo and acoustic guitar ostinato, upright bass, brushed percussion, gentle fiddle melody, creaking old timbered gold mine lit by lanterns, curious and cosy, instrumental, no vocals'),
    'd2':    (120, 'Mysterious enchanted exploration score, 84 BPM, glassy celesta and harp arpeggios, soft marimba, warm low strings, gentle hand drums, a glowing cave of bioluminescent mushrooms and roots, wondrous and calm, instrumental, no vocals'),
    'd3':    (120, 'Crystalline cinematic exploration score, 88 BPM, shimmering glass harmonica tones, bowed vibraphone, airy choir pad, deep pulsing bass, slow taiko, a vast cavern of giant amethyst and quartz crystals, awe and quiet tension, instrumental, no vocals'),
    'd4':    (120, 'Ancient underwater ruins exploration score, 80 BPM, deep resonant bells, low woodwinds, dark ambient strings, slow tribal drums, echoing water, flooded temple halls lost under a mountain, haunting and grand, instrumental, no vocals'),
    'd5':    (120, 'Intense volcanic cavern adventure score, 100 BPM, deep rumbling taiko and anvil percussion, low brass swells, driving cellos, bubbling magma textures, the molten core beneath a mountain, dangerous and heroic, instrumental, no vocals'),
    'deep':  (120, 'Hypnotic deep cave exploration score, 86 BPM, evolving dark ambient pads, slow pulsing bass, distant metallic chimes, soft frame drum, endless descent into the unknown, mysterious and driving, instrumental, no vocals'),
    'boss':  (100, 'Heavy cinematic cave monster boss battle score, 132 BPM, pounding war drums and anvil hits, aggressive low brass, distorted cello ostinato, rumbling bass, a colossal creature awakes in a cavern, relentless and thrilling, instrumental, no vocals'),
    'clear': (10, 'Short triumphant adventure fanfare, bold brass and strings with banjo flourish and a timpani roll, ends on a held major chord, instrumental'),
}
# stings made with the sound-effects model but shipped as music (A.sting)
MUSIC_SFX = {
    'over':     (6.0, 0.45, 'Short sombre sting, low cello and a deep fading horn over a soft timpani roll in a cave, quiet ending'),
    'discover': (5.0, 0.5, 'Short magical discovery sting, a soft rising orchestral swell with warm strings and a gentle harp glissando resolving to a calm major chord, wonder'),
}

# name: (seconds, prompt influence, text). Frequent sounds stay low, dry and non-tonal (no bright chirps or whistles).
SFX = {
    # the digger
    'step':      (0.5, 0.6, 'A single heavy leather work boot footstep on loose gravel and stone in a cave, short soft crunch, no tonal sound'),
    'land':      (0.6, 0.6, 'Heavy boots landing on a rocky cave floor after a short jump, dull thud with a little gravel scatter'),
    'jump':      (0.5, 0.5, 'Quick scuff of boots pushing off a gravel floor with a soft cloth rustle, very short'),
    'climb':     (0.6, 0.55, 'Hands gripping a creaky wooden ladder rung and a rough hemp rope, soft wood creak and rope rub, short'),
    'hurt':      (0.8, 0.6, 'Short pained grunt of a gruff middle aged man taking a knock, breathy, no words'),
    'death':     (2.0, 0.55, 'A man collapsing onto a rocky cave floor, heavy body fall and gear clatter, a lantern rolling, small rocks settling'),
    'splash':    (1.0, 0.6, 'A man falling into a deep underground pool, heavy splash with echo'),
    'swim':      (0.7, 0.55, 'A single swimming stroke in calm water, soft slosh, close'),
    # pickaxe and rock
    'swing':     (0.5, 0.6, 'Fast whoosh of a heavy pickaxe swung through air, short, low'),
    'pick':      (0.6, 0.6, 'Steel pickaxe striking hard rock, sharp crunching impact with a few chips falling, short, not ringing'),
    'rockbreak': (1.2, 0.6, 'A chunk of rock wall breaking apart under a pickaxe, crunching crumble and a small rockfall'),
    'ore':       (0.7, 0.55, 'Pickaxe chipping a gold ore vein, crunchy impact and a soft scatter of small nuggets, dull, not ringing'),
    'hitflesh':  (0.6, 0.6, 'Heavy pickaxe thwack hitting a creature, meaty dull impact, short'),
    # loot
    'gold':      (0.6, 0.6, 'A few small gold nuggets dropped into a leather pouch, soft muffled clink and rustle, low pitched, short'),
    'gem':       (0.8, 0.5, 'A large cut gemstone picked up and dropped into a leather pouch, soft glassy tap and a low warm shimmer, short'),
    'bigloot':   (1.4, 0.5, 'A heavy handful of gold coins and nuggets poured into a sack, rich clatter, low and warm'),
    'oil':       (1.0, 0.55, 'Lamp oil poured from a small tin can into a brass lantern, short glug and a soft flame whoosh as it brightens'),
    'heart':     (1.0, 0.5, 'A canteen uncorked and a long satisfied swallow, then a relieved breath, short'),
    'life':      (1.6, 0.45, 'A warm low brass swell with a soft deep gong, rewarding, short'),
    'key':       (0.7, 0.55, 'An old heavy iron key picked up from stone, dull metallic clank and scrape, short'),
    'door':      (2.0, 0.55, 'A heavy rusted iron gate in a cave unlocking and grinding open on old hinges, deep scrape and clank'),
    'relic':     (3.0, 0.45, 'An ancient relic uncovered in a cave, a deep resonant hum swelling with soft dust falling and a low ethereal choir breath, mysterious'),
    'fossil':    (1.6, 0.5, 'Brushing dust off an ancient fossil bone embedded in rock, soft scraping, then a dull stone tap, short'),
    'chest':     (1.8, 0.55, 'An old wooden treasure chest creaking open, iron latch clunk, coins shifting inside'),
    # tools
    'throw':     (0.5, 0.55, 'Quick underarm throw, soft cloth swish, short'),
    'fuse':      (2.5, 0.6, 'A dynamite fuse burning, steady crackling fizz and sputter, close'),
    'boom':      (3.0, 0.6, 'Stick of dynamite exploding inside a rocky cave, huge deep blast with long echoing rumble and falling rock debris'),
    'boomfar':   (2.5, 0.55, 'Distant muffled explosion deep inside a mountain, low rumble and faint rockfall'),
    'debris':    (1.5, 0.55, 'Rocks and pebbles tumbling down onto a cave floor after a blast, rattling scatter'),
    'flare':     (1.2, 0.6, 'A road flare struck and igniting, sharp scrape then a hissing burning whoosh'),
    'flareloop': (4.0, 0.5, 'A burning signal flare, steady hissing sputter and crackle, seamless loop'),
    'lamp':      (0.8, 0.5, 'A brass miners lamp shutter clicked open and the flame flaring brighter, soft whoosh'),
    # cave hazards
    'crack':     (1.0, 0.55, 'A stalactite cracking loose from a cave ceiling, sharp stone creak and small grit falling'),
    'stalfall':  (1.2, 0.6, 'A heavy stone stalactite crashing onto a rock floor and shattering, cave echo'),
    'crumble':   (1.4, 0.55, 'A rotten stone ledge crumbling and collapsing into a pit, gravel slide'),
    'rumble':    (3.0, 0.5, 'Low ominous earthquake rumble deep inside a mountain cave, dust trickling, no explosion'),
    'geyserwarn': (1.6, 0.55, 'Hot water bubbling and gurgling up from a vent in a rock floor, building pressure, low'),
    'geyser':    (2.0, 0.6, 'A steam geyser erupting from a cave floor, powerful hissing roar of steam and spray'),
    'burn':      (0.8, 0.55, 'A sizzling hiss of something touching molten lava, short'),
    'lift':      (3.0, 0.5, 'An old mine elevator cage moving on a winch, rattling chains and a grinding pulley, steady, seamless loop'),
    'liftstop':  (1.0, 0.55, 'A mine elevator cage clanking to a stop at the bottom of a shaft, heavy metal clunk'),
    'cart':      (3.0, 0.5, 'An old iron mine cart rolling along rusty rails in a tunnel, rhythmic clatter, seamless loop'),
    'cartstop':  (1.0, 0.55, 'An iron mine cart slamming into a wooden buffer at the end of the rails, heavy clank'),
    # creatures
    'bat':       (0.8, 0.55, 'A cave bat taking off, leathery wing flutter, low, no squeak, no chirp'),
    'batdie':    (0.6, 0.55, 'Soft leathery thump of a small bat knocked out of the air, short, no squeak'),
    'shade':     (2.0, 0.5, 'A ghostly low breathy whisper and moan drifting through a cave, eerie, no words'),
    'shadefade': (1.4, 0.5, 'A ghostly apparition dispersing in light, a soft airy whoosh and fading breath'),
    'crawler':   (1.0, 0.55, 'A large cave beetle scuttling over stone, dry clicking legs, low'),
    'crawldie':  (0.7, 0.55, 'A big beetle shell cracked by a heavy blow, crunchy squelch, short'),
    'eel':       (1.2, 0.55, 'A large eel lunging out of dark water, sudden splash and wet slap'),
    'growl':     (1.5, 0.5, 'A large unseen creature growling low in a dark cave tunnel, distant and deep'),
    # bosses
    'bossroar':  (2.5, 0.55, 'A colossal cave monster roaring, deep guttural bellow echoing through a vast cavern'),
    'bosshit':   (0.8, 0.6, 'A heavy blow landing on a huge armoured cave creature, deep thud with a crack of stone plates'),
    'bossdie':   (4.0, 0.55, 'A gigantic cave monster collapsing and breaking apart, huge crash of stone, a dying roar and a long rockfall'),
    'slam':      (1.2, 0.6, 'A giant stone fist slamming into a cave floor, massive deep impact and rock spray'),
    'burrow':    (2.0, 0.55, 'A giant worm burrowing through rock, grinding rumble and crumbling stone'),
    'wings':     (1.2, 0.55, 'Giant leathery wings beating once in a cavern, deep heavy whoosh of air'),
    'screech':   (1.5, 0.5, 'A giant cave beast hissing screech, low and raspy, no high whistle'),
    'beam':      (1.8, 0.55, 'A crystal energy beam charging and firing, deep resonant hum building to a crackling surge'),
    'shatter':   (1.5, 0.55, 'Large crystal formation shattering into pieces, heavy glassy crash, low'),
    # the living cave (1.7): things the digger brushes, kicks and breaks
    'pebble':    (0.6, 0.65, 'A single small stone kicked by a boot, skittering and clacking a few times across a hard rocky cave floor, short, dry'),
    'rustle':    (0.7, 0.6, 'A brief soft rustle of someone brushing through damp cave roots and moss, short and gentle, no footsteps'),
    'tinkle':    (1.0, 0.6, 'A small cluster of crystals snapping off and tinkling onto stone, delicate glassy chime, short'),
    'potbreak':  (0.9, 0.6, 'A small old clay pot smashed and breaking into shards on a stone floor, short dry crack and scatter'),
    # the physical cave (1.8): rock that digs away, props that tip, roll and smash
    'dig':       (0.7, 0.65, 'A steel pickaxe biting hard into solid rock, a chunk of stone cracking loose and dropping, short, dry, crunchy, no metallic ring'),
    'rubble':    (1.0, 0.6, 'A small heap of broken rocks and gravel tumbling down and settling on a stone cave floor, short'),
    'woodknock': (0.8, 0.6, 'A small wooden bucket or keg knocked over, tipping and thudding onto a stone floor, short, dry, hollow'),
    'clang':     (0.8, 0.6, 'An old tin bucket knocked over, clattering and rattling on a stone floor, short metallic clatter'),
    'roll':      (1.4, 0.55, 'An empty wooden barrel tipping over and rolling a short way across a rough stone floor, hollow rumble, short'),
    'splinter':  (0.8, 0.6, 'A rotten wooden crate smashed by a pickaxe, dry wood splintering and planks clattering down, short'),
    'timber':    (1.6, 0.55, 'An old wooden mine support beam cracking and collapsing onto rock, splintering crash and a heavy thud, short'),
    'topple':    (1.0, 0.6, 'A stone stalagmite snapping at its base and toppling onto a cave floor, sharp crack then a heavy stony thud, short'),
    'surge':     (2.0, 0.55, 'A huge wave of water surging through a flooded cavern, roaring rush'),
    'magma':     (2.0, 0.55, 'Molten lava erupting and splashing out of a pool, deep glooping roar and sizzle'),
    # ui and meta
    'checkpoint': (1.6, 0.5, 'A campfire catching light, soft whoosh of flames growing and crackling wood, warm'),
    'discover':  (2.0, 0.5, 'Soft magical shimmer of discovery, warm low strings swell with a gentle airy sparkle, short and calm'),
    'journal':   (0.8, 0.6, 'An old leather journal page turned and a pencil scribble, short'),
    'upgrade':   (1.2, 0.55, 'A blacksmith hammer striking an anvil twice, then coins clinking on a wooden counter'),
    'medal':     (1.4, 0.45, 'A heavy bronze medal dropped onto a wooden table, warm metallic thunk with a short low ring'),
    'uimove':    (0.3, 0.6, 'Very short soft wooden tick, like a pencil tap on a desk'),
    'uiok':      (0.5, 0.6, 'Short soft confirmation sound, a leather book closing with a gentle thump'),
    'uiback':    (0.4, 0.6, 'Short soft paper swish, low'),
    'rewind':    (1.2, 0.55, 'Tape rewinding whoosh, quick'),
    'slowmo':    (1.5, 0.5, 'A deep slow motion whoosh, time slowing down, low'),
    'warn':      (1.0, 0.55, 'A low ominous stone grinding rumble warning, short, no beeps'),
    # ambient beds (loops)
    'amb1':      (12.0, 0.4, 'Ambience of an old abandoned gold mine tunnel, creaking timber supports, distant water drips, faint wind through shafts, seamless loop'),
    'amb2':      (12.0, 0.4, 'Ambience of a damp glowing mushroom cave, soft trickling water, gentle hollow air, faint distant dripping, seamless loop'),
    'amb3':      (12.0, 0.4, 'Ambience of a vast crystal cavern, low airy resonance and a soft hollow hum, very distant drips, seamless loop'),
    'amb4':      (12.0, 0.4, 'Ambience of a flooded underground temple, gentle lapping water, deep distant flow, hollow echo, seamless loop'),
    'amb5':      (12.0, 0.4, 'Ambience of a volcanic cave, low lava rumble, bubbling magma, hissing steam vents, seamless loop'),
    'waterfall': (8.0, 0.45, 'An underground waterfall pouring into a pool inside a cave, steady roar, seamless loop'),
}

VOICE_IDS = ['pqHfZKP75CvOlQylNhV4', 'JBFqnCBsd6RMkjVDRZzb']  # an old storyteller (Bill); fallback George
# the old prospector who dug these tunnels long ago, talking to you through your lamp light. RARE: key moments only.
VOICE = {
    'begin':     'Lamp lit? Good. This old mountain has been keeping secrets for a long time. Go find them.',
    'd2':        'The Glowroot Grotto. Mind the bats. They hate a bright flare.',
    'd3':        'The Geode Vaults. Not many folk have seen this far down.',
    'd4':        'The Drowned Halls. Someone built these, long before us.',
    'd5':        'The Ember Core. The heart of the mountain. Watch your step.',
    'deep':      'Past the maps now. Nobody knows what is down here.',
    'boss':      'Something big is awake down there. Steady now.',
    'bossdown':  'Ha! The mountain gives up another secret.',
    'wonder':    'Would you look at that.',
    'relic':     'Now that is a real find.',
    'lowoil':    'Your lamp is running dry. Find some oil.',
    'lastlife':  'Careful, digger. One more slip and that is it.',
    'gameover':  'The mountain keeps this one. Try again.',
    'newrecord': 'Richest haul I have ever seen.',
    'champion':  'You found the heart of the mountain. I never did.',
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
                         'voice_settings': {'stability': 0.55, 'similarity_boost': 0.8, 'style': 0.3, 'use_speaker_boost': True}}))
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
        print('fewer than 15 % of credits left: not generating')
        sys.exit(2)
    only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
    force = '--force' in sys.argv
    js = [j for j in jobs(kind) if not only or j[1] in only]
    with ThreadPoolExecutor(2) as ex:  # never more than 2 requests in flight
        for line in ex.map(lambda j: run(j, force), js):
            print(line, flush=True)
    used, lim, left = credits()
    print(f'credits after: used {used} / {lim} ({left * 100:.1f} % left)', flush=True)
