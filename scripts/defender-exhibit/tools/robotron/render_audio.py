"""Render the checksum-verified Robotron sound listing with the companion 6800 renderer.
Usage: python render_audio.py 'Video Sound ROM 3.asm' /path/to/render-robotron.exe
Requires ffmpeg on PATH. The temporary ROM is never included in the published site.
"""
from pathlib import Path
import sys,re,tempfile,subprocess,hashlib,json
source=Path(sys.argv[1]).read_text();renderer=str(Path(sys.argv[2]).resolve())
# Correct four transcribed addresses in the published listing. CRC/SHA verifies all bytes.
for old,new in [('F3D1 :','F3D2 :'),('FC46 :','FC47 :'),('FF09 :','FF0A :'),('FF48 :','FF49 :')]:source=source.replace(old,new)
rom=bytearray(4096)
for line in source.splitlines():
 match=re.match(r'^([0-9A-F]{4})\s*:\s*((?:[0-9A-F]{2,4}(?:\s+|$))+)',line)
 if match:
  at=int(match[1],16)
  for byte in bytes.fromhex(match[2]):
   if at>=0xf000:rom[at-0xf000]=byte
   at+=1
assert hashlib.sha1(rom).hexdigest()=='15afefef11bfc3ab78f61ab046701db78d160ec3'
out=Path(__file__).resolve().parents[2]/'public/robotron/audio';manifest=json.loads((out/'manifest.json').read_text())
with tempfile.TemporaryDirectory(prefix='robotron-audio-') as temporary:
 root=Path(temporary);rompath=root/'sound.bin';rompath.write_bytes(rom)
 for name,effect in manifest['effects'].items():
  time=0;events=[]
  for repeat,ticks,command in effect['sequence']:
   for i in range(repeat):events.append((time,command));time+=ticks/60
  schedule=','.join(f'{at:.8f}:{command:x}' for at,command in events[1:]);raw=root/(name+'.f32');wav=out/(name+'.wav')
  subprocess.run([renderer,str(rompath),hex(events[0][1]),str(time),str(raw),schedule],check=True)
  subprocess.run(['ffmpeg','-v','error','-f','f32le','-ar','44100','-ac','1','-i',str(raw),'-af',f'highpass=f=30,afade=t=in:d=0.002,afade=t=out:st={time-.003}:d=0.003','-c:a','pcm_s16le','-y',str(wav)],check=True)
  effect['sha256']=hashlib.sha256(wav.read_bytes()).hexdigest()
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
