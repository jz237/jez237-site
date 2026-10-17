import type {RaceCourse} from './race-course';
const curvedArcs=new WeakMap<RaceCourse,Map<number,boolean>>();
/** Follow only the current ordered arc, never a nearer branch at a crossing.
 * Gate acceptance can advance before the gate center, so retain a short tail. */
export function circuitSteeringTarget(course:RaceCourse,next:number,reverse:boolean,position:{x:number;z:number},speed:number){
 const count=course.checkpoints.length,sign=reverse?-1:1,end=next/count,start=(next-1)/count-(course.checkpointRadius??12)/course.length;
 // Long direct targets remain useful on straights. Use arc guidance only where
 // the chord consumes too much of the road's lateral clearance.
 let arcs=curvedArcs.get(course);if(!arcs){arcs=new Map();curvedArcs.set(course,arcs);}
 const key=next+(reverse?count:0);let curved=arcs.get(key);
 if(curved===undefined){
  const a=course.point((next-1)/count*sign),b=course.point(end*sign);
  curved=[.25,.5,.75].some(t=>course.distance(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t)>course.halfWidth*.5);arcs.set(key,curved);
 }
 if(!curved)return course.point(end*sign);
 const steps=Math.max(4,Math.ceil((end-start)*course.length/3));
 let best=Infinity,progress=start,previous=course.point(start*sign);
 for(let i=1;i<=steps;i++){
  const t=start+(end-start)*i/steps,p=course.point(t*sign),dx=p.x-previous.x,dz=p.z-previous.z,lengthSq=dx*dx+dz*dz;
  const blend=lengthSq?Math.max(0,Math.min(1,((position.x-previous.x)*dx+(position.z-previous.z)*dz)/lengthSq)):0;
  const distance=(position.x-previous.x-dx*blend)**2+(position.z-previous.z-dz*blend)**2;
  if(distance<best){best=distance;progress=start+(end-start)*(i-1+blend)/steps;}previous=p;
 }
 const look=Math.max(6,Math.min(18,6+Math.abs(speed)*.5));
 return course.point(Math.min(end,progress+look/course.length)*sign);
}
