import {createCountyCourse} from './county-course';
const smooth=(value:number)=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
export const ELMSWORTH_BANK_ANGLE=16*Math.PI/180;
/** The flat 170 m grid straight eases into a banked outer racing surface.
 * Height rises outwards through each turn, then levels beyond the safety wall. */
export function elmsworthAuthoredHeight(x:number,z:number){
 const radial=Math.hypot(Math.max(0,Math.abs(x)-110),z);
 return Math.max(0,Math.min(36,radial-48))*Math.tan(ELMSWORTH_BANK_ANGLE)*smooth((Math.abs(x)-85)/40);
}
export const ELMSWORTH=createCountyCourse({
 id:'elmsworth-speedway-v1',name:'Elmsworth Speedway',startZ:-65,
 controls:[[-110,-65],[0,-65],[110,-65],[156,-46],[175,0],[156,46],[110,65],[0,65],[-110,65],[-156,46],[-175,0],[-156,-46]],
 height:elmsworthAuthoredHeight,asphalt:()=>true,
});
