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
]
def length(path):
    return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(path)],capture_output=True,text=True,check=True).stdout)
manifest = json.loads((OUT/'manifest.json').read_text())
added = []
for name, prompt, duration, loop in jobs:
    if any(a['id']==name for a in manifest) and (OUT/(name+'.ogg')).exists(): continue
    raw = RAW/(name+'.mp3')
    if not raw.exists(): raise SystemExit(f'missing raw clip {raw} (generate it first)')
    base = WORK/(name+'-normalized.wav')
    subprocess.run(['ffmpeg','-y','-v','error','-i',str(raw),'-af','loudnorm=I=-23:TP=-3:LRA=7','-ar','44100','-ac','1',str(base)],check=True)
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
        subprocess.run(['ffmpeg','-y','-v','error','-i',str(base),'-af',f'afade=t=in:d=0.005,afade=t=out:st={max(0,real-.1):.3f}:d=0.1','-c:a','libvorbis','-q:a','5',str(OUT/(name+'.ogg'))],check=True)
        processing = 'loudnorm -23 LUFS/-3 dBTP, mono 44.1kHz, 5ms attack / 100ms tail fade, Vorbis q5'
    params = {'text':prompt,'duration_seconds':duration,'loop':loop,'source':'ElevenLabs connector text_to_sound_effects (default model), 2026-10-24'}
    manifest.append({'id':name,'file':name+'.ogg','provider':'ElevenLabs','params':params,'sha256':hashlib.sha256(raw.read_bytes()).hexdigest(),
                     'runtimeSha256':hashlib.sha256((OUT/(name+'.ogg')).read_bytes()).hexdigest(),'processing':processing})
    (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    added.append(name); print('Prepared '+name, flush=True)
print(json.dumps({'added':added,'totalClips':len(manifest)}))
