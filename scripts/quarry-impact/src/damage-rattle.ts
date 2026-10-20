/** Damage you can hear: loose panels clank against the body (more with speed and on rough ground),
 * and a bent wheel thumps once per revolution. The sounds are synthesized, not recorded: short
 * metallic clanks (a few inharmonic damped partials over a click) and a low rubbery thump. */
const clamp01=(v:number)=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
const smooth=(x:number,a:number,b:number)=>{const t=clamp01((x-a)/(b-a));return t*t*(3-2*t);};
export const RATTLE={onset:.12,full:.9,maxRate:9,thumpOnset:.18,hearing:45,variants:4} as const;
/** Clanks per second from the loosest hanging part, speed (m/s) and surface roughness (0 tarmac … 1 gravel). */
export function rattleRate(loose:number,speed:number,rough=0){
  const l=smooth(loose,RATTLE.onset,RATTLE.full);if(l<=0)return 0;
  const s=clamp01(Math.abs(Number.isFinite(speed)?speed:0)/18);
  return RATTLE.maxRate*l*(.12+.88*s)*(1+.6*clamp01(rough));
}
/** Thumps per second from a bent wheel: once per revolution, silent while barely moving. */
export function thumpRate(wheelDamage:number,speed:number,radius:number){
  const v=Math.abs(Number.isFinite(speed)?speed:0);
  if(!(wheelDamage>=RATTLE.thumpOnset)||v<1.5||!(radius>0))return 0;
  return v/(2*Math.PI*radius);
}
/** Turns a rate into discrete events with a little jitter so rattles never sound like a metronome. */
export class EventClock{
  private phase=new Map<string,number>();private seed=0x9e3779b9;
  step(key:string,rate:number,dt:number,jitter=.35){
    if(!(rate>0)||!(dt>0)){this.phase.delete(key);return 0;}
    let p=(this.phase.get(key)??this.random())+rate*dt,n=0;
    while(p>=1&&n<3){p-=1+(this.random()-.5)*jitter;n++;}
    this.phase.set(key,Math.min(p,1));return n;
  }
  random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
  clear(){this.phase.clear();}
}
/** A metallic clank: a click plus inharmonic damped partials, ~0.25 s. */
export function synthClank(sampleRate:number,variant:number):Float32Array<ArrayBuffer>{
  const length=Math.round(sampleRate*.26),out=new Float32Array(length);
  const base=[380,610,890,1270][variant%4],ratios=[1,2.76,5.4,8.93],decays=[.11,.07,.045,.03];
  let seed=(variant+1)*2654435761>>>0;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296*2-1;};
  for(let i=0;i<length;i++){
    const t=i/sampleRate;let v=0;
    for(let k=0;k<4;k++)v+=Math.sin(2*Math.PI*base*ratios[k]*t+k)*Math.exp(-t/decays[k])*(k===0?.55:.32/k);
    v+=rnd()*Math.exp(-t/.006)*.7;
    out[i]=v*.6;
  }
  return out;
}
/** A low thump with a rubbery body and a short knock, ~0.18 s. */
export function synthThump(sampleRate:number):Float32Array<ArrayBuffer>{
  const length=Math.round(sampleRate*.18),out=new Float32Array(length);
  let seed=12345;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296*2-1;};
  for(let i=0;i<length;i++){
    const t=i/sampleRate,f=78-30*Math.min(1,t/.12);
    out[i]=(Math.sin(2*Math.PI*f*t)*Math.exp(-t/.05)*.9+rnd()*Math.exp(-t/.004)*.35+Math.sin(2*Math.PI*240*t)*Math.exp(-t/.02)*.25)*.7;
  }
  return out;
}
