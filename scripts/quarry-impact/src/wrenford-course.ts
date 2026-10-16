import {createCountyCourse} from './county-course';
/** Compact county-show oval: broad constant-grade bends, soft mud racing lane. */
const course=createCountyCourse({id:'wrenford-mud-v1',name:'Wrenford Mud Oval',startZ:-44,looseSurface:'mud',
 controls:[[-55,-44],[0,-44],[55,-44],[88,-30],[101,0],[88,30],[55,44],[0,44],[-55,44],[-88,30],[-101,0],[-88,-30]],
 height:()=>0,asphalt:()=>false});

export const WRENFORD={...course,mapExtent:145};
