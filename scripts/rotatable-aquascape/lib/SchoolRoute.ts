import type {FishPoint} from './FishBrain.ts';
export type SchoolRoute={direction:1|-1;time:number};
export const createSchoolRoute=():SchoolRoute=>({direction:1,time:0});
/** Travel to the far side before committing the school to a return pass. */
export function advanceSchoolRoute(route:SchoolRoute,dt:number,fish:FishPoint[]){
 if(dt>0){route.time+=dt;const center=fish.reduce((v,f)=>v+f.x,0)/Math.max(1,fish.length);if(center>1120)route.direction=-1;else if(center<750)route.direction=1;}
 return {id:-3,x:route.direction===1?1220:650,y:365+65*Math.sin(route.time*.03),z:.5+.25*Math.sin(route.time*.04),vx:route.direction*17};
}
export function schoolLane(goal:FishPoint,id:number):FishPoint{return {...goal,y:goal.y+Math.sin(id*2.4)*45,z:Math.max(.2,Math.min(.8,(goal.z??.5)+Math.cos(id*2.4)*.14))};}

/** Loose shoaling alternates with shared travel; three subgroups wander on different clocks. */
export function schoolActivity(route:SchoolRoute,goal:FishPoint,id:number){
 const phase=route.time%48,loose=phase>17&&phase<37,group=id%3;
 if(!loose)return {goal:schoolLane(goal,id),affinity:.82};
 const t=route.time,heading=Math.sin(t*.12+group*2.1);
 return {goal:{id:-10-group,x:940+230*heading,y:360+85*Math.sin(t*.09+group*2),
 z:.5+.66*Math.sin(t*.13+group*2.1),vx:28*Math.cos(t*.12+group*2.1)},affinity:.48};
}
