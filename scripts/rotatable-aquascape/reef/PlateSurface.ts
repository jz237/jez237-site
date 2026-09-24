import * as T from 'three';
/** Separate upper tissue from porous lower skeleton without another material
 * batch. One packed normal/occlusion lookup only on lower faces. */
export function finishPlateMaterial(material:T.MeshStandardMaterial,skeleton:T.Texture){
 material.onBeforeCompile=shader=>{
  shader.uniforms.plateSkeleton={value:skeleton};
  shader.vertexShader='attribute float plateTissue;attribute float plateUnderside;varying float vPlateTissue;varying float vPlateUnderside;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvPlateTissue=plateTissue;vPlateUnderside=plateUnderside;');
  shader.fragmentShader='uniform sampler2D plateSkeleton;varying float vPlateTissue;varying float vPlateUnderside;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`vec4 skeletonSample=vec4(.5,.5,1.,1.);
if(vPlateUnderside>.001) skeletonSample=texture2D(plateSkeleton,vMapUv*1.6);
`+T.ShaderChunk.map_fragment.replace('diffuseColor *= sampledDiffuseColor;',`sampledDiffuseColor.rgb=mix(vec3(.76,.72,.67),sampledDiffuseColor.rgb,vPlateTissue);
sampledDiffuseColor.rgb=mix(sampledDiffuseColor.rgb,vec3(skeletonSample.a),vPlateUnderside);
diffuseColor *= sampledDiffuseColor;`));
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',T.ShaderChunk.normal_fragment_maps.replace('mapN.xy *= normalScale;',`mapN=mix(mapN,skeletonSample.rgb*2.-1.,vPlateUnderside);
mapN.xy *= normalScale*mix(vPlateTissue,.92,vPlateUnderside);`));
 };
 material.customProgramCacheKey=()=> 'reef-plate-skeleton-v2';
 return material;
}
/** Immersed cups, asymmetric hoods and fine tissue ridges, baked offline rather than evaluated per pixel
 * every frame. Mapped separately from the smaller pores of branching colonies. */
export function plateSurfaceMaps(){
 const loader=new T.TextureLoader(),pending:Promise<unknown>[]=[];
 const load=(url:string,color=false)=>{let done!:()=>void,fail!:(error:unknown)=>void;pending.push(new Promise<void>((resolve,reject)=>{done=resolve;fail=reject;}));const t=loader.load(url,done,undefined,fail);t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;t.flipY=false;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;};
 const maps={map:load(new URL('./assets/plate/map.png',import.meta.url).href,true),normalMap:load(new URL('./assets/plate/normalMap.png',import.meta.url).href),roughnessMap:load(new URL('./assets/plate/roughnessMap.png',import.meta.url).href)},skeleton=load(new URL('./assets/plate/skeleton.png',import.meta.url).href);
 return {maps,skeleton,ready:Promise.all(pending)};
}
