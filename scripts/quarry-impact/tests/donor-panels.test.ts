import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {DONOR,fitDonors,pickDonors} from '../src/donor-panels';
const names=['door-left','door-right','hood','front-bumper','mirror-left','boot'];
test('the older a rival, the likelier its scrapyard panels; each car its own, never a bumper or mirror, never its own colour',()=>{
  const own=new T.Color(0x9a2a22),count=(age:number)=>Array.from({length:200},(_,id)=>pickDonors(names,id,age,own).length).reduce((a,b)=>a+b,0);
  assert.equal(count(0),0,'a new car has none');assert.ok(count(.4)<count(1)&&count(1)>200*.8,'more the older');
  assert.ok(Array.from({length:200},(_,id)=>pickDonors(names,id,1,own).length).every(n=>n<=2),'two at most');
  for(let id=0;id<60;id++){const picked=pickDonors(names,id,.95,own);
    assert.deepEqual(picked,pickDonors(names,id,.95,own),'its own, every time');
    assert.ok(picked.every(d=>(DONOR.parts as readonly string[]).includes(d.name)&&d.paint.colour!==0x9a2a22),'body panels only, not its own red');
    assert.equal(new Set(picked.map(d=>d.name)).size,picked.length,'two different panels');}
  assert.deepEqual(pickDonors(['front-bumper','mirror-left'],3,1,own),[],'nothing to swap');assert.ok(Array.isArray(pickDonors(names,NaN,NaN,own)));
});
test('a donor panel gets its own copy of the steel paint (shader work kept) in the donor colour, matte if primer; trim untouched',()=>{
  const paint=new T.MeshPhysicalMaterial({name:'paint_Paint 1 Test',color:0x9a2a22,clearcoat:.96,roughness:.26});let built=0;
  paint.onBeforeCompile=()=>{built++;};paint.customProgramCacheKey=()=>'quarry-paint';
  const trim=new T.MeshStandardMaterial({name:'Chrome'}),skin=new T.Mesh(new T.BoxGeometry(),paint),inner=new T.Mesh(new T.BoxGeometry(),paint),handle=new T.Mesh(new T.BoxGeometry(),trim),other=new T.Mesh(new T.BoxGeometry(),paint);
  const assemblies=[{name:'door-left',members:[{mesh:skin},{mesh:inner},{mesh:handle}]},{name:'hood',members:[{mesh:other}]}];
  const primer=DONOR.paints.find(p=>p.primer)!,colour=DONOR.paints.find(p=>!p.primer)!;
  assert.equal(fitDonors(assemblies,[{name:'door-left',paint:primer},{name:'boot',paint:colour}]),2,'the door skin and its inner, not the handle; no boot here');
  const m=skin.material as T.MeshPhysicalMaterial;assert.ok(m!==paint&&inner.material===m&&handle.material===trim&&other.material===paint,'its own copy, shared across the door');
  assert.equal(m.color.getHex(),primer.colour);assert.ok(m.clearcoat===0&&m.roughness>.7,'primer: matte, no lacquer');assert.equal(paint.color.getHex(),0x9a2a22,'the car keeps its own paint');
  m.onBeforeCompile({} as any,undefined as any);assert.equal(built,1,'shader work kept');assert.equal(m.customProgramCacheKey(),'quarry-paint');
  fitDonors(assemblies,[{name:'hood',paint:colour}]);const h=other.material as T.MeshPhysicalMaterial;assert.ok(h.color.getHex()===colour.colour&&h.clearcoat===.96,'a coloured donor keeps its lacquer');
});
test('main patches offline rivals (not the player, not the buggy) by their age, with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(car.extendedDamage&&i!==0&&type!=='buggy'){const picked=pickDonors(car.wreckParts.assemblies.map(a=>a.name),car.id,startingRust(car.id),car.paintColor);if(fitDonors(car.wreckParts.assemblies,picked))donorPanels.set(car,picked.map(d=>d.name));}"));
  assert.ok(main.includes('donors: (id = 0) =>'));
});
