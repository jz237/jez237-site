import * as T from 'three';

// Shared by direct surfaces and the viewing leg of underwater reflections.
export const waterOpticsShader=`
float waterPath(vec3 origin,vec3 direction,float distanceToSurface){
 vec3 safeDirection=(step(vec3(0.),direction)*2.-1.)*max(abs(direction),vec3(.00001));
 vec3 a=(vec3(-5.06,.12,-2.31)-origin)/safeDirection;
 vec3 b=(vec3(5.06,5.36,2.31)-origin)/safeDirection;
 vec3 nearHit=min(a,b),farHit=max(a,b);
 float entry=max(max(nearHit.x,nearHit.y),nearHit.z);
 float exit=min(min(farHit.x,farHit.y),farHit.z);
 return max(0.,min(distanceToSurface,exit)-max(0.,entry));
}
vec3 attenuateWater(vec3 radiance,float opticalDistance,float illumination){
 vec3 transmission=exp(-vec3(.032,.011,.020)*opticalDistance);
 return radiance*transmission+vec3(.016,.032,.025)*illumination*(1.-transmission);
}
`;

/** Attenuate only the part of the viewing ray actually inside the aquarium water. */
export function applyWaterDepth(scene:T.Scene,illumination:{value:number}){
 const seen=new Set<T.Material>();
 scene.traverse(object=>{
  if(!(object instanceof T.Mesh))return;
  for(const material of Array.isArray(object.material)?object.material:[object.material]){
   if(!(material instanceof T.MeshStandardMaterial)||seen.has(material))continue;
   seen.add(material);
   // Transmissive glass samples the already-shaded scene; avoid counting its water path twice.
   if(material.userData.skipWaterDepth||material instanceof T.MeshPhysicalMaterial&&material.transmission>0)continue;
   const compile=material.onBeforeCompile,cacheKey=material.customProgramCacheKey();
   material.onBeforeCompile=(shader,renderer)=>{
    compile.call(material,shader,renderer);
    shader.uniforms.waterIllumination=illumination;
    shader.fragmentShader=`uniform float waterIllumination;\n${waterOpticsShader}`+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
vec3 waterRay=inverseTransformDirection(-normalize(vViewPosition),viewMatrix);
float opticalDistance=waterPath(cameraPosition,waterRay,length(vViewPosition));
outgoingLight=attenuateWater(outgoingLight,opticalDistance,waterIllumination);
#include <opaque_fragment>`);
   };
   material.customProgramCacheKey=()=>cacheKey+'-bounded-water-depth-v2';material.needsUpdate=true;
  }
 });
}
