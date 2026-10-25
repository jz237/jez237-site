/** Tyre heat (offline): each tyre has a temperature, 0 cold to 1 overcooked. It starts the event at TYRE_HEAT.start, warms
 * with rolling (TYRE_HEAT.roll a second per m/s) and faster when it slides or spins (TYRE_HEAT.slip a second at
 * TYRE_HEAT.slipFull m/s of slip), and
 * cools toward the air (TYRE_HEAT.air, TYRE_HEAT.wetAir in the rain) at TYRE_HEAT.cool of the difference a second. Between
 * TYRE_HEAT.ideal it grips fully; colder it loses up to TYRE_HEAT.cold of its grip (a cold start), hotter up to TYRE_HEAT.hot
 * (slid until overcooked). Rolling at 15 m/s it settles in its window in about twenty seconds. */
export const TYRE_HEAT={start:.3,air:.3,wetAir:.18,roll:.0009,slip:.035,slipFull:10,cool:.05,ideal:[.45,.78],cold:.05,hot:.09} as const;
const clamp01=(n:number)=>Number.isFinite(n)?Math.max(0,Math.min(1,n)):0;
/** A tyre's temperature after dt seconds at this speed and slip (both m/s), wet or dry. */
export function tyreHeatStep(temp:number,speed:number,slip:number,wet:boolean,dt:number){
  const t=Number.isFinite(temp)?clamp01(temp):TYRE_HEAT.start;if(!(dt>0))return t;
  const v=Math.abs(Number.isFinite(speed)?speed:0),s=clamp01(Math.abs(Number.isFinite(slip)?slip:0)/TYRE_HEAT.slipFull),air=wet?TYRE_HEAT.wetAir:TYRE_HEAT.air;
  return clamp01(t+(v*TYRE_HEAT.roll+s*TYRE_HEAT.slip-TYRE_HEAT.cool*(t-air))*dt);
}
/** The share of its grip a tyre at this temperature has. */
export function tyreHeatGrip(temp:number){
  const t=Number.isFinite(temp)?clamp01(temp):TYRE_HEAT.start,[lo,hi]=TYRE_HEAT.ideal;
  if(t<lo)return 1-TYRE_HEAT.cold*(lo-t)/lo;
  if(t>hi)return 1-TYRE_HEAT.hot*Math.min(1,(t-hi)/(1-hi));
  return 1;
}
