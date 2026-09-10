import type {FishPoint} from './FishBrain.ts';
export type SchoolRoute={direction:1|-1;time:number};
export const createSchoolRoute=():SchoolRoute=>({direction:1,time:0});
/** Travel to the far side before committing the school to a return pass. */
export function advanceSchoolRoute(route:SchoolRoute,dt:number,fish:FishPoint[]){
 if(dt>0){route.time+=dt;const center=fish.reduce((v,f)=>v+f.x,0)/Math.max(1,fish.length);if(center>1120)route.direction=-1;else if(center<750)route.direction=1;}
 return {id:-3,x:route.direction===1?1220:650,y:365+65*Math.sin(route.time*.03),z:.5+.25*Math.sin(route.time*.04),vx:route.direction*17};
}
export function schoolLane(goal:FishPoint,id:number):FishPoint{return {...goal,y:goal.y+Math.sin(id*2.4)*45,z:Math.max(.2,Math.min(.8,(goal.z??.5)+Math.cos(id*2.4)*.14))};}
