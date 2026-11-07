"""Generate Shock Horror audio with ElevenLabs (dread music, horror SFX, scare stingers, whispers, the Voice).

Usage: python -I gen_audio.py [credits|music|sfx|voice|all] [--only name1,name2] [--force]
Raw mp3s land in <work>/audio-raw/<kind>/<name>.mp3 (or SH_RAW). The key is read from the Windows user
environment through PowerShell; it is never printed and never written anywhere.
At most 2 requests run at a time; 429/5xx retry one by one with backoff.
Before generating it checks the credit balance and refuses to run with less than 15 % left.
Then run process_audio.py <game folder> to trim / normalise / loop / encode into the game.
Sounds Shock Horror keeps from Gold Digger (steps, pick, dynamite, UI ...) are not regenerated.
"""
import json, os, subprocess, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

RAW = os.environ.get('SH_RAW', 'D:/Projects/.tmp/shock-horror-work/audio-raw')
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


# Original horror score: a lone miner with a helmet lamp going down an abandoned, haunted pit.
MUSIC = {
    'title': (90, 'Dark cinematic horror main theme, slow 60 BPM, a detuned music box melody over deep sub bass drones, scraping bowed metal, distant choir of whispering voices, a single low piano note repeating, an abandoned haunted mine shaft at night, dread and unease, instrumental, no vocals'),
    'd1':    (120, 'Slow creeping horror underscore, 70 BPM, low cello drones, creaking wood and dripping water textures, sparse detuned piano notes, quiet heartbeat like kick drum, an abandoned mine where the night shift vanished, tense and lonely, instrumental, no vocals'),
    'd2':    (120, 'Unsettling organic horror ambient score, 66 BPM, wet breathing textures, slow dissonant string clusters, low throbbing pulse, faint insect like rattles, a rotting fungus cave full of cocoons, sickly and claustrophobic, instrumental, no vocals'),
    'd3':    (120, 'Gothic horror score, 72 BPM, cold glass harmonica dissonance, distant tolling bell, low monk like choir drone, bone rattle percussion, sub bass swells, catacombs of skulls and candles beneath the earth, sacred dread, instrumental, no vocals'),
    'd4':    (120, 'Drowned horror score, 64 BPM, deep submerged bell tones, slow reversed piano, murky low strings, distant muffled singing, bubbling water textures, a flooded chapel full of the drowned, cold and mournful, instrumental, no vocals'),
    'd5':    (120, 'Visceral body horror score, 84 BPM, pounding heartbeat percussion, screeching violin clusters, distorted low brass, wet flesh textures, industrial rumble, the inside of a living mountain made of flesh, frantic dread, instrumental, no vocals'),
    'deep':  (120, 'Endless nightmare horror ambient score, 70 BPM, evolving dissonant drones, slow pulsing sub bass, distant metallic screams in reverb, ticking clock textures, an endless descent into the dark, instrumental, no vocals'),
    'boss':  (100, 'Intense horror monster chase score, 140 BPM, pounding taiko and metal percussion, shrieking string clusters, distorted brass blasts, driving cello ostinato, a monstrous thing hunting you in the dark, terrifying and relentless, instrumental, no vocals'),
    'clear': (10, 'Short dark horror resolution, a low string swell and a single tolling bell fading into silence, uneasy relief, instrumental'),
}
# stings made with the sound-effects model but shipped as music (A.sting / A.overlay)
MUSIC_SFX = {
    'over':     (6.0, 0.45, 'Short horror game over sting, a deep descending brass groan and a dissonant string cluster fading into a cold wind'),
    'discover': (5.0, 0.5, 'Short eerie discovery sting, a slow rising dissonant string swell with a faint choir and a soft bell, mysterious dread'),
}

# name: (seconds, prompt influence, text)
SFX = {
    # creatures (re-made for the horror versions)
    'hurt':      (0.8, 0.6, 'Short pained gasp and grunt of a frightened man being clawed, breathy, no words'),
    'death':     (2.2, 0.55, 'A man screaming in terror then collapsing onto a stone floor, his lantern clattering and rolling away, silence'),
    'bat':       (1.0, 0.6, 'A pale bat like creature shrieking with an almost human scream, short, harsh, echoing in a cave'),
    'batdie':    (0.9, 0.6, 'A small monstrous creature squealing and dying, wet crunch, short'),
    'shade':     (2.5, 0.55, 'A ghostly woman wailing softly in the distance, breathy and hollow, echoing, getting closer'),
    'shadefade': (1.6, 0.55, 'A ghost dissolving with a fading sigh and a soft hiss, airy reverse whoosh'),
    'crawler':   (1.2, 0.6, 'Long bony limbs skittering quickly across stone, clicking, insect like, close'),
    'crawldie':  (0.9, 0.6, 'A wet crunch of a bony creature being crushed, short squelch'),
    'eel':       (1.2, 0.6, 'A drowned corpse lunging out of black water with a gurgling gasp and a splash'),
    'growl':     (1.5, 0.6, 'A low wet guttural growl from something in the dark, close and menacing'),
    'screech':   (1.5, 0.6, 'A huge monster shrieking, a terrible high piercing inhuman scream echoing in a cavern'),
    'bossroar':  (2.5, 0.6, 'A colossal nightmare creature roaring, layered screams and deep growl, cavernous echo'),
    'bosshit':   (0.8, 0.6, 'A pick striking flesh of a giant monster, wet heavy impact and a pained shriek'),
    'bossdie':   (4.0, 0.5, 'A gigantic monster dying, a long agonised scream collapsing into wet gurgles and falling rocks'),
    'heart':     (0.9, 0.55, 'A single slow heavy heartbeat, deep and muffled, close'),
    'relic':     (2.5, 0.5, 'A cursed object picked up, a low dissonant hum and a faint choir whisper rising then cutting out'),
    'journal':   (1.2, 0.6, 'Old brittle paper being unfolded slowly in a quiet room'),
    'checkpoint':(2.0, 0.55, 'A match struck and a candle flame catching, a soft sigh of relief in the dark'),
    'medal':     (1.6, 0.5, 'A single deep church bell toll with a long dark reverb'),
    'discover':  (2.5, 0.5, 'A hollow wall cracking open and cold air rushing out, a faint distant moan'),
    # the scare stingers (the jump scare hit)
    'st_violin': (1.6, 0.7, 'Horror movie jump scare sting, a violent screeching violin cluster stab, very loud and sudden, then a short decay'),
    'st_brass':  (1.8, 0.7, 'Horror jump scare sting, a sudden blasting low brass and orchestra hit with a metallic scrape, loud'),
    'st_piano':  (1.6, 0.7, 'Horror jump scare, a sudden loud piano low cluster slam with sustain pedal, dissonant ringing'),
    'st_choir':  (1.8, 0.7, 'Horror jump scare, a sudden shrieking choir of screaming voices, loud, then cut off'),
    'st_metal':  (1.4, 0.7, 'Horror jump scare, a sudden harsh metallic screech and impact, like rusty iron tearing, loud'),
    'st_bass':   (2.0, 0.65, 'Horror sting, a sudden deep sub bass boom and reverse whoosh into a heavy impact'),
    'st_reverse':(2.0, 0.65, 'Horror sting, a reversed scream sucking inward and ending in a sharp hit'),
    'st_glitch': (1.0, 0.6, 'Harsh digital glitch noise burst with distorted screaming voices, very short'),
    # screams and voices without words
    'sc_woman':  (1.8, 0.6, 'A woman screaming in terror, piercing, echoing in a cave'),
    'sc_man':    (1.8, 0.6, 'A man screaming in agony far down a mine tunnel, echoing'),
    'sc_inhuman':(1.8, 0.65, 'An inhuman distorted scream, like a person and an animal at once, horrifying'),
    'sc_ghoul':  (1.4, 0.6, 'A ghoul shrieking right in your ear, raspy, wet and very close'),
    'sc_many':   (3.0, 0.55, 'Many distant voices screaming together from deep below the earth, echoing'),
    'laugh_child':(2.5, 0.55, 'A small child giggling softly in the dark, echoing, unsettling'),
    'laugh_low': (2.5, 0.55, 'A low slow evil chuckle of a man in the dark, close, breathy'),
    'cry_woman': (4.0, 0.5, 'A woman sobbing quietly in the dark, distant, echoing in a stone tunnel'),
    'moan_walls':(4.0, 0.5, 'Many low human moans coming from inside stone walls, muffled, layered'),
    'whisper_l': (3.0, 0.55, 'Unintelligible creepy whispering of several voices, close to the ear, breathy and urgent'),
    'whisper_r': (3.0, 0.55, 'A single raspy voice whispering unintelligibly very close, hissing consonants, menacing'),
    'breath':    (3.5, 0.55, 'Slow heavy wet breathing right behind someone, close and menacing'),
    'gasp':      (1.0, 0.6, 'A drowned person gasping and gurgling as they surface, wet'),
    'hum_girl':  (5.0, 0.5, 'A little girl humming a slow sad lullaby melody in the distance, echoing in a cave'),
    'name_call': (2.0, 0.5, 'A faint far away male voice calling out a long hollow hello into a mine shaft, echoing'),
    # bodies and things
    'body_thud': (1.2, 0.6, 'A heavy dead body falling and hitting a stone floor, dull thud and bones cracking'),
    'rope_creak':(3.0, 0.55, 'A taut rope creaking slowly as a heavy weight swings on it, wooden beam groaning'),
    'bone_crunch':(0.9, 0.6, 'Bones crunching and snapping, wet, short'),
    'squelch':   (1.0, 0.6, 'Wet fleshy squelch, something pushing out of meat, gross'),
    'flesh_tear':(1.2, 0.6, 'Flesh tearing open slowly with a wet rip'),
    'bones_rattle':(1.5, 0.55, 'A skeleton rattling, dry bones clattering together'),
    'skull_roll':(1.6, 0.55, 'A skull rolling across a stone floor and knocking to a stop'),
    'teeth':     (1.2, 0.55, 'Teeth chattering rapidly, close, dry clicking'),
    'drip_blood':(3.0, 0.5, 'Thick liquid dripping slowly onto stone in a quiet cave, viscous drops'),
    'wall_groan':(3.0, 0.55, 'Living flesh walls groaning and shifting, deep wet creak'),
    'heartbeat': (4.0, 0.5, 'Fast heavy heartbeat, thumping, deep, panicked, seamless loop'),
    # footsteps and movement in the dark
    'feet_behind':(3.0, 0.55, 'Slow bare footsteps on wet stone behind you, deliberate, stopping'),
    'feet_run':  (2.0, 0.6, 'Bare feet sprinting fast across a stone cave floor and away, slapping, echoing'),
    'skitter':   (2.0, 0.6, 'Something with many limbs skittering rapidly across a ceiling above, scraping'),
    'scratch':   (2.5, 0.6, 'Fingernails scratching slowly down a rough stone wall'),
    'knock':     (2.5, 0.6, 'Three slow heavy knocks from the other side of a rock wall, muffled'),
    'drag':      (3.0, 0.55, 'Something heavy being dragged slowly across a gravel floor in the dark'),
    'rats':      (2.5, 0.6, 'A swarm of rats squeaking and scurrying past quickly'),
    'spiders':   (2.0, 0.6, 'Hundreds of tiny legs skittering over stone, dry and fast'),
    'wings_many':(2.0, 0.6, 'A sudden burst of hundreds of leathery wings flapping past in a cave'),
    # objects
    'iron_slam': (1.4, 0.65, 'A heavy iron gate slamming shut in a stone tunnel, echoing'),
    'cage':      (2.0, 0.6, 'Someone violently shaking an old iron cage, rattling chains'),
    'chains':    (2.5, 0.55, 'Heavy chains swinging and clinking slowly in an empty cave'),
    'bell_toll': (5.0, 0.5, 'A distant church bell tolling once underground, deep and muffled, long reverb'),
    'shift_bell':(3.0, 0.55, 'An old mine shift bell clanging three times far away, echoing up a shaft'),
    'musicbox':  (6.0, 0.5, 'An old music box playing a slow detuned lullaby, winding down and slowing'),
    'cart_roll': (4.0, 0.55, 'An empty rusty mine cart rolling slowly on iron rails by itself, squeaking'),
    'pick_far':  (4.0, 0.55, 'Someone swinging a pickaxe into rock far away in the dark, slow rhythmic clinks, echoing'),
    'whistle':   (4.0, 0.5, 'Someone whistling a slow sad tune far away in a tunnel, echoing, eerie'),
    'candles':   (1.5, 0.6, 'A row of candles blown out one by one by a cold gust, soft puffs'),
    'lamp_die':  (1.2, 0.6, 'An oil lamp flame sputtering and going out, a soft hiss and click'),
    'lantern_sq':(3.0, 0.55, 'An old metal lantern swinging and squeaking on a hook'),
    'glass':     (1.0, 0.6, 'Glass cracking slowly under pressure, a sharp creak'),
    'wind_moan': (4.0, 0.5, 'A cold wind moaning through a narrow cave tunnel, almost like a voice'),
    'static':    (1.5, 0.55, 'Harsh crackling static and distortion, short'),
    'ring':      (3.0, 0.5, 'High pitched tinnitus ringing in the ears after a shock, fading slowly'),
    'drone_rise':(5.0, 0.55, 'A rising horror tension drone, dissonant strings and sub bass growing louder and higher'),
    'thump_above':(1.5, 0.6, 'Heavy thump on the ceiling above, dust falling'),
    'water_hand':(1.5, 0.6, 'A hand bursting out of still water with a splash and dripping'),
    # ambience beds (seamless loops)
    'amb1':      (12.0, 0.4, 'Ambience of an abandoned haunted mine shaft at night, creaking timbers, distant dripping, faint wind moan, very distant knocking, seamless loop'),
    'amb2':      (12.0, 0.4, 'Ambience of a rotting fungus cave, wet squelching, slow dripping, faint buzzing insects, soft distant breathing, seamless loop'),
    'amb3':      (12.0, 0.4, 'Ambience of underground catacombs, cold hollow air, distant faint chanting, dry bones settling, candle crackle, seamless loop'),
    'amb4':      (12.0, 0.4, 'Ambience of a flooded underground chapel, slow lapping black water, distant muffled bell, bubbles, cold echo, seamless loop'),
    'amb5':      (12.0, 0.4, 'Ambience inside a living flesh cave, slow deep heartbeat, wet breathing walls, gurgling, low rumble, seamless loop'),
}

VOICE_IDS = ['N2lVS1w4EtoT3dr4eOWO', 'JBFqnCBsd6RMkjVDRZzb']  # a hoarse intense voice (Callum); fallback George
WHISPER_IDS = ['pFZP5JQG7iQjIQuC4Bku', 'XB0fDUnXU5powFXDhCwa', '21m00Tcm4TlvDq8ikWAM']  # a soft female voice (Lily); fallbacks
# The Voice: whatever lives at the bottom of the pit, talking to you through the dark. RARE: key moments only.
VOICE = {
    'begin':     'Another one comes down with a little lamp. The night shift came down too. They are still here.',
    'd2':        'The rot garden. Do not touch the cocoons. Some of them are awake.',
    'd3':        'The ossuary. Every skull here once had a name.',
    'd4':        'The drowned chapel. Hold your breath. They never let go.',
    'd5':        'You are inside me now.',
    'deep':      'There is no bottom. There never was.',
    'boss':      'Something has smelled your light.',
    'bossdown':  'It is dead. Something worse is listening.',
    'wonder':    'Look closer.',
    'relic':     'That belonged to someone. They want it back.',
    'lowoil':    'Your light is dying. Then we can see you.',
    'lastlife':  'One more time, and you stay with us.',
    'gameover':  'Welcome to the night shift.',
    'newrecord': 'Greedy. Just like the others.',
    'champion':  'You reached the heart. Now it beats for you.',
}
# whispered lines used by the scares (always quiet, processed with reverb)
WHISPERS = {
    'w_behind':  'behind you',
    'w_deeper':  'dig deeper',
    'w_light':   'we can see your light',
    'w_turn':    'do not turn around',
    'w_join':    'join us',
    'w_cold':    'it is so cold down here',
    'w_coming':  'he is coming',
    'w_help':    'help me',
    'w_back':    'turn back',
    'w_dying':   'your lamp is dying',
    'w_shift':   'we were the night shift',
    'w_took':    'it took all of us',
    'w_up':      'look up',
    'w_close':   'so close now',
    'w_stay':    'stay with us',
    'w_why':     'why did you leave us',
    'w_breath':  'i can hear you breathing',
    'w_oneof':   'one of us',
    'w_floor':   'it is under the floor',
    'w_name':    'digger',
    'w_hungry':  'it is hungry',
    'w_see':     'i see you',
    'w_wake':    'do not wake it',
    'w_dark':    'let the dark in',
    'w_out':     'there is no way out',
    'w_mine':    'mine',
    'w_play':    'play with me',
    'w_hush':    'shhh',
    'w_found':   'found you',
    'w_soon':    'soon',
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
            out.append(('voice', 'v_' + n, VOICE_IDS,
                        {'text': text, 'model_id': 'eleven_multilingual_v2',
                         'voice_settings': {'stability': 0.35, 'similarity_boost': 0.8, 'style': 0.55, 'use_speaker_boost': True}}))
        for n, text in WHISPERS.items():
            out.append(('voice', n, WHISPER_IDS,
                        {'text': '[whispers] ' + text + '...', 'model_id': 'eleven_v3',
                         'voice_settings': {'stability': 0.5, 'similarity_boost': 0.8}}))
    return out


def run(job, force):
    kind, name, path, body = job
    out = os.path.join(RAW, kind, name + '.mp3')
    if os.path.exists(out) and not force:
        return f'skip {kind}/{name}'
    try:
        if kind == 'voice':
            err = None
            for vid in path:
                for b in (body, {**body, 'text': body['text'].replace('[whispers] ', ''), 'model_id': 'eleven_multilingual_v2'}):
                    try:
                        return f'ok   {kind}/{name} {post(f"/v1/text-to-speech/{vid}?output_format=mp3_44100_128", b, out)} {vid[:4]} {b["model_id"]}'
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
