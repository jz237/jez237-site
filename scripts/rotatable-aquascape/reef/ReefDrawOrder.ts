import * as T from 'three';
import {MeshoptEncoder} from 'meshoptimizer/encoder';

// Reorder only opaque triangle submission. Keep vertex buffers, winding, tissue
// attributes and every face unchanged; animated shader anatomy uses those data.
export const reefDrawOrderReady=MeshoptEncoder.supported?MeshoptEncoder.ready:Promise.resolve();
export function optimizeReefDrawOrder(root:T.Object3D){
 const seen=new Set<T.BufferGeometry>();let meshes=0,triangles=0;
 if(!MeshoptEncoder.supported)return {meshes,triangles};
 root.traverse(object=>{
  if(!(object instanceof T.Mesh)||Array.isArray(object.material)||object.material.transparent)return;
  const geometry=object.geometry,index=geometry.index;
  // Groups/draw ranges can encode material or semantic boundaries. Leave them.
  if(seen.has(geometry)||!index||index.count<3000||geometry.groups.length||geometry.drawRange.start!==0||geometry.drawRange.count!==Infinity)return;
  seen.add(geometry);
  const reordered=new Uint32Array(index.array),[remap,unique]=MeshoptEncoder.reorderMesh(reordered,true,false),original=new Uint32Array(unique);
  for(let i=0;i<remap.length;i++)if(remap[i]!==0xffffffff)original[remap[i]]=i;
  // Undo the encoder's vertex renumbering, preserving all existing attributes
  // and animation/attachment references while retaining improved face order.
  for(let i=0;i<reordered.length;i++)index.array[i]=original[reordered[i]];
  index.needsUpdate=true;meshes++;triangles+=index.count/3;
 });
 return {meshes,triangles};
}
