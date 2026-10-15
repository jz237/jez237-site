import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createSpeedwaySpectators} from '../src/elmsworth-spectators';import {createElmsworthWorld} from '../src/elmsworth-world';import {ELMSWORTH} from '../src/elmsworth-course';
test('crowd stays outside the racing corridor and is deterministically batched',()=>{
 const a=createSpeedwaySpectators(),b=createSpeedwaySpectators(),matrix=new T.Matrix4();assert.equal(a.root.userData.spectators,1399);assert.equal(a.root.children.length,11);
 a.root.children.forEach((o,index)=>{assert.ok(o instanceof T.InstancedMesh);assert.deepEqual(o.instanceMatrix.array,(b.root.children[index] as T.InstancedMesh).instanceMatrix.array);o.geometry.computeBoundingBox();for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);assert.ok(matrix.elements.every(Number.isFinite));const bounds=o.geometry.boundingBox!.clone().applyMatrix4(matrix),center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3());assert.ok(ELMSWORTH.distance(center.x,center.z)-Math.hypot(size.x,size.z)/2>24);}});a.dispose();b.dispose();
});
test('speedway preserves collision records and owns every crowd resource exactly once',()=>{
 const a=createElmsworthWorld();assert.equal(a.root.userData.solidRecords,ELMSWORTH.solids);assert.ok(a.root.getObjectByName('elmsworth-spectators'));
 const gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>();a.root.traverse(o=>{if(o instanceof T.Mesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);}});let ng=0,nm=0;gs.forEach(g=>g.addEventListener('dispose',()=>ng++));ms.forEach(m=>m.addEventListener('dispose',()=>nm++));a.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);a.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);
});
