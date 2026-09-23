import * as T from 'three';
/** Fine cup walls and radial ribs, baked offline rather than evaluated per pixel
 * every frame. Kept separate from the smaller pores of branching colonies. */
export function encrustingSurfaceMaps(){
 const loader=new T.TextureLoader(),pending:Promise<unknown>[]=[];
 const load=(url:string,color=false)=>{let done!:()=>void,fail!:(error:unknown)=>void;pending.push(new Promise<void>((resolve,reject)=>{done=resolve;fail=reject;}));const t=loader.load(url,done,undefined,fail);t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;t.flipY=false;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;};
 return {maps:{map:load(new URL('./assets/encrusting/map.png',import.meta.url).href,true),normalMap:load(new URL('./assets/encrusting/normalMap.png',import.meta.url).href),roughnessMap:load(new URL('./assets/encrusting/roughnessMap.png',import.meta.url).href)},ready:Promise.all(pending)};
}
