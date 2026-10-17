import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createBrackenWorld} from '../src/bracken-world';import {BRACKEN,BRACKEN_SOLIDS} from '../src/bracken-course';
test('Bracken paddock keeps its structures behind the course and batches animated details',()=>{
 const world=createBrackenWorld();try{
  const root=world.root.getObjectByName('bracken_paddock')!;assert.ok(root);assert.equal(world.root.userData.solidRecords,BRACKEN_SOLIDS);
  for(const p of root.userData.paddockCenters){assert.ok(BRACKEN.outside(p.x,0,p.z+12));assert.equal(BRACKEN.height(p.x,p.z),0,'southern apron is flat');}
  assert.ok(root.userData.spectatorCount>=170);
  let draws=0,triangles=0;root.traverse(o=>{if(o instanceof T.Mesh){draws++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o instanceof T.InstancedMesh?o.count:1);assert.ok(o.geometry.attributes.position.array.every(Number.isFinite));if(o instanceof T.InstancedMesh){assert.ok(o.instanceMatrix.array.every(Number.isFinite));assert.ok(o.boundingSphere&&Number.isFinite(o.boundingSphere.radius));}}});
  assert.ok(draws<=12);assert.ok(triangles<170000,`triangles ${triangles}`);
  const flags=root.getObjectByName('bracken_club_flags') as T.InstancedMesh,initial=Array.from(flags.instanceMatrix.array);world.update(1);assert.notDeepEqual(Array.from(flags.instanceMatrix.array),initial);
  const atOne=Array.from(flags.instanceMatrix.array);world.update(1.001);assert.deepEqual(Array.from(flags.instanceMatrix.array),atOne,'flags update at most 20Hz');world.update(NaN);assert.deepEqual(Array.from(flags.instanceMatrix.array),atOne);
  const crowd=root.getObjectByName('venue_spectators')!,limbs=crowd.getObjectByName('crowd_limb') as T.InstancedMesh,before=Array.from(limbs.instanceMatrix.array);world.update(2);assert.notDeepEqual(Array.from(limbs.instanceMatrix.array),before);
 }finally{world.dispose();world.dispose();world.update(3);assert.equal(world.root.children.length,0);}
});
