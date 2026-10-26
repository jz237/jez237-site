/** Torque steer (offline): a front-driver's unequal driveshafts tug the wheel to one side under hard throttle — each car its
 * own way — up to TORQUE_STEER.pull of full lock with the pedal flat from a standstill, from TORQUE_STEER.throttle of pedal up,
 * fading out by TORQUE_STEER.fade m/s as the drive settles. The driver feels it through the wheel and has to hold it straight. */
export const TORQUE_STEER={pull:.14,throttle:.35,fade:16} as const;
/** Which way car `id` pulls: 1 or −1. */
export const torqueSide=(id:number)=>Math.abs(Math.sin((Number.isFinite(id)?id:0)*47.13+2.9)*43758.5453)%1<.5?-1:1;
/** The steering after the pull, from the driver's steer (−1–1) at this pedal and speed (m/s), on car `id`. */
export function torqueSteer(steer:number,throttle:number,speed:number,id:number){
  const s=Number.isFinite(steer)?steer:0,p=Number.isFinite(throttle)?throttle:0,v=Number.isFinite(speed)?Math.abs(speed):0;
  if(p<=TORQUE_STEER.throttle||v>=TORQUE_STEER.fade)return s;
  const pull=TORQUE_STEER.pull*(p-TORQUE_STEER.throttle)/(1-TORQUE_STEER.throttle)*(1-v/TORQUE_STEER.fade);
  return Math.max(-1,Math.min(1,s+torqueSide(id)*pull));
}
