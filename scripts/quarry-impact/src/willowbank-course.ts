import {createCountyCourse} from './county-course';
const smooth=(value:number)=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
/** A flat paddock straight climbs onto a low heathland ridge through broad bends. */
export function willowbankAuthoredHeight(x:number,z:number){
 return smooth((z+70)/100)*(2.5+1.5*Math.sin((x+50)*Math.PI/260));
}
export const WILLOWBANK=createCountyCourse({
 id:'willowbank-heath-v1',name:'Willowbank Heath Circuit',startZ:-118,
 controls:[[-125,-118],[0,-118],[125,-118],[176,-67],[156,0],[103,48],[110,104],[51,134],[-12,107],[-79,125],[-151,88],[-163,20],[-133,-30],[-169,-77]],
 height:willowbankAuthoredHeight,asphalt:()=>false,
});
