import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LEAK,leakTyre} from '../src/damage-handling';
import {tyreFailure} from '../src/tyre-condition';
import {SLOW,slowPuncture} from '../src/leaky-tyre';
test('past its age, some old rivals arrive with a tyre already going down, any corner, each car its own',()=>{
  const picks=Array.from({length:400},(_,id)=>slowPuncture(id,1)),hit=picks.filter(p=>p!==null);
  assert.ok(Math.abs(hit.length/picks.length-SLOW.share)<.07,`share ${hit.length/picks.length}`);
  assert.deepEqual([...new Set(hit.map(p=>p!.wheel))].sort(),[0,1,2,3],'every corner');
  for(const p of hit)assert.ok(p!.damage>=LEAK.onset&&p!.damage>=SLOW.start[0]&&p!.damage<=SLOW.start[1],'past the leak’s onset, not yet failing');
  assert.ok(Array.from({length:100},(_,id)=>slowPuncture(id,SLOW.age-.01)).every(p=>p===null),'not on younger cars');
  assert.deepEqual(slowPuncture(11,.9),slowPuncture(11,.9));assert.equal(slowPuncture(3,NaN),null);
});
test('such a tyre leaks as it rolls and is soft, then failing, a minute or two into a derby',()=>{
  const start=SLOW.start[0];let d=start,t=0;
  while(tyreFailure(d)===0&&t<600){d=leakTyre(d,8,.5);t+=.5;}
  assert.ok(t>20&&t<240,`fails after ${t}s at derby pace`);assert.equal(leakTyre(start,0,1),start,'standing still it holds');
});
test('main gives old rivals their slow punctures, with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage&&i!==0&&car.tyreDamage){const leak=slowPuncture(car.id,startingRust(car.id));if(leak){car.tyreDamage[leak.wheel]=Math.max(car.tyreDamage[leak.wheel],leak.damage);slowLeaks.set(car,leak.wheel);}}'));
  assert.ok(main.includes('slowLeak: (id = 0) =>'));
});
