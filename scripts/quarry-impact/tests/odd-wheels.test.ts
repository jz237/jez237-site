import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {ODD,fitOddWheels,oddWheelsFor} from '../src/odd-wheels';
test('old rivals lose a hubcap or two and some run a spare, each its own; younger cars match',()=>{
  const all=Array.from({length:400},(_,id)=>oddWheelsFor(id,1));
  const capped=all.filter(p=>p.missing.length).length/400,spares=all.filter(p=>p.spare>=0).length/400;
  assert.ok(Math.abs(capped-ODD.caps)<.07&&Math.abs(spares-ODD.spare)<.07,`${capped} ${spares}`);
  for(const p of all){assert.equal(new Set(p.missing).size,p.missing.length,'two different wheels');assert.ok(p.missing.every(i=>i>=0&&i<4)&&p.spare>=-1&&p.spare<4);}
  assert.ok(all.some(p=>p.missing.length===2));
  assert.deepEqual(oddWheelsFor(7,ODD.age-.01),{missing:[],spare:-1});assert.deepEqual(oddWheelsFor(9,.9),oddWheelsFor(9,.9));
});
test('a missing cap comes off its wheel; the spare loses its cap and is painted to stand out, shader work kept, tyre untouched',()=>{
  const rimPaint=new T.MeshStandardMaterial({name:'Rim',color:0xb0b0b0}),hook=()=>{};rimPaint.onBeforeCompile=hook;rimPaint.customProgramCacheKey=()=>'rim-dust';
  const wheels=[0,1,2,3].map(()=>{const w=new T.Group(),cap=new T.Mesh(new T.CircleGeometry(.2),new T.MeshStandardMaterial({name:'Hubcap chrome'}));cap.name='hubcap_fitted';
    w.add(cap,new T.Mesh(new T.BoxGeometry(),rimPaint),new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial({name:'Classic Tire'})));return w;});
  const fit=fitOddWheels(wheels,{missing:[0],spare:2});
  assert.deepEqual(fit,{caps:2,painted:1});
  assert.ok(!wheels[0].getObjectByName('hubcap_fitted')&&!wheels[2].getObjectByName('hubcap_fitted')&&!!wheels[1].getObjectByName('hubcap_fitted'));
  const spare=wheels[2].children.find(c=>((c as T.Mesh).material as T.Material).name==='Rim') as T.Mesh,m=spare.material as T.MeshStandardMaterial;
  assert.ok(m!==rimPaint&&m.color.getHex()===ODD.black&&m.onBeforeCompile===hook&&m.customProgramCacheKey()==='rim-dust','a bright rim’s spare goes black, its shader work kept');
  assert.equal(((wheels[3].children[1] as T.Mesh).material as T.Material),rimPaint,'the others keep theirs');
  const dark=new T.MeshStandardMaterial({name:'Rim',color:0x202020}),w=new T.Group();w.add(new T.Mesh(new T.BoxGeometry(),dark));
  fitOddWheels([w],{missing:[],spare:0});assert.equal(((w.children[0] as T.Mesh).material as T.MeshStandardMaterial).color.getHex(),ODD.white,'a dark rim’s spare goes white');
});
test('main gives old rivals their odd wheels after the hubcaps go on, with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  const caps=main.indexOf('if(car.extendedDamage)fitHubcaps(car.root,car.wheels);'),odd=main.indexOf('if(car.extendedDamage&&i!==0){const plan=oddWheelsFor(car.id,startingRust(car.id)),fit=fitOddWheels(car.wheels,plan);'),blur=main.indexOf('wheelBlurs.set(car,new WheelBlur(');
  assert.ok(caps>0&&odd>caps&&blur>odd,'after the caps are fitted, before the wheels are blurred');assert.ok(main.includes('oddWheels: (id = 0) =>'));
});
