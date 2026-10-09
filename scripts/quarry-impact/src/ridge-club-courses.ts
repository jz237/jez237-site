import {createCountyCourse} from './county-course';
const smooth=(value:number)=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
/** Club asphalt with an offset eastern bend and a tightening northern return. */
export const WESTMERE=createCountyCourse({
 id:'westmere-club-v1',name:'Westmere Club Circuit',startZ:-118,
 controls:[[-125,-118],[0,-118],[125,-118],[174,-70],[146,-10],[94,20],[115,85],[70,130],[0,125],[-45,65],[-112,65],[-166,25],[-176,-45]],
 height:()=>0,asphalt:()=>true,
});
/** Smooth paired crests beyond the paved paddock; the full grid stays level. */
export function harrowstoneHeight(x:number,z:number){
 const crest=(center:number,width:number)=>{const t=Math.min(1,Math.abs(x-center)/width);return (1+Math.cos(t*Math.PI))/2;};
 return smooth((z+75)/95)*(1.5+5*crest(-108,83)+4*crest(100,90));
}
export const HARROWSTONE=createCountyCourse({
 id:'harrowstone-ridge-v1',name:'Harrowstone Ridge',startZ:-118,
 controls:[[-125,-118],[0,-118],[125,-118],[172,-68],[174,20],[150,103],[77,132],[16,93],[-40,125],[-117,112],[-174,61],[-150,0],[-168,-65]],
 height:harrowstoneHeight,asphalt:(_x,z)=>z< -45,
});
export const RIDGE_CLUB_COURSES=[WESTMERE,HARROWSTONE] as const;
