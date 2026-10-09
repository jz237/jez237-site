import {createCountyCourse} from './county-course';
const smooth=(value:number)=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
/** Broad gravel crests in the canyon; the full starting straight remains flat. */
export function sableAuthoredHeight(x:number,z:number){
 const north=smooth((z+65)/65);
 const ridge=(center:number,width:number,height:number)=>height*Math.max(0,1-Math.abs(x-center)/width);
 return north*(2+ridge(-110,58,4)+ridge(95,62,5));
}
export const SABLE=createCountyCourse({
 id:'sable-canyon-v1',name:'Sable Canyon Rallycross',startZ:-118,
 controls:[[-120,-118],[0,-118],[120,-118],[174,-74],[163,-13],[122,19],[112,70],[74,114],[18,136],[-62,109],[-110,74],[-157,42],[-178,-14],[-163,-78]],
 height:sableAuthoredHeight,asphalt:(_x,z)=>z< -65,
});
