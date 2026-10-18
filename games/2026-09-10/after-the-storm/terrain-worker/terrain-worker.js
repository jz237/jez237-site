import {getCourse} from './courses.js?v=abdbcabcfe7a';
import {sampleTerrain} from './terrain-data.js?v=abdbcabcfe7a';
import {nativeStuntScene} from './native-stunt-scene.js?v=abdbcabcfe7a';
self.onmessage=({data:{id,difficulty,key,geometryPlayers=1,nativeSceneCourseIndex}})=>{
 try{
  const start=performance.now();let course=getCourse(id,difficulty);
  if(nativeSceneCourseIndex!==undefined){
   if(nativeSceneCourseIndex!==course.sourceWaterCourseIndex)throw new RangeError('Native terrain course mismatch');
   course=nativeStuntScene(course);
  }
  if(course.geometryForPlayers)course={...course,...course.geometryForPlayers(geometryPlayers)};
  const result=sampleTerrain(course.renderGround||course.ground);
  self.postMessage({key,...result,ms:performance.now()-start},[result.heights.buffer,result.depth.buffer]);
 }catch(error){self.postMessage({key,error:String(error)});}
};
