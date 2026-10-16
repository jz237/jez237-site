import * as T from 'three';
import type {CameraObstruction} from './demo-camera-visibility';
/** Early reflections only: bounded feed-forward taps, no resonant feedback loop. */
export const REFLECTION_DELAYS=[.020,.045,.080,.130] as const;
export type ReflectionMix={taps:number[];cutoff:number};
export function trackReflectionMix(position:T.Vector3,probe:CameraObstruction):ReflectionMix{
 const taps=[0,0,0,0];let roof=0;
 for(let i=0;i<9;i++){
  const up=i===8,angle=i*Math.PI/4,range=up?12:24;
  const end=position.clone().add(up?new T.Vector3(0,range,0):new T.Vector3(Math.sin(angle)*range,0,Math.cos(angle)*range));
  const distance=probe(position,end);
  // Embedded listeners and invalid hits must not become loud reflection sources.
  if(distance===null||!Number.isFinite(distance)||distance<.15||distance>=range)continue;
  const strength=(1-distance/range)**2*(up?.09:.028),delay=2*distance/343;
  const index=REFLECTION_DELAYS.reduce((best,t,j)=>Math.abs(t-delay)<Math.abs(REFLECTION_DELAYS[best]-delay)?j:best,0);
  taps[index]+=strength;if(up)roof=strength/.09;
 }
 return{taps,cutoff:4200-roof*1600};
}
/** Nine static-world rays at four Hz, independent of frame rate and car count. */
export class TrackAcousticProbe{
 private remaining=0;
 private previous:T.Vector3|null=null;
 private mix:ReflectionMix={taps:[0,0,0,0],cutoff:4200};
 reset(){this.remaining=0;this.previous=null;this.mix={taps:[0,0,0,0],cutoff:4200};}
 update(position:T.Vector3,dt:number,probe:CameraObstruction){
  this.remaining-=Number.isFinite(dt)&&dt>0?dt:0;
  if(!this.previous||this.remaining<=0||this.previous.distanceToSquared(position)>225){
   this.mix=trackReflectionMix(position,probe);this.remaining=.25;this.previous=position.clone();
  }
  return this.mix;
 }
}
/** Post-volume sends preserve effects/engine sliders and master mute/compression.
 * Ambient beds stay dry. Fixed delays prevent pitch sweeps while moving. */
export class TrackReflections{
 private readonly send:GainNode;
 private readonly filter:BiquadFilterNode;
 private readonly taps:{delay:DelayNode;gain:GainNode;pan:StereoPannerNode}[];
 constructor(private ctx:AudioContext,private buses:AudioNode[],output:AudioNode){
  this.send=ctx.createGain();this.send.gain.value=1;
  this.filter=ctx.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=4200;
  this.send.connect(this.filter);
  this.taps=REFLECTION_DELAYS.map((time,i)=>{
   const delay=ctx.createDelay(.2),gain=ctx.createGain(),pan=ctx.createStereoPanner();
   delay.delayTime.value=time;gain.gain.value=0;pan.pan.value=[-.55,.55,-.3,.3][i];
   this.filter.connect(delay).connect(gain).connect(pan).connect(output);return{delay,gain,pan};
  });
  for(const bus of buses)bus.connect(this.send);
 }
 update(mix:ReflectionMix){
  const at=this.ctx.currentTime;
  this.filter.frequency.setTargetAtTime(mix.cutoff,at,.25);
  this.taps.forEach((tap,i)=>tap.gain.gain.setTargetAtTime(mix.taps[i],at,.18));
 }
 dispose(){for(const bus of this.buses)bus.disconnect(this.send);this.send.disconnect();this.filter.disconnect();for(const t of this.taps){t.delay.disconnect();t.gain.disconnect();t.pan.disconnect();}}
}
