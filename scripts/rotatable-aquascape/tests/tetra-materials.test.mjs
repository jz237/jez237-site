import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createTetraMaterials} from '../lib/TetraMaterials.ts';
import {Tetra3D} from '../lib/Tetra3D.ts';
test('school materials share expensive setup while retaining independent exact poses and breathing',()=>{
 const texture=new T.Texture(),shared=createTetraMaterials(texture),school=Array.from({length:16},(_,i)=>new Tetra3D(texture,i*.83,false,shared));
 const references=Array.from({length:16},(_,i)=>new Tetra3D(texture,i*.83,false));
 for(let frame=0;frame<25;frame++)school.forEach((fish,i)=>{
  const args=[frame/60,.1+i/18,texture,.65,.5,1,1/60,.2+i/22];fish.update(...args);references[i].update(...args);
  fish.meshes.forEach((m,k)=>{assert.deepEqual(m.geometry.attributes.position.array,references[i].meshes[k].geometry.attributes.position.array);assert.deepEqual(m.geometry.attributes.normal.array,references[i].meshes[k].geometry.attributes.normal.array);});
  assert.ok(fish.breathAttribute.array.every(x=>x===Math.fround(fish.breathing.gill)));
 });
 assert.notEqual(school[0].breathAttribute.getX(0),school[1].breathAttribute.getX(0));
 assert.equal(new Set(school.flatMap(f=>f.meshes.map(m=>m.material))).size,3);
 assert.notEqual(references[0].materials.skin,shared.skin,'close-up materials remain independent');
 let released=0;for(const m of [shared.skin,shared.fin,shared.pectoral])m.addEventListener('dispose',()=>released++);
 for(let i=0;i<15;i++)school[i].dispose();assert.equal(released,0);school[15].dispose();assert.equal(released,3);school[15].dispose();assert.equal(released,3);
 references.forEach(f=>f.dispose());
});
