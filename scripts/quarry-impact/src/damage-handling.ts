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
/** A rim bent past BENT_RIM.onset breaks the tyre's bead seal: the tyre is at least at the slow-puncture onset,
 * more the worse the bend, and leakTyre takes it from there. */
export const BENT_RIM={onset:.18,gain:.4} as const;
export function bentRimTyre(tyreDamage:number,wheelDamage:number){
  if(!Number.isFinite(wheelDamage)||wheelDamage<BENT_RIM.onset)return tyreDamage;
  return Math.max(Number.isFinite(tyreDamage)?tyreDamage:0,LEAK.onset+(Math.min(1,wheelDamage)-BENT_RIM.onset)*BENT_RIM.gain);
}
/** Visual runout of a bent rim (radians of tilt in the wheel's spinning frame): none below BENT_RIM.onset. */
export function rimWobble(wheelDamage:number){return Number.isFinite(wheelDamage)&&wheelDamage>=BENT_RIM.onset?Math.min(.12,(wheelDamage-.1)*.18):0;}
/** A corner hit hard enough snaps its coil spring: the corner sags onto the bump stops (rest length and stiffness
 * drop) and the car leans that way. Harder still, the driveshaft to that wheel snaps and it stops driving. Natural
 * derby wheel damage tops out near 0.2 (wheels past 0.15 tend to be torn off), hence the low thresholds. */
export const SPRING={snap:.16,sag:.6,stiffness:.35,shaft:.19} as const;
export const springBias=(wheelDamage:number)=>wheelDamage>=SPRING.snap?SPRING.stiffness:1;
export const sagBias=(wheelDamage:number)=>wheelDamage>=SPRING.snap?SPRING.sag:1;
export const driveBias=(wheelDamage:number)=>wheelDamage>=SPRING.shaft?0:1;
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
/** A rear end crushed past SUBFRAME.onset (natural derby rears reach ~0.26) bends the subframe: both rear wheels steer the same way (a thrust angle), so
 * the car dog-tracks, crabbing down the road and pulling. It leans away from the more crushed flank. */
export const SUBFRAME={onset:.15,gain:.25,max:.05} as const;
export function thrustAngle(structure:readonly number[]|undefined){
  const rear=clamp01(structure?.[1]??0);if(rear<=SUBFRAME.onset)return 0;
  const left=clamp01(structure?.[2]??0),right=clamp01(structure?.[3]??0),side=right>left?1:right<left?-1:1;
  return side*Math.min(SUBFRAME.max,(rear-SUBFRAME.onset)*SUBFRAME.gain);
}
/** A front crushed past BRAKE_LINE.onset splits a brake line: the fluid leaks away (faster the worse the crush) and the
 * brakes fade on every wheel, down to BRAKE_LINE.floor of their force with the reservoir dry. */
export const BRAKE_LINE={onset:.45,rate:.02,floor:.25,warn:.7} as const;
export function leakBrakeFluid(fluid:number,frontCompression:number,dt:number){
  const c=clamp01(frontCompression);if(c<=BRAKE_LINE.onset||!(dt>0))return clamp01(fluid);
  return Math.max(0,clamp01(fluid)-(c-BRAKE_LINE.onset)/(1-BRAKE_LINE.onset)*BRAKE_LINE.rate*dt);
}
export const brakeFluidFactor=(fluid:number)=>BRAKE_LINE.floor+(1-BRAKE_LINE.floor)*clamp01(fluid);
export const brakeWarning=(fluid:number)=>clamp01(fluid)<BRAKE_LINE.warn?'BRAKES FADING':'';
export const DAMPER_LOSS=.6;
export function damperFactor(wheelDamage:number){return 1-DAMPER_LOSS*clamp01(wheelDamage);}
