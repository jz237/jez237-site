import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {prepareNativeObjectLoading} from '../native-object-loading.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceObjectLoading,prepareNativeRaceObjectInitialization,prepareNativeRaceStuntRingUpdate,nativeRaceStuntAwardsView} from '../native-race-state.js';
import {objectInitializationFixture} from './helpers/native-object-initialization-fixture.mjs';
import {nativeSineTableWords} from '../native-math-tables.js';
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-object-loading-reference.json',import.meta.url)));
const seed=()=>Array.from({length:3136},(_,i)=>0x12340000+i);
const sceneKeys=['objectCountFa40','ringCountB134','difficulty','mode620','players','rampFilterOverride8254','forceStunt824c'];
function canonical(q){return createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),objectWordsC940:q.objectWordsC940,
 scene:Object.fromEntries(sceneKeys.map(k=>[k,q[k]]))});}
const rows=q=>Object.fromEntries(['rampRows','ringRows','genericRows'].map(k=>[k,q[k]]));

test('selected generic-row loader matches original instructions across102 filtering, ordering and capacity cases',()=>{
 for(const c of reference.cases){
  const input={...c.input,objectWordsC940:seed()},expected=seed();
  for(const x of c.expected.objectWordsC940)expected[x.wordIndex]=x.value;
  const out=prepareNativeObjectLoading(input),state=canonical(input),wrapped=prepareNativeRaceObjectLoading(state,rows(input));
  for(const actual of [out,wrapped.state]){
   assert.deepEqual(actual.objectWordsC940,expected);
   const counts=actual.scene??actual;
   assert.equal(counts.objectCountFa40,c.expected.objectCountFa40);assert.equal(counts.ringCountB134,c.expected.ringCountB134);
  }
  assert.deepEqual(wrapped.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(wrapped.state.hudWords7788,state.hudWords7788);
  assert.deepEqual(nativeRaceStateSnapshot(state),nativeRaceStateSnapshot(canonical(input)));
 }
});

test('rejected ramp writes remain in the slot reused by a generic ring, whose ordinal and ring total stay retained',()=>{
 const q={...reference.cases.at(-2).input,objectWordsC940:seed()},out=prepareNativeObjectLoading(q);
 assert.equal(out.objectCountFa40,1);assert.equal(out.ringCountB134,0);
 assert.equal(out.objectWordsC940[0x4c/4],8);assert.equal(out.objectWordsC940[0x50/4],2,'generic ring inherits rejected ramp variant');
 assert.equal(out.objectWordsC940[0x58/4],3,'generic row does not overwrite the loaded motion field');
 assert.equal(out.objectWordsC940[0xc0/4],q.objectWordsC940[0xc0/4]);
 assert.deepEqual(out.diagnostic.ramps,[{sourceRow:0,objectIndex:0,accepted:false}]);
});

test('selected rows load, initialize and collect through one canonical object span',()=>{
 const resources=objectInitializationFixture([]),q={...reference.cases[0].input,objectWordsC940:seed(),objectCountFa40:0,ringCountB134:0,difficulty:1,players:1,mode620:11,
  rampRows:[[0,0,1,0,0]],ringRows:[[100,64,200,7,0,90]],genericRows:[[300,0,400,9,0]]};
 const initial=nativeRaceStateSnapshot(canonical(q));
 Object.assign(initial.scene,{courseIndex:1,reverseDab68:0,alternate8250:0,activity624:-1,primaryHumanIndex:0,ringNext0cb0:0,ringStreak0cb4:0});
 Object.assign(initial,{collisionPlaneWordsFd78:resources.collisionPlaneWordsFd78,packedObjectMatrixWords0cd0:resources.packedObjectMatrixWords0cd0});
 const loaded=prepareNativeRaceObjectLoading(createNativeRaceState(initial),rows(q));
 assert.equal(loaded.state.scene.objectCountFa40,3);assert.equal(loaded.state.scene.ringCountB134,1);
 assert.deepEqual([0,1,2].map(i=>loaded.state.objectWordsC940[i*49+0x4c/4]),[1,8,10]);
 const initialized=prepareNativeRaceObjectInitialization(loaded.state,{sineTableWords4350:nativeSineTableWords(),planeTemplatesByAddress:resources.planeTemplatesByAddress});
 const collected=prepareNativeRaceStuntRingUpdate(initialized.state,{primaryBodyPositionNative:{x:100,y:56,z:200}});
 assert.deepEqual(collected.diagnostic.collectedRows,[1]);assert.equal(nativeRaceStuntAwardsView(collected.state).slots[0].amount,50);
 assert.equal(collected.state.scene.collisionPlaneCount0578,6);
 assert.deepEqual(collected.state.objectWordsC940.slice(2*49,3*49),initialized.state.objectWordsC940.slice(2*49,3*49));
});

test('overflow in a later group rejects atomically; a filled group stops before unconsumed rows',()=>{
 const q={...reference.cases[0].input,objectWordsC940:seed(),objectCountFa40:63,difficulty:1,mode620:11,
  rampRows:[[0,0,1,0,0]],ringRows:[[0,0,0,0,0,0]],genericRows:[]},state=canonical(q),before=nativeRaceStateSnapshot(state);
 assert.throws(()=>prepareNativeRaceObjectLoading(state,rows(q)),/overflow/);assert.deepEqual(nativeRaceStateSnapshot(state),before);
 const filled=prepareNativeObjectLoading({...q,rampRows:[q.rampRows[0],null],ringRows:[]});assert.equal(filled.objectCountFa40,64);
 assert.throws(()=>prepareNativeRaceObjectLoading(state,{...rows(q),objectCountFa40:0}),/overlaps/);
});
