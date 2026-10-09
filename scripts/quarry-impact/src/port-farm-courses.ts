import {createCountyCourse} from './county-course';
/** Container-terminal tarmac feeds a gravel dock perimeter and broad return esses. */
export const SALTMARSH=createCountyCourse({
 id:'saltmarsh-port-v1',name:'Saltmarsh Port Rallycross',startZ:-118,
 controls:[[-125,-118],[0,-118],[125,-118],[170,-76],[166,-5],[111,28],[151,91],[85,128],[5,96],[-65,124],[-160,90],[-172,12],[-132,-44]],
 height:()=>0,asphalt:(_x,z)=>z< -25,
});
/** Two broad rolling field crests beyond a level start/finish and full-size grid. */
export function dunmereHeight(x:number,z:number){
 const t=Math.max(0,Math.min(1,(z+80)/105)),blend=t*t*(3-2*t);
 return blend*(1.1+4.2*Math.exp(-(((x+95)/80)**2))+2.5*Math.exp(-(((x-120)/65)**2)));
}
export const DUNMERE=createCountyCourse({
 id:'dunmere-farm-v1',name:'Dunmere Farm Circuit',startZ:-118,
 controls:[[-125,-118],[0,-118],[125,-118],[172,-57],[143,5],[169,73],[102,124],[31,73],[-45,129],[-127,104],[-172,40],[-132,-26],[-167,-75]],
 height:dunmereHeight,asphalt:()=>false,
});
export const PORT_FARM_COURSES=[SALTMARSH,DUNMERE] as const;
