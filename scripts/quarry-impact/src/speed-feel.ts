/** How speed reads from the chase camera: the view widens with road speed and kicks wider for a moment under hard
 * acceleration, and at speed the picture buzzes faintly with the road (scaled by the shake setting). Visual only. */
export const SPEED_FEEL={fovPer:.26,fovMax:9,kickPer:.8,kickMax:4,smooth:6,buzzFrom:16,buzzSpan:20,buzz:.0022} as const;
/** Chase-camera field of view (degrees) at this speed (m/s) and smoothed forward acceleration (m/s²). */
export function speedFov(base:number,speed:number,accel:number){
  const v=Math.abs(Number.isFinite(speed)?speed:0),a=Math.max(0,Number.isFinite(accel)?accel:0);
  return base+Math.min(SPEED_FEEL.fovMax,v*SPEED_FEEL.fovPer)+Math.min(SPEED_FEEL.kickMax,a*SPEED_FEEL.kickPer);
}
/** Smoothed forward acceleration after dt: follows the measured change in speed (forward or reverse, by magnitude). */
export function smoothAccel(prev:number,speed:number,lastSpeed:number,dt:number){
  if(!(dt>0)||!Number.isFinite(speed)||!Number.isFinite(lastSpeed))return Number.isFinite(prev)?prev:0;
  const raw=(Math.abs(speed)-Math.abs(lastSpeed))/dt,k=1-Math.exp(-dt*SPEED_FEEL.smooth),p=Number.isFinite(prev)?prev:0;
  return p+(raw-p)*k;
}
/** Road-buzz amplitude (radians) at this speed. */
export const roadBuzz=(speed:number)=>{const v=Math.abs(Number.isFinite(speed)?speed:0);return SPEED_FEEL.buzz*Math.min(1,Math.max(0,v-SPEED_FEEL.buzzFrom)/SPEED_FEEL.buzzSpan);};
