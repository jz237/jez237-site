// Complementary opaque dithering: each screen pixel belongs to one tree
// representation during a transition. No transparent blending or sorting pass.
import * as THREE from 'three';
export const TREE_FADE_SECONDS = 0.45;
export function treeBlend(record, time) {
  const u=THREE.MathUtils.smoothstep(time-record.lodStart,0,TREE_FADE_SECONDS);
  return record.lodFrom+(record.lodTo-record.lodFrom)*u;
}
export function installTreeFade(material, role, clock, depth = true) {
  const prior=material.onBeforeCompile, key=material.customProgramCacheKey();
  material.onBeforeCompile=shader=>{
    prior.call(material,shader);
    shader.uniforms.treeClock=clock;shader.uniforms.treeRole={value:role};
    shader.vertexShader=shader.vertexShader.replace('#include <common>',`#include <common>
      uniform float treeClock; uniform float treeRole;
      varying float vTreeBlend;
      #ifdef USE_INSTANCING
        attribute vec3 aTreeLod;
      #endif`)
      .replace('#include <begin_vertex>',`#include <begin_vertex>
        vTreeBlend=treeRole;
        #ifdef USE_INSTANCING
          float u=smoothstep(0.0,0.45,treeClock-aTreeLod.z);
          vTreeBlend=mix(aTreeLod.x,aTreeLod.y,u);
        #endif`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
      uniform float treeRole; varying float vTreeBlend;`)
      .replace('#include <alphatest_fragment>',`#include <alphatest_fragment>
        if((treeRole>0.5&&vTreeBlend<0.001)||(treeRole<0.5&&vTreeBlend>0.999))discard;
        if(vTreeBlend>0.001&&vTreeBlend<0.999){
          float grain=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(0.06711056,0.00583715))));
          if(treeRole>0.5 ? grain>=vTreeBlend : grain<vTreeBlend) discard;
        }`);
  };
  material.customProgramCacheKey=()=>key+'-tree-fade3-'+role;
  if(depth) {
    const shadow=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:material.map,
      alphaTest:material.alphaTest,side:THREE.FrontSide});
    installTreeFade(shadow,role,clock,false);material.lodDepth=shadow;
  }
}
export function treeLodAttribute(geometry, count) {
  const attr=new THREE.InstancedBufferAttribute(new Float32Array(count*3),3);
  attr.setUsage(THREE.DynamicDrawUsage);geometry.setAttribute('aTreeLod',attr);return attr;
}
