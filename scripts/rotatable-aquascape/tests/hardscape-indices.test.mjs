import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from 'three';
import {reorderedFaces,optimizeHardscapeIndices} from '../lib/HardscapeIndexOrder.ts';
const faces=a=>{const result=[];for(let i=0;i<a.length;i+=3){const f=[a[i],a[i+1],a[i+2]],m=f.indexOf(Math.min(...f));result.push([f[m],f[(m+1)%3],f[(m+2)%3]].join(','));}return result.sort();};
function misses(a,n){const cache=[];let count=0;for(const v of a){const i=cache.indexOf(v);if(i<0)count++;else cache.splice(i,1);cache.unshift(v);if(cache.length>n)cache.pop();}return count;}
test('scanned wood and every rock retain all oriented faces and improve vertex reuse',async()=>{
 for(const model of ['dead_tree_trunk_02','rock_moss_set_01']){
  const root=new URL(`../public/models/${model}/`,import.meta.url),g=JSON.parse(fs.readFileSync(new URL(`${model}_2k.gltf`,root),'utf8')),buffers=g.buffers.map(b=>fs.readFileSync(new URL(b.uri,root)));
  for(const mesh of g.meshes)for(const primitive of mesh.primitives){
   const a=g.accessors[primitive.indices],v=g.bufferViews[a.bufferView],b=buffers[v.buffer],offset=b.byteOffset+(v.byteOffset||0)+(a.byteOffset||0),source=a.componentType===5125?new Uint32Array(b.buffer,offset,a.count):new Uint16Array(b.buffer,offset,a.count),before=source.slice(),ordered=await reorderedFaces(source);
   assert.deepEqual(source,before);assert.equal(ordered.constructor,source.constructor);assert.deepEqual(faces(ordered),faces(source));
   for(const size of [16,32])assert.ok(misses(ordered,size)<misses(source,size));
  }
 }
});
test('only opaque ungrouped hardscape indices change; attributes and other meshes stay untouched',async()=>{
 const scene=new T.Scene(),geometry=new T.TorusGeometry(1,.3,12,30),material=new T.MeshStandardMaterial();material.userData.bakeDiffuse={};
 const mesh=new T.Mesh(geometry,material);scene.add(mesh);
 const original=geometry.index,attributes={...geometry.attributes};
 const glass=new T.Mesh(geometry.clone(),material.clone());glass.material.transparent=true;scene.add(glass);const glassIndex=glass.geometry.index;
 const fish=new T.Mesh(geometry.clone(),new T.MeshStandardMaterial());scene.add(fish);const fishIndex=fish.geometry.index;
 assert.equal(await optimizeHardscapeIndices(scene),1);
 assert.notEqual(geometry.index,original);assert.deepEqual(faces(geometry.index.array),faces(original.array));
 for(const [name,attribute] of Object.entries(attributes))assert.equal(geometry.getAttribute(name),attribute);
 assert.equal(glass.geometry.index,glassIndex);assert.equal(fish.geometry.index,fishIndex);
});
