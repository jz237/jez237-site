import * as T from './vendor/three.module.js';
const textures=new Map();
// Original deterministic material microstructure, shared by all rider liveries.
// Geometry, not a camera overlay: it follows each articulated part and its LOD.
function surfaceTexture(kind){
 if(textures.has(kind))return textures.get(kind);
 const n=128,height=new Float32Array(n*n),pixels=new Uint8Array(n*n*4),rough=new Uint8Array(n*n*4);
 let seed=197;const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const weave=((x>>3)+(y>>3))%2,thread=Math.sin((weave?x:y)*Math.PI/4);
  height[y*n+x]=kind==='skin'?noise()*.20:kind==='carbon'?.5+thread*.22+noise()*.035:.5+Math.sin(x*Math.PI/2)*.09+Math.sin(y*Math.PI/2)*.09+noise()*.09;
 }
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const i=(y*n+x)*4,dx=height[y*n+(x+1)%n]-height[y*n+(x+n-1)%n],dy=height[((y+1)%n)*n+x]-height[((y+n-1)%n)*n+x];
  const normal=new T.Vector3(-dx,-dy,1).normalize();pixels.set([128+normal.x*127,128+normal.y*127,128+normal.z*127,255],i);
  const r=kind==='carbon'?205+height[y*n+x]*45:225+height[y*n+x]*25;rough.set([r,r,r,255],i);
 }
 const make=data=>{const t=new T.DataTexture(data,n,n);t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=4;t.needsUpdate=true;return t;};
 const result={normal:make(pixels),roughness:make(rough)};textures.set(kind,result);return result;
}
export function craftUV(geometry){
 const p=geometry.attributes.position,n=geometry.attributes.normal,uv=new Float32Array(p.count*2);
 // Project whole triangles consistently: curved hulls and horizontal seats
 // retain texel density instead of stretching a single side projection.
 for(let i=0;i<p.count;i+=3){
  const axis=[0,1,2].sort((a,b)=>Math.abs(n.getComponent(i,b)+n.getComponent(i+1,b)+n.getComponent(i+2,b))-Math.abs(n.getComponent(i,a)+n.getComponent(i+1,a)+n.getComponent(i+2,a)))[0];
  const axes=axis===0?[2,1]:axis===1?[0,2]:[0,1];
  for(let j=i;j<i+3;j++){uv[j*2]=p.getComponent(j,axes[0])*7;uv[j*2+1]=p.getComponent(j,axes[1])*7;}
 }
 geometry.setAttribute('uv',new T.BufferAttribute(uv,2));return geometry;
}
export function craftSurface(material,name){
 const kind=name==='Skin'?'skin':name==='Carbon fibre'?'carbon':['Neoprene','Stretch panels','Impact foam','Vest livery','Webbing','Soft saddle','Traction rubber'].includes(name)?'fabric':null;
 if(kind){const t=surfaceTexture(kind);material.normalMap=t.normal;material.roughnessMap=t.roughness;material.normalScale=new T.Vector2(kind==='skin'?.18:.30,kind==='skin'?.18:.30);}
 material.userData.dryRoughness=material.roughness;
 return material;
}
