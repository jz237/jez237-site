import {DEFINITIONS,type CarKind} from './rules';
import type {RoutePoint} from './event-rules';

type RecoveryCar={kind:CarKind;current:{x:number;z:number};speed:number;health:number;finished:boolean;passed:number;nextCheckpoint:number};
export type RecoverySlot=RoutePoint&{yaw:number};

/** A last resort after ordinary reverse escapes fail. Object keys prevent a
 * restarted event inheriting the previous field's timers or vehicle IDs. */
export class RaceRecovery {
 private progress=new WeakMap<RecoveryCar,{passed:number;next:number;seconds:number;retry:number}>();
 clear(car:RecoveryCar){this.progress.delete(car);}
 ready(car:RecoveryCar,dt:number,attempts:number):boolean{
  if(car.finished||car.health<=0){this.clear(car);return false;}
  let state=this.progress.get(car);
  if(!state||state.passed!==car.passed||state.next!==car.nextCheckpoint){
   state={passed:car.passed,next:car.nextCheckpoint,seconds:0,retry:0};this.progress.set(car,state);
  }
  if(!Number.isFinite(dt)||dt<=0)return false;
  state.seconds+=Math.min(dt,.1);state.retry=Math.max(0,state.retry-dt);
  if(state.seconds<30||state.retry>0||!Number.isFinite(car.speed)||Math.abs(car.speed)>3||attempts<4)return false;
  state.retry=1;return true;
 }
}

/** Search behind the last passed gate; never award progress or choose the
 * nearest branch of a crossing. Wrecks and finishers still occupy space. */
export function freeRecoverySlot(car:RecoveryCar,cars:readonly RecoveryCar[],route:readonly RoutePoint[],course:{halfWidth:number;distance(x:number,z:number):number},blocked:(slot:RecoverySlot)=>boolean):RecoverySlot|undefined{
 const n=route.length,next=car.nextCheckpoint;
 if(n<2||!Number.isInteger(next)||next<0||next>=n)return;
 const p=route[(next+n-1)%n],q=route[next],yaw=Math.atan2(q.x-p.x,q.z-p.z),sin=Math.sin(yaw),cos=Math.cos(yaw);
 const radius=(c:RecoveryCar)=>Math.hypot(DEFINITIONS[c.kind].halfLength,DEFINITIONS[c.kind].halfWidth);
 const ownRadius=radius(car);
 for(const back of [0,7,14])for(const lane of [0,-4,4]){
  const slot={x:p.x-sin*back+cos*lane,z:p.z-cos*back-sin*lane,yaw};
  if(course.distance(slot.x,slot.z)>course.halfWidth-ownRadius-.5)continue;
  if(cars.some(other=>other!==car&&Math.hypot(slot.x-other.current.x,slot.z-other.current.z)<ownRadius+radius(other)+.75))continue;
  if(!blocked(slot))return slot;
 }
}
