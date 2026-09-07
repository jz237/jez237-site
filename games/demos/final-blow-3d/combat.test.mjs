import test from 'node:test';
import assert from 'node:assert/strict';
import {Combat,MOVES} from './combat.mjs';

test('seeded CPU fights finish rounds, keep bodies separated, and preserve health bounds',()=>{
 for(let seed=1;seed<=30;seed++){
  const b=new Combat(seed);let finished=0;
  for(let tick=0;tick<60*120;tick++){
   b.step(1/60);
   for(const f of b.fighters){assert.ok(Number.isFinite(f.x));assert.ok(Math.abs(f.x)<=1.170001);assert.ok(f.hp>=0&&f.hp<=100);}
   assert.ok(b.fighters[1].x-b.fighters[0].x>=1.049999);
   finished+=b.events.filter(e=>e.type==='ko').length;b.events.length=0;
  }
  assert.ok(finished>=2,`seed ${seed} must finish bouts`);assert.ok(b.hits>0);
 }
});
test('same seed produces identical combat outcomes',()=>{
 const a=new Combat(237),b=new Combat(237);
 for(let i=0;i<60*35;i++){a.step(1/60);b.step(1/60);}
 assert.deepEqual(a.fighters,b.fighters);assert.deepEqual(a.events,b.events);
});
test('a strike applies its damage once and a block reduces damage',()=>{
 for(const blocked of [false,true]){
  const b=new Combat(1);b.phase='fight';const [a,target]=b.fighters;
  a.x=0;target.x=1;b.act(a,'attack',MOVES.jab.duration,'jab');a.think=10;target.think=10;
  if(blocked)b.act(target,'block',1);
  for(let i=0;i<30;i++)b.step(1/60);
  assert.equal(target.hp,blocked?99:95);assert.equal(b.hits,1);
 }
});
test('the two-jab combination lands twice, with no repeated damage between contacts',()=>{
 const b=new Combat(237);b.phase='fight';const [a,target]=b.fighters;
 a.x=-.55;target.x=.55;a.think=10;target.think=10;
 b.act(a,'attack',MOVES.doublejab.duration,'doublejab');
 for(let i=0;i<18;i++)b.step(1/60);
 assert.equal(target.hp,96);assert.equal(b.hits,1);
 for(let i=0;i<20;i++)b.step(1/60);
 assert.equal(target.hp,92);assert.equal(b.hits,2);
 assert.deepEqual(b.events.filter(e=>e.type==='hit').map(e=>e.combo),[1,2]);
});
test('the CPU uses all three added moves across seeded exhibitions',()=>{
 const seen=new Set();
 for(let seed=1;seed<=12;seed++){
  const b=new Combat(seed);
  for(let i=0;i<60*60;i++){b.step(1/60);for(const f of b.fighters)if(f.move)seen.add(f.move);b.events.length=0;}
 }
 for(const move of ['sweep','straight','doublejab'])assert.ok(seen.has(move),move);
});
