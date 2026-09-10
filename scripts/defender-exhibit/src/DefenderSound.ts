export type SoundEvent='fire'|'explosion'|'bomber'|'mutant'|'pod'|'swarmer'|'abduct'|'fall'|'catch'|'delivery'|'hyperspace'|'credit'|'thrust'|'start'|'bomb'|'death'|'extra'|'planet';
// Priorities come from the original game's SNDLD tables (defa7.src).
const priorities:Record<SoundEvent,number>={bomb:0xe8,death:0xf0,extra:0xff,planet:0xe8,fire:0xc0,explosion:0xd0,pod:0xd0,bomber:0xd0,mutant:0xd0,swarmer:0xc0,abduct:0xd0,fall:0xd8,catch:0xe0,delivery:0xe0,hyperspace:0xd0,credit:0xff,thrust:0,start:0xf0};
export class DefenderSound {
 private master:GainNode;private thrustGain:GainNode;private analyser:AnalyserNode;private buffers=new Map<SoundEvent,AudioBuffer>();
 private voice?:{source:AudioBufferSourceNode;until:number;priority:number};private playing=false;private output=0;private engine=false;private last='';private count=0;private loadError='';
 private context:AudioContext;readonly ready:Promise<void>;
 constructor(context:AudioContext){this.context=context;this.master=context.createGain();this.master.gain.value=0;this.analyser=context.createAnalyser();this.analyser.fftSize=256;this.master.connect(this.analyser).connect(context.destination);this.thrustGain=context.createGain();this.thrustGain.gain.value=0;this.thrustGain.connect(this.master);
  this.ready=this.load().catch(error=>{this.loadError=String(error);console.error('Defender original audio could not load',error);});
 }
 private async load(){
  await Promise.all((Object.keys(priorities) as SoundEvent[]).map(async event=>{const response=await fetch(`./audio/${event}.wav`);if(!response.ok)throw new Error(`${event}: HTTP ${response.status}`);this.buffers.set(event,await this.context.decodeAudioData(await response.arrayBuffer()));}));
  const source=this.context.createBufferSource();source.buffer=this.buffers.get('thrust')!;source.loop=true;source.connect(this.thrustGain);source.start();this.effect('start');
 }
 state(active:boolean,muted:boolean,volume:number,thrust:boolean){
  const enabled=active&&!muted,v=enabled?Math.max(0,Math.min(1,volume))*.45:0;
  if(v!==this.output){this.master.gain.setTargetAtTime(v,this.context.currentTime,.012);this.output=v;}
  if(!enabled&&this.voice){try{this.voice.source.stop()}catch{}this.voice=undefined;}
  // The original sound board has one DAC: effects preempt the background engine.
  const foreground=!!this.voice&&this.voice.until>this.context.currentTime;
  const engine=enabled&&thrust&&!foreground;if(engine!==this.engine){this.thrustGain.gain.setTargetAtTime(engine?1:0,this.context.currentTime,.006);this.engine=engine;}
  this.playing=enabled;
 }
 effect(event:SoundEvent){
  const buffer=this.buffers.get(event);if(!this.playing||!buffer)return;
  const now=this.context.currentTime,priority=priorities[event];if(this.voice&&this.voice.until>now&&this.voice.priority>priority)return;
  if(this.voice){try{this.voice.source.stop()}catch{}}
  this.thrustGain.gain.setTargetAtTime(0,now,.003);this.engine=false;
  const source=this.context.createBufferSource();source.buffer=buffer;source.connect(this.master);source.start();source.onended=()=>source.disconnect();
  this.voice={source,until:now+buffer.duration,priority};this.last=event;this.count++;
 }
 inspect(){const samples=new Float32Array(256);this.analyser.getFloatTimeDomainData(samples);return {context:this.context.state,level:Math.sqrt(samples.reduce((a,b)=>a+b*b,0)/samples.length),output:this.output,engine:this.engine,event:this.last,count:this.count,loaded:this.buffers.size,source:'VSNDRM1 rendered samples',error:this.loadError};}
}
