import * as T from './vendor/three.module.js';
import {craftUV} from './craft-materials.js';
const cache=new Map();
export function loadCraftLOD(name){
 if(!cache.has(name))cache.set(name,(async()=>{
  try{
   const [a,b]=await Promise.all([fetch(new URL(`./assets/${name}-lod.json`,import.meta.url)),fetch(new URL(`./assets/${name}-lod.bin`,import.meta.url))]);
   if(!a.ok||!b.ok)return null;
   const meta=await a.json(),buffer=await b.arrayBuffer();
   return meta.meshes.map(part=>{
    const g=new T.BufferGeometry(),values=new Float32Array(buffer,part.offset,part.vertices*6),data=new T.InterleavedBuffer(values,6);
    g.setAttribute('position',new T.InterleavedBufferAttribute(data,3,0));g.setAttribute('normal',new T.InterleavedBufferAttribute(data,3,3));
    craftUV(g);g.computeBoundingSphere();return g;
   });
  }catch{return null;}
 })());
 return cache.get(name);
}
export function craftGeometryLOD(mesh,geometry){if(geometry){mesh.userData.detailGeometry=mesh.geometry;mesh.userData.lodGeometry=geometry;}}
export function updateCraftLOD(boat,distance,quality){
 const threshold=quality==='high'?30:quality==='medium'?20:0;
 const previous=boat.userData.lowDetail;
 // Hysteresis avoids popping back and forth near the switching distance.
 const low=quality==='low'||distance>(previous?threshold-3:threshold+3);
 boat.userData.lowDetail=low;
 // Check children even when the requested level is unchanged: replacement
 // models or late-attached LOD geometry must inherit the current level.
 boat.traverse(mesh=>{if(mesh.userData.lodGeometry){const geometry=low?mesh.userData.lodGeometry:mesh.userData.detailGeometry;if(mesh.geometry!==geometry)mesh.geometry=geometry;}});
}
