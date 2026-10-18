import {getCourse} from '../../courses.js';
import {stuntCourse} from '../../stunts.js';
import {createHydro} from '../../hydrodynamics.js';
import {createNativeStuntCourseRuntime} from '../../native-stunt-course-runtime.js';
import {createNativeRaceLaunchRuntime} from '../../native-race-launch-runtime.js';
import {createNativeRaceHost,stepNativeRaceHost} from '../../native-race-host.js';
import {prepareNativeHullStartFromMatrix,prepareNativeHullStartFromPose} from '../../native-hull.js';
import {createRaceWater} from '../../race-water.js';
import {sourceWaterConditions} from '../../source-water-conditions.js';

// Internal physical host fixture. Public mode admission and render/HUD adapters
// are deliberately separate; no authored stunt judge or rescue runs here.
export function stuntHostFixture(courseIndex=1,{patch,startPose,runtimeWrapper,onFrame,onLaunchFrame,onContactFrame}={}){
 const courseRuntime=createNativeStuntCourseRuntime({courseIndex}),scale=courseRuntime.scale;
 let course=stuntCourse(getCourse(({0:'practice',1:'greyhaven',2:'amber',3:'reed',4:'citadel',5:'port',6:'neon',7:'tempest',8:'glacier'})[courseIndex]));
 if(course.geometryForPlayers)course={...course,...course.geometryForPlayers(1)};
 if(course.sourceObjectSelection)course={...course,playerCount:1,rocks:course.hazardsForPlayers(1),
  sourceDecorations:course.decorationsForPlayers?.(1)??course.sourceDecorations};
 if(course.contactVolumesForRamps)course={...course,contactVolumes:course.contactVolumesForRamps(course.ramps)};
 course={...course,...courseRuntime.courseView};
 const makeRacers=()=>[{id:0,grid:0,human:true,player:0,hydro:createHydro(),lap:0,power:5,misses:0,finishTime:null,dq:'',lapTimes:[]}];
 let racers=makeRacers(),runtime=createNativeRaceLaunchRuntime({courseRuntime,courseIndex,players:1,racers});
 if(patch){const initialState=runtime.snapshot();patch(initialState);racers=makeRacers();
  runtime=createNativeRaceLaunchRuntime({courseRuntime,courseIndex,players:1,racers,initialState});}
 const start=runtime.gridStart(0),prepared=startPose?prepareNativeHullStartFromPose({rider:0,scale,computerProfile:start.computerProfile,
  ...startPose(runtime.snapshot(),scale)}):prepareNativeHullStartFromMatrix({matrixWords:start.transform.matrixWords,rider:0,computerProfile:start.computerProfile});
 const r=racers[0];r.x=prepared.centerNative.x*scale;r.z=prepared.centerNative.z*scale;r.hydro.y=prepared.centerNative.y*scale;
 r.heading=Math.atan2(prepared.frameNative.forward.x,prepared.frameNative.forward.z);
 r.sourceForwardXZ=[prepared.frameNative.forward.x,prepared.frameNative.forward.z];
 const water=createRaceWater({...sourceWaterConditions({courseIndex,players:1,stunt:true,reverse:false}),crafts:racers,scale,seed:17,initialNoise:false,
  rollerRows:course.rollersForPlayers?.(1,{difficulty:courseRuntime.sourceDifficulty,mode:'stunt'}).map(q=>q.nativeRow)??[],
  primaryPointsNative:courseRuntime.data.nodes.map(n=>[n.centerNativeXZ.x,n.centerNativeXZ.z]),
  boundaryPointsNative:(course.boundaryMarkers??[]).map(q=>q.map(v=>v/scale))});
 runtime.initializeWater(water.field,water.baseAmplitudeNative);
 const host=createNativeRaceHost({racers,water,course,raceRuntime:runtimeWrapper?runtimeWrapper(runtime):runtime,
  staticGeometry:courseRuntime.staticContactGeometry,hullStarts:[{prepared,computerProfile:start.computerProfile}],onFrame,onLaunchFrame,onContactFrame});
 return {course,courseRuntime,racers,runtime,water,host,step:(dt=.05,input={})=>stepNativeRaceHost(host,dt,[input])};
}
