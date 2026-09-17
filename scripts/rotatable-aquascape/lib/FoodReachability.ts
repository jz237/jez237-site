import * as T from 'three';

/** Short-lived perception, separate from the exact collision checks during motion.
 * Bound expensive approach queries; never run a scene-wide search each frame. */
export class FoodReachability {
 private next=0;private cache=new Map<number,{until:number;from:T.Vector3;to:T.Vector3;clear:boolean}>();
 test(id:number,time:number,from:T.Vector3,to:T.Vector3,check:()=>boolean){
  const entry=this.cache.get(id);
  if(entry&&time<entry.until&&entry.from.distanceToSquared(from)<.16&&entry.to.distanceToSquared(to)<.0225)return entry.clear;
  if(time<this.next)return false;
  this.next=time+.16;
  const clear=check();if(this.cache.size>=32)this.cache.delete(this.cache.keys().next().value!);
  this.cache.set(id,{until:time+.8,from:from.clone(),to:to.clone(),clear});return clear;
 }
}

/** Check room to turn and a body-sized approach, ending with food at the mouth.
 * Blocked approaches are declined; existing swept motion remains authoritative. */
export function foodApproach(from:T.Vector3,food:T.Vector3,yaw:number,pitch:number,mouth:number,clear:(p:T.Vector3,yaw:number,pitch:number)=>boolean,floor?:(x:number,z:number)=>number,mouthY=0){
 const delta=food.clone().sub(from),heading=Math.atan2(-delta.z,delta.x),tilt=floor?0:T.MathUtils.clamp(Math.atan2(delta.y,Math.hypot(delta.x,delta.z)),-.26,.26);
 const forward=new T.Vector3(Math.cos(heading)*Math.cos(tilt),Math.sin(tilt),-Math.sin(heading)*Math.cos(tilt)),end=food.clone().addScaledVector(forward,-mouth);
 end.addScaledVector(new T.Vector3(-Math.cos(heading)*Math.sin(tilt),Math.cos(tilt),Math.sin(heading)*Math.sin(tilt)),-mouthY);
 if(floor)end.y=floor(end.x,end.z);
 const angle=Math.atan2(Math.sin(heading-yaw),Math.cos(heading-yaw)),turns=Math.max(1,Math.ceil(Math.abs(angle)/.16));
 for(let i=1;i<=turns;i++)if(!clear(from,yaw+angle*i/turns,pitch+(tilt-pitch)*i/turns))return false;
 const steps=Math.max(1,Math.ceil(from.distanceTo(end)/.10)),p=new T.Vector3();
 if(steps>100)return false;
 for(let i=1;i<=steps;i++){p.copy(from).lerp(end,i/steps);if(floor)p.y=Math.max(p.y,floor(p.x,p.z));if(!clear(p,heading,tilt))return false;}
 return true;
}
