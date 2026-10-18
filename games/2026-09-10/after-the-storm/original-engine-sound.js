import {stereoWidth} from './coastal-music.js';
const base=new URL('./assets/audio/waverace64/engine/',import.meta.url);
const files=['base-low.wav','base-middle.wav','base-high.wav','water.wav'];
const view=new DataView(new ArrayBuffer(4));
const float=bits=>{view.setUint32(0,bits);return view.getFloat32(0);};
const signed=value=>(value<<24)>>24;
const finite=(v,low,high)=>Number.isFinite(v)&&v>=low&&v<=high;

// Sequence0's two human engine channels. Layer0 overrides the program to0;
// layer1 retains program1 (water) or2 (the detuned base sample out of water).
export function createOriginalEngineChannels(players=1){
 if(![1,2].includes(players))throw new RangeError('Expected one or two engine channels');
 return Array.from({length:players},(_,i)=>({lane:i?3:0,enabled:false,frequency:1,expression:1,
  volume:(i?80:60)/127,pan:64,transpose:0,program:1,velocity:100}));
}

// The recovered C547C channel-command fields, followed by sequence0's IO5/6
// layer controls. This is a browser control adapter, not an audio-thread VM.
export function applyOriginalEngineCommands(channels,commands){
 const result=channels.map(c=>({...c}));
 for(const command of commands){
  const name=command.consumer?.replace(/^800/,'');
  if(name!=='c538c'&&name!=='c53d4')continue;
  if(!Array.isArray(command.arguments)||command.arguments.length!==2||command.arguments.some(v=>!Number.isInteger(v)||v< -2147483648||v>0xffffffff))
   throw new RangeError('Invalid original engine command');
  const [op,arg]=command.arguments,channel=result.find(c=>c.lane===((op>>>8)&255));
  if(!channel||((op>>>16)&255)!==0)continue;
  const kind=op>>>24,index=op&255;
  if(name==='c538c'&&[1,2,4].includes(kind)){
   const value=float(arg);
   if(!finite(value,0,kind===4?16:1))throw new RangeError('Invalid original engine mixer value');
   channel[kind===1?'expression':kind===2?'volume':'frequency']=value;
  }else if(name==='c53d4'){
   if(kind===3){if(!Number.isInteger(arg)||arg<0||arg>127)throw new RangeError('Invalid original engine pan');channel.pan=arg;}
   else if(kind===6){
    const value=signed(arg);
    if(index===0&&value>=0)channel.enabled=true;
    else if(index===4&&value<0)channel.enabled=false;
    else if(index===5)channel.transpose=value;
    else if(index===6){
     if(value<=0){channel.program=value===0?2:1;channel.velocity=127;}
     else channel.velocity=value;
    }
   }
  }
 }
 return result;
}

export function originalEngineLayers(channel,manifest){
 const note=39+channel.transpose;
 if(![0,3].includes(channel.lane)||typeof channel.enabled!=='boolean'||!Number.isInteger(note)||note<0||note>127||
  ![1,2].includes(channel.program)||!Number.isInteger(channel.velocity)||!finite(channel.velocity,0,127)||
  !finite(channel.frequency,0,16)||!finite(channel.expression,0,1)||!finite(channel.volume,0,1)||!finite(channel.pan,0,127))
  throw new RangeError('Invalid original engine channel');
 const zone=manifest.zones.find(z=>note>=z.low&&note<=z.high),pitch=2**(channel.transpose/12)*channel.frequency;
 const mix=channel.expression*channel.volume*.45,pan=(channel.pan-64)/64;
 return [{key:channel.lane+':0',file:zone.file,rate:pitch*zone.baseTuning,gain:mix*(117/127)**2,pan},
  {key:channel.lane+':1',file:channel.program===1?manifest.water.file:zone.file,
   rate:pitch*(channel.program===1?manifest.water.tuning:zone.dryTuning),gain:mix*(channel.velocity/127)**2,pan}];
}

export class OriginalEngineSound{
 constructor(ctx,destination,{loader=(url,signal)=>fetch(url,{signal}).then(r=>{if(!r.ok)throw Error('Engine asset '+r.status);return r.arrayBuffer();})}={}){
  this.ctx=ctx;this.destination=destination;this.loader=loader;this.buffers=new Map();this.voices=new Map();this.tails=new Set();
  this.ready=false;this.disposed=false;this.retryAt=0;this.failures=[];
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
    if(m.version!==1||!m.files||!Array.isArray(m.zones)||m.zones.length!==3||
     m.zones.some((z,i)=>z.file!==files[i]||z.low!==[0,38,42][i]||z.high!==[37,41,127][i]||!finite(z.baseTuning,.1,2)||!finite(z.dryTuning,.1,2))||
     m.water?.file!=='water.wav'||!finite(m.water.tuning,.1,2)||files.some(file=>{
      const f=m.files[file];return !f||f.sampleRate!==32000||!Number.isInteger(f.frames)||f.frames<=0||f.frames>32000||
       !Number.isInteger(f.loopStartFrame)||f.loopStartFrame<0||f.loopStartFrame>=f.loopEndFrame||f.loopEndFrame!==f.frames;
     }))throw Error('Invalid engine manifest');
    this.manifest=m;
   }
   await Promise.all(files.filter(file=>!this.buffers.has(file)).map(async file=>{
    try{
     const buffer=await this.ctx.decodeAudioData(await this.loader(new URL(file,base),controller.signal)),f=this.manifest.files[file];
     if(!finite(buffer.duration,0,1)||Math.abs(buffer.duration-f.frames/f.sampleRate)>.001)throw Error('Truncated engine asset');
     if(!this.disposed&&!controller.signal.aborted)this.buffers.set(file,buffer);
    }catch{if(!controller.signal.aborted)this.failures.push(file);}
   }));
   this.ready=!this.disposed&&this.buffers.size===files.length;
  }catch(error){if(!controller.signal.aborted)this.failures.push(String(error.message||error));}
  finally{if(this.controller===controller)this.controller=null;}
  if(!this.ready)this.retryAt=this.ctx.currentTime+30;
  return this.ready;
 }
 release(voice,fade=false){
  voice.source.onended=null;
  if(fade){
   const t=this.ctx.currentTime;voice.gain.gain.setTargetAtTime(0,t,.008);voice.source.stop(t+.04);this.tails.add(voice);
   voice.source.onended=()=>{this.tails.delete(voice);for(const n of [voice.source,voice.gain,voice.pan])n.disconnect();};
   while(this.tails.size>8){const oldest=this.tails.values().next().value;this.tails.delete(oldest);this.release(oldest);}
  }else{voice.source.stop();for(const n of [voice.source,voice.gain,voice.pan])n.disconnect();}
 }
 update(channels,{active=true,mode='stereo'}={}){
  if(this.disposed||!this.ready)return false;
  if(!active){this.stop();return true;}
  const plans=channels.flatMap(c=>c.enabled?originalEngineLayers(c,this.manifest):[]),wanted=new Set(plans.map(p=>p.key)),t=this.ctx.currentTime;
  for(const [key,voice]of this.voices)if(!wanted.has(key)){this.release(voice,true);this.voices.delete(key);}
  for(const plan of plans){
   let voice=this.voices.get(plan.key);
   if(voice?.file!==plan.file){
    if(voice)this.release(voice,true);
    const source=this.ctx.createBufferSource(),gain=this.ctx.createGain(),pan=this.ctx.createStereoPanner(),f=this.manifest.files[plan.file];
    source.buffer=this.buffers.get(plan.file);source.loop=true;source.loopStart=f.loopStartFrame/f.sampleRate;source.loopEnd=f.loopEndFrame/f.sampleRate;
    source.playbackRate.value=plan.rate;gain.gain.value=0;pan.pan.value=plan.pan*stereoWidth(mode);
    source.connect(gain).connect(pan).connect(this.destination);source.start(t);
    voice={source,gain,pan,file:plan.file};this.voices.set(plan.key,voice);
   }
   // Web Audio smooths changes and crossfades sample-zone replacements. The
   // original sequence's portamento, envelopes and RSP interpolation differ.
   voice.source.playbackRate.setTargetAtTime(plan.rate,t,.025);voice.gain.gain.setTargetAtTime(plan.gain,t,.02);
   voice.pan.pan.setTargetAtTime(plan.pan*stereoWidth(mode),t,.02);
  }
  return true;
 }
 stop(){for(const voice of [...this.voices.values(),...this.tails])this.release(voice);this.voices.clear();this.tails.clear();}
 dispose(){this.disposed=true;this.controller?.abort();this.stop();this.buffers.clear();this.ready=false;}
}
