import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNativeIceFragments,resetNativeIceFragments,spawnNativeIceFragments,stepNativeIceFragments} from '../native-ice-fragments.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-ice-fragments-reference.json',import.meta.url)));

test('fragment creation, shared random draws, pool overwrite, stepping and reset match original prepared executions',()=>{
 for(const [index,c] of reference.cases.entries()){
  let state=structuredClone(c.initial),seed=c.seed;
  for(const [operationIndex,q] of c.operations.entries()){
   const before=structuredClone(state),previous=state;
   if(q.kind==='burst'){
    const result=spawnNativeIceFragments(state,{positionNative:q.position,velocityNative:q.velocity,seed6f00:seed});
    state=result.state;seed=result.seed6f00;
    assert.equal(seed,q.seed);assert.equal(result.randomDraws,16);assert.deepEqual(result.splashPositionNative,q.effect);
   }else if(q.kind==='step')for(let i=0;i<q.count;i++)state=stepNativeIceFragments(state);
   else if(q.kind==='reset')state=resetNativeIceFragments(state);
   else assert.fail(`Unknown reference operation ${q.kind}`);
   assert.deepEqual(previous,before,'preparing an update cannot mutate retained input');
   assert.deepEqual(state,q.expected,`case ${index}, operation ${operationIndex}`);
  }
 }
});

test('each break replaces eight slots, including live older fragments, in a sixteen-slot ring',()=>{
 let state=createNativeIceFragments(),seed=17;
 for(let event=0;event<3;event++){
  const result=spawnNativeIceFragments(state,{positionNative:[event*100,0,0],velocityNative:[0,0,0],seed6f00:seed});
  state=result.state;seed=result.seed6f00;
 }
 assert.equal(state.cursor,8);assert.equal(state.slots.filter(s=>s.active).length,16);
 assert.ok(state.slots.slice(0,8).every(s=>s.position[0]>170));
 assert.ok(state.slots.slice(8).every(s=>s.position[0]>70&&s.position[0]<130));
 const reset=resetNativeIceFragments(state);assert.equal(reset.cursor,0);assert.ok(reset.slots.every(s=>!s.active));
 assert.deepEqual(reset.slots.map(s=>({...s,active:true})),state.slots);
});

test('fragment producer requires explicit finite source coordinates, valid pool and shared seed',()=>{
 const state=createNativeIceFragments(),input={positionNative:[0,0,0],velocityNative:[0,0,0],seed6f00:0};
 assert.throws(()=>spawnNativeIceFragments(state,{...input,seed6f00:undefined}));
 assert.throws(()=>spawnNativeIceFragments(state,{...input,seed6f00:65536}));
 assert.throws(()=>spawnNativeIceFragments(state,{...input,positionNative:[0,Infinity,0]}));
 assert.throws(()=>spawnNativeIceFragments({...state,cursor:16},input));
 assert.throws(()=>stepNativeIceFragments({...state,slots:[]}));
 assert.throws(()=>resetNativeIceFragments({...state,slots:state.slots.map(s=>({...s,age:-1}))}));
 assert.equal(state.slots.filter(s=>s.active).length,0);
});
