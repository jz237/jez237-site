import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {PLATES,fitPlates,isPlate,plateFor} from '../src/number-plates';
const panel=(name:string,material:string,at:[number,number,number])=>{const g=new T.PlaneGeometry(.3,.1);g.translate(...at);g.setAttribute('wreckPosition',g.attributes.position.clone());const m=new T.Mesh(g,new T.MeshStandardMaterial({name:material}));m.name=name;return m;};
test('each rival has its own made-up registration, now and then a personal plate',()=>{
  const all=Array.from({length:300},(_,id)=>plateFor(id)),jokes=all.filter(p=>(PLATES.jokes as readonly string[]).includes(p)).length/all.length;
  assert.ok(Math.abs(jokes-PLATES.joke)<.07,`jokes ${jokes}`);assert.ok(new Set(all).size>200,'nearly all different');
  for(const p of all.filter(p=>!(PLATES.jokes as readonly string[]).includes(p)))assert.match(p,/^[A-HJ-NPR-Y]{2}\d{2} [A-HJ-NPR-Y]{3}$/,'two letters, two digits, three letters');
  assert.equal(plateFor(6),plateFor(6));assert.doesNotThrow(()=>plateFor(NaN));
});
test('a plate is a panel named for one or made of the plate material',()=>{
  assert.ok(isPlate(panel('panel_TailgateEstatePlate','Estate Rear Plate Backing',[0,0,0]))&&isPlate(panel('panel_bumper_rear_55','License',[0,0,0])));
  assert.ok(!isPlate(panel('panel_bumper_rear','paint Body',[0,0,0]))&&!isPlate(panel('panel_door','Chrome',[0,0,0])));
});
test('front plates go white and rear ones yellow, each read the right way, over the plate itself',()=>{
  const front=panel('panel_bumper_frontEstatePlate','Estate Plate Backing',[0,.4,2.3]),rear=panel('panel_TailgateEstatePlate','Estate Rear Plate Backing',[0,.6,-2.3]),door=panel('panel_door','paint Body',[.9,.6,0]);
  assert.equal(fitPlates([front,rear,door],'KF19 VVF'),2,'the two plates');
  const f=front.children[0] as T.Mesh,r=rear.children[0] as T.Mesh;assert.ok(f.geometry===front.geometry&&r.geometry===rear.geometry&&!door.children.length);
  const fm=f.material as T.ShaderMaterial,rm=r.material as T.ShaderMaterial;
  assert.equal(fm.uniforms.plain.value.getHex(),new T.Color(PLATES.front).getHex());assert.equal(rm.uniforms.plain.value.getHex(),new T.Color(PLATES.rear).getHex());
  assert.ok(fm.uniforms.bounds.value.x<fm.uniforms.bounds.value.y,'from in front, −x on the left');assert.ok(rm.uniforms.bounds.value.x>rm.uniforms.bounds.value.y,'from behind, +x on the left');
  assert.ok(fm.polygonOffset&&!fm.transparent,'an opaque face laid over the plate');
});
test('main plates offline rivals (never the player’s own plate), with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage&&i!==0){const reg=plateFor(car.id);if(fitPlates(car.panels,reg))plates.set(car,reg);}'));
  assert.ok(main.includes('plate: (id = 0) =>'));
});
