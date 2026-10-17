import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createFenwickBoundary} from '../src/fenwick-boundary';import {FENWICK_COURSES} from '../src/fenwick-course';
test('rural boundary stays outside both layouts and leaves access gaps',()=>{
 const boundary=createFenwickBoundary(),v=new T.Vector3(),matrix=new T.Matrix4();let triangles=0,disposals=0;
 assert.equal(boundary.root.children.length,2);
 for(const child of boundary.root.children){const mesh=child as T.InstancedMesh;mesh.geometry.addEventListener('dispose',()=>disposals++);(mesh.material as T.Material).addEventListener('dispose',()=>disposals++);
  const p=mesh.geometry.attributes.position;triangles+=(mesh.geometry.index?.count??p.count)/3*mesh.count;
  for(let i=0;i<mesh.count;i++){mesh.getMatrixAt(i,matrix);for(let j=0;j<p.count;j++){v.fromBufferAttribute(p,j).applyMatrix4(matrix);assert.ok(Number.isFinite(v.y));assert.ok(v.y>-.45,'no buried leaf or fence');for(const c of FENWICK_COURSES)assert.ok(c.distance(v.x,v.z)>24,'race/recovery clearance');assert.ok(!(Math.abs(v.x)<38&&Math.abs(v.z)>170),'service entrance remains open');}}
 }
 assert.ok(triangles<250000);boundary.dispose();boundary.dispose();assert.equal(disposals,4);assert.equal(boundary.root.children.length,0);
});
