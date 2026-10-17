import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import {createRookvaleHoists} from '../src/rookvale-hoists';
test('hoists retain overhead clearance and culling bounds throughout travel and deterministic seeks',()=>{
 const rig=createRookvaleHoists(),m=new T.Matrix4(),v=new T.Vector3();const snapshot=()=>rig.root.children.map(o=>Array.from((o as T.InstancedMesh).instanceMatrix.array));
 const initial=snapshot();assert.equal(rig.root.children.length,3);
 for(let time=0;time<48;time+=2){rig.update(time);for(const o of rig.root.children){const mesh=o as T.InstancedMesh,p=mesh.geometry.attributes.position;for(let i=0;i<mesh.count;i++){mesh.getMatrixAt(i,m);for(let j=0;j<p.count;j++){v.fromBufferAttribute(p,j).applyMatrix4(m);assert.ok(v.y>9.8&&v.y<26.01,'clear of vehicles and attached to jib');assert.ok(Math.abs(v.x)>191&&Math.abs(v.x)<197);assert.ok(mesh.boundingSphere!.containsPoint(v));assert.ok(mesh.boundingBox!.containsPoint(v));}}}}
 rig.update(12);assert.notDeepEqual(snapshot(),initial);rig.update(0);assert.deepEqual(snapshot(),initial);rig.update(48);assert.deepEqual(snapshot(),initial);rig.update(NaN);assert.deepEqual(snapshot(),initial);
 rig.dispose();rig.update(2);rig.dispose();assert.equal(rig.root.children.length,0);
});

test('world forwards animation time and releases the hoists without changing barriers',async()=>{
 const {createRookvaleWorld}=await import('../src/rookvale-world');
 const {ROOKVALE_BARRIERS}=await import('../src/rookvale-course');
 const world=createRookvaleWorld();
 const mesh=world.root.getObjectByName('rookvale_hoist_box') as T.InstancedMesh;
 assert.ok(mesh);assert.equal(world.root.userData.solidRecords,ROOKVALE_BARRIERS);
 const before=mesh.instanceMatrix.array.slice();world.update(12);assert.notDeepEqual(mesh.instanceMatrix.array,before);
 world.update(0);assert.deepEqual(mesh.instanceMatrix.array,before);
 let disposed=0;mesh.geometry.addEventListener('dispose',()=>disposed++);
 world.dispose();world.dispose();assert.equal(disposed,1);
});
