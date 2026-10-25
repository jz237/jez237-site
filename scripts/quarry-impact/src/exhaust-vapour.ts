/** Exhaust vapour (offline, cool damp air: rain or dusk). A running engine's exhaust condenses into white puffs at the
 * tailpipe: VAPOUR.cold puffs a second from a cold engine, fading to VAPOUR.warm as it heats up (see bonnetHeat), and
 * VAPOUR.throttle more on full throttle. None once the tailpipe is torn off. */
export const VAPOUR={cold:3,warm:.5,throttle:2,hot:.75} as const;
/** Vapour puffs a second from a running engine at this heat (0–1) and pedal (0–1). */
export function vapourRate(heat:number,throttle:number){
  const h=Number.isFinite(heat)?Math.max(0,Math.min(1,heat)):0,t=Number.isFinite(throttle)?Math.max(0,Math.min(1,Math.abs(throttle))):0;
  const cool=Math.max(0,1-h/VAPOUR.hot);
  return VAPOUR.warm+(VAPOUR.cold-VAPOUR.warm)*cool+VAPOUR.throttle*t*(.4+.6*cool);
}
