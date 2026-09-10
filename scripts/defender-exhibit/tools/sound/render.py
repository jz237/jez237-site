from pathlib import Path
import subprocess,json,hashlib,shutil
import argparse,tempfile
p=argparse.ArgumentParser();p.add_argument('--rom',required=True);p.add_argument('--renderer',required=True);args=p.parse_args();assert hashlib.sha1(Path(args.rom).read_bytes()).hexdigest()=='ceb0d18483f0691978c604db94417e6941ad7ff2'
scratch=Path(tempfile.mkdtemp(prefix='defender-audio-'));root=Path(__file__).resolve().parents[2];out=root/'public/audio';out.mkdir(exist_ok=True)
effects={'fire':(0x14,.768,''),'explosion':(6,.16,''),'pod':(5,.256,''),'bomber':(1,.16,''),'mutant':(0x17,.128,''),'swarmer':(7,.128,''),'abduct':(0x0b,.256,''),'fall':(0x1a,.256,''),'catch':(8,.48,'0.16:8,0.32:8'),'delivery':(0x1f,.384,''),'hyperspace':(0x15,.768,''),'credit':(0x19,.384,''),'thrust':(0x16,2,''),'start':(0x0a,1.28,'1.024:b')}
records={}
for name,(command,duration,schedule) in effects.items():
 raw=scratch/(name+'.f32');subprocess.run([str(Path(args.renderer).resolve()),str(Path(args.rom).resolve()),hex(command),str(duration),str(raw),schedule],check=True)
 wav=out/(name+'.wav');subprocess.run(['ffmpeg','-v','error','-f','f32le','-ar','44100','-ac','1','-i',str(raw),'-af',f'highpass=f=30,afade=t=in:d=0.002,afade=t=out:st={duration-.003}:d=0.003','-c:a','pcm_s16le','-y',str(wav)],check=True)
 records[name]={'file':name+'.wav','command':hex(command),'duration':duration,'schedule':schedule,'sha256':hashlib.sha256(wav.read_bytes()).hexdigest()}
manifest={'source':'Williams VSNDRM1 original sound program (Sam Dicker, 1980)','romSha1':'ceb0d18483f0691978c604db94417e6941ad7ff2','romCrc32':'fefd5b48','romSource':'https://github.com/topherCantrell/computerarcheology/blob/master/content/Arcade/Defender/defendRED/defend.snd','commandSource':'https://github.com/mwenge/defender/blob/master/src/defa7.src','cpuClockHz':3579545/4,'sampleRate':44100,'rendering':'6800 instruction emulation; PIA port A DAC output; box integration to 44.1 kHz; 30 Hz DC removal; 2/3 ms edge fades. Game-table command durations and catch repetitions. Thrust is a rendered loop, not live emulation.','effects':records}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print('Rendered',len(records),'samples')
