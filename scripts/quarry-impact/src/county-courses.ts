import {createCountyCourse} from './county-course';
const smooth=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
export const DOCKSIDE=createCountyCourse({
 id:'dockside-loop-v1',name:'Dockside Loop',startZ:-100,
 controls:[[-125,-100],[0,-100],[125,-100],[160,-65],[165,0],[125,50],[90,105],[10,120],[-65,80],[-150,100],[-175,35],[-160,-45]],
 height:()=>0,asphalt:()=>true,
});
export const FAIRGROUND=createCountyCourse({
 id:'fairground-scramble-v1',name:'Fairground Scramble',startZ:-75,
 controls:[[-100,-75],[0,-75],[100,-75],[133,-28],[118,40],[65,88],[0,60],[-55,100],[-115,65],[-145,0]],
 // A flat, bidirectional start opens onto broad undulations in the northern dirt section.
 height:(x,z)=>(2.2+1.2*Math.sin(x*.04))*smooth((z+25)/65),asphalt:()=>false,
});
