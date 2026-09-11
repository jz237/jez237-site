import * as T from 'three';

/** The low scanned fronds flex in object space; their normals and shadows agree. */
export function fernCurrent(material:T.Material,time:{value:number}){
 material.onBeforeCompile=shader=>{
  shader.uniforms.fernTime=time;
  shader.vertexShader=`uniform float fernTime;
vec4 fernFlow(float h){
 float phase=modelMatrix[3].x*.8+modelMatrix[3].z*1.1;
 float a=fernTime*.9+phase-h*3.,b=fernTime*1.7+phase*1.3-h*7.,c=fernTime*.72+phase*.9-h*2.;
 return vec4(.22*sin(a)+.05*sin(b),-.66*cos(a)-.35*cos(b),.14*sin(c),-.28*cos(c));
}
vec3 fernBend(vec3 p){
 float h=max(0.,p.y);vec4 flow=fernFlow(h);
 p.x+=h*h*flow.x;p.z+=h*h*flow.z;return p;
}
vec3 fernNormal(vec3 p,vec3 n){
 float h=max(0.,p.y);vec4 flow=fernFlow(h);
 n.y-=(2.*h*flow.x+h*h*flow.y)*n.x+(2.*h*flow.z+h*h*flow.w)*n.z;return n;
}
`+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed=fernBend(transformed);');
  shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nobjectNormal=fernNormal(position,objectNormal);');
 };
 material.customProgramCacheKey=()=>`scanned-fern-current-v2-${material.type}`;
}
