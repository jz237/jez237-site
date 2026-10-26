/** Slipstream (offline): a car tucked in behind another at speed meets less air — between DRAFT.near and DRAFT.far m behind it,
 * within DRAFT.lateral m of its line, going its way (headings within DRAFT.heading), both faster than DRAFT.speed m/s — and is
 * towed along by the drag it is spared: up to DRAFT.accel m/s² at DRAFT.ref m/s (rising with the square of the speed), strongest
 * close in and dead behind (tuned to the game's racing speeds, where the real effect would be lost). There is no air drag in
 * the car physics, so the saving is given as a push. */
export const DRAFT={near:2,far:14,lateral:1.6,heading:.9,speed:10,accel:.45,ref:20,toast:6} as const;
type V={x:number;z:number};
/** How much of a tow (0–1) a car at `c` heading `f` gets from one at `l` heading `lf`, at these speeds (m/s). */
export function draftFactor(c:V,f:V,speed:number,l:V,lf:V,leadSpeed:number){
  if(!(Math.abs(speed)>DRAFT.speed)||!(Math.abs(leadSpeed)>DRAFT.speed)||!(f.x*lf.x+f.z*lf.z>DRAFT.heading))return 0;
  const dx=l.x-c.x,dz=l.z-c.z,along=dx*f.x+dz*f.z,lateral=Math.abs(dx*f.z-dz*f.x);
  if(!(along>=DRAFT.near&&along<=DRAFT.far)||!(lateral<DRAFT.lateral))return 0;
  return (1-(along-DRAFT.near)/(DRAFT.far-DRAFT.near))*(1-lateral/DRAFT.lateral);
}
/** The push (m/s²) a tow this strong gives at this speed. */
export const draftAccel=(factor:number,speed:number)=>Number.isFinite(factor)&&Number.isFinite(speed)?DRAFT.accel*Math.max(0,Math.min(1,factor))*(speed/DRAFT.ref)**2:0;
