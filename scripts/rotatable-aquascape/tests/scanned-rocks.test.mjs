import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {rockPlacements,shapeScannedRock} from '../lib/ScannedRock.ts';

test('all placed rock scans are grounded, inside the glass and covered by their collision sphere',()=>{
 const root=new URL('../public/models/rock_moss_set_01/',import.meta.url),gltf=JSON.parse(readFileSync(new URL('rock_moss_set_01_2k.gltf',root),'utf8'));
 const buffers=gltf.buffers.map(b=>readFileSync(new URL(b.uri,root)));
 for(const [id,x,z,size,yaw,tilt] of rockPlacements){
  const accessor=gltf.accessors[gltf.meshes[id].primitives[0].attributes.POSITION],view=gltf.bufferViews[accessor.bufferView],bytes=buffers[view.buffer];
  const data=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),positions=[];
  assert.equal(accessor.componentType,5126);
  for(let i=0;i<accessor.count;i++)for(let j=0;j<3;j++)positions.push(data.getFloat32((view.byteOffset??0)+(accessor.byteOffset??0)+i*(view.byteStride??12)+j*4,true));
  const source=new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(positions,3)),original=source.getAttribute('position').array.slice();
  const geometry=shapeScannedRock(source,size,yaw,tilt),attribute=geometry.getAttribute('position'),sphere=geometry.boundingSphere,point=new T.Vector3();
  assert.ok(Math.abs(geometry.boundingBox.min.y)<1e-6,'orientation must be grounded after rotation');
  for(let i=0;i<attribute.count;i++){
   point.fromBufferAttribute(attribute,i);assert.ok(Number.isFinite(point.lengthSq()));
   assert.ok(point.distanceTo(sphere.center)<=sphere.radius+1e-6,`rock ${id}: uncovered vertex ${i}`);
   assert.ok(Math.abs(point.x+x)<5.06&&Math.abs(point.z+z)<2.31,`rock ${id}: outside tank`);
  }
  assert.deepEqual(source.getAttribute('position').array,original);geometry.dispose();source.dispose();
 }
});
