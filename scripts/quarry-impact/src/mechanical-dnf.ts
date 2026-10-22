/** A car that can no longer drive itself is out (offline events): a seized engine, an empty tank, a flat battery, or no drive left to any
 * wheel (broken diff, snapped shafts, wheels gone). After DNF.after seconds dead it is eliminated like a wreck, so a dead
 * car cannot hold up "last car standing". */
export const DNF={after:8} as const;
export type DnfCar={health:number;seized?:boolean;batteryFlat?:boolean;fuelLevel?:number;driveBias?:ArrayLike<number>;wheelLost?:ArrayLike<number>;driven:readonly number[]};
export function deadReason(c:DnfCar){
  if(!(c.health>0))return'';
  if(c.seized)return'ENGINE SEIZED';
  if((c.fuelLevel??1)<=.005)return'OUT OF FUEL';
  if(c.batteryFlat)return'BATTERY FLAT';
  if(c.driven.length&&c.driven.every(i=>(c.driveBias?.[i]??1)<=0||(c.wheelLost?.[i]??0)>0))return'NO DRIVE';
  return'';
}
/** Seconds dead after this step: counts while dead, resets once the car can drive again. */
export const deadTime=(time:number,dead:boolean,dt:number)=>dead&&dt>0?Math.max(0,Number.isFinite(time)?time:0)+dt:0;
