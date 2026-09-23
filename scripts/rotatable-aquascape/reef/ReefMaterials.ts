import * as T from 'three';

// Original periodic porous limestone maps, baked offline. See assets/README.md.
export function limestoneMaps(){
 const loader=new T.TextureLoader(),pending:Promise<unknown>[]=[];
 const load=(url:string,color=false)=>{
  let done!:()=>void,fail!:(error:unknown)=>void;
  pending.push(new Promise<void>((resolve,reject)=>{done=resolve;fail=reject;}));
  const map=loader.load(url,()=>done(),undefined,fail);
  map.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;
  map.repeat.set(2.4,1.6);map.anisotropy=8;return map;
 };
 const map=load(new URL('./assets/limestone/map.png',import.meta.url).href,true);
 const normalMap=load(new URL('./assets/limestone/normalMap.png',import.meta.url).href);
 // Roughness shares the normal map's alpha channel: same 1K detail, one fewer sampler.
 return {maps:{map,normalMap},ready:Promise.all(pending)};
}
function hash(x:number,y:number,z:number){let n=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(z,1442695041);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;}
function noise(x:number,y:number,z:number){
 const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),smooth=(n:number)=>n*n*(3-2*n),a=smooth(x-ix),b=smooth(y-iy),c=smooth(z-iz),mix=T.MathUtils.lerp;
 return mix(mix(mix(hash(ix,iy,iz),hash(ix+1,iy,iz),a),mix(hash(ix,iy+1,iz),hash(ix+1,iy+1,iz),a),b),mix(mix(hash(ix,iy,iz+1),hash(ix+1,iy,iz+1),a),mix(hash(ix,iy+1,iz+1),hash(ix+1,iy+1,iz+1),a),b),c);
}
// Baked coralline-algae mosaic follows the actual volume, without a repeating
// image decal or an extra runtime shader. Nested scales break up smooth stone.
export function encrustRock(g:T.BufferGeometry){
 const p=g.getAttribute('position'),cavity=g.getAttribute('rockCavity'),colors=new Float32Array(p.count*3);
 const chalk=new T.Color('#c8b797').multiplyScalar(1.45),purple=new T.Color('#9b477f').multiplyScalar(1.65),rose=new T.Color('#bd7785').multiplyScalar(1.4),olive=new T.Color('#858974').multiplyScalar(1.35),edge=new T.Color('#c9a6b5'),color=new T.Color();
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i),fine=noise(x*31,y*31,z*31),grain=noise(x*13,y*13,z*13);
  const patch=noise(x*5.1+grain*.6,y*5.1,z*5.1)*.72+grain*.28;
  const crust=T.MathUtils.smoothstep(patch,.44,.57),variation=noise(x*3.1,y*3.1,z*3.1);
  color.copy(chalk).lerp(olive,T.MathUtils.smoothstep(variation,.48,.71)*.55).lerp(variation>.48?purple:rose,crust*.58);
  // Thin pale growing boundaries and uneven age/color within each attached patch.
  const margin=Math.exp(-(((patch-.485)/.018)**2))*.17;
  color.lerp(edge,margin).multiplyScalar(.78+.27*fine+.12*grain);
  // Baked sheltered-pore darkening supplements real geometry/shadows without
  // another screen-space pass. It is restrained so cavities retain color.
  color.multiplyScalar(1-(cavity?.getX(i)??0)*.28);
  colors.set([color.r,color.g,color.b],i*3);
 }
 g.setAttribute('color',new T.BufferAttribute(colors,3));g.deleteAttribute('rockCavity');return g;
}
