import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStuntRingUpdate,
 prepareNativeRaceStuntAwardDisplay,nativeRaceStuntAwardsView} from '../native-race-state.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-rings-reference.json',import.meta.url)));
const ri=a=>(a-0x1f94)/4;
function initial(c){
 const raceWords1f94=Array(1693).fill(0),objectWordsC940=Array(3136).fill(0);
 for(const q of c.initial)raceWords1f94[q.wordIndex]=q.value;
 for(const q of c.objectInitial)objectWordsC940[q.wordIndex]=q.value;
 return {raceWords1f94,objectWordsC940,hudWords7788:Array(1442).fill(0),scene:{...c.globals}};
}
test('primary ring geometry, source order, fade and signed counters match original6A748',()=>{
 for(const [index,c]of reference.cases.entries()){
  const before=initial(c),state=createNativeRaceState(before),expected=structuredClone(before);
  for(const [key,changes]of [['raceWords1f94',c.expected.raceChanges],['hudWords7788',c.expected.hudChanges],['objectWordsC940',c.expected.objectChanges]])
   for(const q of changes)expected[key][q.wordIndex]=q.value;
  expected.scene.ringNext0cb0=c.expected.ringNext0cb0;expected.scene.ringStreak0cb4=c.expected.ringStreak0cb4;
  const out=prepareNativeRaceStuntRingUpdate(state,c.input);
  assert.deepEqual(nativeRaceStateSnapshot(out.state),expected,`case${index}`);
  assert.deepEqual(out.effects,c.expected.effects,`effects${index}`);
  assert.deepEqual(nativeRaceStateSnapshot(state),before);
 }
});
test('overlapping rings collect once in source order and use the existing four-slot award queue',()=>{
 const c=reference.cases.find(c=>c.globals.objectCountFa40===8),s=initial(c);
 Object.assign(s.scene,{main638:1,gameStateAb24:40});
 let state=createNativeRaceState(s);
 const out=prepareNativeRaceStuntRingUpdate(state,c.input);state=out.state;
 assert.deepEqual(out.diagnostic.collectedRows,[0,2,3,4,5,6]);
 assert.deepEqual(out.effects.map(e=>e.arguments[0]),[1,2,3,4,5,6]);
 assert.equal(state.raceWords1f94[ri(0x292c)],6);
 assert.deepEqual(nativeRaceStuntAwardsView(state).slots.map(s=>s.amount),[300,100,150,200]);
 const again=prepareNativeRaceStuntRingUpdate(state,c.input);state=again.state;
 assert.deepEqual(again.diagnostic.collectedRows,[]);assert.deepEqual(again.effects,[]);
 assert.equal(state.objectWordsC940[0x6c/4],1,'newly collected ring starts fading on the next call');
 assert.equal(state.objectWordsC940[7*49+0x6c/4],255,'existing fade is capped');
 assert.equal(nativeRaceStuntAwardsView(state).totals.ring,0);
 for(let i=0;i<23;i++)state=prepareNativeRaceStuntAwardDisplay(state).state;
 assert.equal(nativeRaceStuntAwardsView(state).totals.ring,750);
 assert.equal(nativeRaceStuntAwardsView(state).totals.total,750);
});
test('ordinary, retired and finished riders cannot collect or fade rings',()=>{
 const c=reference.cases.find(c=>c.globals.objectCountFa40===8),s=initial(c);
 for(const kind of ['ordinary','inactive','finished','retired']){
  const seed=structuredClone(s);
  if(kind==='ordinary')seed.scene.mode620=0;
  if(kind==='inactive')seed.scene.activity624=0;
  if(kind==='finished')seed.raceWords1f94[ri(0x2c2c)]=1;
  if(kind==='retired')seed.raceWords1f94[ri(0x2c24)]=2;
  const state=createNativeRaceState(seed),out=prepareNativeRaceStuntRingUpdate(state);
  assert.deepEqual(nativeRaceStateSnapshot(out.state),seed);assert.deepEqual(out.effects,[]);
 }
});
test('an invalid later ring rejects the whole preparation without committing earlier collections',()=>{
 const c=reference.cases.find(c=>c.globals.objectCountFa40===8),seed=initial(c);
 seed.objectWordsC940[2*49]=0x7fc00000;
 const state=createNativeRaceState(seed),before=nativeRaceStateSnapshot(state);
 assert.throws(()=>prepareNativeRaceStuntRingUpdate(state,c.input),/ring float/);
 assert.deepEqual(nativeRaceStateSnapshot(state),before);
});
