"""Offline, resumable ElevenLabs fire effects using verified included allowance only."""
import os, json, pathlib, urllib.request, hashlib, subprocess
ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT, RAW = ROOT/'public/audio', ROOT/'source/audio'
PRIVATE = ROOT/'outputs/vehicle-fire'
PRIVATE.mkdir(parents=True, exist_ok=True)
key = os.environ['ELEVENLABS_API_KEY']
def subscription():
    req = urllib.request.Request('https://api.elevenlabs.io/v1/user/subscription', headers={'xi-api-key':key})
    with urllib.request.urlopen(req, timeout=30) as response: return json.load(response)
def allowed():
    s = subscription()
    if s.get('can_extend_character_limit') is not False or s.get('allowed_to_extend_character_limit') is not False:
        raise RuntimeError('Overage protection unavailable; no generation allowed')
    if s['character_limit']-s['character_count'] < 5000: raise RuntimeError('Included allowance insufficient')
    return s
start = allowed()['character_count']
jobs = [
 ('fire-roar', 'Continuous close recording of a small intense automotive engine compartment fire. Steady turbulent flame whoosh and low airy combustion roar, fluctuating naturally. No explosion, no engine running, no siren, no wind. Seamless sustained isolated effect.', 6, True),
 ('fire-crackle', 'Continuous close recording of burning automotive rubber and plastic in a small engine bay fire. Irregular tiny dry crackles, sharp intermittent snaps and sizzling, restrained low flame sound. No explosion, no wood logs, no voices, no siren. Seamless sustained isolated effect.', 6, True),
 ('vehicle-burst', 'One short realistic burst of igniting fuel vapor from a badly crashed car: immediate sharp low percussive thump, fast breathy fire whoosh, brief scattered metal rattles decaying outdoors. Tight dry near-field recording. No cinematic bass drone, no music, no voices, no long reverb.', 3.5, False),
]
manifest = json.loads((OUT/'manifest.json').read_text())
generated = []
for name, prompt, duration, loop in jobs:
    if any(a['id']==name for a in manifest) and (OUT/(name+'.ogg')).exists(): continue
    raw = RAW/(name+'.mp3')
    params = {'text':prompt+' No music or speech.', 'duration_seconds':duration, 'loop':loop, 'prompt_influence':.55, 'model_id':'eleven_text_to_sound_v2'}
    cost = None
    if not raw.exists():
        current = allowed()
        if current['character_count']-start > 1600: raise RuntimeError('Development generation cap reached')
        request = urllib.request.Request('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', data=json.dumps(params).encode(), headers={'xi-api-key':key,'Content-Type':'application/json'})
        # Never auto-retry a possibly billed request. Preserve each response before processing.
        with urllib.request.urlopen(request, timeout=180) as response:
            raw.write_bytes(response.read()); cost=response.headers.get('character-cost')
    base = PRIVATE/(name+'-normalized.wav')
    subprocess.run(['ffmpeg','-y','-v','error','-i',str(raw),'-af','loudnorm=I=-23:TP=-3:LRA=7','-ar','44100','-ac','1',str(base)],check=True)
    if loop:
        # Rotate the seam: blend final 180ms into first 180ms, then concatenate middle.
        end = duration-.18
        graph=f'[0:a]asplit=3[a][b][c];[a]atrim=start=0:end=0.18,asetpts=PTS-STARTPTS[head];[b]atrim=start=0.18:end={end},asetpts=PTS-STARTPTS[mid];[c]atrim=start={end}:end={duration},asetpts=PTS-STARTPTS[tail];[tail][head]acrossfade=d=0.18:c1=tri:c2=tri[seam];[mid][seam]concat=n=2:v=0:a=1[out]'
        subprocess.run(['ffmpeg','-y','-v','error','-i',str(base),'-filter_complex',graph,'-map','[out]','-c:a','libvorbis','-q:a','5',str(OUT/(name+'.ogg'))],check=True)
        processing='loudnorm -23 LUFS/-3 dBTP, mono 44.1kHz, 180ms rotated seam crossfade, Vorbis q5'
    else:
        subprocess.run(['ffmpeg','-y','-v','error','-i',str(base),'-af',f'afade=t=in:d=0.005,afade=t=out:st={duration-.1}:d=0.1','-c:a','libvorbis','-q:a','5',str(OUT/(name+'.ogg'))],check=True)
        processing='loudnorm -23 LUFS/-3 dBTP, mono 44.1kHz, 5ms attack / 100ms tail fade, Vorbis q5'
    manifest.append({'id':name,'file':name+'.ogg','provider':'ElevenLabs','params':params,'sha256':hashlib.sha256(raw.read_bytes()).hexdigest(),'runtimeSha256':hashlib.sha256((OUT/(name+'.ogg')).read_bytes()).hexdigest(),'processing':processing})
    (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    generated.append({'id':name,'reportedCreditCost':cost}); print('Prepared '+name,flush=True)
final=allowed()
report={'includedCreditsUsed':final['character_count']-start,'remainingIncluded':final['character_limit']-final['character_count'],'overagesEnabled':False,'newFiles':generated,'totalClips':len(manifest)}
(PRIVATE/'audio-allowance.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
