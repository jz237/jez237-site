import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createFenwickWorld} from '../src/fenwick-world';import {FENWICK_COURSES} from '../src/fenwick-course';
for(const course of FENWICK_COURSES)test(`${course.id} fairground clearance, shared physics, animation and disposal`,()=>{
 const world=createFenwickWorld(course.id);try{
  assert.equal(world.root.userData.solidRecords,course.solids);const root=world.root.getObjectByName('fenwick_fairground')!;assert.ok(root.userData.spectatorCount>300);
  let triangles=0,draws=0;const mat=new T.Matrix4(),point=new T.Vector3();
  root.traverse(o=>{if(!(o instanceof T.Mesh))return;draws++;const pos=o.geometry.attributes.position;assert.ok(pos.array.every(Number.isFinite));triangles+=(o.geometry.index?.count??pos.count)/3*(o instanceof T.InstancedMesh?o.count:1);
   if(o instanceof T.InstancedMesh){assert.ok(o.instanceMatrix.array.every(Number.isFinite));assert.ok(o.boundingSphere&&Number.isFinite(o.boundingSphere.radius));if(o.name.startsWith('fenwick_fair_'))for(let i=0;i<o.count;i++){o.getMatrixAt(i,mat);for(let j=0;j<pos.count;j++){point.fromBufferAttribute(pos,j).applyMatrix4(mat);assert.ok(Math.abs(point.z)>125,`detail enters driving area: ${point.z}`);assert.ok(point.y>=-.2,'slanted support feet only slightly embed in ground');assert.ok(Math.abs(point.x)<220&&Math.abs(point.z)<180,'grounded inside original apron');}}}
  });assert.ok(draws<=6);assert.ok(triangles<230000,`${triangles} triangles`);
  const arms=root.getObjectByName('crowd_limb') as T.InstancedMesh,before=Array.from(arms.instanceMatrix.array);world.update(3);assert.notDeepEqual(Array.from(arms.instanceMatrix.array),before);
 }finally{world.dispose();world.dispose();world.update(4);assert.equal(world.root.children.length,0);}
});
