// Complementary opaque dithering: each screen pixel belongs to one tree
// representation during a transition. No transparent blending or sorting pass.
import * as THREE from 'three';
export const TREE_FADE_SECONDS = 0.45;
export function treeBlend(record, time) {
  const u=THREE.MathUtils.smoothstep(time-record.lodStart,0,TREE_FADE_SECONDS);
  return record.lodFrom+(record.lodTo-record.lodFrom)*u;
}
// Camera cut-away: foliage inside a cone from the camera to the player tank
// dithers out, so a crown between the lens and the hull never fills the
// screen. Shadows (depth materials) are untouched. Updated once per frame.
export const treeOcclusion={
  cam:{value:new THREE.Vector3()},target:{value:new THREE.Vector3()},on:{value:0},
};
export function installTreeFade(material, role, clock, depth = true) {
  const prior=material.onBeforeCompile, key=material.customProgramCacheKey();
  const cutaway=depth;
  material.onBeforeCompile=shader=>{
    prior.call(material,shader);
    shader.uniforms.treeClock=clock;shader.uniforms.treeRole={value:role};
    if(cutaway){
      shader.uniforms.occCam=treeOcclusion.cam;shader.uniforms.occTarget=treeOcclusion.target;
      shader.uniforms.occOn=treeOcclusion.on;
      shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vOccWorld;')
        .replace('#include <project_vertex>',`{
          vec4 occW=vec4(transformed,1.0);
          #ifdef USE_INSTANCING
            occW=instanceMatrix*occW;
          #endif
          vOccWorld=(modelMatrix*occW).xyz;
        }
        #include <project_vertex>`);
      shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
        uniform vec3 occCam; uniform vec3 occTarget; uniform float occOn; varying vec3 vOccWorld;`)
        .replace('#include <alphatest_fragment>',`#include <alphatest_fragment>
        if(occOn>0.5){
          vec3 occSeg=occTarget-occCam; float occLen=length(occSeg); vec3 occDir=occSeg/max(occLen,0.001);
          vec3 occRel=vOccWorld-occCam; float occT=dot(occRel,occDir);
          if(occT>0.2&&occT<occLen-1.0){
            // cone ~13 degrees half-angle, widest at the tank
            float occR=1.3+occT*0.3, occD=length(occRel-occDir*occT);
            // clear core, dithered rim (stacked crowns multiply any partial cut)
            float occCut=(1.0-smoothstep(occR*0.72,occR,occD))*smoothstep(occLen-1.0,occLen-2.6,occT);
            float occGrain=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(0.06711056,0.00583715))));
            if(occCut>0.98||occGrain<occCut)discard;
          }
        }`);
    }
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
  material.customProgramCacheKey=()=>key+'-tree-fade3-'+role+(cutaway?'-cut1':'');
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
