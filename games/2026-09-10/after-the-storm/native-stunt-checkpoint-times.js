// Original unsigned checkpoint bytes at800D9280, indexed by course then the
// retained checkpoint index. Startup uses index0; the next refill uses index1.
const seconds=Object.freeze([[15,15,15,15],[15,15,15,10],[15,15,10,10],[20,15,15,15],[15,15,15,15],[15,25,10,15],[20,15,15,15],[20,15,20,15],[20,20,20,20]].map(Object.freeze));
export function nativeStuntCheckpointSeconds(courseIndex){
 if(!Number.isInteger(courseIndex)||courseIndex<0||courseIndex>=seconds.length)throw new RangeError('Select one of the nine source Stunt courses');
 return seconds[courseIndex];
}
