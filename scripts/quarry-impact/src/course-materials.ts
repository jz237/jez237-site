import * as T from 'three';
import type {createCountyCourse} from './county-course';
type Course=ReturnType<typeof createCountyCourse>;
export const COURSE_MASK_SIZE=[256,210] as const;
/** The mask selects photographs only: the existing terrain/collision mesh stays exact. */
export function courseSurfaceMask(course:Course){
 const [width,height]=COURSE_MASK_SIZE,data=new Uint8Array(width*height*4);
 for(let row=0;row<height;row++)for(let col=0;col<width;col++){
  const x=((col+.5)/width-.5)*course.terrain.spanX,z=(.5-(row+.5)/height)*course.terrain.spanZ,d=course.distance(x,z),i=(row*width+col)*4;
  data[i]=course.surface(x,z)==='asphalt'?255:0;data[i+1]=Math.round(T.MathUtils.smoothstep(15-d,0,4)*255);data[i+2]=Math.round((1-T.MathUtils.smoothstep(Math.abs(d-12.7),.35,1.15))*255);data[i+3]=255;
 }
 return data;
}
function photo(name:string,color:boolean,owned:T.Texture[]){
 const texture=typeof document==='undefined'?new T.DataTexture(new Uint8Array(color?[160,160,160,255]:[128,128,255,255]),1,1):new T.TextureLoader().load((import.meta.env?.BASE_URL??'./')+'assets/'+name+'.jpg');
 texture.name='course-photo-'+name;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.anisotropy=8;texture.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;if(typeof document==='undefined')texture.needsUpdate=true;owned.push(texture);return texture;
}
const positionVertex=`
vec4 coursePosition=vec4(transformed,1.0);
#ifdef USE_INSTANCING
coursePosition=instanceMatrix*coursePosition;
#endif
vCourseWorld=(modelMatrix*coursePosition).xyz;
`;
/** Layer metre-scale aggregate over the existing course atlas. Palette and paint
 * stay authored per venue; normal detail and roughness now respond to the light. */
export function addCourseGroundDetail(material:T.MeshStandardMaterial,course:Course){
 const owned:T.Texture[]=[],mask=new T.DataTexture(courseSurfaceMask(course),...COURSE_MASK_SIZE);mask.name='course-surface-mask';mask.flipY=false;mask.minFilter=mask.magFilter=T.LinearFilter;mask.needsUpdate=true;owned.push(mask);
 const asphalt=photo('circuit_asphalt_diff',true,owned),gravel=photo('gravel_diff',true,owned),soil=photo('forrest_ground_01_diff',true,owned);
 const asphaltN=photo('circuit_asphalt_nor_gl',false,owned),soilN=photo('mud_nor_gl',false,owned);material.normalMap=photo('gravel_nor_gl',false,owned);material.normalScale.setScalar(.55);
 const originalCompile=material.onBeforeCompile,originalKey=material.customProgramCacheKey;
 material.onBeforeCompile=(shader,renderer)=>{
  originalCompile.call(material,shader,renderer);
  Object.assign(shader.uniforms,{courseMask:{value:mask},courseAsphalt:{value:asphalt},courseGravel:{value:gravel},courseSoil:{value:soil},courseAsphaltN:{value:asphaltN},courseSoilN:{value:soilN}});
  shader.vertexShader='varying vec3 vCourseWorld;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n'+positionVertex);
  shader.fragmentShader=`
varying vec3 vCourseWorld;
uniform sampler2D courseMask,courseAsphalt,courseGravel,courseSoil,courseAsphaltN,courseSoilN;
vec2 courseOffset(vec2 cell){return fract(sin(vec2(dot(cell,vec2(127.1,311.7)),dot(cell,vec2(269.5,183.3))))*43758.5453);}
vec3 coursePair(sampler2D photograph,vec2 uv){
 // Three continuously blended offsets break visible rows of repeated cracks.
 vec2 grid=mat2(1.0,0.0,-.57735027,1.15470054)*uv*.5;
 vec2 cell=floor(grid),f=fract(grid),a,b,c;vec3 weights;
 if(f.x+f.y<1.0){weights=vec3(1.0-f.x-f.y,f.x,f.y);a=cell;b=cell+vec2(1,0);c=cell+vec2(0,1);}
 else{weights=vec3(f.x+f.y-1.0,1.0-f.x,1.0-f.y);a=cell+vec2(1,1);b=cell+vec2(0,1);c=cell+vec2(1,0);}
 weights=pow(weights,vec3(4.0));weights/=dot(weights,vec3(1.0));vec2 dx=dFdx(uv),dy=dFdy(uv);
 return textureGrad(photograph,uv+courseOffset(a),dx,dy).rgb*weights.x+textureGrad(photograph,uv+courseOffset(b),dx,dy).rgb*weights.y+textureGrad(photograph,uv+courseOffset(c),dx,dy).rgb*weights.z;
}
`+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <alphamap_fragment>',`
vec2 courseUV=vec2(vCourseWorld.x/${course.terrain.spanX.toFixed(1)}+.5,.5-vCourseWorld.z/${course.terrain.spanZ.toFixed(1)});
vec3 courseWeights=texture2D(courseMask,courseUV).rgb;
vec3 coursePaint=diffuseColor.rgb;
vec2 courseRoadUV=vCourseWorld.xz/3.0,courseDirtUV=vCourseWorld.xz/2.5,courseSoilUV=vCourseWorld.xz/4.5;
vec3 pavement=coursePair(courseAsphalt,courseRoadUV);pavement=mix(pavement,vec3(dot(pavement,vec3(.2126,.7152,.0722))),.55)*.75;
vec3 aggregate=coursePair(courseGravel,courseDirtUV);
vec3 earth=coursePair(courseSoil,courseSoilUV);
// The atlas supplies each venue's grass/dry earth hue, not a second giant texture.
float courseLuma=dot(coursePaint,vec3(.2126,.7152,.0722));
vec3 courseTint=clamp(coursePaint/max(courseLuma,.03),vec3(.65),vec3(1.45));
earth=mix(earth,vec3(dot(earth,vec3(.2126,.7152,.0722))),.35)*courseTint*.9;
aggregate=mix(aggregate,vec3(dot(aggregate,vec3(.2126,.7152,.0722))),.35)*mix(vec3(.9),courseTint,.3);
vec3 courseRoad=mix(aggregate,pavement,courseWeights.r);
vec3 courseFinish=mix(earth,courseRoad,courseWeights.g);
// White grid paint, yellow lines and colored curb bands retain their old positions.
float courseMark=max(courseWeights.b,smoothstep(.42,.66,max(max(coursePaint.r,coursePaint.g),coursePaint.b))*courseWeights.g);
diffuseColor.rgb=mix(courseFinish,coursePaint,courseMark);
#include <alphamap_fragment>`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
roughnessFactor=mix(.98,mix(.94,.81,courseWeights.r),courseWeights.g);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`
#ifdef USE_NORMALMAP_TANGENTSPACE
vec3 courseRN=mix(coursePair(normalMap,courseDirtUV),coursePair(courseAsphaltN,courseRoadUV),courseWeights.r)*2.0-1.0;
vec3 courseEN=coursePair(courseSoilN,courseSoilUV)*2.0-1.0;
courseRN.xy*=.48;courseEN.xy*=.65;
mat3 courseRoadFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,courseRoadUV);
mat3 courseSoilFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,courseSoilUV);
normal=normalize(mix(normalize(courseSoilFrame*courseEN),normalize(courseRoadFrame*courseRN),courseWeights.g));
normal=normalize(mix(normal,nonPerturbedNormal,courseMark*.7));
#endif`);
 };
 material.customProgramCacheKey=()=> 'course-photo-ground-v1';material.needsUpdate=true;
 let disposed=false;return{textures:owned,dispose(){if(disposed)return;disposed=true;owned.forEach(t=>t.dispose());material.normalMap=null;material.onBeforeCompile=originalCompile;material.customProgramCacheKey=originalKey;}};
}
/** World-space projection keeps boulders and large ridges at the same rock scale. */
export function addCourseRockDetail(material:T.MeshStandardMaterial){
 const owned:T.Texture[]=[],rock=photo('rock_diff',true,owned),originalCompile=material.onBeforeCompile,originalKey=material.customProgramCacheKey;
 material.onBeforeCompile=(shader,renderer)=>{
  originalCompile.call(material,shader,renderer);shader.uniforms.courseRock={value:rock};
  shader.vertexShader='varying vec3 vCourseWorld;varying vec3 vCourseRockNormal;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n'+positionVertex).replace('#include <defaultnormal_vertex>',`#include <defaultnormal_vertex>\nvCourseRockNormal=inverseTransformDirection(transformedNormal,viewMatrix);`);
  shader.fragmentShader='varying vec3 vCourseWorld;varying vec3 vCourseRockNormal;uniform sampler2D courseRock;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
vec3 rockAxis=pow(abs(normalize(vCourseRockNormal)),vec3(4.0));rockAxis/=max(dot(rockAxis,vec3(1.0)),.001);
vec3 rockPhoto=texture2D(courseRock,vCourseWorld.yz/5.0).rgb*rockAxis.x+texture2D(courseRock,vCourseWorld.xz/5.0).rgb*rockAxis.y+texture2D(courseRock,vCourseWorld.xy/5.0).rgb*rockAxis.z;
diffuseColor.rgb*=mix(vec3(.6),rockPhoto*2.3,.8);
`);
 };
 material.customProgramCacheKey=()=> 'course-photo-rock-v1';material.needsUpdate=true;
 let disposed=false;return{textures:owned,dispose(){if(disposed)return;disposed=true;owned.forEach(t=>t.dispose());material.onBeforeCompile=originalCompile;material.customProgramCacheKey=originalKey;}};
}
