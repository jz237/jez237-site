import * as T from './vendor/three.module.js';
const fract=x=>x-Math.floor(x),smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
function noise(x,z){const ix=Math.floor(x),iz=Math.floor(z),u=smooth(0,1,fract(x)),v=smooth(0,1,fract(z)),h=(x,z)=>fract(Math.sin(x*127.1+z*311.7)*43758.5453);return (h(ix,iz)*(1-u)+h(ix+1,iz)*u)*(1-v)+(h(ix,iz+1)*(1-u)+h(ix+1,iz+1)*u)*v;}
export function cloudCover(x,z,t,storm){const px=x*.006+t*.006,pz=z*.006-t*.002,n=noise(px,pz)*.57+noise(px*2.03,pz*2.03)*.28+noise(px*4.07,pz*4.07)*.15;return smooth(.43-storm*.12,.72-storm*.10,n);}
export const weatherUniforms={weatherTime:{value:0},weatherStorm:{value:0},weatherSun:{value:new T.Vector3(-.35,.25,-.9).normalize()}};
export const cloudGLSL=`uniform float weatherTime,weatherStorm;uniform vec3 weatherSun;
float cloudHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float cloudNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(cloudHash(i),cloudHash(i+vec2(1.,0.)),f.x),mix(cloudHash(i+vec2(0.,1.)),cloudHash(i+1.),f.x),f.y);}
float cloudCoverAt(vec2 world){vec2 p=world*.006+vec2(weatherTime*.006,-weatherTime*.002);float n=cloudNoise(p)*.57+cloudNoise(p*2.03)*.28+cloudNoise(p*4.07)*.15;return smoothstep(.43-weatherStorm*.12,.72-weatherStorm*.10,n);}
float cloudVisibility(vec3 p){vec2 intercept=p.xz+weatherSun.xz*(190.-p.y)/max(.12,weatherSun.y);return 1.-cloudCoverAt(intercept)*(.48+weatherStorm*.26);}`;
export function cloudMaterial(material){if(!material||material.onBeforeCompile.cloudPatch||!material.isMeshStandardMaterial)return;material.userData.cloudLighting=true;const before=material.onBeforeCompile,key=material.customProgramCacheKey().toString();material.onBeforeCompile=s=>{before.call(material,s);Object.assign(s.uniforms,weatherUniforms);
 s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 cloudWorld;').replace('#include <project_vertex>',`#include <project_vertex>
 vec4 cp=vec4(transformed,1.);
 #ifdef USE_INSTANCING
 cp=instanceMatrix*cp;
 #endif
 cloudWorld=(modelMatrix*cp).xyz;`);
 s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 cloudWorld;\n'+cloudGLSL).replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
 float sunlight=cloudVisibility(cloudWorld);reflectedLight.directDiffuse*=sunlight;reflectedLight.directSpecular*=sunlight;`).replace('#include <fog_fragment>',`#include <fog_fragment>
 #ifdef USE_FOG
 float aerial=(1.-exp(-length(cameraPosition-cloudWorld)*.0006))*(.6+weatherStorm*.4);gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,aerial);
 #endif
 `);
 };material.onBeforeCompile.cloudPatch=true;material.customProgramCacheKey=()=>key+'-cloud-light-1';material.needsUpdate=true;}
export function cloudScene(root){root.traverse(o=>{if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])cloudMaterial(m);});}
