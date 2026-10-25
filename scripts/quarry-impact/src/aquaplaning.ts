import {puddleDepth,type Puddle} from './puddle-splashes';
/** Aquaplaning (offline): a tyre running through standing water rides up on it. Past AQUA.speed m/s it starts to lose
 * grip, and by AQUA.full m/s a tyre deep in a puddle keeps only 1 - AQUA.loss of it; the water also pushes back on the
 * tyre itself (AQUA.drag N at AQUA.dragSpeed m/s, growing with the square of speed up to AQUA.maxDrag times that), so a
 * car with one side in a puddle is tugged toward it. Water depth is how far into a puddle the tyre is, 0 at its edge to 1 well inside. */
export const AQUA={speed:12,full:24,loss:.75,drag:2500,dragSpeed:18,maxDrag:1.5,warn:.6,warnGap:4} as const;
/** An AI driver whose front tyres aquaplane lifts off to AQUA_LIFT.throttle and keeps off the brakes (to AQUA_LIFT.brake)
 * until they bite again, as a driver does, rather than spinning the wheels or locking them on the water. */
export const AQUA_LIFT={throttle:.15,brake:.15} as const;
export function aquaplaneLift<I extends {throttle:number;brake:number}>(input:I,grip:ArrayLike<number>):I{
  return aquaplaningNow(grip)?{...input,throttle:Math.min(input.throttle,AQUA_LIFT.throttle),brake:Math.min(input.brake,AQUA_LIFT.brake)}:input;
}
/** The driver is told when a front tyre has lost more than 1 - AQUA.warn of its grip to the water. */
export const aquaplaningNow=(grip:ArrayLike<number>)=>Math.min(grip[0]??1,grip[1]??1)<AQUA.warn;
const clamp01=(n:number)=>Number.isFinite(n)?Math.max(0,Math.min(1,n)):0;
const smooth=(a:number,b:number,x:number)=>{const t=clamp01((x-a)/(b-a));return t*t*(3-2*t);};
/** The share of its grip a tyre keeps in this much water at this speed (m/s). */
export const aquaGrip=(water:number,speed:number)=>1-AQUA.loss*clamp01(water)*smooth(AQUA.speed,AQUA.full,Math.abs(Number.isFinite(speed)?speed:0));
/** The water's push back on a tyre (N), against the way the car is going. */
export const waterDrag=(water:number,speed:number)=>{const s=Math.abs(Number.isFinite(speed)?speed:0);return AQUA.drag*clamp01(water)*Math.min(AQUA.maxDrag,(s/AQUA.dragSpeed)**2);};
/** How deep in standing water a tyre at (x, y, z) is: the deepest of the puddles under it. */
export function waterAt(puddles:readonly Puddle[],x:number,y:number,z:number){
  let deepest=0;
  for(const p of puddles){
    const reach=p.radius*1.25;if(Math.abs(x-p.x)>reach||Math.abs(z-p.z)>reach)continue;
    deepest=Math.max(deepest,puddleDepth(p,x,y,z));if(deepest>=1)break;
  }
  return deepest;
}
