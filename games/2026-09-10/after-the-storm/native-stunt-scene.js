import {createSourceTwilightCourse} from './source-twilight-course.js';
import {polygonDistance} from './classic-courses.js';
import {twilightAnchors,twilightPilotAnchors,twilightStuntNavigation} from './source-twilight-navigation.js';
import {samplePolyline} from './courses.js';
import {createSourcePortCourse} from './source-port-course.js';
import {portStuntNavigation} from './source-port-navigation.js';
import {createSourceDolphinStuntCourse} from './source-dolphin-stunt-course.js';

/** Source-aligned high-resolution scene for native Stunt. Course geometry and
 * decorative materials remain separate from the original physical owners.
 * Other modes keep their existing independently prepared course selections. */
export function nativeStuntScene(base){
 const index=base.sourceWaterCourseIndex;
 if(![0,5,6].includes(index))return base;
 const source=index===0?createSourceDolphinStuntCourse(polygonDistance):index===5?createSourcePortCourse(polygonDistance,{stuntNavigation:portStuntNavigation}):
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
