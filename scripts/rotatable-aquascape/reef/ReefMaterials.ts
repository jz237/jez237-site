import * as T from 'three';

// Free CC0 scanned coastal stone, locally hosted. See assets/README.md.
export function limestoneMaps(){
 const loader=new T.TextureLoader(),pending:Promise<unknown>[]=[];
 const load=(url:string,color=false)=>{
  let done!:()=>void,fail!:(error:unknown)=>void;
  pending.push(new Promise<void>((resolve,reject)=>{done=resolve;fail=reject;}));
  const map=loader.load(url,()=>done(),undefined,fail);
  map.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;
  map.repeat.set(2.4,1.6);map.anisotropy=8;return map;
 };
 const map=load(new URL('./assets/seaside_rock_diff_1k.jpg',import.meta.url).href,true);
 const normalMap=load(new URL('./assets/seaside_rock_nor_gl_1k.jpg',import.meta.url).href);
 const roughnessMap=load(new URL('./assets/seaside_rock_rough_1k.jpg',import.meta.url).href);
 return {maps:{map,normalMap,roughnessMap},ready:Promise.all(pending)};
}
function hash(x:number,y:number,z:number){let n=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(z,1442695041);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;}
function noise(x:number,y:number,z:number){
 const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),smooth=(n:number)=>n*n*(3-2*n),a=smooth(x-ix),b=smooth(y-iy),c=smooth(z-iz),mix=T.MathUtils.lerp;
 return mix(mix(mix(hash(ix,iy,iz),hash(ix+1,iy,iz),a),mix(hash(ix,iy+1,iz),hash(ix+1,iy+1,iz),a),b),mix(mix(hash(ix,iy,iz+1),hash(ix+1,iy,iz+1),a),mix(hash(ix,iy+1,iz+1),hash(ix+1,iy+1,iz+1),a),b),c);
}
// Small attached crusts, not large camouflage patches. Vertex color is baked once.
export function encrustRock(g:T.BufferGeometry){
 const p=g.getAttribute('position'),colors=new Float32Array(p.count*3);
 const chalk=new T.Color('#ddd2bb').multiplyScalar(1.85),purple=new T.Color('#a282b3').multiplyScalar(1.8),rose=new T.Color('#b9858c').multiplyScalar(1.65),olive=new T.Color('#98a288').multiplyScalar(1.5),color=new T.Color();
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i),patch=noise(x*13,y*13,z*13)*.64+noise(x*37,y*37,z*37)*.36;
  const crust=T.MathUtils.smoothstep(patch,.49,.69),variation=noise(x*4,y*4,z*4);
  color.copy(chalk).lerp(olive,T.MathUtils.smoothstep(variation,.55,.78)*.5).lerp(variation>.5?purple:rose,crust*.81);
  colors.set([color.r,color.g,color.b],i*3);
 }
 g.setAttribute('color',new T.BufferAttribute(colors,3));return g;
}
