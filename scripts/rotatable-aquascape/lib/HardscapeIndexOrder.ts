import * as T from 'three';
import {MeshoptEncoder} from 'meshoptimizer/encoder';

/** Reorder faces for GPU vertex-cache reuse, then reverse the encoder's vertex
 * remap so every authored position/normal/UV/color stays byte-for-byte intact.
 * This is not mesh simplification or welding. */
export async function reorderedFaces(source:Uint16Array|Uint32Array){
 await MeshoptEncoder.ready;
 const ordered=Uint32Array.from(source),[remap,count]=MeshoptEncoder.reorderMesh(ordered,true,false),inverse=new Uint32Array(count);
 for(let old=0;old<remap.length;old++)if(remap[old]!==0xffffffff)inverse[remap[old]]=old;
 const result=source instanceof Uint16Array?new Uint16Array(ordered.length):new Uint32Array(ordered.length);
 for(let i=0;i<ordered.length;i++)result[i]=inverse[ordered[i]];
 return result;
}
export async function optimizeHardscapeIndices(scene:T.Scene){
 if(!MeshoptEncoder.supported)return 0;
 const geometries=new Set<T.BufferGeometry>();
 scene.traverse(object=>{
  if(!(object instanceof T.Mesh)||object instanceof T.InstancedMesh)return;
  const materials=Array.isArray(object.material)?object.material:[object.material];
  // Only opaque scanned hardscape: transparent sorting and animated fish normal
  // accumulation must retain their existing order. Run after moss placement.
  if(materials.length!==1||!materials[0].userData.bakeDiffuse||materials[0].transparent)return;
  if(object.geometry.index&&object.geometry.groups.length===0)geometries.add(object.geometry);
 });
 for(const geometry of geometries){
  const source=geometry.index!.array;
  if(source instanceof Uint16Array||source instanceof Uint32Array)geometry.setIndex(new T.BufferAttribute(await reorderedFaces(source),1));
 }
 return geometries.size;
}
