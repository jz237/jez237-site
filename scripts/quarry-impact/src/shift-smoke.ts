/** Shift smoke (offline): an engine pulling hard runs rich for a moment as it changes up — floor it through the gears and
 * each upshift (with the pedal past SHIFT_SMOKE.throttle) coughs a puff of dark smoke from the tailpipe: SHIFT_SMOKE.puffs
 * particles, SHIFT_SMOKE.classic from an old carburettor car, SHIFT_SMOKE.worn more from an engine damaged past
 * SHIFT_SMOKE.damage. None changing down, lifting off, or with the tailpipe torn off. */
export const SHIFT_SMOKE={throttle:.6,puffs:6,classic:10,worn:4,damage:.5,size:.5,puff:[.9,1.6],life:[.9,1.6],back:1.5,tint:0x2e2c29} as const;
/** Smoke particles for a gear change from `before` to `now` at this pedal, from this engine. */
export function shiftPuffs(before:number,now:number,throttle:number,classic:boolean,damage:number){
  if(!Number.isFinite(before)||!Number.isFinite(now)||before<1||now<=before)return 0;
  if(!Number.isFinite(throttle)||throttle<SHIFT_SMOKE.throttle)return 0;
  return (classic?SHIFT_SMOKE.classic:SHIFT_SMOKE.puffs)+(Number.isFinite(damage)&&damage>SHIFT_SMOKE.damage?SHIFT_SMOKE.worn:0);
}
