import {nativeStuntPrimaryRows} from './native-stunt-primary-resources.js';
import {nativeStuntCheckpointSeconds} from './native-stunt-checkpoint-times.js';
import {createNativePrimaryCourseData} from './native-primary-initialization.js';
import {createNativeCourseObjectStartup} from './native-course-object-startup.js';
import {createNativeRaceResetLayout} from './native-race-reset.js';
import {createNativePrimaryScratchLayout} from './native-primary-scratch-context.js';
import {nativeRaceCourseRegions} from './native-course-regions.js';
import {sourceBuoyCourseRules,createSourceBuoyLayout} from './source-buoy-progress.js';
import {createNativeAIRoute} from './native-ai-route.js';
import {createNativeAITargetTable} from './native-ai-target.js';
import {SUNNY_NATIVE_RETIREMENT_GEOMETRY} from './native-sunny-support.js';
import {nativeSunsetRetirementGeometry} from './native-sunset-support.js';
import {nativeSouthernRetirementGeometry} from './native-southern-support.js';
import {nativeGlacierRetirementGeometry} from './native-glacier-support.js';
import {nativeRaceShoreGeometry} from './native-shore-geometry.js';
import {nativeAdditionalStuntSupportGeometry} from './native-additional-stunt-support.js';

/** Normal solo Stunt numeric initialization. All nine source selections share
 * mode11, one lap and forward routes;9345C forces difficulty2 except Port0.
 * All nine courses have verified solo shore/floor resources. Their mode-independent
 *71E70 headers are selected before the Stunt objects. Moving box planes belong
 * to objectStartup and the canonical race, never to an ordinary layout snapshot.
 * Physical admission and high-resolution presentation are separate.
 */
export function createNativeStuntCourseRuntime({courseIndex}={}){
 const rows=nativeStuntPrimaryRows({courseIndex}),mode620=11,players=1,scale=.025;
 const sourceDifficulty=courseIndex===5?0:2,rules=sourceBuoyCourseRules(courseIndex);
 const support=courseIndex===1?SUNNY_NATIVE_RETIREMENT_GEOMETRY:courseIndex===2?nativeSunsetRetirementGeometry({players}):
  courseIndex===7?nativeSouthernRetirementGeometry({players}):courseIndex===8?nativeGlacierRetirementGeometry({players}):
  nativeAdditionalStuntSupportGeometry({courseIndex,players});
 const retirementGeometry=Object.freeze({floor:support.floor});
 const data=createNativePrimaryCourseData({rows,courseIndex,mode620});
 const objectStartup=createNativeCourseObjectStartup({courseIndex,players,mode620,difficulty:sourceDifficulty,reverseDab68:0});
 const bits=new DataView(new ArrayBuffer(4)),fixed=objectStartup.storage.fixedSphereWordsB138;
 const value=i=>{bits.setUint32(0,fixed[i]);return bits.getFloat32(0);};
 const staticContactGeometry=Object.freeze({floor:support.floor,shore:support.shore??nativeRaceShoreGeometry({courseIndex,players}),
  // Startup view only. The live host replaces this box pass with its canonical
  // object owner, which reads the transformed rows on every physical contact.
  boxes:Object.freeze({count0578:objectStartup.counts.collisionPlaneCount0578,
   rows:Object.freeze(Array.from({length:objectStartup.counts.collisionPlaneCount0578},(_,i)=>Object.freeze(
    objectStartup.storage.collisionPlaneWordsFd78.slice(i*16,(i+1)*16).map(w=>{bits.setUint32(0,w);return bits.getFloat32(0);}))))})});
 const checkpointSecondsByIndex=nativeStuntCheckpointSeconds(courseIndex);
 const resetLayout=createNativeRaceResetLayout({nodes:data.nodes,objectKinds4c:objectStartup.objectKinds4c,
  //75310 scans the entire C938 fixed family, including hidden rows. Its
  // historical boundary parameter must not contain only visible markers.
  boundaryNativeXZ:Array.from({length:objectStartup.counts.fixedSphereCountC938},(_,i)=>({x:value(i*6),z:value(i*6+2)})),
  checkpointSeconds:checkpointSecondsByIndex[0],checkpointSlackNative:rules.checkpointSlackNative,
  recordTimeTemplateWords:[599999,0,0,0,0x494e4900],stuntTemplateWords:[0,0,0,0x494e4900]});
 const primaryScratchLayout=createNativePrimaryScratchLayout({nodes:data.nodes,regionsNative:rules.regionsNative,
  weedCentersNativeXZ:[[-2130,-3130],[-60,-2380],[10,-3940],[-3980,620],[-4610,1620],[-4690,-490]].map(([x,z])=>({x,z})),
  weedRadiusSquaredNative:22500,portRegionNative:[-1000,2600,-5450,1500],cityRegionNative:[-300,300,700,4400]});
 const nodes=data.nodes.map((n,i)=>({sourceRow:i,x:n.centerNativeXZ.x*scale,z:n.centerNativeXZ.z*scale,
  tx:n.forwardXZ.x,tz:n.forwardXZ.z,classification:n.classification98,routeGroup:n.routeGroupC0,nativeType:rows[i][2],
  nextSourceRow:n.nextSourceRowA0,halfWidthNative:n.halfWidthNative8c,enabled:n.enabledC8!==0,checkpoint:n.checkpointFlag9c!==0,
  endpointPlusNativeXZ:n.endpointANativeXZ,endpointMinusNativeXZ:n.endpointBNativeXZ,
  passingDirectionXZ:n.rightXZ,initialPositionNativeXZ:n.centerNativeXZ}));
 const sourceBuoyLayout=createSourceBuoyLayout({courseIndex,scale,mode:'stunt',nodes,finishSourceRow:data.finishSourceRow});
 const aiRoute=createNativeAIRoute({nodes,scale,courseIndex}),aiTargetTable=createNativeAITargetTable({route:aiRoute,nodes});
 const aiFamilies=Object.freeze({primary:Object.freeze({family:'primary',data,route:aiRoute,targetTable:aiTargetTable})});
 // Source judge follows A0, not the raw row order or an authored driving path.
 const checkpointSourceRows=[];let row=data.finishSourceRow,budget=data.nodes.length;
 do{const n=data.nodes[row];if(n.checkpointFlag9c===1)checkpointSourceRows.push(row);row=n.nextSourceRowA0;
  if(--budget<0||checkpointSourceRows.length>4)throw new RangeError('Unexpected source Stunt checkpoint cycle');
 }while(row!==data.finishSourceRow);
 const gates=Object.freeze(checkpointSourceRows.map(sourceRow=>Object.freeze({...nodes[sourceRow],
  bx:nodes[sourceRow].x,bz:nodes[sourceRow].z,width:data.nodes[sourceRow].halfWidthNative8c*scale,side:0})));
 const sourceVisibleGateIndices=Object.freeze(Object.fromEntries(checkpointSourceRows.map((r,i)=>[r,i])));
 const courseView=Object.freeze({sourceWaterCourseIndex:courseIndex,reverse:false,gates,sourceVisibleGateIndices,sourceBuoyLayout});
 return Object.freeze({courseIndex,mode620,players,scale,sourceDifficulty,configuredLaps728:1,
  data,objectStartup,resetLayout,primaryScratchLayout,checkpointSecondsByIndex,sourceBuoyLayout,
  checkpointSourceRows:Object.freeze(checkpointSourceRows),courseView,aiRoute,aiTargetTable,aiFamilies,retirementGeometry,staticContactGeometry,
  ...nativeRaceCourseRegions(courseIndex),directionFlag1f90:rules.checkpointSide});
}
