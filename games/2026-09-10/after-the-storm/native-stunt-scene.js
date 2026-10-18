import {createSourceTwilightCourse} from './source-twilight-course.js';
import {polygonDistance} from './classic-courses.js';
import {twilightAnchors,twilightPilotAnchors,twilightStuntNavigation} from './source-twilight-navigation.js';
import {samplePolyline} from './courses.js';

/** Source-aligned high-resolution scene for native Stunt. Course geometry and
 * decorative materials remain separate from the original physical owners.
 * Other modes keep their existing independently prepared course selections. */
export function nativeStuntScene(base){
 if(base.sourceWaterCourseIndex!==6)return base;
 const source=createSourceTwilightCourse(polygonDistance,{anchorsByClass:twilightAnchors,
  pilotAnchorsByClass:twilightPilotAnchors,stuntNavigation:twilightStuntNavigation});
 return {...source,id:base.id,sky:base.sky,water:base.water,storm:base.storm,
  sourceWaterCourseIndex:6,waterModelRevision:base.waterModelRevision,
  difficulty:base.difficulty,reverse:false,laps:1,
  // A distinct terrain identity prevents reuse of the old illustration-map mesh.
  layoutRevision:source.layoutRevision+100,nativeSceneCourseIndex:6,
  route:samplePolyline(source.stuntLayout.anchors,384),
  rocks:[],ramps:[],closedAreas:[],requiredPassage:false};
}
