import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createBrackenWorld} from '../src/bracken-world';import {BRACKEN_SOLIDS} from '../src/bracken-course';
test('Bracken woodland clears recovery space and preserves racing geometry',()=>{
 const world=createBrackenWorld();try{
  assert.equal(world.root.userData.solidRecords,BRACKEN_SOLIDS);const root=world.root.getObjectByName('bracken_woodland')!;assert.ok(root);
  assert.ok(root.userData.treePlaces.length>150);
  for(const p of root.userData.treePlaces){assert.ok(Math.abs(p.x)-p.radius>=178||Math.abs(p.z)-p.radius>=138,'whole crown clears recovery rectangle');assert.ok(Number.isFinite(p.y));assert.ok(!(p.z< -120&&Math.abs(p.x)<155),'paddock stays open');assert.ok(Math.abs(p.x)<290&&Math.abs(p.z)<230,'trees remain on apron');}
  let draws=0,triangles=0;root.traverse(o=>{if(o instanceof T.InstancedMesh){draws++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*o.count;assert.ok(o.instanceMatrix.array.every(Number.isFinite));assert.ok(o.geometry.attributes.position.array.every(Number.isFinite));assert.ok(o.boundingSphere&&Number.isFinite(o.boundingSphere.radius));assert.equal(o.matrixAutoUpdate,false);}});assert.equal(draws,3);assert.ok(triangles<80000,`triangles ${triangles}`);
  for(const p of root.userData.hillPlaces){const r=Math.max(p.rx,p.rz)*1.12;assert.ok(Math.abs(p.x)-r>180||Math.abs(p.z)-r>140,'hills cannot intrude onto circuit terrain');}
 }finally{world.dispose();world.dispose();assert.equal(world.root.children.length,0);}
});
