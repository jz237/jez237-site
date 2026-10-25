/** A burning car's cabin fills with smoke (offline): its glass murks up to max over fill seconds of fire, and once the fire is out
 * it clears over clear seconds down to a sooty residue (it never comes back clean). */
export const CABIN_SMOKE={fill:10,max:.85,residue:.5,clear:30} as const;
/** The cabin's smoke after dt seconds, from smoke now and whether the car is on fire. */
export function cabinSmoke(smoke:number,onFire:boolean,dt:number){
  const s=Math.max(0,Math.min(CABIN_SMOKE.max,Number.isFinite(smoke)?smoke:0));if(!(dt>0))return s;
  if(onFire)return Math.min(CABIN_SMOKE.max,s+dt*CABIN_SMOKE.max/CABIN_SMOKE.fill);
  return s>CABIN_SMOKE.residue?Math.max(CABIN_SMOKE.residue,s-dt*(CABIN_SMOKE.max-CABIN_SMOKE.residue)/CABIN_SMOKE.clear):s;
}
