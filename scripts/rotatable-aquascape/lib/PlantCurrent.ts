import * as T from 'three';

/** Shared rooted deformation keeps leaf attachments, stems and shadows together. */
export function plantCurrent(material:T.Material,time:{value:number},flutter=false){
 material.onBeforeCompile=shader=>{
  shader.uniforms.waterTime=time;
  shader.vertexShader=`uniform float waterTime;
attribute vec3 plantRoot;
attribute float plantFlex;
${flutter?`attribute vec3 leafMotion;
vec3 animatedLeaf(vec3 p){
 float phase=waterTime*leafMotion.z+leafMotion.x;
 float surge=.78+.22*sin(waterTime*.37+leafMotion.x*.43);
 float ripple=(sin(phase+p.y*2.8)+.3*sin(phase*1.9+.7))*surge;
 p.z+=leafMotion.y*(ripple*p.y*p.y+.8*p.x*p.y*sin(phase*.8+1.2));
 return p;
}
vec3 animatedLeafNormal(vec3 p,vec3 n){
 float phase=waterTime*leafMotion.z+leafMotion.x;
 float surge=.78+.22*sin(waterTime*.37+leafMotion.x*.43);
 float ripple=(sin(phase+p.y*2.8)+.3*sin(phase*1.9+.7))*surge;
 float twist=sin(phase*.8+1.2);
 float dx=leafMotion.y*.8*p.y*twist;
 float dy=leafMotion.y*(2.*p.y*ripple+2.8*p.y*p.y*cos(phase+p.y*2.8)*surge+.8*p.x*twist);
 return vec3(n.x-dx*n.z,n.y-dy*n.z,n.z);
}
`:''}
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
transformed=animatedLeaf(transformed);
`);
  if(flutter)shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
objectNormal=animatedLeafNormal(position,objectNormal);
`);
  shader.vertexShader=shader.vertexShader.replace('#include <defaultnormal_vertex>',T.ShaderChunk.defaultnormal_vertex.replace('transformedNormal = normalMatrix * transformedNormal;',`
vec3 plantNormalPosition=position;
${flutter?'plantNormalPosition=animatedLeaf(plantNormalPosition);':''}
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
   shader.uniforms.leafOpticalDensity={value:material.userData.leafOpticalDensity??1};
   shader.fragmentShader='uniform float leafOpticalDensity;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
// A paler abaxial face and thicker veins break the uniform plastic-sheet response.
if(!gl_FrontFacing){
 float tissueLuma=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(tissueLuma),.12)*vec3(1.08,1.12,.99);
}
float leafTissueDensity=.27;
#ifdef USE_ROUGHNESSMAP
 leafTissueDensity=texture2D(roughnessMap,vRoughnessMapUv).r;
#endif
float leafOpticalDepth=max(.05,leafTissueDensity*leafOpticalDensity)*3.5;
`);
   // Use each light's attenuated, shadowed irradiance for thin-leaf transmission.
   const direct='RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );';
   shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_begin>',T.ShaderChunk.lights_fragment_begin.replaceAll(direct,direct+`
{ // Each unrolled light needs its own local scope.
// Oblique light travels farther through the blade; dense veins transmit less.
float leafBackCos=saturate(dot(-geometryNormal,directLight.direction));
float leafTransmittance=.52*exp(-leafOpticalDepth/max(.28,leafBackCos));
// A pigment tint approximates transmitted color separately from surface reflectance.
vec3 leafTransmissionTint=pow(max(material.diffuseColor,vec3(0.)),vec3(.65));
reflectedLight.directDiffuse += directLight.color * leafTransmissionTint * leafTransmittance * RECIPROCAL_PI * pow(leafBackCos,.8);
}
`));
  }
 };
 material.customProgramCacheKey=()=>`rooted-plant-current-translucency-v7-${flutter}-${material.type}`;
}

export function setPlantRoots(geometry:T.BufferGeometry,roots:number[],flex:number[]){
 geometry.setAttribute('plantRoot',new T.InstancedBufferAttribute(new Float32Array(roots),3));
 geometry.setAttribute('plantFlex',new T.InstancedBufferAttribute(new Float32Array(flex),1));
}
