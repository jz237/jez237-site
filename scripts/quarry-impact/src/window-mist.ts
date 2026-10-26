/** Misted windows (offline rain): a car standing still in the rain (slower than MIST.still m/s) or wrecked mists up inside —
 * its glass going milky toward MIST.max, MIST.build of the way a second — and clears once it gets going again
 * (MIST.clear of it a second; half that out of the rain). Smashed-out windows never mist. */
export const MIST={max:.65,build:.035,clear:.16,still:1.5} as const;
/** The mist on a car's windows after dt seconds. */
export function mistStep(level:number,dt:number,raining:boolean,still:boolean){
  const l=Number.isFinite(level)?Math.max(0,Math.min(MIST.max,level)):0,t=Number.isFinite(dt)?Math.max(0,Math.min(1,dt)):0;
  if(raining&&still)return l+(MIST.max-l)*(1-Math.exp(-MIST.build*t));
  return l*Math.exp(-MIST.clear*(raining?1:.5)*t);
}
