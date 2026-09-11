import * as T from 'three';

/** Shared rooted deformation keeps leaf attachments, stems and shadows together. */
export function plantCurrent(material:T.Material,time:{value:number},flutter=false){
 material.onBeforeCompile=shader=>{
  shader.uniforms.waterTime=time;
  shader.vertexShader=`uniform float waterTime;
attribute vec3 plantRoot;
attribute float plantFlex;
vec3 bendPlant(vec3 p){
 float h=max(0.,p.y-plantRoot.y);
 float phase=plantRoot.x*.47+plantRoot.z*.71;
 float current=sin(waterTime*.61+phase)*.035+sin(waterTime*.93+phase*1.7)*.013;
 p.x+=current*h*h*plantFlex*clamp((4.96-abs(p.x))*2.,0.,1.);
 p.z+=sin(waterTime*.48+phase+.8)*.029*h*h*plantFlex*clamp((2.20-abs(p.z))*2.,0.,1.);
 return p;
}
vec3 bendPlantNormal(vec3 p,vec3 n){
 float h=max(0.,p.y-plantRoot.y),phase=plantRoot.x*.47+plantRoot.z*.71;
 float c=(sin(waterTime*.61+phase)*.035+sin(waterTime*.93+phase*1.7)*.013)*plantFlex;
 float d=sin(waterTime*.48+phase+.8)*.029*plantFlex;
 float fx=clamp((4.96-abs(p.x))*2.,0.,1.),fz=clamp((2.20-abs(p.z))*2.,0.,1.);
 float dfx=fx>0.&&fx<1.?-2.*sign(p.x):0.,dfz=fz>0.&&fz<1.?-2.*sign(p.z):0.;
 // Inverse transpose of the actual rooted bend, after the instance transform.
 float nx=n.x/(1.+c*h*h*dfx),nz=n.z/(1.+d*h*h*dfz);
 return vec3(nx,n.y-2.*h*(c*fx*nx+d*fz*nz),nz);
}
`+shader.vertexShader;
  if(flutter)shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
transformed.z+=sin(waterTime*1.1+plantRoot.x*2.1+position.y*3.)*.022*uv.y*uv.y;
`);
  if(flutter)shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
float leafPhase=waterTime*1.1+plantRoot.x*2.1+position.y*3.;
objectNormal.y-=.022*(3.*cos(leafPhase)*position.y*position.y+2.*sin(leafPhase)*position.y)*objectNormal.z;
`);
  shader.vertexShader=shader.vertexShader.replace('#include <defaultnormal_vertex>',T.ShaderChunk.defaultnormal_vertex.replace('transformedNormal = normalMatrix * transformedNormal;',`
vec3 plantNormalPosition=position;
${flutter?'plantNormalPosition.z+=sin(waterTime*1.1+plantRoot.x*2.1+position.y*3.)*.022*position.y*position.y;':''}
#ifdef USE_INSTANCING
 plantNormalPosition=(instanceMatrix*vec4(plantNormalPosition,1.)).xyz;
#endif
transformedNormal=bendPlantNormal(plantNormalPosition,transformedNormal);
transformedNormal = normalMatrix * transformedNormal;
`));
  // Instanced coordinates are in scene space, so every part of one plant bends identically.
  shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',T.ShaderChunk.project_vertex.replace('mvPosition = modelViewMatrix * mvPosition;','mvPosition.xyz = bendPlant(mvPosition.xyz);\nmvPosition = modelViewMatrix * mvPosition;'));
  shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>',T.ShaderChunk.worldpos_vertex.replace('worldPosition = modelMatrix * worldPosition;','worldPosition.xyz = bendPlant(worldPosition.xyz);\nworldPosition = modelMatrix * worldPosition;'));
  if(flutter&&material instanceof T.MeshStandardMaterial){
   // Use each light's attenuated, shadowed irradiance for thin-leaf transmission.
   const direct='RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );';
   shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_begin>',T.ShaderChunk.lights_fragment_begin.replaceAll(direct,direct+`
reflectedLight.directDiffuse += directLight.color * material.diffuseColor * .38 * RECIPROCAL_PI * pow(saturate(dot(-geometryNormal,directLight.direction)),.8);
`));
  }
 };
 material.customProgramCacheKey=()=>`rooted-plant-current-translucency-v3-${flutter}-${material.type}`;
}

export function setPlantRoots(geometry:T.BufferGeometry,roots:number[],flex:number[]){
 geometry.setAttribute('plantRoot',new T.InstancedBufferAttribute(new Float32Array(roots),3));
 geometry.setAttribute('plantFlex',new T.InstancedBufferAttribute(new Float32Array(flex),1));
}
