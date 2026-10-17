import type {TransmissionVehicle} from '../transmission';
export type AutoGearState={gear:number;delay:number;cooldown:number;pending:number|null};
export const freshAutoGear=():AutoGearState=>({gear:1,delay:0,cooldown:0,pending:null});
const ratios=[12,8.04,5.88,4.56,3.72];
/** Road-speed hysteresis prevents stationary wheelspin from running up through
 * the gearbox. Direction changes require a nearly stopped chassis. */
export function stepAutoGear(s:AutoGearState,speed:number,engineRPM:number,radius:number,throttle:number,dt:number,ratioScale=1){
 s.cooldown=Math.max(0,s.cooldown-dt);
 if(s.pending!==null){s.delay=Math.max(0,s.delay-dt);if(s.delay===0){s.gear=s.pending;s.pending=null;s.cooldown=.65;}}
 const desired=throttle<-.05?-1:throttle>.05?1:0;
 if(desired&&Math.abs(speed)<.6&&Math.sign(s.gear)!==desired){s.gear=desired;s.pending=null;s.delay=0;s.cooldown=.65;}
 if(s.gear>0&&s.pending===null&&s.cooldown===0){
  const rpm=Math.abs(speed)/radius*ratios[s.gear-1]*ratioScale*60/(2*Math.PI);
  let next=s.gear;
  if(rpm>5200&&engineRPM>5000&&s.gear<5)next++;
  else if(rpm<2100&&s.gear>1)next--;
  if(next!==s.gear){s.pending=next;s.delay=.18;}
 }
 const allowThrottle=desired===0||Math.sign(s.gear)===desired;
 return{ratio:(s.gear<0?-12:ratios[s.gear-1])*ratioScale,clutch:s.pending===null&&allowThrottle?1:0,allowThrottle};
}

/** Use the established input/shift state machine; map its N/R convention to
 * actual signed ratios and disconnect the clutch during shifts or grinding. */
export function manualDriveGear(car:TransmissionVehicle,ratioScale=1){
 const input=car.input.transmission,t=car.transmission;
 const ratio=(car.gear===-1?0:car.gear===0?-12:ratios[car.gear-1])*ratioScale;
 const interrupted=car.gear===-1||t?.pending!=null||(t?.grind??0)>.15;
 return{ratio,clutch:interrupted?0:input?.mode==='clutch'?1-input.clutch:1,allowThrottle:ratio===0||car.speed*Math.sign(ratio)>=-1.5};
}
