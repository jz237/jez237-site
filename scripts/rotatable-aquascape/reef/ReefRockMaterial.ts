import * as T from 'three';
/** World-scale projections keep pores round on steep walls and undercuts. The
 * normal perturbation is projected onto the actual curved surface, so blending
 * projection axes never replaces the rock's geometric shading normal. */
export function finishRockMaterial(material:T.MeshStandardMaterial){
 material.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 reefRockP,reefRockN;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nreefRockP=position;reefRockN=normal;');
  shader.fragmentShader='varying vec3 reefRockP,reefRockN; uniform mat3 normalMatrix;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
   vec3 stoneN=normalize(reefRockN),stoneSign=sign(stoneN+vec3(.000001));
   vec3 stoneWeight=pow(abs(stoneN),vec3(4.));stoneWeight/=dot(stoneWeight,vec3(1.));
   vec2 stoneX=vec2(-stoneSign.x*reefRockP.z,reefRockP.y)*.78;
   vec2 stoneY=vec2(reefRockP.x,-stoneSign.y*reefRockP.z)*.78;
   vec2 stoneZ=vec2(stoneSign.z*reefRockP.x,reefRockP.y)*.78;
   vec3 stoneColor=texture2D(map,stoneX).rgb*stoneWeight.x+texture2D(map,stoneY).rgb*stoneWeight.y+texture2D(map,stoneZ).rgb*stoneWeight.z;
   diffuseColor.rgb*=stoneColor;`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`
   vec4 stoneSampleX=texture2D(normalMap,stoneX),stoneSampleY=texture2D(normalMap,stoneY),stoneSampleZ=texture2D(normalMap,stoneZ);
   float roughnessFactor=roughness*dot(vec3(stoneSampleX.a,stoneSampleY.a,stoneSampleZ.a),stoneWeight);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`
   vec3 stoneNX=stoneSampleX.xyz*2.-1.,stoneNY=stoneSampleY.xyz*2.-1.,stoneNZ=stoneSampleZ.xyz*2.-1.;
   vec2 dx=stoneNX.xy/max(.15,stoneNX.z)*normalScale,dy=stoneNY.xy/max(.15,stoneNY.z)*normalScale,dz=stoneNZ.xy/max(.15,stoneNZ.z)*normalScale;
   vec3 slope=vec3(0.,dx.y,-stoneSign.x*dx.x)*stoneWeight.x+vec3(dy.x,0.,-stoneSign.y*dy.y)*stoneWeight.y+vec3(stoneSign.z*dz.x,dz.y,0.)*stoneWeight.z;
   normal=normalize(normalMatrix*normalize(stoneN+slope-stoneN*dot(slope,stoneN)));`);
 };
 material.customProgramCacheKey=()=> 'reef-porous-rock-triplanar-v1';
 return material;
}
