import {createCountyCourse} from './county-course';
/** A broad grid straight leads into the park's winding infield and western sweep. */
export const KINGSWELL=createCountyCourse({
 id:'kingswell-park-v1',name:'Kingswell Park Circuit',startZ:-118,
 controls:[[-120,-118],[0,-118],[120,-118],[170,-70],[158,15],[110,104],[45,118],[15,66],[-32,38],[-72,106],[-139,112],[-174,45],[-160,-40]],
 height:()=>0,asphalt:()=>true,
});
/** Flat paddock approaches blend into two broad dunes, with no blind launch ramps. */
export function copperfieldHeight(x:number,z:number){
 const t=Math.max(0,Math.min(1,(z+80)/90)),blend=t*t*(3-2*t);
 return blend*(1+5*Math.exp(-(((x-100)/85)**2+((z-20)/100)**2))+7*Math.exp(-(((x+105)/90)**2+((z-80)/85)**2)));
}
export const COPPERFIELD=createCountyCourse({
 id:'copperfield-dunes-v1',name:'Copperfield Dunes Rally',startZ:-120,
 controls:[[-120,-120],[0,-120],[120,-120],[169,-69],[132,-7],[163,58],[113,122],[30,117],[-35,72],[-118,119],[-169,62],[-142,-5],[-167,-66]],
 height:copperfieldHeight,asphalt:()=>false,
});
export const PARK_DUNES_COURSES=[KINGSWELL,COPPERFIELD] as const;
