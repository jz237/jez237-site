import * as T from 'three';
import {rubbleNodules} from './ReefRockMaterial.ts';
// Reef pigments fluoresce under actinic light: saturated tissue emits a share
// of its own color, so greens, pinks and oranges stay vivid in blue water.
export const reefFluorescence=(strength:number)=>`#include <emissivemap_fragment>
 vec3 reefPigment=diffuseColor.rgb;float reefChroma=max(reefPigment.r,max(reefPigment.g,reefPigment.b))-min(reefPigment.r,min(reefPigment.g,reefPigment.b));
 totalEmissiveRadiance+=reefPigment*${strength.toFixed(3)}*(.15+.85*smoothstep(.04,.3,reefChroma));`;
/** Branch skin of densely set corallites at world scale: each a small raised
 * cup with a pale rim and a dark central pit, the rough "bottlebrush" surface of
 * Acropora branches. Adds no geometry; the baked maps keep their own detail. */
export function finishCoralMaterial(material:T.MeshStandardMaterial){
 material.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 reefCoralP;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nreefCoralP=position;');
  shader.fragmentShader='varying vec3 reefCoralP; uniform mat3 normalMatrix;\n'+rubbleNodules+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   vec3 cupTo,cupId;float cupF1,cupF2;
   reefNodules(reefCoralP*52.,cupF1,cupF2,cupTo,cupId);
   float cupPit=1.-smoothstep(.04,.2,cupF1),cupRim=smoothstep(.16,.34,cupF1)*(1.-smoothstep(.5,.78,cupF1)),cupGap=smoothstep(.0,.13,cupF2-cupF1);
   float coralLuma=dot(diffuseColor.rgb,vec3(.3,.59,.11));
   diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*.55+vec3(coralLuma*.62),.32*cupRim);
   diffuseColor.rgb*=mix(.66,1.,cupGap)*(1.-.5*cupPit)*(.94+.12*cupId.x);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
   vec3 cupSlope=normalMatrix*(-cupTo*(1.5*cupF1)*(1.-2.2*cupPit));
   normal=normalize(normal+cupSlope-normal*dot(cupSlope,normal));`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',reefFluorescence(.42));
 };
 material.customProgramCacheKey=()=>'reef-coral-corallite-skin-fluorescent-v2';
 return material;
}
/** Locally baked, shared full-resolution corallite maps. Regenerate with the
 * source in model-source; no texture synthesis or remote service at startup. */
export function coralSurfaceMaps(){
 const loader=new T.TextureLoader(),pending:Promise<unknown>[]=[];
 const load=(url:string,color=false)=>{let done!:()=>void,fail!:(error:unknown)=>void;pending.push(new Promise<void>((resolve,reject)=>{done=resolve;fail=reject;}));const t=loader.load(url,done,undefined,fail);t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;t.flipY=false;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;};
 return {maps:{map:load(new URL('./assets/coral/map.png',import.meta.url).href,true),normalMap:load(new URL('./assets/coral/normalMap.png',import.meta.url).href),roughnessMap:load(new URL('./assets/coral/roughnessMap.png',import.meta.url).href)},ready:Promise.all(pending)};
}
