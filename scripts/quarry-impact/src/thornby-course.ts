import {createCountyCourse} from './county-course';
const smooth=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
/** Flat paddock and start straight; the back of the circuit climbs about 12 m to a
 * rolling hilltop straight, then drops back down the western side. */
export function thornbyHeight(x:number,z:number){
 return smooth((z+70)/200)*12.5*(1-.3*smooth((x+60)/140))+1.6*Math.sin(x/26)*smooth((z-95)/35);
}
export const THORNBY=createCountyCourse({
 id:'thornby-hill-v1',name:'Thornby Hill',startZ:-118,
 controls:[[-125,-118],[0,-118],[125,-118],[178,-70],[186,0],[160,58],[170,112],[120,145],[52,124],[-5,140],[-65,122],[-118,88],[-158,30],[-180,-42]],
 height:thornbyHeight,asphalt:()=>true,
});
