/** How accumulated damage changes the way a car drives (offline events only).
 * - Bent steering: front compression (structure[0]) cuts the available steering lock.
 * - Brake bias: a damaged corner's brake loses force, so the car pulls under braking.
 * - Overheating: a crushed front (radiator) keeps adding engine damage while the engine runs. */
const clamp01=(v:number)=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
export const STEER_LOSS=.4,BRAKE_LOSS=.45,RADIATOR={onset:.35,rate:.006,cap:.85} as const;
export function steeringLimit(structure:readonly number[]|undefined){return 1-STEER_LOSS*clamp01(structure?.[0]??0);}
export function brakeFactor(wheelDamage:number){return 1-BRAKE_LOSS*clamp01(wheelDamage);}
/** New engine damage after dt seconds of running with this front compression and throttle. */
export function overheat(engineDamage:number,frontCompression:number,throttle:number,dt:number){
  const crushed=clamp01((frontCompression-RADIATOR.onset)/(1-RADIATOR.onset));
  if(crushed<=0||!(dt>0)||engineDamage>=RADIATOR.cap)return engineDamage;
  return Math.min(RADIATOR.cap,engineDamage+dt*RADIATOR.rate*crushed*(.35+.65*clamp01(Math.abs(throttle))));
}
/** Slow puncture: a tyre damaged past LEAK.onset but not yet failed loses air while it rolls, faster
 * the more damaged it is, until it fails (tyreFailure starts at 0.72, fully flat by 0.92). */
export const LEAK={onset:.35,rate:.006,flat:.92} as const;
export function leakTyre(damage:number,speed:number,dt:number){
  if(!(dt>0)||!Number.isFinite(damage)||damage<LEAK.onset||damage>=LEAK.flat)return damage;
  const severity=(damage-LEAK.onset)/(LEAK.flat-LEAK.onset),rolling=Math.min(1,Math.abs(Number.isFinite(speed)?speed:0)/15);
  return Math.min(LEAK.flat,damage+dt*LEAK.rate*(.35+severity)*rolling);
}
/** A damaged corner's damper loses up to DAMPER_LOSS of its damping, so it bounces and wallows. */
/** Gearbox damage: crushing the driven end of the car past GEARBOX.onset strips the top gear, then more,
 * down to GEARBOX.min gears, which caps top speed. */
export const GEARBOX={onset:.3,step:.15,min:2} as const;
export type DriveLayout='front'|'rear'|'all';
export function gearLimit(structure:readonly number[]|undefined,drive:DriveLayout){
  const front=clamp01(structure?.[0]??0),rear=clamp01(structure?.[1]??0);
  const c=drive==='front'?front:drive==='rear'?rear:Math.max(front,rear)*.85;
  return Math.max(GEARBOX.min,5-Math.max(0,Math.floor((c-GEARBOX.onset)/GEARBOX.step)+1));
}
export function gearboxWarning(limit:number){return limit<5?`GEARBOX DAMAGED · ${limit} GEARS`:'';}
/** A tyre that bursts at speed snatches the car toward that corner: a backward tug at the wheel (yaw) and a
 * smaller sideways one, scaled by mass and speed (capped at 30 m/s). Nothing below BLOWOUT.minSpeed. */
export const BLOWOUT={minSpeed:6,drag:.05,side:.018} as const;
export function blowoutImpulse(mass:number,speed:number){
  const v=Math.abs(Number.isFinite(speed)?speed:0);if(!(mass>0)||v<BLOWOUT.minSpeed)return{drag:0,side:0};
  const s=Math.min(30,v);return{drag:mass*s*BLOWOUT.drag,side:mass*s*BLOWOUT.side};
}
export const DAMPER_LOSS=.6;
export function damperFactor(wheelDamage:number){return 1-DAMPER_LOSS*clamp01(wheelDamage);}
