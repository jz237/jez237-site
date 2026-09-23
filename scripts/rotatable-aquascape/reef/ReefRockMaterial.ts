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
   float lowerDetail=1.-smoothstep(.7,1.65,reefRockP.y);
   vec2 fineX=stoneX*3.7+vec2(.31,.17),fineY=stoneY*3.7+vec2(.31,.17),fineZ=stoneZ*3.7+vec2(.31,.17);
   if(lowerDetail>0.){
    vec3 fineColor=texture2D(map,fineX).rgb*stoneWeight.x+texture2D(map,fineY).rgb*stoneWeight.y+texture2D(map,fineZ).rgb*stoneWeight.z;
    stoneColor*=mix(vec3(1.),clamp(fineColor*1.45,vec3(.44),vec3(1.16)),lowerDetail*.72);
   }
   diffuseColor.rgb*=stoneColor;`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`
   vec4 stoneSampleX=texture2D(normalMap,stoneX),stoneSampleY=texture2D(normalMap,stoneY),stoneSampleZ=texture2D(normalMap,stoneZ);
   float roughnessFactor=roughness*dot(vec3(stoneSampleX.a,stoneSampleY.a,stoneSampleZ.a),stoneWeight);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`
   vec3 stoneNX=stoneSampleX.xyz*2.-1.,stoneNY=stoneSampleY.xyz*2.-1.,stoneNZ=stoneSampleZ.xyz*2.-1.;
   vec2 dx=stoneNX.xy/max(.15,stoneNX.z)*normalScale,dy=stoneNY.xy/max(.15,stoneNY.z)*normalScale,dz=stoneNZ.xy/max(.15,stoneNZ.z)*normalScale;
   vec3 slope=vec3(0.,dx.y,-stoneSign.x*dx.x)*stoneWeight.x+vec3(dy.x,0.,-stoneSign.y*dy.y)*stoneWeight.y+vec3(stoneSign.z*dz.x,dz.y,0.)*stoneWeight.z;
   if(lowerDetail>0.){
    vec3 microX=texture2D(normalMap,fineX).xyz*2.-1.,microY=texture2D(normalMap,fineY).xyz*2.-1.,microZ=texture2D(normalMap,fineZ).xyz*2.-1.;
    vec2 mx=microX.xy/max(.25,microX.z),my=microY.xy/max(.25,microY.z),mz=microZ.xy/max(.25,microZ.z);
    slope+=(vec3(0.,mx.y,-stoneSign.x*mx.x)*stoneWeight.x+vec3(my.x,0.,-stoneSign.y*my.y)*stoneWeight.y+vec3(stoneSign.z*mz.x,mz.y,0.)*stoneWeight.z)*lowerDetail*.62;
   }
   normal=normalize(normalMatrix*normalize(stoneN+slope-stoneN*dot(slope,stoneN)));`);
 };
 material.customProgramCacheKey=()=> 'reef-porous-rock-triplanar-lower-micropores-v2';
 return material;
}
