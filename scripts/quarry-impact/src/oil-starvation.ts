/** Oil starvation (offline events only): an oil leak drains the sump; below OIL.low the bearings knock and the engine
 * wears fast under load; run it dry with the engine nearly finished and it seizes for good. */
const clamp01=(v:number)=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
export const OIL={drain:.012,low:.25,wear:.03,seize:.97,empty:.02,jolt:.35,knockRate:10} as const;
export const drainOil=(level:number,leak:number,dt:number)=>dt>0?Math.max(0,clamp01(level)-clamp01(leak)*OIL.drain*dt):clamp01(level);
/** Extra engine damage this step from running short of oil, more under throttle. */
export function starvationWear(level:number,throttle:number,dt:number){
  const l=clamp01(level);if(l>=OIL.low||!(dt>0))return 0;
  return (OIL.low-l)/OIL.low*OIL.wear*(.4+.6*clamp01(Math.abs(throttle)))*dt;
}
export const seizes=(level:number,engineDamage:number)=>clamp01(level)<=OIL.empty&&engineDamage>=OIL.seize;
/** Bearing knocks per second: with the revs, louder the drier, silent with oil in it. */
export function knockRate(level:number,rpm:number){const l=clamp01(level);return l>=OIL.low||!(rpm>300)?0:Math.min(OIL.knockRate,rpm/120)*(OIL.low-l)/OIL.low;}
export const oilWarning=(level:number,seized:boolean)=>seized?'ENGINE SEIZED':clamp01(level)<OIL.low?'OIL PRESSURE LOW':'';
/** Coolant: a leaking radiator drains it too; below COOLANT.low the engine overheats and wears fast under load. */
export const COOLANT={drain:.015,low:.3,wear:.02} as const;
export const drainCoolant=(level:number,leak:number,dt:number)=>dt>0?Math.max(0,clamp01(level)-clamp01(leak)*COOLANT.drain*dt):clamp01(level);
export function overheatWear(level:number,throttle:number,dt:number){
  const l=clamp01(level);if(l>=COOLANT.low||!(dt>0))return 0;
  return (COOLANT.low-l)/COOLANT.low*COOLANT.wear*(.3+.7*clamp01(Math.abs(throttle)))*dt;
}
export const coolantWarning=(level:number)=>clamp01(level)<COOLANT.low?'ENGINE OVERHEATING':'';
