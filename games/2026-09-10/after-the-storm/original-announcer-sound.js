import {ANNOUNCER_TICK,originalMenuAnnouncerPlan} from './original-menu-announcer.js';
import {stereoWidth} from './coastal-music.js';
const base=new URL('./assets/audio/waverace64/announcer/',import.meta.url);
const filePattern=/^(announcer|menu)-[0-9a-f]{2}\.wav$/;
export function originalAnnouncerSelection(command){
 const args=command?.arguments;
 if(command?.consumer!=='c53d4'||!Array.isArray(args)||args.length!==2||args[0]!==0x06000c00||
  !Number.isInteger(args[1])||args[1]<0||args[1]>=112)return null;
 return args[1];
}

// Sequence0/channel12 regular bank2 and special127 bank6 percussion voices.
// Null drum slots stay silent. Special scripts retain only the latest IO0
// write during their waits, with IO1 read when127 actually starts.
// The source polls every6 sequence ticks (37.5ms); browser delivery uses the
// render's command drain outside explicit waits, not the RSP phase/reverb.
export class OriginalAnnouncerSound{
 constructor(ctx,destination,{loader=(url,signal)=>fetch(url,{signal}).then(r=>{if(!r.ok)throw Error('Announcer asset '+r.status);return r.arrayBuffer();})}={}){
  this.ctx=ctx;this.destination=destination;this.loader=loader;this.buffers=new Map();
  this.ready=false;this.disposed=false;this.retryAt=0;this.failures=[];this.voices=new Set();
  this.mode='stereo';this.io1=-1;this.pending=null;this.busyUntil=0;
 }
 load(){
  if(this.disposed||this.ready||this.ctx.currentTime<this.retryAt)return Promise.resolve(this.ready);
  if(this.loading)return this.loading;
  this.loading=this.loadAssets().finally(()=>{this.loading=null;});return this.loading;
 }
 async loadAssets(){
  const controller=this.controller=new AbortController();this.failures=[];
  try{
   if(!this.manifest){
    const m=JSON.parse(new TextDecoder().decode(await this.loader(new URL('manifest.json?v=2',base),controller.signal)));
    if(this.disposed||controller.signal.aborted)return false;
    const validSlots=(slots,count)=>slots&&Object.keys(slots).length===count&&Array.from({length:count},(_,i)=>i).every(i=>{
     const s=slots[i];return s===null||!!s&&filePattern.test(s.file)&&!!m.files?.[s.file];
    });
    if(m.version!==2||!m.files||!validSlots(m.sounds,112)||!validSlots(m.menuSounds,30)||
     Object.entries(m.files).some(([file,f])=>!filePattern.test(file)||!Number.isFinite(f.duration)||f.duration<=0||f.duration>7.65))throw Error('Invalid announcer manifest');
    this.manifest=m;
   }
   const pending=Object.keys(this.manifest.files).filter(file=>!this.buffers.has(file));
   await Promise.all(Array.from({length:6},async()=>{
    while(pending.length&&!controller.signal.aborted){
     const file=pending.shift();
     try{
      const buffer=await this.ctx.decodeAudioData(await this.loader(new URL(file,base),controller.signal));
      if(!Number.isFinite(buffer.duration)||Math.abs(buffer.duration-this.manifest.files[file].duration)>.025)throw Error('Truncated announcer asset');
      if(!this.disposed&&!controller.signal.aborted)this.buffers.set(file,buffer);
     }catch{if(!controller.signal.aborted)this.failures.push(file);}
    }
   }));
   this.ready=!this.disposed&&this.buffers.size===Object.keys(this.manifest.files).length;
  }catch(error){if(!controller.signal.aborted)this.failures.push(String(error.message||error));}
  finally{if(this.controller===controller)this.controller=null;}
  if(!this.ready)this.retryAt=this.ctx.currentTime+30;
  return this.ready;
 }
 play(command){
  if(this.disposed)return false;
  if(command?.consumer==='c538c'&&command.arguments?.length===2&&command.arguments[0]===0x01000c00&&command.arguments[1]===0){
   this.stop();return true;
  }
  const args=command?.arguments;
  if(command?.consumer!=='c53d4'||!Array.isArray(args)||args.length!==2)return false;
  this.update();
  if(args[0]===0x06000c01&&Number.isInteger(args[1])&&args[1]>=-2147483648&&args[1]<=0xffffffff){this.io1=(args[1]<<24)>>24;return true;}
  const note=originalAnnouncerSelection(command)??(args[0]===0x06000c00&&args[1]===127?127:null);
  if(note===null)return false;
  if(this.ctx.currentTime<this.busyUntil){this.pending=note;return true;}
  return this.select(note);
 }
 select(note){
  const time=this.ctx.currentTime;
  if(note!==127)return this.layer(this.manifest?.sounds[note],note,time);
  const selector=this.io1;this.io1=-1;
  const plan=originalMenuAnnouncerPlan(selector);if(!plan)return false;
  this.busyUntil=time+plan.busyTicks*ANNOUNCER_TICK;
  let played=true;
  for(const event of plan.layers){
   const sound=event.note===null?null:this.manifest?.menuSounds[event.note];
   played=this.layer(sound,event.note,time+event.tick*ANNOUNCER_TICK,event.pans,true)&&played;
  }
  return played;
 }
 get voice(){
  let current=null;
  for(const v of this.voices)if(v.start<=this.ctx.currentTime&&v.end>this.ctx.currentTime)current=v;
  return current;
 }
 layer(sound,note,start,pans=[[0,64]],menu=false){
  // A new layer replaces the previous one at its scheduled onset, including
  // silent/missing slots. Loading never replays an already consumed request.
  for(const v of this.voices)if(v.end>start){
   v.end=start;v.source.stop(start);
   if(start<=this.ctx.currentTime)this.disconnect(v);
  }
  if(sound===null)return true;
  const buffer=this.buffers.get(sound?.file);if(!buffer)return false;
  const source=this.ctx.createBufferSource(),gain=this.ctx.createGain(),pan=this.ctx.createStereoPanner();source.buffer=buffer;
  gain.gain.value=.7;source.connect(gain).connect(pan).connect(this.destination);
  const voice={source,gain,pan,note,menu,start,end:start+buffer.duration,pans};this.voices.add(voice);
  this.panVoice(voice);source.onended=()=>this.disconnect(voice);source.start(start);return true;
 }
 panVoice(voice){
  const now=this.ctx.currentTime,width=stereoWidth(this.mode),value=pan=>(pan-64)/64*width;
  voice.pan.pan.cancelScheduledValues(now);
  let current=voice.pans[0][1];
  for(const [tick,pan]of voice.pans)if(voice.start+tick*ANNOUNCER_TICK<=now)current=pan;
  voice.pan.pan.setValueAtTime(value(current),now);
  for(const [tick,pan]of voice.pans){const t=voice.start+tick*ANNOUNCER_TICK;if(t>now)voice.pan.pan.setValueAtTime(value(pan),t);}
 }
 update(mode=this.mode){
  if(this.disposed)return false;
  if(mode!==this.mode){this.mode=mode;for(const v of this.voices)this.panVoice(v);}
  if(this.pending!==null&&this.ctx.currentTime>=this.busyUntil){const note=this.pending;this.pending=null;return this.select(note);}
  return false;
 }
 disconnect(voice){
  voice.source.onended=null;voice.source.disconnect();voice.gain.disconnect();voice.pan.disconnect();this.voices.delete(voice);
 }
 stop(){
  this.pending=null;this.io1=-1;this.busyUntil=0;
  for(const voice of this.voices){voice.source.onended=null;voice.source.stop();this.disconnect(voice);}
 }
 dispose(){this.disposed=true;this.controller?.abort();this.stop();this.buffers.clear();this.ready=false;}
}
