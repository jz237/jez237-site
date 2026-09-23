import * as T from 'three';
/** Locally baked, shared full-resolution corallite maps. Regenerate with the
 * source in model-source; no texture synthesis or remote service at startup. */
export function coralSurfaceMaps(){
 const loader=new T.TextureLoader(),pending:Promise<unknown>[]=[];
 const load=(url:string,color=false)=>{let done!:()=>void,fail!:(error:unknown)=>void;pending.push(new Promise<void>((resolve,reject)=>{done=resolve;fail=reject;}));const t=loader.load(url,done,undefined,fail);t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;t.flipY=false;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;};
 return {maps:{map:load(new URL('./assets/coral/map.png',import.meta.url).href,true),normalMap:load(new URL('./assets/coral/normalMap.png',import.meta.url).href),roughnessMap:load(new URL('./assets/coral/roughnessMap.png',import.meta.url).href)},ready:Promise.all(pending)};
}
