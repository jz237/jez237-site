import * as T from 'three';
/** Fine relief belongs to mature upper tissue; the growth edge and underside
 * remain smoother. One normalized byte per vertex, no per-frame CPU updates. */
export function finishPlateMaterial(material:T.MeshStandardMaterial){
 material.onBeforeCompile=shader=>{
  shader.vertexShader='attribute float plateTissue;varying float vPlateTissue;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvPlateTissue=plateTissue;');
  shader.fragmentShader='varying float vPlateTissue;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',T.ShaderChunk.map_fragment.replace('diffuseColor *= sampledDiffuseColor;','sampledDiffuseColor.rgb=mix(vec3(.76,.72,.67),sampledDiffuseColor.rgb,vPlateTissue);\ndiffuseColor *= sampledDiffuseColor;'));
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',T.ShaderChunk.normal_fragment_maps.replace('mapN.xy *= normalScale;','mapN.xy *= normalScale*vPlateTissue;'));
 };
 material.customProgramCacheKey=()=> 'reef-plate-tissue-v1';
 return material;
}
/** Immersed cups, asymmetric hoods and fine tissue ridges, baked offline rather than evaluated per pixel
 * every frame. Mapped separately from the smaller pores of branching colonies. */
export function plateSurfaceMaps(){
 const loader=new T.TextureLoader(),pending:Promise<unknown>[]=[];
 const load=(url:string,color=false)=>{let done!:()=>void,fail!:(error:unknown)=>void;pending.push(new Promise<void>((resolve,reject)=>{done=resolve;fail=reject;}));const t=loader.load(url,done,undefined,fail);t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;t.flipY=false;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;};
 return {maps:{map:load(new URL('./assets/plate/map.png',import.meta.url).href,true),normalMap:load(new URL('./assets/plate/normalMap.png',import.meta.url).href),roughnessMap:load(new URL('./assets/plate/roughnessMap.png',import.meta.url).href)},ready:Promise.all(pending)};
}
