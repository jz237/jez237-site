// Separate audio files rendered from the supplied game's original sequences
// and instrument samples. No ROM, emulator, or synthesis service is downloaded.
const courseTracks={practice:6,greyhaven:7,amber:8,citadel:9,reed:10,port:11,neon:12,tempest:13,glacier:14};
const base=new URL('./assets/audio/waverace64/',import.meta.url);
// Time Trial has its own lap/record cues in the original C37F4 branch;
// only racing modes enter the accelerated course variation. Either human
// reaching the final lap changes the shared two-player soundtrack.
export function raceMusicFinalLap({mode,freeRide=false,laps,racers=[]}={}){
 return !freeRide&&['race','championship','versus'].includes(mode)&&Number.isInteger(laps)&&laps>=2&&
  racers.some(r=>r.human===true&&!r.dq&&Number.isInteger(r.lap)&&r.lap>=laps);
}
export function originalMusicTrack({course='greyhaven',phase='running',place=1,disqualified=false,finalLap=false}={}){
 if(phase==='menu')return '03';
 if(phase==='results')return (disqualified?19:14+Math.max(1,Math.min(4,Math.trunc(place)||1))).toString(16).padStart(2,'0');
 const key=(courseTracks[course]??7).toString(16).padStart(2,'0');
 return finalLap&&key!=='06'?key+'-final':key;
}
export function musicPosition(position,track){
 if(track.loopStart!==null&&position>=track.loopEnd)return track.loopStart+(position-track.loopStart)%(track.loopEnd-track.loopStart);
 return Math.min(position,track.duration);
}
export class OriginalMusic{
 constructor(ctx,destination,{loader=(url,signal)=>fetch(url,{signal}).then(r=>{if(!r.ok)throw Error('Music asset '+r.status);return r.arrayBuffer();})}={}){
  this.ctx=ctx;this.destination=destination;this.loader=loader;this.cache=new Map();this.key=null;this.position=0;this.active=false;this.disposed=false;this.mode='stereo';this.retryAt=0;this.error=null;
 }
 async load(key){
  const controller=this.controller=new AbortController();
  this.loadingKey=key;
  try{
   if(!this.manifest){const bytes=await this.loader(new URL('manifest.json',base),controller.signal);const manifest=JSON.parse(new TextDecoder().decode(bytes));if(manifest.version!==1||!manifest.tracks)throw Error('Invalid music manifest');this.manifest=manifest;}
   const track=this.manifest.tracks[key];
   if(!track||!/^track-[0-9a-f]{2}(?:-final)?\.mp3$/.test(track.file)||!Number.isFinite(track.duration)||track.duration<=0||track.duration>240)throw Error('Invalid music track');
   if(track.loopStart!==null&&!(Number.isFinite(track.loopStart)&&track.loopStart>=0&&Number.isFinite(track.loopEnd)&&track.loopEnd>track.loopStart&&track.loopEnd<=track.duration+.025))throw Error('Invalid music loop');
   const buffer=await this.ctx.decodeAudioData(await this.loader(new URL(track.file,base),controller.signal));
   if(buffer.duration+.05<track.duration)throw Error('Truncated music asset');
   if(this.disposed||controller.signal.aborted||key!==this.key&&key!==this.key+'-final')return;
   this.cache.set(key,{track,buffer});while(this.cache.size>2)this.cache.delete(this.cache.keys().next().value);
   this.error=null;
  }catch(error){if(!controller.signal.aborted){this.error=String(error.message||error);this.retryAt=this.ctx.currentTime+30;}}
  finally{if(this.controller===controller){this.controller=null;this.loading=null;this.loadingKey=null;}}
 }
 stop(reset=false){
  const voice=this.voice;
  if(voice){this.position=musicPosition(this.position+Math.max(0,this.ctx.currentTime-this.startedAt),voice.track);this.voice=null;voice.source.onended=null;voice.source.stop();for(const node of voice.nodes)node.disconnect();}
  if(reset){this.position=0;this.finished=false;}
 }
 update(context,active,mode='stereo'){
  if(this.disposed)return;
  const fresh=context.session!==this.session||context.course!==this.course;
  if(fresh)this.finalLap=false;
  if(context.phase==='running'&&context.finalLap)this.finalLap=true;
  const key=originalMusicTrack({...context,finalLap:this.finalLap});
  if(key!==this.key||fresh){
   // A ready/in-flight final-lap prefetch becomes the selected track. Loads
   // from another race, course or results screen cannot replace this one.
   if(fresh||this.loadingKey!==key){this.controller?.abort();this.controller=null;this.loading=null;this.loadingKey=null;}
   this.stop(true);this.key=key;this.session=context.session;this.course=context.course;this.retryAt=0;this.error=null;
  }
  this.active=active;this.mode=mode;
  if(!active){this.stop();return;}
  const item=this.cache.get(key);
  if(!item){if(!this.loading&&this.ctx.currentTime>=this.retryAt)this.loading=this.load(key);return;}
  if(!this.voice&&!this.finished){
   const source=this.ctx.createBufferSource(),gain=this.ctx.createGain(),split=this.ctx.createChannelSplitter(2),merge=this.ctx.createChannelMerger(2),matrix=Array.from({length:4},()=>this.ctx.createGain());
   source.buffer=item.buffer;source.loop=item.track.loopStart!==null;
   if(source.loop){source.loopStart=item.track.loopStart;source.loopEnd=item.track.loopEnd;}
   source.connect(split);split.connect(matrix[0],0);split.connect(matrix[1],0);split.connect(matrix[2],1);split.connect(matrix[3],1);
   matrix[0].connect(merge,0,0);matrix[1].connect(merge,0,1);matrix[2].connect(merge,0,0);matrix[3].connect(merge,0,1);merge.connect(gain).connect(this.destination);gain.gain.value=2;
   const voice=this.voice={source,track:item.track,matrix,nodes:[source,gain,split,merge,...matrix]};
   source.onended=()=>{if(this.voice===voice){this.voice=null;this.finished=true;for(const node of voice.nodes)node.disconnect();}};
   this.startedAt=this.ctx.currentTime;source.start(this.startedAt,this.position);
  }
  if(this.voice){const width=mode==='mono'?0:mode==='headphones'?.45:1;this.voice.matrix.forEach((node,i)=>node.gain.setTargetAtTime((1+([0,3].includes(i)?width:-width))/2,this.ctx.currentTime,.025));}
  // Keep only the current theme and its upcoming variant, and only download
  // while music is enabled. No network work is required at the lap crossing.
  if(/^0[7-9a-e]$/.test(key)&&['race','championship','versus'].includes(context.mode)&&!context.freeRide&&
   !this.cache.has(key+'-final')&&!this.loading&&this.ctx.currentTime>=this.retryAt)this.loading=this.load(key+'-final');
 }
 dispose(){this.disposed=true;this.controller?.abort();this.stop(true);this.cache.clear();}
}
