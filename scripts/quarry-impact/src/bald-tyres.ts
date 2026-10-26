import {AQUA,aquaGrip} from './aquaplaning';

/** Bald tyres (offline rivals, by age): an old banger runs its tyres down to the canvas. From BALD.age of its age, on BALD.share
 * of them the tyres have only BALD.tread of their tread left (each its own; now and then, BALD.pair of them, one axle on a
 * newer pair). Dry, a bald tyre grips as well as any; in the wet it cannot clear the water: on a wet road it keeps up to
 * BALD.wet less of its grip, and in standing water it rides up sooner — aquaplaning from BALD.early less speed and losing up
 * to BALD.loss of its grip where a treaded tyre loses AQUA.loss. Its worn face shows smooth and shiny. Full tread (1) is
 * exactly as before. */
export const BALD={age:.5,share:.45,tread:[.08,.4],pair:.3,wet:.18,early:.4,loss:.9,shine:.5} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*29.57+salt*61.13)*43758.5453)%1;
const clamp01=(n:number)=>Number.isFinite(n)?Math.max(0,Math.min(1,n)):1;
const smooth=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
/** Car `id`'s tread left on each wheel (FL, FR, RL, RR; 1 new) at this age, or null when its tyres are fine. */
export function treadFor(id:number,age:number):number[]|null{
  const n=Number.isFinite(id)?id:0;
  if(!(age>=BALD.age)||hash(n,1)>=BALD.share)return null;
  const [lo,hi]=BALD.tread,base=lo+(hi-lo)*hash(n,2),tread=[0,1,2,3].map(i=>Math.max(lo,Math.min(hi,base+(hash(n,3+i)-.5)*.12)));
  if(hash(n,7)<BALD.pair){const axle=hash(n,8)<.5?0:2;tread[axle]=tread[axle+1]=.75+.2*hash(n,9);}
  return tread;
}
/** The share of its grip a tyre with this much tread keeps on a road this wet (0 dry .. 1 soaked). */
export function wetTreadGrip(tread:number,wetness:number){
  const worn=1-clamp01(tread);if(worn===0)return 1;
  return 1-BALD.wet*worn*Math.max(0,Math.min(1,Number.isFinite(wetness)?wetness:0));
}
/** aquaGrip for a tyre with this much tread: the same at full tread, sooner and deeper as it wears. */
export function treadAquaGrip(water:number,speed:number,tread:number){
  const worn=1-clamp01(tread);if(worn===0)return aquaGrip(water,speed);
  const w=Math.max(0,Math.min(1,Number.isFinite(water)?water:0)),s=Math.abs(Number.isFinite(speed)?speed:0),early=1-BALD.early*worn,loss=AQUA.loss+(BALD.loss-AQUA.loss)*worn;
  return 1-loss*w*smooth(AQUA.speed*early,AQUA.full*early,s);
}
