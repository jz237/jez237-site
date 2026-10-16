import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createCinderbankWorld} from '../src/cinderbank-world';import {CINDERBANK,CINDERBANK_SOLIDS} from '../src/cinderbank-course';
test('Cinderbank backdrop stays beyond recovery bounds with a bounded instanced crowd',()=>{
 const world=createCinderbankWorld();try{
  const surroundings=world.root.getObjectByName('cinderbank_surroundings')!;assert.ok(surroundings);
  assert.equal(surroundings.userData.treePositions.length,240);
  for(const p of surroundings.userData.treePositions)assert.ok(CINDERBANK.outside(p.x,0,p.z),'trees stay outside the playable boundary');
  assert.ok(surroundings.userData.spectatorCount>200);
  assert.equal(world.root.userData.solidRecords,CINDERBANK_SOLIDS);
  let draws=0,triangles=0;surroundings.traverse(o=>{if(o instanceof T.Mesh){draws++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o instanceof T.InstancedMesh?o.count:1);assert.ok(o.geometry.attributes.position.array.every(Number.isFinite));}});
  assert.ok(draws<=12,`draws: ${draws}`);assert.ok(triangles<250000,`triangles: ${triangles}`);
  world.update(1);world.update(2);assert.ok(world.root.children.length>0);
 }finally{world.dispose();world.dispose();assert.equal(world.root.children.length,0);}
});
