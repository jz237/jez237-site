/** Tyre squeal, belt squeal and the rattle budget: what the field sounds like when it is busy.
 * - Tyres squeal on paved ground only (on gravel the stones roar instead), and mostly as a slide begins: slip past
 *   TYRE_SQUEAL.onset sounds at once, growing to full at TYRE_SQUEAL.full, but a slide held for a while (a derby push with the
 *   wheels spinning) settles over TYRE_SQUEAL.settle s to TYRE_SQUEAL.steady of that — a scrub, not a scream. Only the
 *   TYRE_SQUEAL.voices loudest cars squeal at once, and a car's skid chirp comes at most every TYRE_SQUEAL.skidGap s.
 * - A slipping fan belt squeals as the revs climb (BELT_SURGE.rise rpm above where they have been is full voice) and settles
 *   to BELT_SURGE.base of that while they hold.
 * - Rattles, knocks and clatter across the field are played at most RATTLE_BUDGET.rate a second (bursts of
 *   RATTLE_BUDGET.burst): beyond that they are a wall of noise, and every one is a new sound to build.
 * - Each running-gear loop (reverse whine, steam and tyre hiss, flapping tyres, groans, brake squeal…) sounds from at most
 *   LOOP_VOICES cars, the ones heard loudest; the rest of the field's would only blur into a drone. */
export const TYRE_SQUEAL={onset:2.5,full:9,cap:.35,settle:1.4,steady:.3,voices:3,skidGap:1.2} as const;
export const BELT_SURGE={settle:1,rise:1200,base:.1} as const;
export const RATTLE_BUDGET={rate:10,burst:5} as const;
export const LOOP_VOICES=2;
/** The cars whose loop of one kind sounds: the LOOP_VOICES heard loudest (level over distance). */
export function loudest<C>(heard:readonly {car:C;level:number;distance:number}[]){
  return [...heard].sort((a,b)=>b.level/Math.max(1,b.distance)-a.level/Math.max(1,a.distance)).slice(0,LOOP_VOICES);
}
const clamp01=(v:number)=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
export const isPaved=(surface:string|undefined)=>surface==='asphalt';
export type SquealState={avg:number;skidAt:number};
export const squealState=():SquealState=>({avg:0,skidAt:-Infinity});
/** This car's tyre squeal gain (0–TYRE_SQUEAL.cap) after dt s at this slip (m/s) on paved ground or not. */
export function squealLevel(s:SquealState,slip:number,paved:boolean,dt:number){
  const target=paved?clamp01((slip-TYRE_SQUEAL.onset)/(TYRE_SQUEAL.full-TYRE_SQUEAL.onset)):0,t=Number.isFinite(dt)&&dt>0?dt:0;
  s.avg+=(target-s.avg)*(1-Math.exp(-t/TYRE_SQUEAL.settle));
  return TYRE_SQUEAL.cap*Math.min(1,Math.max(0,target-s.avg)+TYRE_SQUEAL.steady*Math.min(target,s.avg));
}
/** May this car chirp a skid now (time s)? Marks it if so. */
export function skidChirp(s:SquealState,now:number){if(!(now-s.skidAt>=TYRE_SQUEAL.skidGap))return false;s.skidAt=now;return true;}
/** The cars allowed to squeal: the TYRE_SQUEAL.voices with the loudest squeal heard (level over distance). */
export function squealVoices(heard:ReadonlyMap<number,number>){
  return new Set([...heard].filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,TYRE_SQUEAL.voices).map(([id])=>id));
}
/** How much of a slipping belt's squeal sounds (BELT_SURGE.base–1): full as the revs climb, settling while they hold. */
export function beltSurge(s:{rpm:number},rpm:number,dt:number){
  const r=Number.isFinite(rpm)?rpm:0,t=Number.isFinite(dt)&&dt>0?dt:0,rise=clamp01((r-s.rpm)/BELT_SURGE.rise);
  s.rpm+=(r-s.rpm)*(1-Math.exp(-t/BELT_SURGE.settle));return BELT_SURGE.base+(1-BELT_SURGE.base)*rise;
}
/** A shared allowance for rattle-type one-shots. */
export class ShotBudget{
  private tokens:number=RATTLE_BUDGET.burst;private at=-Infinity;
  /** Spend one at time `now` (s) if there is one. */
  take(now:number){
    if(Number.isFinite(this.at)&&Number.isFinite(now))this.tokens=Math.min(RATTLE_BUDGET.burst,this.tokens+(now-this.at)*RATTLE_BUDGET.rate);
    this.at=now;if(this.tokens<1)return false;this.tokens--;return true;
  }
}
