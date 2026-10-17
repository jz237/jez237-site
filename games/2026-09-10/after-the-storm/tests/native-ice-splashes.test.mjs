import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNativeIceSplashes,queueNativeIceSplash,stepNativeIceSplashes} from '../native-ice-splashes.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-ice-splashes-reference.json',import.meta.url)));

test('shared splash emitter order, overwrite, random draws and particle ages match original executions',()=>{
 for(const c of reference.cases){let state=structuredClone(c.initial),seed=c.seed;
  for(const q of c.operations){const before=structuredClone(state),previous=state;
   if(q.kind==='queue')state=queueNativeIceSplash(state,q.position);
   else{const result=stepNativeIceSplashes(state,seed);seed=result.seed6f00;state=result.state;assert.equal(seed,q.seed);}
   assert.deepEqual(state,q.expected);assert.deepEqual(previous,before);
  }
 }
});

test('one ice burst consumes sixteen later draws over four calls and retires particles at age8',()=>{
 let state=queueNativeIceSplash(createNativeIceSplashes(),[1,24,3]),seed=17,draws=0;
 for(let i=0;i<12;i++){
  const result=stepNativeIceSplashes(state,seed);state=result.state;seed=result.seed6f00;draws+=result.randomDraws;
  assert.equal(result.randomDraws,i<4?4:0);
  if(i===0){assert.equal(state.slots[0].age,1);assert.equal(state.slots[0].active,true);assert.equal(state.emitters[0].remaining,3);}
  if(i===7){assert.equal(state.slots[0].age,8);assert.equal(state.slots[0].active,false);}
 }
 assert.equal(draws,16);assert.equal(state.slots.filter(p=>p.active).length,0);
 assert.equal(stepNativeIceSplashes(state,seed).seed6f00,seed);
});

test('splash updates require a bounded explicit owner and seed without mutating invalid input',()=>{
 const state=createNativeIceSplashes(),before=structuredClone(state);
 assert.throws(()=>stepNativeIceSplashes(state,undefined));assert.throws(()=>stepNativeIceSplashes(state,65536));
 assert.throws(()=>queueNativeIceSplash(state,[0,Infinity,0]));
 assert.throws(()=>stepNativeIceSplashes({...state,emitterCursor:2},0));
 assert.throws(()=>stepNativeIceSplashes({...state,slots:[]},0));assert.deepEqual(state,before);
});
