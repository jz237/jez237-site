import {stereoWidth} from './coastal-music.js';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const SOUND_FILES={idle:'engine-idle',fast:'engine-fast',water:'water-rush',wind:'wind',splash:'splash',hit:'hull-impact',cue:'race-cue',music:'coastal-theme'};
// No service credentials or runtime generation: these are local ElevenLabs exports.
export function engineMix(speed,wet=1,throttle=0){const motion=clamp(Math.abs(speed)/14),load=clamp(throttle),rpm=clamp(motion*.72+load*.28+(1-wet)*load*.22);
 return {idle:Math.cos(rpm*Math.PI/2)*.42,fast:Math.sin(rpm*Math.PI/2)*(.35+load*.23),idleRate:.82+rpm*.75,fastRate:.65+rpm*.53,water:motion*wet*.52,cutoff:500+wet*8500};}
export class SampleSound{
 constructor(ctx,effects,music){this.ctx=ctx;this.effects=effects;this.musicBus=music;this.buffers={};this.loops=[];this.shots=new Set();this.ready=false;this.failures=[];this.mode='stereo';}
 async load(loader=url=>fetch(url).then(r=>{if(!r.ok)throw Error('Sound asset '+r.status);return r.arrayBuffer();})){
  await Promise.all(Object.entries(SOUND_FILES).map(async([id,file])=>{try{this.buffers[id]=await this.ctx.decodeAudioData(await loader(new URL('./assets/audio/'+file+'.mp3',import.meta.url)));}catch{this.failures.push(id);}}));
  this.ready=['idle','fast','water','wind'].every(id=>this.buffers[id]);if(!this.ready)return false;
  for(let player=0;player<2;player++)for(const id of ['idle','fast','water'])this.loop(id,player);
  this.loop('wind',-1);if(this.buffers.music)this.loop('music',-1);return true;
 }
 loop(id,player){const c=this.ctx,source=c.createBufferSource(),gain=c.createGain(),filter=c.createBiquadFilter(),pan=c.createStereoPanner();source.buffer=this.buffers[id];source.loop=true;filter.type='lowpass';filter.frequency.value=16000;gain.gain.value=0;source.connect(filter).connect(gain).connect(pan).connect(id==='music'?this.musicBus:this.effects);source.start(c.currentTime,player===1?source.buffer.duration*.37:0);this.loops.push({id,player,source,gain,filter,pan});}
 update(speed,storm,wet,companion,throttle=0,music=false,mode='stereo',engineMuted=false,paused=false){
  this.mode=mode;if(!this.ready)return;const c=this.ctx.currentTime;
  for(const l of this.loops){const second=l.player===1,p=second?companion:{speed,wet,throttle},m=engineMix(p?.speed||0,p?.wet??1,p?.throttle??throttle);let gain=0,rate=1,cutoff=16000,pan=0;
   if(l.id==='wind'){gain=.08+storm*.38;cutoff=900+storm*6500;pan=.12;}
   else if(l.id==='music'){gain=music?.45:0;}
   else if(!second||companion){gain=m[l.id]*(companion?.72:1);rate=l.id==='idle'?m.idleRate:l.id==='fast'?m.fastRate:.85+clamp((p?.speed||0)/14)*.3;cutoff=l.id==='water'?12000:m.cutoff;pan=companion?(second?.45:-.45):0;}
   if(paused&&l.id!=='music')gain=0;if(engineMuted&&l.player===0&&['idle','fast'].includes(l.id))gain=0;l.gain.gain.setTargetAtTime(gain,c,.12);l.source.playbackRate.setTargetAtTime(rate,c,.09);l.filter.frequency.setTargetAtTime(cutoff,c,.15);l.pan.pan.setTargetAtTime(pan*stereoWidth(mode),c,.08);
  }
 }
 play(id,{gain=.5,rate=1,pan=0}={}){const buffer=this.buffers[id];if(!buffer)return false;const c=this.ctx,t=c.currentTime;if(this.shots.size>=12)return true;
  const source=c.createBufferSource(),volume=c.createGain(),position=c.createStereoPanner();source.buffer=buffer;source.playbackRate.value=clamp(rate,.55,1.8);volume.gain.value=clamp(gain,0,.9);position.pan.value=clamp(pan,-1,1)*stereoWidth(this.mode);source.connect(volume).connect(position).connect(this.effects);this.shots.add(source);source.onended=()=>{source.disconnect();volume.disconnect();position.disconnect();this.shots.delete(source);};source.start(t);return true;
 }
 dispose(){for(const l of this.loops){l.source.stop();for(const n of [l.source,l.gain,l.filter,l.pan])n.disconnect();}for(const s of this.shots)s.stop();this.loops=[];this.shots.clear();}
}
