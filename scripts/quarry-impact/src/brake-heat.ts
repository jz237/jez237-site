/** Brakes heat with use (offline): braking turns the car's speed into heat in the discs, BRAKE_HEAT.rate of heat a second
 * per m/s at full pedal, the front discs doing BRAKE_HEAT.front of the work and the rear BRAKE_HEAT.rear (the handbrake
 * works the rear alone). One hard stop warms them; stop after stop and they glow, steam in the rain and fade (the caliper
 * rules: glow past 0.45, fade past 0.6). Braking alone never takes a disc past BRAKE_HEAT.cap, short of the white heat that
 * sets a tyre alight; that takes a binding caliper. */
export const BRAKE_HEAT={rate:.015,front:1.3,rear:.7,cap:.82} as const;
const clamp01=(n:number)=>Number.isFinite(n)?Math.max(0,Math.min(1,n)):0;
/** A disc's heat after braking for dt seconds at this pedal and handbrake, speed (m/s) and end (front true). */
export function brakeWork(heat:number,pedal:number,handbrake:boolean,speed:number,front:boolean,dt:number){
  const h=clamp01(heat);if(!(dt>0)||h>=BRAKE_HEAT.cap)return h;
  const press=front?clamp01(pedal)*BRAKE_HEAT.front:Math.max(clamp01(pedal),handbrake?1:0)*BRAKE_HEAT.rear;
  return Math.min(BRAKE_HEAT.cap,h+press*Math.abs(Number.isFinite(speed)?speed:0)*BRAKE_HEAT.rate*dt);
}
