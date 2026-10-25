"""Destruction sound effects (ElevenLabs, generated through the ElevenLabs connector on 2026-10-24 from the prompts below,
included allowance only, overages off). The raw MP3s are kept out of git in outputs/destruction-sfx/<id>.mp3; this script
turns each into public/audio/<id>.ogg with the same processing as tools/fire-audio.py and records it in the manifest.
Idempotent: clips already in the manifest with their .ogg present are skipped."""
import json, pathlib, hashlib, subprocess
ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT, RAW, WORK = ROOT/'public/audio', ROOT/'outputs/destruction-sfx', ROOT/'outputs/destruction-sfx/work'
WORK.mkdir(parents=True, exist_ok=True)
NO = ' Isolated, no music, no voices, no speech.'
jobs = [
 ('backfire', 'Exhaust backfire: a single very loud sharp bang from a car tailpipe like a gunshot, with a short metallic ring and a brief echo outdoors. Isolated, no engine running, no music, no voices, no speech.', 1.0, False),
 ('tyre-blowout', 'Tyre exploding on a car: one violent rubber blowout bang with a burst of escaping air and a flap of torn rubber, outdoors.'+NO, 1.0, False),
 ('rod-bang', 'Engine throwing a connecting rod: one violent metallic bang deep inside the engine block, a harsh clattering grind and the engine stopping dead with a hiss. Isolated mechanical sound, no music, no voices, no speech.', 1.8, False),
 ('engine-seize', 'Seizing car engine from oil starvation: a harsh metallic knocking that turns into a grinding screech and stops dead with a final clunk. Isolated mechanical sound, no music, no voices, no speech.', 1.6, False),
 ('extinguisher', 'Handheld dry powder fire extinguisher discharged in one burst: a sharp pressurized whoosh and hiss that cuts off cleanly.'+NO, 1.3, False),
 ('bump-start', 'Push starting an old car: the engine turns over with two compression chuffs, coughs, and catches into a rough idle. Isolated engine sound outdoors, no music, no voices, no speech.', 1.8, False),
 ('spring-snap', 'Heavy car coil spring snapping under load: a sharp metallic twang and a hard suspension clunk.'+NO, .8, False),
 ('shaft-snap', 'Driveshaft snapping under load on a car: a loud metal crack followed by a few fast clattering flails against the underbody.'+NO, 1.0, False),
 ('mirror-snap', 'Wing mirror knocked off a car by a passing car: a sharp crack of snapping plastic and a small glass tinkle.'+NO, .6, False),
 ('battery-rip', 'Battery torn out of a car engine bay in a crash: cables snapping with a crackle of electrical sparks and a heavy plastic box thudding onto dirt.'+NO, 1.0, False),
 ('crowd-cheer', 'Grandstand crowd at an outdoor demolition derby erupting into a big roar and cheer after a huge crash, then settling. Wordless crowd noise only, no announcer, no music, no individual words or speech.', 4.0, False),
 ('horn-stuck', 'Stuck car horn: one continuous steady slightly weak old car horn blare with no variation.'+NO, 2.0, True),
 # Extra takes of the three impact clips so repeated hits do not all sound the same (audio.impactTake).
 ('impact-light-2', 'Light car body knock at low speed: a hollow sheet metal bang with a short plastic trim crack and a faint rattle. Dry close recording. No music, no voices, no speech.', 2.0, False),
 ('impact-light-3', 'Low speed bumper-to-door car tap: a dull metallic thump, a crunch of plastic and a light panel flex. Dry close recording. No music, no voices, no speech.', 2.0, False),
 ('impact-medium-2', 'Medium speed demolition derby car crash: a hard crunch of folding steel panels, a cracking bumper and a few bits of trim falling. No explosion. No music, no voices, no speech.', 3.0, False),
 ('impact-medium-3', 'Crunching car side impact starting instantly: from the very first moment a deep metal crump as a door caves in, glass cracking and debris skittering, then fading. No lead-in, no explosion. No music, no voices, no speech.', 3.0, False),
 ('impact-heavy-2', 'Violent head-on collision of two heavy cars at high speed: an enormous low impact boom, steel crushing and tearing, a windscreen bursting and debris raining down. No explosion. No music, no voices, no speech.', 4.0, False),
 ('impact-heavy-3', 'Brutal high speed T-bone smash in a demolition derby: a massive metallic slam, a car body folding around the impact, glass showering and parts clattering away. No explosion. No music, no voices, no speech.', 4.0, False),
 # Damage loops (audio.damageLoops) and more takes of the glass and debris layers.
 ('tyre-rub', 'Tyre rubbing against a crushed steel wheel arch on a moving car: a continuous rhythmic rubber scrubbing squeal and grinding with a faint thump on each wheel turn. Isolated, no engine, no music, no voices, no speech.', 3.0, True),
 ('metal-groan', 'Metal groaning as two crashed cars are pressed together: continuous deep creaking and moaning of stressed steel body panels under heavy load, with small metallic pops. Isolated, no engine, no music, no voices, no speech.', 3.0, True),
 ('glass-2', 'Rear window of a car bursting in a crash: a sharp crack and a shower of small tempered glass cubes pattering onto dirt. No music, no voices, no speech.', 2.0, False),
 ('glass-3', 'Car windscreen and headlight glass breaking: a crisp shatter and small glass fragments tinkling down onto asphalt. No music, no voices, no speech.', 2.0, False),
 ('debris-2', 'Torn-off car door hitting hard ground and skidding along it with a scraping metal clatter. No music, no voices, no speech.', 2.0, False),
 ('debris-3', 'Pieces of plastic car trim and a hubcap falling onto gravel, rolling and rattling to a stop. No music, no voices, no speech.', 2.0, False),
 # Recorded loops that take over from the synthesized ones (same ids, so the synth stays as the fallback).
 ('starter', 'Starter motor cranking a car engine that will not start: continuous rhythmic whirring and chugging of the starter with steady compression pulses, the engine never catching. Isolated, no music, no voices, no speech.', 2.0, True),
 ('gear-grind', 'Loud continuous gear crunch: a manual gearbox grinding hard and steadily the whole time, a dense harsh metallic rasp of clashing gear teeth with no pauses. Isolated, no engine revving, no music, no voices, no speech.', 1.5, True),
 ('squeal', 'Fan belt slipping in a car engine bay: a continuous steady high pitched rubber belt squeal. Isolated, no music, no voices, no speech.', 2.0, True),
 ('growl', 'Wheel bearing worn out on a moving car: a continuous low rumbling metallic growl and hum that stays steady. Isolated, no engine, no music, no voices, no speech.', 2.0, True),
 # Loose-panel clanks (four variants, also the fan clatter and the dry-engine knock) and the bent-wheel thump, in place
 # of synthClank/synthThump: all five must be present, or audio.damageBuffers() would leave the rattles silent.
 ('rattle-0', 'Single loose car body panel clank: one short metallic rattle hit of a dented door panel, very short and dry, then silence. No music, no voices, no speech.', .5, False),
 ('rattle-1', 'Tinny clatter: one short hit of a loose plastic bumper trim slapping against car metal, very short and dry, then silence. No music, no voices, no speech.', .5, False),
 ('rattle-2', 'Hollow knock: one short bang of a loose car bonnet bouncing on its latch, very short and dry, then silence. No music, no voices, no speech.', .5, False),
 ('rattle-3', 'Sharp metallic tick: one short ping of a loose exhaust heat shield rattling against the car floor, very short and dry, then silence. No music, no voices, no speech.', .5, False),
 ('thump', 'Dull rubbery thump: one short heavy knock of a bent car wheel and flat-spotted tyre hitting the road, very short and dry, then silence. No music, no voices, no speech.', .5, False),
 # The open-cabin wind roar (synthWind's id) and the rain, recorded.
 ('wind', 'Wind roaring through the shattered open windscreen of a fast moving car: a continuous turbulent rush of air buffeting the cabin, steady. Isolated, no engine, no music, no voices, no speech.', 3.0, True),
 ('rain', 'Steady rain falling on a dirt arena and on car roofs: a continuous even rain hiss with soft patter, no thunder. No music, no voices, no speech.', 4.0, True),
 # A car's fuel tank going up (BLOW UP).
 ('car-explosion', 'Car fuel tank explosion in an outdoor arena: a massive deep boom and fireball whoosh, metal panels tearing and flying, then debris clattering down and fire crackling. No music, no voices, no speech.', 3.5, False),
 # Tyres rolling over the crash litter (crunch takes, alternated).
 ('glass-crunch', 'Crunching broken glass under a car tyre: a car rolling slowly over scattered tempered glass crumbs on asphalt, a short gritty crackle and crunch. Isolated, no engine, no music, no voices, no speech.', 1.0, False),
 ('glass-crunch-2', 'Gritty crackle of glass fragments and plastic chips being crushed under a slowly rolling rubber tyre on a hard floor, short and dry. Isolated, no engine, no music, no voices, no speech.', 1.0, False),
 # The arena air horn over the PA as a derby heat starts (two takes, one per heat in turn).
 ('air-horn', 'Airhorn blast at an outdoor stadium: one long loud pneumatic air horn blast over a public address system, echoing around a dirt arena, then fading. Isolated, no music, no voices, no speech, no crowd.', 2.2, False),
 ('air-horn-end', 'Pneumatic stadium horn sounding twice: two long loud air horn blasts in a row over arena loudspeakers, echoing outdoors, then fading. Isolated, no music, no voices, no speech, no crowd.', 3.0, False),
 # The whine of a straight-cut reverse gear on a car backing up hard (a loop, pitched with speed).
 ('reverse-whine', 'Whining reverse gear of an old car backing up fast: a loud continuous high pitched gearbox whine from straight cut reverse gears, steady and mechanical. Isolated, no engine roar, no music, no voices, no speech.', 2.0, True),
 # A blown or shredded tyre flapping as the car goes, and steam hissing out of a burst radiator (loops).
 ('tyre-flap', 'Flapping shredded tyre: a flat torn car tyre slapping against the wheel arch as the car drives along, a rhythmic rubbery flap flap flap, steady. Isolated, no engine, no music, no voices, no speech.', 2.0, True),
 ('steam-hiss', 'Steam hissing out of a burst car radiator: a continuous steady hiss of escaping hot steam with a faint bubbling gurgle under the bonnet. Isolated, no engine, no music, no voices, no speech.', 2.0, True),
]
# Seconds cut from the start of a raw clip: metal-groan dips to silence early (it would drop out every loop) and
# debris-2 opens with half a second of near silence (the layer would land late).
TRIM = {'metal-groan':.7,'debris-2':.45,'growl':.6,'thump':.11,'car-explosion':.5,'reverse-whine':.5}
# Seconds kept (after any trim): the game plays the clanks for 0.26 s and the thump for 0.18 s, so the clips are cut to
# about that (rattle-2 before its second bounce) and level-matched over what is heard.
KEEP = {'rattle-0':.3,'rattle-1':.3,'rattle-2':.18,'rattle-3':.3,'thump':.22,'reverse-whine':.9}
# Clips that replace a synthesized sound are brought to that synth's RMS (dBFS), so the gains the game already plays
# them at stay right: the stuck horn (synthHorn), the starter, the gearbox grind, the belt squeal and the bearing growl.
MATCH = {'horn-stuck':-13.2,'starter':-13.5,'gear-grind':-14.3,'squeal':-17.4,'growl':-29.1,'rattle-0':-18.3,'rattle-1':-18.2,'rattle-2':-18.2,'rattle-3':-18.3,'thump':-15.4,'wind':-20.3,'rain':-17.7,'car-explosion':-15}
def rms_db(path):
    import array, math
    pcm = array.array('h', subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','s16le','-ac','1','-'],capture_output=True,check=True).stdout)
    return 20*math.log10(max(1e-9, math.sqrt(sum(x*x for x in pcm)/max(1,len(pcm)))/32768))
def length(path):
    return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(path)],capture_output=True,text=True,check=True).stdout)
manifest = json.loads((OUT/'manifest.json').read_text())
added = []
for name, prompt, duration, loop in jobs:
    entry = next((a for a in manifest if a['id']==name), None)
    # A clip that should be level-matched but was processed before matching existed is redone.
    if entry and name in MATCH and 'RMS matched' not in entry['processing']: manifest.remove(entry); entry = None
    if entry and (OUT/(name+'.ogg')).exists(): continue
    raw = RAW/(name+'.mp3')
    if not raw.exists(): raise SystemExit(f'missing raw clip {raw} (generate it first)')
    base = WORK/(name+'-normalized.wav')
    trim = TRIM.get(name, 0)
    keep = ['-t',str(KEEP[name])] if name in KEEP else []
    subprocess.run(['ffmpeg','-y','-v','error','-ss',str(trim),*keep,'-i',str(raw),'-af','loudnorm=I=-23:TP=-3:LRA=7','-ar','44100','-ac','1',str(base)],check=True)
    if name in MATCH:
        gain = MATCH[name]-rms_db(base); matched = WORK/(name+'-matched.wav')
        subprocess.run(['ffmpeg','-y','-v','error','-i',str(base),'-af',f'volume={gain:.2f}dB,alimiter=limit=0.95:level=disabled','-ar','44100','-ac','1',str(matched)],check=True)
        base = matched
    real = length(base)
    if loop:
        # Rotate the seam: blend the final 180 ms into the first 180 ms, then the middle (as tools/fire-audio.py).
        end = real-.18
        graph = (f'[0:a]asplit=3[a][b][c];[a]atrim=start=0:end=0.18,asetpts=PTS-STARTPTS[head];'
                 f'[b]atrim=start=0.18:end={end},asetpts=PTS-STARTPTS[mid];[c]atrim=start={end}:end={real},asetpts=PTS-STARTPTS[tail];'
                 '[tail][head]acrossfade=d=0.18:c1=tri:c2=tri[seam];[mid][seam]concat=n=2:v=0:a=1[out]')
        subprocess.run(['ffmpeg','-y','-v','error','-i',str(base),'-filter_complex',graph,'-map','[out]','-c:a','libvorbis','-q:a','5',str(OUT/(name+'.ogg'))],check=True)
        processing = 'loudnorm -23 LUFS/-3 dBTP, mono 44.1kHz, 180ms rotated seam crossfade, Vorbis q5'
    else:
        fade = min(.1, real*.3)
        subprocess.run(['ffmpeg','-y','-v','error','-i',str(base),'-af',f'afade=t=in:d=0.005,afade=t=out:st={max(0,real-fade):.3f}:d={fade:.3f}','-c:a','libvorbis','-q:a','5',str(OUT/(name+'.ogg'))],check=True)
        processing = f'loudnorm -23 LUFS/-3 dBTP, mono 44.1kHz, 5ms attack / {round(fade*1000)}ms tail fade, Vorbis q5'
    if trim: processing = f'first {trim}s cut, '+processing
    if name in KEEP: processing = f'{KEEP[name]}s kept, '+processing
    if name in MATCH: processing += f', RMS matched to {MATCH[name]} dBFS (the synthesized sound it replaces), limited at -0.4 dBFS'
    params = {'text':prompt,'duration_seconds':duration,'loop':loop,'source':'ElevenLabs connector text_to_sound_effects (default model), 2026-10-24'}
    manifest.append({'id':name,'file':name+'.ogg','provider':'ElevenLabs','params':params,'sha256':hashlib.sha256(raw.read_bytes()).hexdigest(),
                     'runtimeSha256':hashlib.sha256((OUT/(name+'.ogg')).read_bytes()).hexdigest(),'processing':processing})
    (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    added.append(name); print('Prepared '+name, flush=True)
print(json.dumps({'added':added,'totalClips':len(manifest)}))
