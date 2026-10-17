import * as T from 'three';
import {createRookvaleWearTexture} from './rookvale-wear';
import {ROOKVALE,ROOKVALE_LANES} from './rookvale-course';
import {addCourseGroundDetail} from './course-materials';
/** Material-only distance includes the open cross-yard roads. Physics still uses ROOKVALE. */
export function rookvaleGroundDistance(x:number,z:number){
 let distance=ROOKVALE.distance(x,z);
 for(const lane of ROOKVALE_LANES){const [a,b]=lane.points,dx=b.x-a.x,dz=b.z-a.z,t=T.MathUtils.clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz),0,1);
  // The shared material's road reference is 24m wide; compensate narrower yard lanes.
  distance=Math.min(distance,Math.hypot(x-a.x-t*dx,z-a.z-t*dz)+12-lane.width/2);
 }
 return distance;
}
export function addRookvaleGroundDetail(material:T.MeshStandardMaterial){
 const detail=addCourseGroundDetail(material,{...ROOKVALE,distance:rookvaleGroundDistance}),compile=material.onBeforeCompile,wear=createRookvaleWearTexture();detail.textures.push(wear);
 material.onBeforeCompile=(shader,renderer)=>{compile.call(material,shader,renderer);shader.uniforms.rookvaleWear={value:wear};shader.fragmentShader='uniform sampler2D rookvaleWear;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('diffuseColor.rgb=mix(courseFinish,coursePaint,courseMark);',`// Yard labels and loading-apron paint also occur outside the racing lanes.
courseMark=max(courseMark,smoothstep(.4,.55,max(max(coursePaint.r,coursePaint.g),coursePaint.b)));
vec3 yardWear=texture2D(rookvaleWear,courseUV).rgb;
// Broad connected patches break the uniform apron without changing line readability.
float yardBare=1.0-courseWeights.g;
courseFinish*=mix(1.0,mix(.52,1.22,yardWear.r),yardBare);
courseFinish=mix(courseFinish,courseFinish*vec3(.69,.73,.76),yardBare*(1.0-yardWear.r)*.45);
courseFinish*=1.0-yardBare*(yardWear.g*.42+yardWear.b*.54);
diffuseColor.rgb=mix(courseFinish,coursePaint,courseMark);`);
 shader.fragmentShader=shader.fragmentShader.replace('#include <metalnessmap_fragment>',`roughnessFactor=mix(roughnessFactor,.58,yardWear.b*yardBare*(1.0-courseMark));
#include <metalnessmap_fragment>`);};
 material.customProgramCacheKey=()=> 'rookvale-photo-ground-v2';return detail;
}
