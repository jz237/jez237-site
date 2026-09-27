"""Explicit offline ElevenLabs generation; never called by game/build. No overages."""
import os,json,pathlib,urllib.request,hashlib,subprocess,time
ROOT=pathlib.Path(__file__).resolve().parents[1];OUT=ROOT/'public/audio';OUT.mkdir(parents=True,exist_ok=True)
RAW=ROOT/'source/audio';RAW.mkdir(parents=True,exist_ok=True)
key=os.environ['ELEVENLABS_API_KEY']
def subscription():
 for attempt in range(4):
  try:return json.load(urllib.request.urlopen(urllib.request.Request('https://api.elevenlabs.io/v1/user/subscription',headers={'xi-api-key':key}),timeout=30))
  except urllib.error.HTTPError as e:
   if e.code!=429 or attempt==3:raise
   time.sleep(15)
initial=subscription();start=initial['character_count'];limit=initial['character_limit']
origin=RAW/'initial-usage.json'
if origin.exists():start=json.loads(origin.read_text())['character_count']
else:origin.write_text(json.dumps({'character_count':16336})) ;start=16336
if initial.get('can_extend_character_limit') or initial.get('allowed_to_extend_character_limit'): raise RuntimeError('Cannot guarantee zero overages; stop for review')
if limit-start<15000:raise RuntimeError('Insufficient included allowance for generation budget')
jobs=[]
for car,desc in [('coupe','modern naturally aspirated V8 sports coupe, deep resonant exhaust'),('sedan','modern twin turbo inline six performance sedan, smooth metallic exhaust'),('hatch','modern turbo four cylinder sports hatchback, raspy exhaust')]:
 for name,rpm in [('idle',850),('low',2200),('mid',4100),('high',6500)]:
  jobs.append((f'{car}-{name}',f'Steady continuous {desc} engine at constant {rpm} RPM. Stationary close microphone, completely stable revs, no driving past, no gear changes. Isolated mechanical engine and exhaust only.',5,True))
 for name,desc2,dur,loop in [('load','steady engine under hard acceleration load at 3500 RPM, intake induction roar',4,True),('shift','single quick mechanical paddle gear upshift, exhaust interruption and subtle clunk',1.5,False),('exhaust','one sharp realistic exhaust overrun burble and pop',1.5,False),('damaged','uneven sputtering damaged engine with faint metallic knocking, steady',4,True)]:
  jobs.append((f'{car}-{name}',f'{desc}, {desc2}. Isolated close recording.',dur,loop))
jobs += [
 ('tires','Continuous realistic car tires squealing and scrubbing across dry asphalt in a sustained drift.',5,True),
 ('gravel','Continuous close gravel crunch and fine stones spraying under fast car tires on a quarry road.',5,True),
 ('skid','Short tire skid braking hard on rough asphalt, close and dry.',2,False),
 ('suspension','One car suspension compression, dull chassis thump and brief spring rattle.',1.5,False),
 ('impact-light','Single realistic low speed car body collision, sharp sheet metal dent and plastic crack. Dry close recording.',2,False),
 ('impact-medium','Single forceful car crash with crunching metal body panels, bumper breaking and small debris falling. No explosion.',3,False),
 ('impact-heavy','Single heavy high speed collision between two sports cars, deep impact thud, crushing metal and glass scattering. No explosion.',4,False),
 ('scrape','Continuous harsh metal car body scraping a concrete barrier with gritty friction.',4,True),
 ('glass','One automotive side window shattering, small glass fragments scattering onto asphalt.',2,False),
 ('debris','A loose metal bumper hitting gravel and bouncing twice with metallic clattering.',2,False),
 ('ambience','Quiet woodland quarry in late afternoon, soft wind in pine trees, distant birds and very faint industrial hum. No vehicles or people nearby.',12,True)]
manifest=json.loads((OUT/'manifest.json').read_text()) if (OUT/'manifest.json').exists() else []
for name,prompt,duration,loop in jobs:
 if any(x['id']==name for x in manifest) and (OUT/f'{name}.ogg').exists():continue
 current=subscription()
 if current['character_count']-start>13000 or current['character_limit']-current['character_count']<2000:raise RuntimeError('Included generation budget reached')
 params={'text':prompt+' No music, no voices, no speech.', 'duration_seconds':duration,'loop':loop,'prompt_influence':0.5,'model_id':'eleven_text_to_sound_v2'}
 raw=RAW/f'{name}.mp3'
 if not raw.exists():
  req=urllib.request.Request('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128',data=json.dumps(params).encode(),headers={'xi-api-key':key,'Content-Type':'application/json'})
  with urllib.request.urlopen(req,timeout=180) as response: raw.write_bytes(response.read())
 # Level-match; short edge fades prevent sample discontinuities without masking impact attacks.
 filt=f'loudnorm=I=-23:TP=-3:LRA=7,afade=t=in:d=0.015,afade=t=out:st={duration-0.04}:d=0.04'
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(raw),'-af',filt,'-c:a','libvorbis','-q:a','5',str(OUT/f'{name}.ogg')],check=True)
 manifest.append({'id':name,'file':name+'.ogg','provider':'ElevenLabs','params':params,'sha256':hashlib.sha256(raw.read_bytes()).hexdigest(),'processing':filt})
 (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2));print('Generated',name,flush=True)
final=subscription();report={'includedCreditsUsed':final['character_count']-start,'remaining':final['character_limit']-final['character_count'],'overagesEnabled':False,'files':len(manifest)}
(RAW/'usage.json').write_text(json.dumps(report,indent=2));print(json.dumps(report),flush=True)
