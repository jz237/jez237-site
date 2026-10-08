import {createCountyCourse} from './county-course';
const smooth=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
/** Flat bidirectional starting straight; a rolling gravel return above the mill. */
export const MILLHAVEN=createCountyCourse({
 id:'millhaven-rally-v1',name:'Millhaven Rally Park',startZ:-105,
 controls:[[-120,-105],[0,-105],[120,-105],[168,-58],[155,15],[110,65],[45,85],[-10,45],[-65,105],[-137,88],[-166,20],[-157,-55]],
 height:(x,z)=>5*smooth((z+25)/95)*(.75+.25*Math.cos(x*.015)),
 asphalt:(_x,z)=>z<0,
});
