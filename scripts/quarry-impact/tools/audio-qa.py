import subprocess,json,pathlib,struct,math
ROOT=pathlib.Path(__file__).resolve().parents[1];rows=[]
for file in sorted((ROOT/'public/audio').glob('*.ogg')):
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(file),'-f','f32le','-ar','22050','-ac','1','-'])
 values=struct.unpack('<'+'f'*(len(raw)//4),raw)
 rms=math.sqrt(sum(x*x for x in values)/len(values));peak=max(abs(x) for x in values)
 row={'file':file.name,'duration':len(values)/22050,'rmsDb':20*math.log10(max(rms,1e-9)),'peakDb':20*math.log10(max(peak,1e-9)),'loopEdgeJump':abs(values[-1]-values[0]),'finite':all(math.isfinite(x) for x in values)}
 assert row['finite'] and peak<1 and rms>.0001,file.name
 rows.append(row)
(ROOT/'outputs/audio-qa.json').write_text(json.dumps(rows,indent=2));print(json.dumps({'clips':len(rows),'allDecodable':True,'clippedClips':0,'durationSeconds':sum(x['duration'] for x in rows),'maxPeakDb':max(x['peakDb'] for x in rows)}))
