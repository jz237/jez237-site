import {createCountyCourse} from './county-course';
/** Two distinct at-grade intersections, with a start on the central north arc.
 * Ordered checkpoints distinguish the approaches when cars meet at a crossing. */
export const ALDERWICK_CROSS=createCountyCourse({
 id:'alderwick-cross-v1',name:'Alderwick Double Cross',startZ:55,openCrossings:true,
 controls:[[-125,-90],[-30,45],[0,55],[30,45],[125,-90],[170,-75],[190,0],[170,75],[125,90],[30,-45],[0,-55],[-30,-45],[-125,90],[-170,75],[-190,0],[-170,-75]],
 height:()=>0,asphalt:()=>true,
});
