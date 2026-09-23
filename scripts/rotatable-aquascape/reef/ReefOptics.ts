import * as T from 'three';
import {reefCausticsShader} from './ReefCaustics.ts';

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
  shader.fragmentShader='varying vec3 vReefWorld;uniform float reefOpticsTime,reefDaylight;\n'+reefCausticsShader+shader.fragmentShader;
  // Standard materials assume an air/tissue interface. Submerged coral/rock
  // has lower Fresnel contrast. Keep normal/roughness detail, reduce the broad
  // air-like specular sheen. Fish already carry an explicit underwater IOR.
  if(!(material instanceof T.MeshPhysicalMaterial))shader.fragmentShader=shader.fragmentShader.replace('#include <lights_physical_fragment>',`#include <lights_physical_fragment>
   material.specularColor*=.25;`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
   vec3 reefNormal=inverseTransformDirection(normal,viewMatrix);
   float reefDepth=max(0.,5.45-vReefWorld.y);
   vec2 reefUV=vReefWorld.xz-reefDepth*vec2(.13,.025);
   float focus=reefCausticFocus(reefUV,reefDepth,reefOpticsTime);
   float facing=smoothstep(.0,.8,dot(reefNormal,normalize(vec3(-.13,1.,-.025))));
   // Shadowed direct illumination only: cave walls cannot emit caustic light.
   // Keep the redistribution bounded, with slight warm-light loss on descent.
   vec3 incidentTransmission=exp(-reefDepth*vec3(.022,.009,.004));
   reflectedLight.directDiffuse*=incidentTransmission*(1.+(focus*.36-.075)*facing*reefDaylight);
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
 material.customProgramCacheKey=()=>cacheKey+'-reef-optics-wave-focus-v3';
 material.needsUpdate=true;
}

// Static deposition around the two island feet, with a lower winding channel.
// Not a sediment simulation. Shared by the bed and its partly buried rubble.
export function sandBank(x:number,z:number){
 const left=Math.exp(-((x+2.95+Math.sin(z*1.8)*.16)**2/1.65+(z-.1)**2/3.2));
 const right=Math.exp(-((x-2.55-Math.sin(z*1.5)*.23)**2/2.15+(z-.2)**2/3.5));
 const toe=Math.exp(-((x-.7)**2/.4+(z-1.43)**2/.4));
 return Math.min(1,left+right+toe*.42);
}
// Low deposited dunes, scalloped island toes and a shallow channel. Food and
// fish clearance follow this terrain; the tank perimeter remains sealed.
export function sandHeight(x:number,z:number){
 const edge=Math.min(1,Math.max(0,(5.03-Math.abs(x))*4),Math.max(0,(2.305-Math.abs(z))*4));
 const fade=edge*edge*(3-2*edge),bank=sandBank(x,z);
 const phase=z*11.4+x*.85+Math.sin(x*1.9)*.65;
 const ripple=(Math.sin(phase)+Math.sin(phase*2+.7)*.22)*(.010+bank*.008);
 const drift=Math.sin(x*2.1+z*.7)*Math.cos(z*1.6)*.009;
 const dunes=.115*Math.exp(-((x+1.85)**2/.85+(z-1.42)**2/.32))+.14*Math.exp(-((x-1.48)**2/.65+(z-1.58)**2/.26))+.09*Math.exp(-((x+3.85)**2/.45+(z-.98)**2/.30));
 return .18+fade*(bank*.14+dunes+ripple+drift);
}
