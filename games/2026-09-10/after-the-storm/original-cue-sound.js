import {originalCuePlan} from './native-cue-audio.js';
const base=new URL('./assets/audio/waverace64/cues/',import.meta.url);
const filePattern=/^cue-[0-9a-f]{2}\.wav$/;

// Channel11's looping instruments are rendered through the recovered ADSR
// and vibrato routines. Its two layers remain independent of announcer12.
export class OriginalCueSound{
 constructor(ctx,destination,{loader=(url,signal)=>fetch(url,{signal}).then(r=>{if(!r.ok)throw Error('Cue asset '+r.status);return r.arrayBuffer();})}={}){
  this.ctx=ctx;this.destination=destination;this.loader=loader;this.buffers=new Map();this.voices=new Map();
  this.ready=false;this.disposed=false;this.retryAt=0;this.failures=[];this.pending=null;this.discardUntil=0;this.pollUntil=0;
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
    const m=JSON.parse(new TextDecoder().decode(await this.loader(new URL('manifest.json',base),controller.signal)));
    if(this.disposed||controller.signal.aborted)return false;
    if(m.version!==1||!m.programs||!m.files||Object.keys(m.programs).length!==20||Object.keys(m.files).length!==16||
     Array.from({length:20},(_,i)=>i).some(i=>{const s=m.programs[i];return [3,7,16,17].includes(i)?s!==null:!s||!filePattern.test(s.file)||!m.files[s.file];})||
     Object.entries(m.files).some(([file,f])=>!filePattern.test(file)||!Number.isFinite(f.duration)||f.duration<=0||f.duration>15))throw Error('Invalid original cue manifest');
    this.manifest=m;
   }
   const pending=Object.keys(this.manifest.files).filter(file=>!this.buffers.has(file));
   await Promise.all(Array.from({length:4},async()=>{
    while(pending.length&&!controller.signal.aborted){
     const file=pending.shift();
     try{
      const buffer=await this.ctx.decodeAudioData(await this.loader(new URL(file,base),controller.signal));
      if(!Number.isFinite(buffer.duration)||Math.abs(buffer.duration-this.manifest.files[file].duration)>.025)throw Error('Truncated original cue');
      if(!this.disposed&&!controller.signal.aborted)this.buffers.set(file,buffer);
     }catch{if(!controller.signal.aborted)this.failures.push(file);}
    }
   }));
   this.ready=!this.disposed&&this.buffers.size===Object.keys(this.manifest.files).length;
  }catch(error){if(!controller.signal.aborted)this.failures.push(String(error.message||error));}
  finally{if(this.controller===controller)this.controller=null;}
  if(!this.ready)this.retryAt=this.ctx.currentTime+30;return this.ready;
 }
 play(command){
  if(this.disposed)return false;
  const args=command?.arguments;
  if(!Array.isArray(args)||args.length!==2)return false;
  if(command.consumer==='c538c'&&args[0]===0x01000b00&&args[1]===0){this.stop();return true;}
  if(command.consumer!=='c53d4'||args[0]!==0x06000b00||!Number.isInteger(args[1])||args[1]<-2147483648||args[1]>0xffffffff)return false;
  this.update();const selector=(args[1]<<24)>>24;if(selector<0)return true;
  // The special16 script reads and discards IO0 at the end of its1200-tick
  // delay. Only writes during the following8-tick poll can become pending.
  if(this.ctx.currentTime<this.discardUntil)return true;
  if(this.ctx.currentTime<this.pollUntil){this.pending=selector;return true;}
  return this.select(selector);
 }
 select(selector){
  const plan=originalCuePlan(selector);if(!plan)return false;
  const now=this.ctx.currentTime;
  if(plan.discardTicks){this.discardUntil=now+plan.discardTicks/160;this.pollUntil=this.discardUntil+plan.nextPollTicks/160;}
  if(plan.program===null){this.stopLayer(0);return true;}
  const sound=this.manifest?.programs[plan.program],buffer=this.buffers.get(sound?.file);let played=true;
  for(let layer=0;layer<plan.layers;layer++){
   this.stopLayer(layer);if(!buffer){played=false;continue;}
   const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=buffer;gain.gain.value=.45;
   source.connect(gain).connect(this.destination);const voice={source,gain,program:plan.program,layer};this.voices.set(layer,voice);
   source.onended=()=>{source.disconnect();gain.disconnect();if(this.voices.get(layer)===voice)this.voices.delete(layer);};source.start(now);
  }
  return played;
 }
 update(){
  if(!this.disposed&&this.pending!==null&&this.ctx.currentTime>=this.pollUntil){const selector=this.pending;this.pending=null;return this.select(selector);}
  return false;
 }
 stopLayer(layer){
  const voice=this.voices.get(layer);if(!voice)return;this.voices.delete(layer);
  voice.source.onended=null;voice.source.stop();voice.source.disconnect();voice.gain.disconnect();
 }
 stop(){this.pending=null;this.discardUntil=this.pollUntil=0;for(const layer of this.voices.keys())this.stopLayer(layer);}
 dispose(){this.disposed=true;this.controller?.abort();this.stop();this.buffers.clear();this.ready=false;}
}
