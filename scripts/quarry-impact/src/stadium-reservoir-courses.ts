import {createCountyCourse} from './county-course';
/** A fast paved stadium ring: long grid straight, broad ends, and a tighter north arc. */
export const HOLLOWAY=createCountyCourse({
 id:'holloway-stadium-v1',name:'Holloway Stadium Circuit',startZ:-100,
 controls:[[-115,-100],[0,-100],[115,-100],[158,-70],[158,0],[110,50],[0,70],[-110,50],[-158,0],[-158,-70]],
 height:()=>0,asphalt:()=>true,
});
/** Smooth dam-road climb and descent, with the complete starting grid on level ground. */
export function bramblebrookHeight(x:number,z:number){
 const t=Math.max(0,Math.min(1,(z+75)/125)),blend=t*t*(3-2*t);
 return blend*(1.3+6.4*Math.exp(-(((x+90)/105)**2)));
}
export const BRAMBLEBROOK=createCountyCourse({
 id:'bramblebrook-reservoir-v1',name:'Bramblebrook Reservoir Rally',startZ:-118,
 controls:[[-125,-118],[0,-118],[125,-118],[171,-70],[141,-5],[170,66],[135,123],[60,129],[0,70],[-62,117],[-135,119],[-174,65],[-160,-7],[-125,-60]],
 height:bramblebrookHeight,asphalt:(_x,z)=>z< -35,
});
export const STADIUM_RESERVOIR_COURSES=[HOLLOWAY,BRAMBLEBROOK] as const;
