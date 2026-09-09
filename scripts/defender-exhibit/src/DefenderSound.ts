export type SoundEvent='fire'|'explosion'|'abduct'|'catch'|'delivery'|'hyperspace'|'credit'|'thrust';
const durations:Record<SoundEvent,number>={fire:.13,explosion:.42,abduct:.65,catch:.42,delivery:.68,hyperspace:.48,credit:.20,thrust:.32};
const priorities:Record<SoundEvent,number>={fire:1,explosion:2,abduct:3,catch:4,delivery:4,hyperspace:3,credit:4,thrust:0};

// Newly composed synthesis. No ROM bytes, sampled game audio or copied waveform tables.
// The historical sound computer used software waveforms/noise and an 8-bit DAC.
export function soundFrames(event:SoundEvent,rate=22050){
 const duration=durations[event],data=new Float32Array(Math.ceil(duration*rate));let phase=0,noise=0,seed=0x1981,filter=0;
 for(let i=0;i<data.length;i++){
  const t=i/rate,u=t/duration;seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  if(i%3===0)noise=seed/2147483648-1;
  let f=200,body=0;
  if(event==='fire'){f=1750*Math.exp(-u*3.4)+65;phase+=f/rate;body=((phase%1)<(.18+.45*u)?1:-1)*(.75+.25*Math.sin(u*27));}
  else if(event==='explosion'){const cutoff=.22*(1-u)+.012;filter+=cutoff*(noise-filter);body=filter*2.5;}
  else if(event==='thrust'){filter+=.15*(noise-filter);body=filter*.55+Math.sin(t*2*Math.PI*93)*.09;}
  else if(event==='hyperspace'){f=100+2100*(1-(u*4)%1);phase+=f/rate;body=((phase%1)<.27?1:-1)*.55+noise*.15;}
  else if(event==='abduct'){f=260+1150*((u*3)%1);phase+=f/rate;body=Math.sin(phase*Math.PI*2)*(.4+.6*Math.sin(u*3*Math.PI)**2);}
  else if(event==='catch'){f=u<.45?510+u*1100:950+(u-.45)*1500;phase+=f/rate;body=Math.sin(phase*2*Math.PI)*.75+Math.sin(phase*4*Math.PI)*.15;}
  else if(event==='delivery'){f=[523.25,659.25,783.99,1046.5][Math.min(3,Math.floor(u*4))];phase+=f/rate;body=((phase%1)<.35?1:-1)*.5*(.5+.5*Math.sin((u*4%1)*Math.PI));}
  else {f=700+u*580;phase+=f/rate;body=Math.sin(phase*2*Math.PI)*.65;}
  const envelope=event==='thrust'?1:Math.min(1,t/.003)*Math.min(1,(duration-t)/.018)*(event==='fire'||event==='explosion'?Math.exp(-u*3):1);
  // 8-bit amplitude steps are an aesthetic approximation, not instruction-level emulation.
  data[i]=Math.round(Math.max(-.85,Math.min(.85,body*envelope)) *127)/127;
 }return data;
}

export class DefenderSound {
 private master:GainNode;private thrustGain:GainNode;private analyser:AnalyserNode;private buffers=new Map<SoundEvent,AudioBuffer>();
 private voice?:{source:AudioBufferSourceNode;until:number;priority:number};private playing=false;private output=0;private engine=false;private last='';private count=0;
 private context:AudioContext;
 constructor(context:AudioContext){this.context=context;
  this.master=context.createGain();this.master.gain.value=0;
  const high=context.createBiquadFilter();high.type='highpass';high.frequency.value=75;
  const low=context.createBiquadFilter();low.type='lowpass';low.frequency.value=4200;low.Q.value=.6;
  const limit=context.createDynamicsCompressor();limit.threshold.value=-16;limit.ratio.value=5;limit.attack.value=.003;limit.release.value=.08;
  this.analyser=context.createAnalyser();this.analyser.fftSize=256;this.master.connect(high).connect(low).connect(limit).connect(this.analyser).connect(context.destination);
  this.thrustGain=context.createGain();this.thrustGain.gain.value=0;this.thrustGain.connect(this.master);
  const engine=context.createBufferSource();engine.buffer=this.buffer('thrust');engine.loop=true;engine.connect(this.thrustGain);engine.start();
 }
 private buffer(event:SoundEvent){let b=this.buffers.get(event);if(!b){const samples=soundFrames(event);b=this.context.createBuffer(1,samples.length,22050);b.copyToChannel(samples,0);this.buffers.set(event,b);}return b;}
 state(active:boolean,muted:boolean,volume:number,thrust:boolean){
  const enabled=active&&!muted,v=enabled?Math.max(0,Math.min(1,volume))*.24:0;
  if(v!==this.output){this.master.gain.setTargetAtTime(v,this.context.currentTime,.012);this.output=v;}
  const engine=enabled&&thrust;if(engine!==this.engine){this.thrustGain.gain.setTargetAtTime(engine?.17:0,this.context.currentTime,.03);this.engine=engine;}
  this.playing=enabled;
 }
 effect(event:SoundEvent){
  if(!this.playing)return;const now=this.context.currentTime,priority=priorities[event];if(this.voice&&this.voice.until>now&&this.voice.priority>priority)return;
  if(this.voice){try{this.voice.source.stop(now+.002)}catch{}}
  const source=this.context.createBufferSource();source.buffer=this.buffer(event);const gain=this.context.createGain();gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(1,now+.003);source.connect(gain).connect(this.master);source.start(now);source.onended=()=>{source.disconnect();gain.disconnect();};
  this.voice={source,until:now+source.buffer.duration,priority};this.last=event;this.count++;
 }
 inspect(){const samples=new Float32Array(256);this.analyser.getFloatTimeDomainData(samples);return {context:this.context.state,level:Math.sqrt(samples.reduce((a,b)=>a+b*b,0)/samples.length),output:this.output,engine:this.engine,event:this.last,count:this.count};}
}
