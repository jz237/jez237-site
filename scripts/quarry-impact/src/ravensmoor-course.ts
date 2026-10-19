import {createCountyCourse} from './county-course';
const smooth=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
/** Rolling moorland: a tarmac start straight and southern loop, then gravel moor tracks over
 * low rises (to about 7 m), a tightening bend on the east side and a long sweeping descent to the west. */
export function ravensmoorHeight(x:number,z:number){
 return smooth((z+75)/150)*(5.5+2.6*Math.sin(x/45)+1.4*Math.cos(z/36));
}
export const RAVENSMOOR=createCountyCourse({
 id:'ravensmoor-rally-v1',name:'Ravensmoor Moor Rally',startZ:-118,
 controls:[[-125,-118],[0,-118],[125,-118],[170,-80],[175,-10],[145,35],[160,85],[110,130],[40,100],[-20,140],[-95,128],[-158,88],[-180,15],[-170,-60]],
 height:ravensmoorHeight,asphalt:(_x,z)=>z< -60,
});
