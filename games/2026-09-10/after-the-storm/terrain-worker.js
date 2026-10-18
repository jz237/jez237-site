import {getCourse} from './courses.js';
import {sampleTerrain} from './terrain-data.js';
import {nativeStuntScene} from './native-stunt-scene.js';
import {nativeDrakeRaceScene} from './source-drake-course.js';
self.onmessage=({data:{id,difficulty,key,geometryPlayers=1,nativeSceneCourseIndex,nativeSceneMode}})=>{
 try{
  const start=performance.now();let course=getCourse(id,difficulty);
  if(nativeSceneCourseIndex!==undefined){
   if(nativeSceneCourseIndex!==course.sourceWaterCourseIndex)throw new RangeError('Native terrain course mismatch');
   course=nativeSceneMode==='race'?nativeDrakeRaceScene(course):nativeStuntScene(course);
  }
  if(course.geometryForPlayers)course={...course,...course.geometryForPlayers(geometryPlayers)};
  const result=sampleTerrain(course.renderGround||course.ground);
  self.postMessage({key,...result,ms:performance.now()-start},[result.heights.buffer,result.depth.buffer]);
 }catch(error){self.postMessage({key,error:String(error)});}
};
