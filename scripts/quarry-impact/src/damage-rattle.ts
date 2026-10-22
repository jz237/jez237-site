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
/** A front crushed past HORN.onset shorts the horn on about a third of the cars (fixed per car): it blares on. */
export const HORN={onset:.55,share:.34} as const;
export const hornStuck=(frontCompression:number,carId:number)=>clamp01(frontCompression)>HORN.onset&&((carId*.7548+.13)%1)<HORN.share;
/** One second of a two-tone car horn (about 420 and 525 Hz, slightly harsh), loopable. */
export function synthHorn(sampleRate:number):Float32Array<ArrayBuffer>{
  const length=Math.round(sampleRate),out=new Float32Array(length);
  for(let i=0;i<length;i++){const t=i/sampleRate;let v=0;for(const f of [420,525])for(let h=1;h<=5;h+=2)v+=Math.sin(2*Math.PI*f*h*t)/h;out[i]=Math.tanh(v*.9)*.35;}
  return out;
}
/** A one-second loop of a failing wheel bearing: a gritty, rough-edged hum (noise through two resonances) that throbs with the
 * wheel's turn. Played back faster with speed. */
export function synthGrowl(sampleRate:number):Float32Array<ArrayBuffer>{
  const length=Math.round(sampleRate),out=new Float32Array(length);let seed=12345,a=0,b=0,c=0,d=0;
  const res=(f:number)=>2*Math.sin(Math.PI*f/sampleRate);const fa=res(180),fb=res(410),q=.08;
  for(let i=0;i<length;i++){
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;const n=seed/4294967296*2-1,t=i/sampleRate;
    a+=fa*b;b+=fa*(n-a-q*b);c+=fb*d;d+=fb*(n-c-q*d);
    const throb=.6+.4*Math.sin(2*Math.PI*8*t);
    out[i]=Math.tanh((a*.5+c*.35)*throb*.6)*.5;
  }
  // Fade the seam so the loop does not click.
  for(let i=0;i<256;i++){const g=i/256;out[i]*=g;out[length-1-i]*=g;}
  return out;
}
/** A two-second loop of wind buffeting an open cabin: low-passed noise swelling in slow gusts. */
export function synthWind(sampleRate:number):Float32Array<ArrayBuffer>{
  const length=Math.round(sampleRate*2),out=new Float32Array(length);let seed=777,lp=0,lp2=0;
  for(let i=0;i<length;i++){
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;const n=seed/4294967296*2-1,t=i/sampleRate;
    lp+=.06*(n-lp);lp2+=.3*(n-lp2);
    // Gust rates are whole cycles per loop so the swell is seamless.
    const gust=.65+.2*Math.sin(2*Math.PI*.5*t)+.15*Math.sin(2*Math.PI*1.5*t+1);
    out[i]=Math.tanh((lp*2.4+(lp2-lp)*.35)*gust)*.55;
  }
  for(let i=0;i<512;i++){const g=i/512;out[i]*=g;out[length-1-i]*=g;}
  return out;
}
/** A one-second loop of a slipping fan belt: a shrill, warbling squeal (a few close harmonics, wavering). */
export function synthSqueal(sampleRate:number):Float32Array<ArrayBuffer>{
  const length=Math.round(sampleRate),out=new Float32Array(length);let ph=0;
  for(let i=0;i<length;i++){
    const t=i/sampleRate,f=2300+180*Math.sin(2*Math.PI*6*t)+90*Math.sin(2*Math.PI*17*t);ph+=2*Math.PI*f/sampleRate;
    const chatter=.55+.45*Math.max(0,Math.sin(2*Math.PI*11*t));
    out[i]=(Math.sin(ph)*.6+Math.sin(ph*2.01)*.25+Math.sin(ph*.5)*.15)*chatter*.4;
  }
  for(let i=0;i<256;i++){const g=i/256;out[i]*=g;out[length-1-i]*=g;}
  return out;
}
