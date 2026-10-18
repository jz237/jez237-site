import {getCourse} from './courses.js?v=6fdabd848c37';
import {sampleTerrain} from './terrain-data.js?v=6fdabd848c37';
import {nativeStuntScene} from './native-stunt-scene.js?v=6fdabd848c37';
import {nativeDrakeRaceScene} from './source-drake-course.js?v=6fdabd848c37';
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
