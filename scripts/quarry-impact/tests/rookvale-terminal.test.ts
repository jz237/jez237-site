import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createRookvaleWorld} from '../src/rookvale-world';import {ROOKVALE_BARRIERS} from '../src/rookvale-course';
test('terminal details clear driving and waypoint space, retain physics and dispose resources',()=>{
 const world=createRookvaleWorld();try{
  assert.equal(world.root.userData.solidRecords,ROOKVALE_BARRIERS);const root=world.root.getObjectByName('rookvale_terminal')!;assert.ok(root);let draws=0,triangles=0;
  const matrix=new T.Matrix4(),point=new T.Vector3();root.traverse(o=>{if(!(o instanceof T.Mesh))return;draws++;const pos=o.geometry.attributes.position;assert.ok(pos.array.every(Number.isFinite));triangles+=(o.geometry.index?.count??pos.count)/3*(o instanceof T.InstancedMesh?o.count:1);
   if(o instanceof T.InstancedMesh){assert.ok(o.count>100);assert.ok(o.boundingSphere&&Number.isFinite(o.boundingSphere.radius));for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);for(let v=0;v<pos.count;v++){point.fromBufferAttribute(pos,v).applyMatrix4(matrix);assert.ok(Math.abs(point.x)>205.5||Math.abs(point.z)>166||point.y>25,'no machinery inside playable volume');assert.ok(point.y>=-.2);}}}
  });assert.equal(draws,3);assert.ok(triangles<50000,`${triangles} triangles`);const apron=root.getObjectByName('rookvale_outer_apron')!;assert.equal(apron.position.y,-.05);
 }finally{world.dispose();world.dispose();assert.equal(world.root.children.length,0);}
});
