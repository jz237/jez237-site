import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createAggregateConveyor} from '../src/aggregate-conveyor';import {createCopperfieldPlant} from '../src/copperfield-plant';import {COPPERFIELD} from '../src/park-dunes-courses';
test('rollers share the belt frame across slopes and headings',()=>{
 for(const end of [new T.Vector3(10,14,42),new T.Vector3(-20,25,6),new T.Vector3(30,19,-30)]){
  const start=new T.Vector3(0,19,0),art=createAggregateConveyor(start,end),forward=end.clone().sub(start).normalize(),right=new T.Vector3(forward.z,0,-forward.x).normalize(),rollers=art.root.getObjectByName('conveyor-roller:steel') as T.InstancedMesh;
  assert.ok(rollers.count>15);const m=new T.Matrix4(),axis=new T.Vector3();for(let i=0;i<rollers.count;i++){rollers.getMatrixAt(i,m);axis.setFromMatrixColumn(m,1).normalize();assert.ok(Math.abs(axis.dot(right))>.99999);assert.ok(Math.abs(axis.dot(forward))<1e-6);}
  art.root.traverse(o=>{if(o instanceof T.InstancedMesh)for(const n of o.instanceMatrix.array)assert.ok(Number.isFinite(n));});assert.ok(art.root.children.length<=10);art.dispose();
 }
 assert.throws(()=>createAggregateConveyor(new T.Vector3(),new T.Vector3()));assert.throws(()=>createAggregateConveyor(new T.Vector3(),new T.Vector3(0,10,0)));assert.throws(()=>createAggregateConveyor(new T.Vector3(),new T.Vector3(NaN,0,0)));
});
test('integrated conveyor remains behind the track and frees all resources once',()=>{
 const plant=createCopperfieldPlant(),root=plant.root.getObjectByName('aggregate-discharge-conveyor')!;assert.ok(root);const bounds=root.userData.bounds as T.Box3[];assert.ok(bounds.length>0);
 for(const b of bounds){const c=b.getCenter(new T.Vector3()),size=b.getSize(new T.Vector3());assert.ok(COPPERFIELD.distance(c.x,c.z)-Math.hypot(size.x,size.z)/2>24);assert.ok(b.min.y>=-.01);}
 const counts=new Map<T.BufferGeometry|T.Material|T.InstancedMesh,number>();root.traverse(o=>{if(o instanceof T.InstancedMesh){for(const r of [o,o.geometry,...(Array.isArray(o.material)?o.material:[o.material])])if(!counts.has(r)){counts.set(r,0);r.addEventListener('dispose',()=>counts.set(r,counts.get(r)!+1));}}});plant.dispose();plant.dispose();assert.equal(root.parent,null);for(const n of counts.values())assert.equal(n,1);
});
