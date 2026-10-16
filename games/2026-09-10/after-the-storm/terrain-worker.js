import {getCourse} from './courses.js';
import {sampleTerrain} from './terrain-data.js';
self.onmessage=({data:{id,difficulty,key,geometryPlayers=1}})=>{
 try{
  const start=performance.now();let course=getCourse(id,difficulty);
  if(course.geometryForPlayers)course={...course,...course.geometryForPlayers(geometryPlayers)};
  const result=sampleTerrain(course.renderGround||course.ground);
  self.postMessage({key,...result,ms:performance.now()-start},[result.heights.buffer,result.depth.buffer]);
 }catch(error){self.postMessage({key,error:String(error)});}
};
