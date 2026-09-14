import * as T from 'three';

/** Six directional visibility estimates, compressed into an ambient term and
 * first-order directional terms. Calculated once, not per animation frame. */
export function ceramicExposure(position:T.Vector3,rotation:T.Quaternion,neighbors:T.Vector3[]){
 const axes=[new T.Vector3(1,0,0),new T.Vector3(-1,0,0),new T.Vector3(0,1,0),new T.Vector3(0,-1,0),new T.Vector3(0,0,1),new T.Vector3(0,0,-1)];
 const values=axes.map(local=>{
  const normal=local.clone().applyQuaternion(rotation),point=position.clone().addScaledVector(normal,.092);let visibility=1;
  for(const center of neighbors){if(center.distanceToSquared(position)<1e-10)continue;const delta=center.clone().sub(point),distance=delta.length();if(distance>.65)continue;
   const facing=Math.max(0,normal.dot(delta)/Math.max(distance,1e-5));
   visibility*=1-facing*Math.min(.85,.115**2/Math.max(distance*distance,1e-6))*.84;
  }
  return Math.max(.15,visibility);
 });
 return new T.Vector4(values.reduce((a,b)=>a+b,0)/6,(values[0]-values[1])*.5,(values[2]-values[3])*.5,(values[4]-values[5])*.5);
}

/** Occlude indirect light only: ceramic stays pale under direct illumination. */
export function shadeCeramic(material:T.MeshStandardMaterial){
 material.onBeforeCompile=shader=>{
  shader.vertexShader=`attribute float ceramicCavity;
  #ifdef USE_INSTANCING
   attribute vec4 mediaExposure;
  #endif
  varying float vCeramicVisibility;\n`+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
   vCeramicVisibility=1.0;
   #ifdef USE_COLOR
    vCeramicVisibility=ceramicCavity;
    #ifdef USE_INSTANCING
     vCeramicVisibility*=clamp(mediaExposure.x+dot(mediaExposure.yzw,normal),.15,1.0);
    #endif
   #endif`);
  shader.fragmentShader='varying float vCeramicVisibility;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <aomap_fragment>',`#include <aomap_fragment>
   reflectedLight.indirectDiffuse*=vCeramicVisibility;
   reflectedLight.indirectSpecular*=mix(.5,1.0,vCeramicVisibility);`);
 };
 material.customProgramCacheKey=()=> 'canister-ceramic-visibility-1';
}
