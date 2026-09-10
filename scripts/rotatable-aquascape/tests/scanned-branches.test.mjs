import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {aquascapeBranches,bendScannedBranch} from '../lib/ScannedBranch.ts';

test('every vertex of all six tapered scans stays inside its wood collision envelopes',()=>{
 const root=new URL('../public/models/dead_tree_trunk_02/',import.meta.url);
 const gltf=JSON.parse(readFileSync(new URL('dead_tree_trunk_02_2k.gltf',root),'utf8'));
 const bytes=readFileSync(new URL(gltf.buffers[0].uri,root)),primitive=gltf.meshes[0].primitives[0];
 const attribute=(id,size)=>{
  const a=gltf.accessors[id],view=gltf.bufferViews[a.bufferView],data=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  const componentBytes=a.componentType===5123?2:4,offset=(view.byteOffset??0)+(a.byteOffset??0),stride=view.byteStride??componentBytes*size,values=[];
  for(let i=0;i<a.count;i++)for(let j=0;j<size;j++){const at=offset+i*stride+j*componentBytes;values.push(a.componentType===5126?data.getFloat32(at,true):a.componentType===5123?data.getUint16(at,true):data.getUint32(at,true));}
  return values;
 };
 const source=new T.BufferGeometry();source.setAttribute('position',new T.Float32BufferAttribute(attribute(primitive.attributes.POSITION,3),3));source.setIndex(attribute(primitive.indices,1));
 const original=new Float32Array(source.getAttribute('position').array),point=new T.Vector3();
 for(const branch of aquascapeBranches){
  const {geometry,obstacles}=bendScannedBranch(source,branch),p=geometry.getAttribute('position');
  assert.equal(p.count,original.length/3);
  for(let i=0;i<p.count;i++){
   point.fromBufferAttribute(p,i);assert.ok(Number.isFinite(point.lengthSq()));
   assert.ok(obstacles.some(o=>point.distanceToSquared(o.center)<=o.radius**2),`Uncovered scan vertex ${i}`);
  }
  geometry.dispose();
 }
 assert.deepEqual(source.getAttribute('position').array,original,'bending must not mutate the scan shared by other branches');
 source.dispose();
});
