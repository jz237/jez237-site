// Distinct restrained material responses; no coarse painted-on blotches.
export function polymer(material,rubber=false){
 material.onBeforeCompile=s=>{
  s.vertexShader='varying vec3 polymerP;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\npolymerP=position;');
  s.fragmentShader='varying vec3 polymerP;\n'+s.fragmentShader;
  s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
   float micro=sin(polymerP.x*310.)*sin(polymerP.y*337.)*sin(polymerP.z*293.);
   float fade=1.-smoothstep(.01,.04,length(fwidth(polymerP)));
   roughnessFactor=clamp(roughnessFactor+micro*fade*${rubber?'.055':'.035'},.1,1.);`);
 };material.customProgramCacheKey=()=>rubber?'drum-rubber-v5':'drum-molded-v5';return material;
}
