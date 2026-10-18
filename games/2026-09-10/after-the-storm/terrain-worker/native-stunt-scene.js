import {createSourceTwilightCourse} from './source-twilight-course.js?v=c69bdfad4cd7';
import {polygonDistance} from './classic-courses.js?v=c69bdfad4cd7';
import {twilightAnchors,twilightPilotAnchors,twilightStuntNavigation} from './source-twilight-navigation.js?v=c69bdfad4cd7';
import {samplePolyline} from './courses.js?v=c69bdfad4cd7';
import {createSourcePortCourse} from './source-port-course.js?v=c69bdfad4cd7';
import {portStuntNavigation} from './source-port-navigation.js?v=c69bdfad4cd7';
import {createSourceDolphinStuntCourse} from './source-dolphin-stunt-course.js?v=c69bdfad4cd7';
import {createSourceFortressStuntCourse} from './source-fortress-stunt-course.js?v=c69bdfad4cd7';
import {createSourceDrakeStuntCourse} from './source-drake-stunt-course.js?v=c69bdfad4cd7';

/** Source-aligned high-resolution scene for native Stunt. Course geometry and
 * decorative materials remain separate from the original physical owners.
 * Other modes keep their existing independently prepared course selections. */
export function nativeStuntScene(base){
 const index=base.sourceWaterCourseIndex;
 if(![0,3,4,5,6].includes(index))return base;
 const source=index===0?createSourceDolphinStuntCourse(polygonDistance):index===3?createSourceFortressStuntCourse(polygonDistance):index===4?createSourceDrakeStuntCourse(polygonDistance):index===5?createSourcePortCourse(polygonDistance,{stuntNavigation:portStuntNavigation}):
  createSourceTwilightCourse(polygonDistance,{anchorsByClass:twilightAnchors,
   pilotAnchorsByClass:twilightPilotAnchors,stuntNavigation:twilightStuntNavigation});
 return {...source,id:base.id,sky:base.sky,water:base.water,storm:base.storm,
  sourceWaterCourseIndex:index,waterModelRevision:base.waterModelRevision,
  difficulty:base.difficulty,reverse:false,laps:1,
  // A distinct terrain identity prevents reuse of the old illustration-map mesh.
  layoutRevision:source.layoutRevision+100,nativeSceneCourseIndex:index,
  // Port's complete canonical object array owns its twelve floating bodies.
  // Keep the source definitions for display; do not start a second physics owner.
  ...(index===5?{dynamicObjectsForPlayers:()=>[],sourceDynamicsReady:true,
   description:'Source-aligned Stunt harbour with sixteen rings, four jumps and live buoyant obstacles.',
   pendingSourceMechanics:[]}:{}),
  route:samplePolyline(source.stuntLayout.anchors,384),
  rocks:[],ramps:[],closedAreas:[],requiredPassage:false};
}
