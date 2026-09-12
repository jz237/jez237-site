import {loadCraftLOD,craftGeometryLOD} from './mesh-lod.js';
import * as T from './vendor/three.module.js';
import {craftSurface,craftUV} from './craft-materials.js';

// These shared geometries are evaluated from the editable Blender model.
// Material/group batching keeps all eight rider liveries inexpensive to instantiate.
let asset=null;
try {
 const [metadataResponse,geometryResponse]=await Promise.all([
  fetch(new URL('./assets/tideline-r01.json',import.meta.url)),
  fetch(new URL('./assets/tideline-r01.bin',import.meta.url))
 ]);
 if(!metadataResponse.ok||!geometryResponse.ok)throw new Error('Jet ski asset request failed');
 const metadata=await metadataResponse.json(),buffer=await geometryResponse.arrayBuffer();
 const materials=Object.fromEntries(Object.entries(metadata.materials).map(([name,spec])=>{
  const material=new T.MeshPhysicalMaterial({...spec,side:T.DoubleSide});material.name=name;craftSurface(material,name);return [name,material];
 }));
 const meshes=metadata.meshes.map(batch=>{
  const geometry=new T.BufferGeometry(),data=new T.InterleavedBuffer(new Float32Array(buffer,batch.offset,batch.vertices*6),6);
  geometry.setAttribute('position',new T.InterleavedBufferAttribute(data,3,0));
  geometry.setAttribute('normal',new T.InterleavedBufferAttribute(data,3,3));
  craftUV(geometry);
  geometry.computeBoundingSphere();
  return {group:batch.group,geometry,material:materials[batch.material]};
 });
 asset={meshes};
} catch(error){console.warn('Blender jet ski unavailable; using the built-in model.',error);}

const lodGeometry=await loadCraftLOD('tideline-r01');
export function installBlenderJetSki(v,{screen,rack,winchArm,salvage=true}={}){
 if(!asset)return false;
 const keep=new Set([v.rider,v.cargo,v.winch,v.handlebars,v.prop,...(salvage?[rack,winchArm]:[])]);
 for(const child of [...v.body.children])if(!keep.has(child)){
  v.body.remove(child);child.traverse(o=>o.geometry?.dispose());
 }
 for(const group of [v.handlebars,v.prop])for(const child of [...group.children]){
  if(child===screen)continue;group.remove(child);child.traverse(o=>o.geometry?.dispose());
 }
 if(screen){screen.position.set(0,.121,-.025);screen.rotation.set(0,0,0);}
 const groups={chassis:v.body,bars:v.handlebars,nozzle:v.prop};
 for(const [partIndex,part] of asset.meshes.entries()){
  const mesh=new T.Mesh(part.geometry,part.material);craftGeometryLOD(mesh,lodGeometry?.[partIndex]);mesh.name='Blender / '+part.group+' / '+part.material.name;
  mesh.castShadow=true;mesh.receiveShadow=true;groups[part.group].add(mesh);
 }
 v.boat.userData.model='Tideline R-01 · Blender';
 return true;
}
