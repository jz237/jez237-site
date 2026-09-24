import * as T from 'three';
/** Project the existing corallite maps around the whole living mantle. A single
 * frontal UV projection collapsed on steep flanks, stretching cups into long
 * plastic-looking streaks. Blend three surface-oriented projections instead;
 * their normal slopes perturb, rather than replace, the curved tissue normal. */
export function finishEncrustingMaterial(material:T.MeshStandardMaterial){
 material.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 crustP,crustN;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncrustP=position;crustN=normal;');
  shader.fragmentShader='varying vec3 crustP,crustN; uniform mat3 normalMatrix;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
   vec3 tissueN=normalize(crustN),tissueSign=sign(tissueN+vec3(.000001));
   vec3 tissueWeight=pow(abs(tissueN),vec3(6.));tissueWeight/=dot(tissueWeight,vec3(1.));
   vec2 tissueX=vec2(-tissueSign.x*crustP.z,crustP.y)*3.2;
   vec2 tissueY=vec2(crustP.x,-tissueSign.y*crustP.z)*3.2;
   vec2 tissueZ=vec2(tissueSign.z*crustP.x,crustP.y)*3.2;
   diffuseColor.rgb*=texture2D(map,tissueX).rgb*tissueWeight.x+texture2D(map,tissueY).rgb*tissueWeight.y+texture2D(map,tissueZ).rgb*tissueWeight.z;`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`
   float roughnessFactor=roughness*(texture2D(roughnessMap,tissueX).g*tissueWeight.x+texture2D(roughnessMap,tissueY).g*tissueWeight.y+texture2D(roughnessMap,tissueZ).g*tissueWeight.z);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`
   vec3 tissueNX=texture2D(normalMap,tissueX).xyz*2.-1.,tissueNY=texture2D(normalMap,tissueY).xyz*2.-1.,tissueNZ=texture2D(normalMap,tissueZ).xyz*2.-1.;
   vec2 tx=tissueNX.xy/max(.2,tissueNX.z)*normalScale,ty=tissueNY.xy/max(.2,tissueNY.z)*normalScale,tz=tissueNZ.xy/max(.2,tissueNZ.z)*normalScale;
   vec3 tissueSlope=vec3(0.,tx.y,-tissueSign.x*tx.x)*tissueWeight.x+vec3(ty.x,0.,-tissueSign.y*ty.y)*tissueWeight.y+vec3(tissueSign.z*tz.x,tz.y,0.)*tissueWeight.z;
   normal=normalize(normal+normalMatrix*(tissueSlope-tissueN*dot(tissueSlope,tissueN))*faceDirection);`);
 };
 material.customProgramCacheKey=()=> 'reef-encrusting-curved-corallites-v1';
 return material;
}
/** Fine cup walls and radial ribs, baked offline rather than evaluated per pixel
 * every frame. Kept separate from the smaller pores of branching colonies. */
export function encrustingSurfaceMaps(){
 const loader=new T.TextureLoader(),pending:Promise<unknown>[]=[];
 const load=(url:string,color=false)=>{let done!:()=>void,fail!:(error:unknown)=>void;pending.push(new Promise<void>((resolve,reject)=>{done=resolve;fail=reject;}));const t=loader.load(url,done,undefined,fail);t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;t.flipY=false;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;};
 return {maps:{map:load(new URL('./assets/encrusting/map.png',import.meta.url).href,true),normalMap:load(new URL('./assets/encrusting/normalMap.png',import.meta.url).href),roughnessMap:load(new URL('./assets/encrusting/roughnessMap.png',import.meta.url).href)},ready:Promise.all(pending)};
}
