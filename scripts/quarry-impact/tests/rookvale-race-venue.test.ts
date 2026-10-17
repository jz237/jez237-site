import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createRookvaleWorld} from '../src/rookvale-world';import {ROOKVALE_BARRIERS} from '../src/rookvale-course';
test('race venue stays behind walls, keeps physics intact and batches the crowd',()=>{
 const world=createRookvaleWorld();try{
  assert.equal(world.root.userData.solidRecords,ROOKVALE_BARRIERS);
  const root=world.root.getObjectByName('rookvale_race_venue')!;assert.ok(root.userData.spectatorCount>180);
  let draws=0,triangles=0;const matrix=new T.Matrix4(),point=new T.Vector3();
  root.traverse(o=>{if(!(o instanceof T.InstancedMesh))return;draws++;const p=o.geometry.attributes.position;triangles+=(o.geometry.index?.count??p.count)/3*o.count;assert.ok(o.boundingSphere&&Number.isFinite(o.boundingSphere.radius));for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);for(let j=0;j<p.count;j++){point.fromBufferAttribute(p,j).applyMatrix4(matrix);assert.ok(point.toArray().every(Number.isFinite));assert.ok(Math.abs(point.x)>205.6||point.z< -166,'behind containing walls');assert.ok(point.y>=-.001,'grounded');}}});
  assert.equal(draws,5);assert.ok(triangles<200000,`${triangles} triangles`);
  const arms=root.getObjectByName('crowd_limb') as T.InstancedMesh,before=arms.instanceMatrix.array.slice();world.update(1);assert.notDeepEqual(arms.instanceMatrix.array,before);
 }finally{world.dispose();world.dispose();assert.equal(world.root.children.length,0);}
});
