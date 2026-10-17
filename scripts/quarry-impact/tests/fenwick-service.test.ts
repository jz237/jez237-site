import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createFenwickWorld} from '../src/fenwick-world';import {FENWICK_COURSES} from '../src/fenwick-course';
for(const course of FENWICK_COURSES)test(`${course.id}: service compound stays grounded behind racing space and releases its resources`,()=>{
 const before=JSON.stringify(course.solids),world=createFenwickWorld(course.id),service=world.root.getObjectByName('fenwick_service')!;
 assert.ok(service);let draws=0,triangles=0;const matrix=new T.Matrix4(),point=new T.Vector3(),resources=new Set<T.BufferGeometry|T.Material>();
 service.traverse(o=>{if(!(o instanceof T.InstancedMesh))return;draws++;assert.ok(o.instanceMatrix.array.every(Number.isFinite));assert.ok(o.boundingSphere);resources.add(o.geometry);resources.add(o.material as T.Material);const vertices=o.geometry.attributes.position;triangles+=(o.geometry.index?.count??vertices.count)/3*o.count;
  for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);for(let j=0;j<vertices.count;j++){point.fromBufferAttribute(vertices,j).applyMatrix4(matrix);assert.ok(point.y>=-.001,'props stand on apron');assert.ok(point.z>114&&point.z<130&&Math.abs(point.x)<150,'compound remains between circuit and garages');assert.ok(course.distance(point.x,point.z)>22,'both racing and recovery corridor stay clear');}}
 });assert.equal(draws,3);assert.ok(triangles<24000,`${triangles} triangles`);assert.equal(world.root.userData.solidRecords,course.solids);assert.equal(JSON.stringify(course.solids),before);
 let disposed=0;resources.forEach(r=>r.addEventListener('dispose',()=>disposed++));world.dispose();world.dispose();assert.equal(disposed,resources.size);assert.equal(service.children.length,0);
});
