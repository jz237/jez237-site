import {stereoWidth} from './coastal-music.js';
import {originalEffectPitch} from './original-effect-poll.js';
const base=new URL('./assets/audio/waverace64/contacts/',import.meta.url);
const ids=[1,11,12,13,14,15,...Array.from({length:48},(_,i)=>i+16)];
const files=new Set([1,11,12,13,14,15,...Array.from({length:12},(_,i)=>16+i*4)].map(i=>'contact-'+i.toString(16).padStart(2,'0')+'.wav'));
files.add('ice-break.wav');
const sprayKeys=Array.from({length:5},(_,i)=>'spray-'+i);
for(const key of sprayKeys)files.add(key+'.wav');
const riderKeys=Array.from({length:16},(_,i)=>'rider-'+i.toString(16).padStart(2,'0'));
for(const key of riderKeys)files.add(key+'.wav');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

// Sequence0, channels2/5: BFFEC writes IO5 (velocity), then IO0 (note).
// Both channels select bank0/percussion127 and restart layer0. Ice's channel7
// dynamic-call19 plays a separate three-layer bank5/instrument7 sequence.
// Rider channel10 resolves logical bank8 to physical bank7 and uses fixed
// layer pans for its solo/P1/P2 ports. Original reverb sends remain separate.
export function originalContactSelection(command){
 const a=command?.arguments;
 if(command?.consumer==='c53d4'&&Array.isArray(a)&&a.length===2&&[0x06000a00,0x06000a01,0x06000a02].includes(a[0])&&
  Number.isInteger(a[1])&&a[1]>=0&&a[1]<16){
  const port=a[0]&255;
  return {lane:10,key:riderKeys[a[1]],velocity:127,layer:port===2?1:0,pan:[64,32,96][port],fixedPan:true};
 }
 if(command?.consumer==='c0044'&&Array.isArray(a)&&a.length===3&&[2,5].includes(a[0])&&
  Number.isInteger(a[1])&&a[1]>=0&&a[1]<20&&Number.isInteger(a[2])&&a[2]>=0&&a[2]<=127)
  return {lane:a[0],key:'spray-'+Math.floor(a[1]/4),velocity:a[2],layer:1,pan:[0,64,127,0][a[1]&3]};
 if(command?.consumer==='c53d4'&&Array.isArray(a)&&a.length===2&&a[0]===0x06000700&&a[1]===19)
  return {lane:7,key:'ice-break',velocity:127};
 if(command?.consumer!=='bffec'||!Array.isArray(a)||a.length!==3||
  ![2,5].includes(a[0])||!ids.includes(a[1])||!Number.isInteger(a[2])||a[2]<0||a[2]>127)return null;
 return {lane:a[0],key:String(a[1]),velocity:a[2]};
}

export class OriginalContactSound{
 constructor(ctx,destination,{loader=(url,signal)=>fetch(url,{signal}).then(r=>{if(!r.ok)throw Error('Contact asset '+r.status);return r.arrayBuffer();})}={}){
  this.ctx=ctx;this.destination=destination;this.loader=loader;this.buffers=new Map();this.voices=new Map();
  this.mode='stereo';this.ready=false;this.disposed=false;this.retryAt=0;this.failures=[];
  this.channelPitch=new Map([[2,1],[5,1]]);
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
    if(m.version!==1||!m.sounds||!m.files||[...ids,'ice-break',...sprayKeys,...riderKeys].some(id=>{
     const s=m.sounds[id],f=m.files[s?.file];
     return !s||!files.has(s.file)||!Number.isFinite(s.rate)||s.rate<.9||s.rate>1||
      !Number.isInteger(s.pan)||s.pan<0||s.pan>127||!f||!Number.isFinite(f.duration)||f.duration<=0||f.duration>3;
    }))throw Error('Invalid contact manifest');
    this.manifest=m;
   }
   await Promise.all([...files].filter(file=>!this.buffers.has(file)).map(async file=>{
    try{
     const buffer=await this.ctx.decodeAudioData(await this.loader(new URL(file,base),controller.signal));
     if(!Number.isFinite(buffer.duration)||Math.abs(buffer.duration-this.manifest.files[file].duration)>.025)throw Error('Truncated contact asset');
     if(!this.disposed&&!controller.signal.aborted)this.buffers.set(file,buffer);
    }catch{if(!controller.signal.aborted)this.failures.push(file);}
   }));
   this.ready=!this.disposed&&this.buffers.size===files.size;
  }catch(error){if(!controller.signal.aborted)this.failures.push(String(error.message||error));}
  finally{if(this.controller===controller)this.controller=null;}
  if(!this.ready)this.retryAt=this.ctx.currentTime+30;
  return this.ready;
 }
 setMode(mode){
  this.mode=mode;
  for(const voice of this.voices.values())voice.pan.pan.setTargetAtTime(voice.position*stereoWidth(mode),this.ctx.currentTime,.025);
 }
 play(command,side=0){
  const pitch=originalEffectPitch(command);
  if(this.disposed)return false;
  if(pitch){
   this.channelPitch.set(pitch.lane,pitch.rate);
   for(const voice of this.voices.values())if(voice.lane===pitch.lane)
    voice.source.playbackRate.setTargetAtTime(voice.rate*pitch.rate,this.ctx.currentTime,.01);
   return true;
  }
  const selection=originalContactSelection(command);
  if(!selection)return false;
  // Channel7 cannot poll IO0 during its dynamic call. Repeated ice hits retain
  // one pending command; the clip includes the original routine/poll duration.
  if(selection.lane===7&&this.voices.has(7)){this.pendingIce={command,side};return true;}
  const key=selection.lane===10?'10:'+selection.layer:selection.layer===1?selection.lane+':spray':selection.lane;
  this.stopVoice(key);
  if(selection.velocity===0)return true;
  const sound=this.manifest?.sounds[selection.key],buffer=this.buffers.get(sound?.file);
  if(!buffer)return false;
  const source=this.ctx.createBufferSource(),gain=this.ctx.createGain(),pan=this.ctx.createStereoPanner();
  const position=clamp(((selection.pan??sound.pan)-64)/64+(!selection.fixedPan&&Number.isFinite(side)?side:0),-1,1);
  source.buffer=buffer;source.playbackRate.value=sound.rate*(this.channelPitch.get(selection.lane)??1);
  // The source note interpreter squares velocity. Bus gain, stereo placement,
  // resampling and the offline envelopes are browser presentation adaptations.
  gain.gain.value=(selection.velocity/127)**2*.55;pan.pan.value=position*stereoWidth(this.mode);
  source.connect(gain).connect(pan).connect(this.destination);
  const voice={source,gain,pan,position,lane:selection.lane,rate:sound.rate};this.voices.set(key,voice);
  source.onended=()=>{
   source.disconnect();gain.disconnect();pan.disconnect();
   if(this.voices.get(key)!==voice)return;
   this.voices.delete(key);
   if(selection.lane===7&&this.pendingIce){const pending=this.pendingIce;this.pendingIce=null;this.play(pending.command,pending.side);}
  };
  source.start(this.ctx.currentTime);return true;
 }
 stop(lane){
  if(lane===undefined||lane===7)this.pendingIce=null;
  for(const [key,voice]of this.voices){
   if(lane!==undefined&&voice.lane!==lane)continue;
   this.stopVoice(key);
  }
 }
 stopVoice(key){
  const voice=this.voices.get(key);if(!voice)return;
  this.voices.delete(key);voice.source.onended=null;voice.source.stop();
  voice.source.disconnect();voice.gain.disconnect();voice.pan.disconnect();
 }
 resetChannels(){this.stop();this.channelPitch.set(2,1);this.channelPitch.set(5,1);}
 dispose(){this.disposed=true;this.controller?.abort();this.stop();this.buffers.clear();this.ready=false;}
}
