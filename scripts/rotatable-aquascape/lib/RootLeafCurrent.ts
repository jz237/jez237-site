import * as T from 'three';

/** Gentle submerged blade flex, shared by leaf tissue and its modeled midrib. */
export function rootLeafCurrent(material:T.Material,time:{value:number},flow:{value:number}){
 material.onBeforeCompile=shader=>{
  shader.uniforms.rootStudyTime=time;shader.uniforms.rootStudyFlow=flow;
  shader.vertexShader=`uniform float rootStudyTime;
uniform float rootStudyFlow;
attribute vec4 rootMotion;
vec4 rootLeafBend(vec3 p){
 float h=max(0.,p.y-rootMotion.x-.18);
 float a=rootStudyTime*rootMotion.z+rootMotion.y-h*.8;
 float b=rootStudyTime*.37+rootMotion.y*1.3;
 float c=rootStudyTime*rootMotion.z*.83+rootMotion.y+h*.7;
 float strength=rootMotion.w*rootStudyFlow;
 float wave=sin(a)+.25*sin(b);
 return strength*vec4(h*h*wave,.7*h*h*sin(c),2.*h*wave-.8*h*h*cos(a),.7*(2.*h*sin(c)+.7*h*h*cos(c)));
}
`+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
 vec4 rootBend=rootLeafBend(position);
 transformed.x+=rootBend.x;transformed.z+=rootBend.y;`);
  shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
 vec4 rootNormalBend=rootLeafBend(position);
 objectNormal.y-=rootNormalBend.z*objectNormal.x+rootNormalBend.w*objectNormal.z;`);
 };
 material.customProgramCacheKey=()=> 'root-leaf-current-v1';
}
export function setRootLeafMotion(geometry:T.BufferGeometry,crownY:number,phase:number,speed:number,amplitude:number){
 const count=geometry.getAttribute('position').count,values=new Float32Array(count*4);
 for(let i=0;i<count;i++)values.set([crownY,phase,speed,amplitude],i*4);
 geometry.setAttribute('rootMotion',new T.BufferAttribute(values,4));
}
