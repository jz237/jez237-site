import {getCourse} from './courses.js?v=0409f9dba1c4';
import {sampleTerrain} from './terrain-data.js?v=0409f9dba1c4';
self.onmessage=({data:{id,difficulty,key}})=>{
 try{
  const start=performance.now(),course=getCourse(id,difficulty),result=sampleTerrain(course.renderGround||course.ground);
  self.postMessage({key,...result,ms:performance.now()-start},[result.heights.buffer,result.depth.buffer]);
 }catch(error){self.postMessage({key,error:String(error)});}
};
