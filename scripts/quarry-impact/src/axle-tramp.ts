/** Axle tramp (offline): a classic's live rear axle, on its leaf springs, hops when the car is launched hard at the edge of grip —
 * its driven rear wheels slipping between TRAMP.slip m/s (worst mid-band), under TRAMP.speed m/s, the pedal past TRAMP.throttle —
 * and judders the tail up and down at TRAMP.hz: a vertical force at the axle of up to TRAMP.kick of the car's weight, and the rear
 * wheels hopping clear of the ground by up to TRAMP.hop m each time, from TRAMP.worn[0] of it on a sound car to all of it at its
 * oldest. Rear-driven classics only (not the buggies). */
export const TRAMP={slip:[1.2,7],speed:10,throttle:.7,hz:7,kick:.6,hop:.06,worn:[.45,1]} as const;
/** How far the rear wheels have hopped clear (m) at this point in the hop (radians) and this tramp level. */
export const trampHop=(phase:number,level:number)=>Number.isFinite(phase)&&level>0?Math.max(0,Math.sin(phase))*Math.min(1,level)*TRAMP.hop:0;
/** Does this car's rear axle tramp: a classic (not a buggy) driving its rear wheels only? */
export const trampKind=(kind:string,classic:boolean,driven:readonly number[])=>classic&&kind!=='buggy'&&kind!=='trail'&&driven.length===2&&driven[0]===2&&driven[1]===3;
/** How hard the axle tramps now (0–1): the driven rear wheels' slip (m/s), the car's speed (m/s), the pedal, its age (0–1). */
export function trampLevel(slip:number,speed:number,throttle:number,age:number){
  if(![slip,speed,throttle].every(Number.isFinite)||throttle<TRAMP.throttle||Math.abs(speed)>=TRAMP.speed)return 0;
  const s=Math.abs(slip);if(s<=TRAMP.slip[0]||s>=TRAMP.slip[1])return 0;
  const a=Number.isFinite(age)?Math.max(0,Math.min(1,age)):0,band=Math.sin(Math.PI*(s-TRAMP.slip[0])/(TRAMP.slip[1]-TRAMP.slip[0]));
  return band*(TRAMP.worn[0]+(TRAMP.worn[1]-TRAMP.worn[0])*a)*(1-.5*Math.abs(speed)/TRAMP.speed);
}
