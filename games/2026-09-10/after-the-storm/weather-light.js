import {frontAt,frontEnabled,frontGLSL} from './weather-front.js';
import * as T from './vendor/three.module.js';
const fract=x=>x-Math.floor(x),smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
function noise(x,z){const ix=Math.floor(x),iz=Math.floor(z),u=smooth(0,1,fract(x)),v=smooth(0,1,fract(z)),h=(x,z)=>fract(Math.sin(x*127.1+z*311.7)*43758.5453);return (h(ix,iz)*(1-u)+h(ix+1,iz)*u)*(1-v)+(h(ix,iz+1)*(1-u)+h(ix+1,iz+1)*u)*v;}
export function cloudCover(x,z,t,storm){let px=x*.0035+t*.0042,pz=z*.0035-t*.0015,n=0,weight=.55;for(let i=0;i<4;i++){n+=noise(px,pz)*weight;const a=px;px=(px*.8-pz*.6)*2.03+13.1;pz=(a*.6+pz*.8)*2.03+7.7;weight*=.48;}return smooth(.34-storm*.09-frontAt(x,z,t)*.14,.67-storm*.07,n);}

export const weatherUniforms={frontEnabled,weatherTime:{value:0},weatherStorm:{value:0},weatherSun:{value:new T.Vector3(-.35,.25,-.9).normalize()}};
export const cloudGLSL=`${frontGLSL}
uniform float weatherTime,weatherStorm;uniform vec3 weatherSun;
float cloudHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float cloudNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(cloudHash(i),cloudHash(i+vec2(1.,0.)),f.x),mix(cloudHash(i+vec2(0.,1.)),cloudHash(i+1.),f.x),f.y);}
float cloudFbm(vec2 p){float n=0.,w=.55;for(int i=0;i<4;i++){n+=cloudNoise(p)*w;p=mat2(.8,.6,-.6,.8)*p*2.03+vec2(13.1,7.7);w*=.48;}return n;}
float cloudCoverAt(vec2 world){vec2 p=world*.0035+vec2(weatherTime*.0042,-weatherTime*.0015);return smoothstep(.34-weatherStorm*.09-frontAt(world,weatherTime)*.14,.67-weatherStorm*.07,cloudFbm(p));}
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
 };material.onBeforeCompile.cloudPatch=true;material.customProgramCacheKey=()=>key+'-cloud-light-2';material.needsUpdate=true;}
export function cloudScene(root){root.traverse(o=>{if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])cloudMaterial(m);});}
