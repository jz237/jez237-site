import * as T from 'three';
import {addCourseGroundDetail} from './course-materials';
import type {getFenwickCourse} from './fenwick-course';
/** Dry clay retains its warm atlas colour and painted grid; relief is visual only. */
export function addFenwickGroundDetail(material:T.MeshStandardMaterial,course:ReturnType<typeof getFenwickCourse>){
 const detail=addCourseGroundDetail(material,course),compile=material.onBeforeCompile;
 const start=course.point(0),next=course.point(.0001),yaw=Math.atan2(next.x-start.x,next.z-start.z);
 material.onBeforeCompile=(shader,renderer)=>{
  compile.call(material,shader,renderer);
  shader.uniforms.fenwickStart={value:new T.Vector4(start.x,start.z,Math.cos(yaw),Math.sin(yaw))};
  shader.fragmentShader='uniform vec4 fenwickStart;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('vec3 courseRoad=mix(aggregate,pavement,courseWeights.r);',`// Aggregate modulates the clay atlas, preserving longitudinal ruts and the warm dry surface.
float clayDetail=clamp(dot(aggregate,vec3(.2126,.7152,.0722))*3.8,.45,1.45);
aggregate=coursePaint*clayDetail;
vec3 courseRoad=mix(aggregate,pavement,courseWeights.r);`);
  shader.fragmentShader=shader.fragmentShader.replace('float courseMark=max(courseWeights.b,smoothstep(.42,.66,max(max(coursePaint.r,coursePaint.g),coursePaint.b))*courseWeights.g);',`// Fenwick has dirt shoulders, not painted curbs. Preserve both checker colours and the apron lettering.
vec2 gridDelta=vCourseWorld.xz-fenwickStart.xy;
vec2 gridLocal=vec2(dot(gridDelta,vec2(fenwickStart.z,-fenwickStart.w)),dot(gridDelta,fenwickStart.wz));
float gridPaint=(1.0-smoothstep(12.0,12.25,abs(gridLocal.x)))*(1.0-smoothstep(1.0,1.25,abs(gridLocal.y)));
float courseMark=max(gridPaint,smoothstep(.55,.75,max(max(coursePaint.r,coursePaint.g),coursePaint.b)));`);
 };
 material.customProgramCacheKey=()=> 'fenwick-photo-clay-v1';return detail;
}
