import {DEFINITIONS,type CarKind} from './rules';
import {courseGridSlot,type RaceCourse} from './race-course';
import type {RecoverySlot} from './race-recovery';

type PracticeCar={kind:CarKind;current:{x:number;y:number;z:number};forward:{x:number;z:number}};
/** Spread practice traffic along the starting straight; Quarry retains its original spawns. */
export function freeDriveSpawn(course:RaceCourse,index:number){
 return courseGridSlot(course,index*4,'forward');
}
/** Free drive has no race progress to preserve. Keep a clear usable position,
 * otherwise find the closest clear road position instead of repeating an out-of-bounds reset. */
export function freeDriveRecovery(course:RaceCourse,car:PracticeCar,cars:readonly PracticeCar[],blocked:(slot:RecoverySlot)=>boolean):RecoverySlot|undefined{
 const radius=(c:PracticeCar)=>Math.hypot(DEFINITIONS[c.kind].halfLength,DEFINITIONS[c.kind].halfWidth)+.4;
 const usable=(p:RecoverySlot)=>Number.isFinite(p.x)&&Number.isFinite(p.z)&&Number.isFinite(p.yaw)&&
  !course.outside(p.x,course.height(p.x,p.z)+.9,p.z)&&
  (course.waypointStations||course.distance(p.x,p.z)<course.halfWidth-radius(car))&&
  !cars.some(other=>other!==car&&Math.hypot(other.current.x-p.x,other.current.z-p.z)<radius(car)+radius(other))&&!blocked(p);
 const here={x:car.current.x,z:car.current.z,yaw:Math.atan2(car.forward.x,car.forward.z)};
 if(!course.outside(car.current.x,car.current.y,car.current.z)&&usable(here))return here;
 const candidates=course.samples.map((p,i)=>{
  const q=course.samples[(i+1)%course.samples.length];
  return{x:p.x,z:p.z,yaw:Math.atan2(q.x-p.x,q.z-p.z)};
 }).sort((a,b)=>Math.hypot(a.x-car.current.x,a.z-car.current.z)-Math.hypot(b.x-car.current.x,b.z-car.current.z));
 return candidates.find(usable);
}
