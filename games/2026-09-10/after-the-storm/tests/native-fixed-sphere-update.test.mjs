import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {prepareNativeFixedSphereUpdate} from '../native-fixed-sphere-update.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceFixedSphereUpdate} from '../native-race-state.js';
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-fixed-sphere-update-reference.json',import.meta.url)));
function input(c){const words=Array.from({length:1536},(_,i)=>0x12340000+i);c.tags.forEach((tag,i)=>words[i*6+4]=tag>>>0);return {...c,fixedSphereWordsB138:words};}
function state(q,activity624=-1){return createNativeRaceState({raceWords1f94:Array(1693).fill(0x34567890),hudWords7788:Array(1442).fill(0x12345678),
 fixedSphereWordsB138:q.fixedSphereWordsB138,fixedSphereGridWords1ce8:Array(166).fill(0x56789012),
 scene:{courseIndex:q.courseIndex,fixedSphereCountC938:q.fixedSphereCountC938,activity624,simulation648:0}});}

test('Southern fixed-sphere tide writes match52 original execution cases and preserve the XZ grid',()=>{
 for(const c of reference.cases){
  const q=input(c.input),before=state(q),expected=q.fixedSphereWordsB138.slice();
  for(const p of c.expected.patches)expected[p.wordIndex]=p.value;
  const leaf=prepareNativeFixedSphereUpdate(q),wrapped=prepareNativeRaceFixedSphereUpdate(before,{datum2458:q.datum2458});
  assert.deepEqual(leaf.fixedSphereWordsB138,expected);assert.deepEqual(wrapped.state.fixedSphereWordsB138,expected);
  assert.equal(wrapped.applied,q.courseIndex===7&&q.fixedSphereCountC938>0);
  assert.deepEqual(wrapped.state.fixedSphereGridWords1ce8,before.fixedSphereGridWords1ce8);
  assert.deepEqual(wrapped.state.raceWords1f94,before.raceWords1f94);assert.deepEqual(wrapped.state.hudWords7788,before.hudWords7788);
  assert.deepEqual(wrapped.state.scene,before.scene);assert.deepEqual(before,state(q));
 }
});

test('source activity/course/count gates avoid unread storage, while tag5 needs no water datum',()=>{
 const raw={raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0)};
 for(const scene of [{activity624:0},{activity624:-1,courseIndex:1},{activity624:-1,courseIndex:7,fixedSphereCountC938:0},{activity624:-1,courseIndex:7,fixedSphereCountC938:-1}]){
  const before=createNativeRaceState({...raw,scene}),out=prepareNativeRaceFixedSphereUpdate(before);
  assert.equal(out.applied,false);assert.deepEqual(out.state,before);
 }
 const q=input({tags:[5,5],courseIndex:7,fixedSphereCountC938:2});
 const out=prepareNativeRaceFixedSphereUpdate(state(q));assert.equal(out.applied,true);
 assert.deepEqual(out.state.fixedSphereWordsB138,q.fixedSphereWordsB138);assert.deepEqual(out.diagnostic.updatedRows,[]);
});

test('invalid water datum or source overflow rejects without modifying the shared owner',()=>{
 const q=input({tags:[5,0],courseIndex:7,fixedSphereCountC938:2}),before=state(q),snapshot=nativeRaceStateSnapshot(before);
 for(const datum2458 of [undefined,NaN,1.5,2147483648])assert.throws(()=>prepareNativeRaceFixedSphereUpdate(before,{datum2458}),/datum2458/);
 assert.deepEqual(nativeRaceStateSnapshot(before),snapshot);
 const overflow=createNativeRaceState({...snapshot,scene:{...snapshot.scene,fixedSphereCountC938:257}});
 assert.throws(()=>prepareNativeRaceFixedSphereUpdate(overflow,{datum2458:0}),/fixedSphereCount/);
 assert.throws(()=>prepareNativeRaceFixedSphereUpdate(before,{datum2458:0,courseIndex:1}),/overlaps/);
});
