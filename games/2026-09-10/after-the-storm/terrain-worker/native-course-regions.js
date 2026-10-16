// Reconstructed numeric course-out tables selected by the ordinary initializer.
// These are the allowed1f80 and warning-suppression1f88 families. They are NOT
// the coarse1f84 progress regions and are not polygons through boundary buoys.
const allowed={
 1:[[-7000,-6900,-1300,4000],[-6900,-6800,-1500,4000],[-6800,-6700,-1600,4000],
  [-6700,-6600,-1700,4000],[-6600,-6400,-1800,4000],[-6400,-6200,-1900,4000],[-6200,8500,-2000,4000]],
 2:[[1100,1600,1400,2200],[-4000,1100,-2800,5500],[-4000,-100,-5907,-2800],
  [1100,4300,2200,5500],[1600,1800,1600,2200],[-100,400,-5100,-2800],
  [400,900,-4000,-2800],[1100,1300,900,1200],[1100,1400,1200,1400],
  [2100,2900,2000,2200],[1800,2100,1800,2200]]
};
export function nativeRaceCourseRegions(courseIndex){
 if(!Number.isInteger(courseIndex)||!Object.hasOwn(allowed,courseIndex))throw new RangeError('No verified ordinary region layout for this course');
 return Object.freeze({courseIndex,
  allowedRegionsNative:Object.freeze(allowed[courseIndex].map(r=>Object.freeze(r.slice()))),
  warningSuppressionRegionsNative:Object.freeze([])});
}
