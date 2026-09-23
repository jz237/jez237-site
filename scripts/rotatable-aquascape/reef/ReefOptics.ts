import * as T from 'three';

/** An inexpensive artistic approximation of moving water light, not ray-traced optics. */
export function applyReefOptics(material:T.MeshStandardMaterial,clock:{value:number},daylight:{value:number}){
 if(material.userData.reefOptics)return;
 material.userData.reefOptics=true;
 const previous=material.onBeforeCompile,cacheKey=material.customProgramCacheKey();
 material.onBeforeCompile=(shader,renderer)=>{
  previous.call(material,shader,renderer);
  shader.uniforms.reefOpticsTime=clock;shader.uniforms.reefDaylight=daylight;
  shader.vertexShader='varying vec3 vReefWorld;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>',`#include <worldpos_vertex>
   vec4 reefWorld=vec4(transformed,1.);
   #ifdef USE_BATCHING
    reefWorld=batchingMatrix*reefWorld;
   #endif
   #ifdef USE_INSTANCING
    reefWorld=instanceMatrix*reefWorld;
   #endif
   vReefWorld=(modelMatrix*reefWorld).xyz;`);
  shader.fragmentShader='varying vec3 vReefWorld;uniform float reefOpticsTime,reefDaylight;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
   vec3 reefNormal=inverseTransformDirection(normal,viewMatrix);
   vec2 reefUV=vReefWorld.xz+vReefWorld.y*vec2(.17,.09);
   float reefTime=reefOpticsTime*.43;
   float waterWave=sin(reefUV.x*10.7+sin(reefUV.y*5.3+reefTime)*1.2-reefTime)
      *.55+sin(reefUV.y*11.9+sin(reefUV.x*6.7-reefTime)*1.1+reefTime*.83)*.45;
   float focus=pow(max(0.,1.-abs(waterWave)),14.);
   // Modulate shadowed direct light only; no emissive pattern glowing in caves.
   reflectedLight.directDiffuse*=1.+(focus*.58-.065)*smoothstep(-.08,.7,reefNormal.y)*reefDaylight;
  `);
  shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
   // Only the portion of the camera ray inside the tank attenuates color.
   vec3 waterRay=normalize(cameraPosition-vReefWorld);
   vec3 waterExit=mix(vec3(-5.03,.16,-2.33),vec3(5.03,5.65,2.33),step(vec3(0.),waterRay));
   vec3 waterLengths=(waterExit-vReefWorld)/(sign(waterRay)*max(abs(waterRay),vec3(.00001))+vec3(.000001));
   float waterPath=clamp(min(min(waterLengths.x,waterLengths.y),waterLengths.z),0.,length(cameraPosition-vReefWorld));
   vec3 transmittance=exp(-waterPath*vec3(.038,.017,.007));
   outgoingLight=outgoingLight*transmittance+vec3(.012,.047,.095)*(1.-transmittance)*reefDaylight;
   #include <opaque_fragment>`);
 };
 material.customProgramCacheKey=()=>cacheKey+'-reef-optics-v1';
 material.needsUpdate=true;
}

// Keep relief below food/resting heights; rubble uses the identical surface function.
export function sandHeight(x:number,z:number){
 const edge=Math.min(1,Math.max(0,(5.03-Math.abs(x))*5),Math.max(0,(2.305-Math.abs(z))*5));
 const ripple=Math.sin(z*14+x*1.1+Math.sin(x*1.6)*.7)*.006;
 const drift=Math.sin(x*.9+z*.6)*Math.cos(z*1.3)*.008;
 return .18+edge*(ripple+drift);
}
