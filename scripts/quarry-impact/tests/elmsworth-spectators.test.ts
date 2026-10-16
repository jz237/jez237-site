import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createSpeedwaySpectators} from '../src/elmsworth-spectators';import {createElmsworthWorld} from '../src/elmsworth-world';import {ELMSWORTH} from '../src/elmsworth-course';
test('crowd stays outside the racing corridor and is deterministically batched',()=>{
 const a=createSpeedwaySpectators(),b=createSpeedwaySpectators(),matrix=new T.Matrix4();assert.equal(a.root.userData.spectators,1399);assert.equal(a.root.children.length,4);
 a.root.children.forEach((o,index)=>{assert.ok(o instanceof T.InstancedMesh);assert.deepEqual(o.instanceMatrix.array,(b.root.children[index] as T.InstancedMesh).instanceMatrix.array);o.geometry.computeBoundingBox();for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);assert.ok(matrix.elements.every(Number.isFinite));const bounds=o.geometry.boundingBox!.clone().applyMatrix4(matrix),center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3());assert.ok(ELMSWORTH.distance(center.x,center.z)-Math.hypot(size.x,size.z)/2>24);}});a.dispose();b.dispose();
});
test('speedway preserves collision records and owns every crowd resource exactly once',()=>{
 const a=createElmsworthWorld();assert.equal(a.root.userData.solidRecords,ELMSWORTH.solids);assert.ok(a.root.getObjectByName('elmsworth-spectators'));
 const gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>();a.root.traverse(o=>{if(o instanceof T.Mesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);}});let ng=0,nm=0;gs.forEach(g=>g.addEventListener('dispose',()=>ng++));ms.forEach(m=>m.addEventListener('dispose',()=>nm++));a.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);a.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);
});

test('both speedway stands face inward and animate only articulated arms',()=>{
 const a=createSpeedwaySpectators(),torso=a.root.getObjectByName('crowd_torso') as T.InstancedMesh,limbs=a.root.getObjectByName('crowd_limb') as T.InstancedMesh,m=new T.Matrix4();
 for(let i=0;i<torso.count;i++){torso.getMatrixAt(i,m);const facing=new T.Vector3(0,0,1).transformDirection(m);assert.ok(facing.z*m.elements[14]<0,'spectator faces the racing corridor');}
 const fixed=Array.from(torso.instanceMatrix.array),rest=Array.from(limbs.instanceMatrix.array);a.update(2);assert.deepEqual(Array.from(torso.instanceMatrix.array),fixed);assert.notDeepEqual(Array.from(limbs.instanceMatrix.array),rest);
 a.update(0);for(let i=0;i<rest.length;i++)assert.ok(Math.abs(limbs.instanceMatrix.array[i]-rest[i])<1e-5);
 assert.equal(a.root.userData.spectators,1399);assert.ok(a.root.children.every(m=>!m.castShadow));a.dispose();assert.doesNotThrow(()=>a.update(3));
});
