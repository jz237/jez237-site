import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createPinecrestWorld} from '../src/pinecrest-world';import {PINECREST_SOLIDS} from '../src/pinecrest-course';
test('Pinecrest pit additions preserve collision records and animate existing terrace occupants',()=>{
 const world=createPinecrestWorld();try{
  assert.equal(world.root.userData.solidRecords,PINECREST_SOLIDS);const root=world.root.getObjectByName('pinecrest_paddock')!;assert.ok(root);assert.ok(root.userData.spectatorCount>200);
  const detail=root.getObjectByName('pinecrest_club_details') as T.InstancedMesh,mat=new T.Matrix4();
  for(let i=0;i<detail.count;i++){detail.getMatrixAt(i,mat);assert.ok(mat.elements[14]<-120,'all solid detailing remains behind the terrace wall');}
  let draws=0,triangles=0;root.traverse(o=>{if(o instanceof T.Mesh){draws++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o instanceof T.InstancedMesh?o.count:1);assert.ok(o.geometry.attributes.position.array.every(Number.isFinite));if(o instanceof T.InstancedMesh){assert.ok(o.instanceMatrix.array.every(Number.isFinite));assert.ok(o.boundingSphere&&Number.isFinite(o.boundingSphere.radius));}}});assert.ok(draws<=8);assert.ok(triangles<150000,`triangles ${triangles}`);
  const arms=root.getObjectByName('crowd_limb') as T.InstancedMesh,before=Array.from(arms.instanceMatrix.array);world.update(2);assert.notDeepEqual(Array.from(arms.instanceMatrix.array),before);assert.equal(arms.matrixAutoUpdate,false);

 }finally{world.dispose();world.dispose();world.update(3);assert.equal(world.root.children.length,0);}
});
