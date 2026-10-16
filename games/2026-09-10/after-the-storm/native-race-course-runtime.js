import {createNativePrimaryCourseData} from './native-primary-initialization.js';
import {createNativeRaceResetLayout} from './native-race-reset.js';
import {createNativePrimaryRacePhaseLayout} from './native-primary-race-phase.js';
import {createSourceBuoyLayout,sourceBuoyCourseRules} from './source-buoy-progress.js';
import {createNativeAIRoute} from './native-ai-route.js';
import {createNativeAITargetTable} from './native-ai-target.js';
import {nativeRaceCourseRegions} from './native-course-regions.js';

// Sunny is live; Sunset can prepare its own ordinary data owners for further
// host validation. This factory does not admit another course to live physics.
export function createNativeRaceCourseRuntime({course,difficulty,players}={}){
 const courseIndex=course?.sourceWaterCourseIndex;
 if(![1,2].includes(courseIndex)||!Number.isInteger(difficulty)||difficulty<0||difficulty>3||![1,2].includes(players))
  throw new RangeError('Ordinary data preparation requires Sunny/Sunset source rows and one/two players');
 if(!course.sourceRouteRowsByClass?.[difficulty]||course.sourceBuoyLayout?.courseIndex!==courseIndex)
  throw new TypeError('Selected source route rows and buoy layout are required');
 const mode620=players===2?1:0,scale=course.sourceBuoyLayout.scale,rules=sourceBuoyCourseRules(courseIndex,{reverse:!!course.reverse});
 const regions=nativeRaceCourseRegions(courseIndex);
 const data=createNativePrimaryCourseData({rows:course.sourceRouteRowsByClass[difficulty],courseIndex,mode620});
 const resetLayout=createNativeRaceResetLayout({nodes:data.nodes,
  boundaryNativeXZ:course.boundaryMarkers.map(([x,z])=>({x:x/scale,z:z/scale})),objectKinds4c:[],
  checkpointSeconds:15,checkpointSlackNative:rules.checkpointSlackNative,
  recordTimeTemplateWords:[599999,0,0,0,0x494e4900],stuntTemplateWords:[0,0,0,0x494e4900]});
 const primaryLayout=createNativePrimaryRacePhaseLayout({nodes:data.nodes,regionsNative:rules.regionsNative,fortressRegionsNative:[],
  weedCentersNativeXZ:[[-2130,-3130],[-60,-2380],[10,-3940],[-3980,620],[-4610,1620],[-4690,-490]].map(([x,z])=>({x,z})),
  weedRadiusSquaredNative:22500,portRegionNative:[-1000,2600,-5450,1500],cityRegionNative:[-300,300,700,4400]});
 // Contact/motion metadata receives the SAME initialized geometry/links as
 // judging; its mutable center array remains the only moving primary owner.
 const sourceBuoyLayout=createSourceBuoyLayout({courseIndex,scale,reverse:!!course.reverse,
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
 const aiRoute=createNativeAIRoute({nodes:aiNodes,scale,courseIndex});
 const aiTargetTable=createNativeAITargetTable({route:aiRoute,nodes:aiNodes});
 return Object.freeze({data,resetLayout,primaryLayout,sourceBuoyLayout,mode620,aiRoute,aiTargetTable,...regions,
  sourceDifficulty:course.sourceMetadata.sourceNativeClassByDifficulty[difficulty],
  directionFlag1f90:rules.checkpointSide,scale});
}
