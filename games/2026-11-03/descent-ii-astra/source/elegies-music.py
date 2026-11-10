"""Convert original HMI tracks using the timing used by DXX-Redux hmp2mid.
Render offline with FluidSynth (-F: no audio driver), then encode for browsers.
Inputs: extracted Elegies game01..04.hmp, GeneralUser GS SF2, FluidSynth exe.
"""
from pathlib import Path
import argparse,struct,subprocess,hashlib,json,re

def vlq(value):
    b=[value&127];value>>=7
    while value:b.insert(0,(value&127)|128);value>>=7
    return bytes(b)

def hmp_to_midi(data):
    assert data[:8]==b'HMIMIDIP'
    count=struct.unpack_from('<I',data,0x30)[0];tempo=struct.unpack_from('<I',data,0x38)[0]
    assert 1<count<64 and 1<tempo<10000
    chunks=[b'\0\xff\x51\x03\x18\x80\0\0\xff\x2f\0'];at=0x308;events=0
    for track in range(count):
        _,size,channel=struct.unpack_from('<III',data,at);assert size>=12 and at+size<=len(data)
        src=data[at+12:at+size];at+=size
        if track==0:continue
        out=bytearray();i=0
        while i<len(src):
            delta=0;shift=0
            while True:
                b=src[i];i+=1;delta|=(b&127)<<shift;shift+=7;assert shift<=35
                if b&128:break
            out+=vlq(delta);status=src[i];i+=1;assert status>=128
            out.append(status)
            if status==255:
                kind=src[i];n=src[i+1];i+=2;assert n<128 and i+n<=len(src)
                out+=bytes([kind,n])+src[i:i+n];i+=n
                if kind==47:break
            else:
                assert 0x80<=status<0xf0
                n=1 if status&0xf0 in (0xc0,0xd0) else 2
                assert i+n<=len(src) and all(v<128 for v in src[i:i+n])
                out+=src[i:i+n];i+=n;events+=1
        assert out[-3:]==b'\xff\x2f\0';chunks.append(bytes(out))
    assert at<=len(data) and len(chunks)==count # HMI may append a 400-byte instrument trailer.
    midi=b'MThd'+struct.pack('>IHHH',6,1,count,int(tempo*1.6))+b''.join(b'MTrk'+struct.pack('>I',len(c))+c for c in chunks)
    return midi,{'tracks':count,'events':events,'tempo':tempo}

if __name__=='__main__':
    a=argparse.ArgumentParser();a.add_argument('input',type=Path);a.add_argument('font',type=Path);a.add_argument('renderer',type=Path);a.add_argument('output',type=Path);args=a.parse_args();args.output.mkdir(parents=True,exist_ok=True);records=[]
    for n in range(1,5):
        source=args.input/f'game{n:02}.hmp';mid=source.with_suffix('.mid');wav=source.with_suffix('.wav');data=source.read_bytes();midi,info=hmp_to_midi(data);mid.write_bytes(midi)
        subprocess.run([str(args.renderer),'-n','-i','-q','-F',str(wav),'-T','wav','-O','s16','-r','44100','-g','0.35',str(args.font),str(mid)],check=True,timeout=180)
        analysis=subprocess.run(['ffmpeg','-hide_banner','-nostdin','-i',str(wav),'-af','volumedetect,silencedetect=noise=-50dB:d=3','-f','null','-'],capture_output=True,text=True,check=True).stderr
        peak=float(re.search(r'max_volume: ([\d.-]+) dB',analysis)[1]);gain=-2.5-peak
        out=args.output/f'{n:02}.mp3'
        # FluidSynth appends a silent release tail. Keep two seconds of decay,
        # preserving every note and all interior rests before the loop repeats.
        ends=re.findall(r'silence_start: ([\d.]+).*?silence_end: ([\d.]+)',analysis,re.S)
        duration=float(json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-of','json',str(wav)]))['format']['duration'])
        trim=['-t',str(float(ends[-1][0])+2)] if ends and abs(float(ends[-1][1])-duration)<.1 else []
        subprocess.run(['ffmpeg','-v','error','-nostdin','-y','-i',str(wav),'-af',f'volume={gain:.3f}dB','-codec:a','libmp3lame','-b:a','192k','-map_metadata','-1',*trim,str(out)],check=True,timeout=180)
        probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-of','json',str(out)]))
        record={'file':out.name,'source':source.name,'sourceSha256':hashlib.sha256(data).hexdigest(),'midiSha256':hashlib.sha256(midi).hexdigest(),'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'bytes':out.stat().st_size,'seconds':float(probe['format']['duration']),**info};records.append(record);print(json.dumps(record),flush=True)
    (args.output/'sources.json').write_text(json.dumps({'archive':'http://www.pooterman.com/ftp/descent2/levels/elegies.zip','levelTracks':[1,2,3,4,1,2],'mapping':'Original descent.sng supplies four level slots; the mission overrides all four HMP files.','renderer':'FluidSynth 2.6.2, GeneralUser GS 2.0.3 (offline rendering; no runtime synthesizer)','soundfontSource':'https://github.com/mrbumpy409/GeneralUser-GS','soundfontSha256':hashlib.sha256(args.font.read_bytes()).hexdigest(),'tracks':records},indent=2)+'\n')
