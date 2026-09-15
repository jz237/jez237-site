import * as T from './vendor/three.module.js';
// Existing generated tree assets from First Light, copied from its committed
// version. Shared textures, alpha-tested crossed cards and soft upright normals.
export const canopyKinds=[];
for(const [name,aspect] of [['oak',.95],['maple',.70]]){
 try {const map=await new T.TextureLoader().loadAsync(new URL(`./assets/scenery/first-light-${name}.webp`,import.meta.url).href);
  map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;canopyKinds.push({name,aspect,map});
 }catch{console.warn('Canopy photograph unavailable:',name);}
}
export function canopyGeometry(aspect){
 const p=[],uv=[],normals=[],indices=[];
 for(let k=0;k<3;k++){const a=k*Math.PI/3,x=Math.cos(a)*aspect*.5,z=Math.sin(a)*aspect*.5,b=p.length/3;
  p.push(-x,0,-z,x,0,z,x,1,z,-x,1,-z);uv.push(0,0,1,0,1,1,0,1);
  for(let i=0;i<4;i++)normals.push((i===0||i===3?-1:1)*Math.cos(a)*.35,.94,(i===0||i===3?-1:1)*Math.sin(a)*.35);
  indices.push(b,b+1,b+2,b,b+2,b+3);
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('normal',new T.Float32BufferAttribute(normals,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);return g;
}
export function canopyMaterial(kind){return new T.MeshStandardMaterial({map:kind.map,color:0xc0c9aa,roughness:.95,side:T.DoubleSide,alphaTest:.52,alphaToCoverage:true});}
