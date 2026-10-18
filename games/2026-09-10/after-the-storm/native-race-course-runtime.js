import {createNativePrimaryCourseData} from './native-primary-initialization.js';
import {createNativeRaceResetLayout} from './native-race-reset.js';
import {createNativePrimaryRacePhaseLayout} from './native-primary-race-phase.js';
import {createSourceBuoyLayout,sourceBuoyCourseRules} from './source-buoy-progress.js';
import {createNativeAIRoute} from './native-ai-route.js';
import {createNativeAITargetTable} from './native-ai-target.js';
import {nativeRaceCourseRegions} from './native-course-regions.js';
import {SUNNY_NATIVE_RETIREMENT_GEOMETRY} from './native-sunny-support.js';
import {nativeSunsetRetirementGeometry} from './native-sunset-support.js';
import {nativeSouthernRetirementGeometry} from './native-southern-support.js';
import {nativeGlacierRetirementGeometry} from './native-glacier-support.js';
import {nativeDrakeSupportGeometry} from './native-drake-support.js';
import {nativeFortressSupportGeometry} from './native-fortress-support.js';
import {nativePortSupportGeometry} from './native-port-support.js';
import {nativeTwilightSupportGeometry} from './native-twilight-support.js';
import {nativeAdditionalStuntSupportGeometry} from './native-additional-stunt-support.js';
import {PORT_NATIVE_GEOMETRY} from './source-port-course.js';
import {TWILIGHT_NATIVE_GEOMETRY} from './source-twilight-course.js';
import {FORTRESS_NATIVE_SECONDARY_ROWS_BY_CLASS} from './source-fortress-ai-routes.js';
import {GLACIER_NATIVE_ROUTE_ROWS_BY_CLASS} from './source-glacier-rows.js';
import {nativeRaceShoreGeometry} from './native-shore-geometry.js';
import {SOUTHERN_NATIVE_AI_ROWS_BY_CLASS} from './source-southern-ai-routes.js';
import {createNativeCourseObjectStartup} from './native-course-object-startup.js';
import {nativeCourseCheckpointSeconds} from './native-stunt-checkpoint-times.js';

// Numeric ordinary-course owners. Twilight has no original Normal route.
// Mode and source-water admission remain the race host's responsibility.
export function createNativeRaceCourseRuntime({course,difficulty,players,objectLayout='source'}={}){
 if(!['source','authored'].includes(objectLayout))throw new RangeError('Select source objects or explicit authored diagnostics');
 const courseIndex=course?.sourceWaterCourseIndex;
 if(![0,1,2,3,4,5,6,7,8].includes(courseIndex)||!Number.isInteger(difficulty)||difficulty<0||difficulty>3||![1,2].includes(players))
  throw new RangeError('Ordinary data preparation requires a verified source course and one/two players');
 if(courseIndex===0&&(players!==1||difficulty!==0||course.reverse||course.nativeSceneMode!=='practice'))
  throw new RangeError('Dolphin Practice preparation requires its solo forward Normal selection');
 if(courseIndex===6&&difficulty===0)throw new RangeError('Twilight has no original Normal race route');
 if([0,3,5,6].includes(courseIndex)&&objectLayout!=='source')throw new RangeError('Selected preparation requires canonical source objects');
 // The native selection owns its route metadata. Do not activate a different
 // modern water/judging graph by modifying the shared authored course.
 if(courseIndex===8)course={...course,sourceRouteRowsByClass:GLACIER_NATIVE_ROUTE_ROWS_BY_CLASS,
  sourceMetadata:{...course.sourceMetadata,nativeCourseIndex:8,nativeScale:.025,sourceNativeClassByDifficulty:[0,1,2,2]},
  sourceBuoyLayout:createSourceBuoyLayout({rows:GLACIER_NATIVE_ROUTE_ROWS_BY_CLASS[difficulty],courseIndex,scale:.025,reverse:!!course.reverse})};
 if(!course.sourceRouteRowsByClass?.[difficulty]||course.sourceBuoyLayout?.courseIndex!==courseIndex)
  throw new TypeError('Selected source route rows and buoy layout are required');
 const mode620=players===2?1:0,scale=course.sourceBuoyLayout.scale,rules=sourceBuoyCourseRules(courseIndex,{reverse:!!course.reverse});
 const regions=nativeRaceCourseRegions(courseIndex);
 const retirementGeometry=courseIndex===0?nativeAdditionalStuntSupportGeometry({courseIndex,players}):courseIndex===1?SUNNY_NATIVE_RETIREMENT_GEOMETRY:courseIndex===2?nativeSunsetRetirementGeometry({players}):courseIndex===3?nativeFortressSupportGeometry({players}):courseIndex===4?nativeDrakeSupportGeometry({players}):courseIndex===5?nativePortSupportGeometry({players}):courseIndex===6?nativeTwilightSupportGeometry({players}):courseIndex===7?nativeSouthernRetirementGeometry({players}):nativeGlacierRetirementGeometry({players});
 const data=createNativePrimaryCourseData({rows:course.sourceRouteRowsByClass[difficulty],courseIndex,mode620});
 const sourceDifficulty=course.sourceMetadata.sourceNativeClassByDifficulty[difficulty];
 const objectStartup=objectLayout==='source'?createNativeCourseObjectStartup({courseIndex,players,mode620,difficulty:sourceDifficulty,reverseDab68:Number(!!course.reverse)}):null;
 const fixed=objectStartup?.storage.fixedSphereWordsB138,bits=new DataView(new ArrayBuffer(4));
 // Gates, ramps and solids are loaded by mode/difficulty. This is
 // only their startup view; the physical host uses current canonical planes.
 const boxes=[0,3,5,6].includes(courseIndex)?Object.freeze({count0578:objectStartup.counts.collisionPlaneCount0578,
  rows:Object.freeze(Array.from({length:objectStartup.counts.collisionPlaneCount0578},(_,i)=>Object.freeze(
   objectStartup.storage.collisionPlaneWordsFd78.slice(i*16,(i+1)*16).map(w=>{bits.setUint32(0,w);return bits.getFloat32(0);}))))}):retirementGeometry.boxes;
 const staticContactGeometry=Object.freeze({...retirementGeometry,shore:retirementGeometry.shore??nativeRaceShoreGeometry({courseIndex,players}),boxes});
 const fixedFloat=i=>{bits.setUint32(0,fixed[i]);return bits.getFloat32(0);};
 //75310 includes every initialized fixed record, even hidden rows. Visible
 // authored markers are retained only for the explicit authored diagnostic.
 const resetBoundary=objectStartup?Array.from({length:objectStartup.counts.fixedSphereCountC938},(_,i)=>({x:fixedFloat(i*6),z:fixedFloat(i*6+2)})):
  course.boundaryMarkers.map(([x,z])=>({x:x/scale,z:z/scale}));
 const resetLayout=createNativeRaceResetLayout({nodes:data.nodes,
  boundaryNativeXZ:resetBoundary,objectKinds4c:objectStartup?.objectKinds4c??[],
  checkpointSeconds:nativeCourseCheckpointSeconds(courseIndex)[0],checkpointSlackNative:rules.checkpointSlackNative,
  recordTimeTemplateWords:[599999,0,0,0,0x494e4900],stuntTemplateWords:[0,0,0,0x494e4900]});
 const primaryLayout=createNativePrimaryRacePhaseLayout({nodes:data.nodes,regionsNative:rules.regionsNative,fortressRegionsNative:courseIndex===3?regions.warningSuppressionRegionsNative:[],
  weedCentersNativeXZ:[[-2130,-3130],[-60,-2380],[10,-3940],[-3980,620],[-4610,1620],[-4690,-490]].map(([x,z])=>({x,z})),
  weedRadiusSquaredNative:22500,portRegionNative:[-1000,2600,-5450,1500],cityRegionNative:[-300,300,700,4400]});
 // Contact/motion metadata receives the SAME initialized geometry/links as
 // judging; its mutable center array remains the only moving primary owner.
 const sourceBuoyLayout=createSourceBuoyLayout({courseIndex,scale,reverse:!!course.reverse,
  finishSourceRow:data.finishSourceRow,nodes:data.nodes.map((n,i)=>({...course.sourceBuoyLayout.nodes[i],
   tx:n.forwardXZ.x,tz:n.forwardXZ.z,nextSourceRow:n.nextSourceRowA0,
   halfWidthNative:n.halfWidthNative8c,enabled:n.enabledC8!==0,checkpoint:n.checkpointFlag9c!==0}))});
 // Hidden navigation rows force the source water too. The host must receive
 // this complete view rather than falling back to the17 visible Glacier gates.
 // Numeric-only preparation also accepts course inputs without render gates.
 const sourceVisibleGateIndices=course.sourceVisibleGateIndices??(Array.isArray(course.gates)?Object.fromEntries(sourceBuoyLayout.nodes.filter(n=>n.enabled).map(n=>{
  const index=n.classification===3?0:course.gates.findIndex(g=>g.side&&Math.abs(g.bx-n.x)<1e-6&&Math.abs(g.bz-n.z)<1e-6);
  if(index<0)throw new RangeError('Native visible buoy has no matching course marker');
  return [n.sourceRow,index];
 })):undefined);
 const courseView=Object.freeze({...course,sourceBuoyLayout,...(sourceVisibleGateIndices?{sourceVisibleGateIndices:Object.freeze({...sourceVisibleGateIndices})}:{})});
 // AI retains avatar links and initialized endpoints from the same source
 // records. Human judging's nextA0 links are a separate graph.
 const aiNodes=data.nodes.map((n,i)=>({...sourceBuoyLayout.nodes[i],
  x:n.centerNativeXZ.x*scale,z:n.centerNativeXZ.z*scale,
  classification:n.classification98,routeGroup:n.routeGroupC0,
  endpointPlusNativeXZ:n.endpointANativeXZ,endpointMinusNativeXZ:n.endpointBNativeXZ,
  passingDirectionXZ:n.rightXZ,initialPositionNativeXZ:n.centerNativeXZ}));
 const aiRoute=createNativeAIRoute({nodes:aiNodes,scale,courseIndex});
 const aiTargetTable=createNativeAITargetTable({route:aiRoute,nodes:aiNodes});
 const aiFamilies={primary:Object.freeze({family:'primary',data,route:aiRoute,targetTable:aiTargetTable})};
 //85EEC forces primary in two-player mode. Solo Port/City can select an
 // alternate AI context independently of the human judge's retained family.
 // Fortress/Southern also retain their lap/gate/tide-selected families.
 // Alternate centers are static, separate from physical primary buoy motion.
 if([3,5,6,7].includes(courseIndex)&&players===1)for(const family of courseIndex===7?['secondary','tertiary']:['secondary']){
  const rows=courseIndex===3?FORTRESS_NATIVE_SECONDARY_ROWS_BY_CLASS[difficulty]:courseIndex===5?PORT_NATIVE_GEOMETRY.raceSecondaryByClass[difficulty]:courseIndex===6?TWILIGHT_NATIVE_GEOMETRY.raceSecondaryByClass[difficulty]:SOUTHERN_NATIVE_AI_ROWS_BY_CLASS[difficulty][family];
  if(rows.length!==data.nodes.length)throw new RangeError('Alternate source loader count differs from primary');
  const alternate=createNativePrimaryCourseData({rows,courseIndex,mode620});
  const nodes=alternate.nodes.map((n,i)=>({
   sourceRow:n.sourceRow,x:n.centerNativeXZ.x*scale,z:n.centerNativeXZ.z*scale,
   tx:n.forwardXZ.x,tz:n.forwardXZ.z,classification:n.classification98,routeGroup:n.routeGroupC0,
   nativeType:rows[i][2],halfWidthNative:n.halfWidthNative8c,
   endpointPlusNativeXZ:n.endpointANativeXZ,endpointMinusNativeXZ:n.endpointBNativeXZ,
   passingDirectionXZ:n.rightXZ,initialPositionNativeXZ:n.centerNativeXZ}));
  const route=createNativeAIRoute({nodes,scale,courseIndex,family});
  aiFamilies[family]=Object.freeze({family,data:alternate,route,targetTable:createNativeAITargetTable({route,nodes})});
 }
 return Object.freeze({courseView,data,resetLayout,objectStartup,primaryLayout,sourceBuoyLayout,mode620,aiRoute,aiTargetTable,aiFamilies:Object.freeze(aiFamilies),retirementGeometry,staticContactGeometry,...regions,
  sourceDifficulty,
  directionFlag1f90:rules.checkpointSide,scale});
}
