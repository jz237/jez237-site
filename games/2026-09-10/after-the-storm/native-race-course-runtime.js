import {createNativePrimaryCourseData} from './native-primary-initialization.js';
import {createNativeRaceResetLayout} from './native-race-reset.js';
import {createNativePrimaryRacePhaseLayout} from './native-primary-race-phase.js';
import {createSourceBuoyLayout,sourceBuoyCourseRules} from './source-buoy-progress.js';
import {createNativeAIRoute} from './native-ai-route.js';
import {createNativeAITargetTable} from './native-ai-target.js';

// Live admission is deliberately the existing Sunny ordinary preview. Other
// courses need their own full current-region/object/alternate-route owners.
const allowed=[[-7000,-6900,-1300,4000],[-6900,-6800,-1500,4000],[-6800,-6700,-1600,4000],
 [-6700,-6600,-1700,4000],[-6600,-6400,-1800,4000],[-6400,-6200,-1900,4000],[-6200,8500,-2000,4000]];
export function createNativeRaceCourseRuntime({course,difficulty,players}={}){
 if(course?.sourceWaterCourseIndex!==1||!Number.isInteger(difficulty)||difficulty<0||difficulty>3||![1,2].includes(players))
  throw new RangeError('Full ordinary runtime requires selected Sunny source rows and one/two players');
 const mode620=players===2?1:0,scale=course.sourceBuoyLayout.scale,rules=sourceBuoyCourseRules(1,{reverse:!!course.reverse});
 const data=createNativePrimaryCourseData({rows:course.sourceRouteRowsByClass[difficulty],courseIndex:1,mode620});
 const resetLayout=createNativeRaceResetLayout({nodes:data.nodes,
  boundaryNativeXZ:course.boundaryMarkers.map(([x,z])=>({x:x/scale,z:z/scale})),objectKinds4c:[],
  checkpointSeconds:15,checkpointSlackNative:256,
  recordTimeTemplateWords:[599999,0,0,0,0x494e4900],stuntTemplateWords:[0,0,0,0x494e4900]});
 const primaryLayout=createNativePrimaryRacePhaseLayout({nodes:data.nodes,regionsNative:rules.regionsNative,fortressRegionsNative:[],
  weedCentersNativeXZ:[[-2130,-3130],[-60,-2380],[10,-3940],[-3980,620],[-4610,1620],[-4690,-490]].map(([x,z])=>({x,z})),
  weedRadiusSquaredNative:22500,portRegionNative:[-1000,2600,-5450,1500],cityRegionNative:[-300,300,700,4400]});
 // Contact/motion metadata receives the SAME initialized geometry/links as
 // judging; its mutable center array remains the only moving primary owner.
 const sourceBuoyLayout=createSourceBuoyLayout({courseIndex:1,scale,reverse:!!course.reverse,
  finishSourceRow:data.finishSourceRow,nodes:data.nodes.map((n,i)=>({...course.sourceBuoyLayout.nodes[i],
   tx:n.forwardXZ.x,tz:n.forwardXZ.z,nextSourceRow:n.nextSourceRowA0,
   halfWidthNative:n.halfWidthNative8c,enabled:n.enabledC8!==0,checkpoint:n.checkpointFlag9c!==0}))});
 // AI retains avatar links and initialized endpoints from the same source
 // records. Human judging's nextA0 links are a separate graph.
 const aiNodes=data.nodes.map((n,i)=>({...sourceBuoyLayout.nodes[i],
  x:n.centerNativeXZ.x*scale,z:n.centerNativeXZ.z*scale,
  classification:n.classification98,routeGroup:n.routeGroupC0,
  endpointPlusNativeXZ:n.endpointANativeXZ,endpointMinusNativeXZ:n.endpointBNativeXZ,
  passingDirectionXZ:n.rightXZ,initialPositionNativeXZ:n.centerNativeXZ}));
 const aiRoute=createNativeAIRoute({nodes:aiNodes,scale,courseIndex:1});
 const aiTargetTable=createNativeAITargetTable({route:aiRoute,nodes:aiNodes});
 return Object.freeze({data,resetLayout,primaryLayout,sourceBuoyLayout,mode620,aiRoute,aiTargetTable,
  sourceDifficulty:course.sourceMetadata.sourceNativeClassByDifficulty[difficulty],
  directionFlag1f90:rules.checkpointSide,allowedRegionsNative:Object.freeze(allowed.map(r=>Object.freeze(r.slice()))),
  warningSuppressionRegionsNative:Object.freeze([]),scale});
}
