import * as T from 'three';

/** Keep Three's original 20-tap PCF for full effects. The lighter mode uses one
 * hardware-filtered comparison (four taps), without a shader recompile hitch.
 * All shadow maps, lights and occluding geometry remain in place. */
export function installAdaptiveShadowFilter(scene:T.Scene,simple:{value:number}){
 const seen=new Set<T.Material>();
 const original=T.ShaderChunk.shadowmap_pars_fragment;
 const start=original.indexOf('float getShadow( sampler2DShadow');
 const marker='if ( frustumTest ) {';
 const insertion=original.indexOf(marker,start)+marker.length;
 if(start<0||insertion<marker.length)throw Error('Shadow shader changed; adaptive filtering needs review');
 const close=original.lastIndexOf('}',original.indexOf('return mix',insertion));
 if(close<insertion)throw Error('Shadow filter scope changed');
 const chunk=original.slice(0,insertion)+`
 if(aquariumSimpleShadows>.5){shadow=texture(shadowMap,shadowCoord.xyz);}else{
 `+original.slice(insertion,close)+'\n }\n'+original.slice(close);
 scene.traverse(object=>{
  if(!(object instanceof T.Mesh))return;
  for(const material of Array.isArray(object.material)?object.material:[object.material]){
   if(!(material instanceof T.MeshStandardMaterial)||seen.has(material))continue;
   seen.add(material);const compile=material.onBeforeCompile,key=material.customProgramCacheKey();
   material.onBeforeCompile=(shader,renderer)=>{
    compile.call(material,shader,renderer);shader.uniforms.aquariumSimpleShadows=simple;
    shader.fragmentShader='uniform float aquariumSimpleShadows;\n'+shader.fragmentShader.replace('#include <shadowmap_pars_fragment>',chunk);
   };
   material.customProgramCacheKey=()=>key+'-adaptive-pcf-v1';material.needsUpdate=true;
  }
 });
}
