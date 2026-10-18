import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {prepareNativeObjectInitialization} from '../native-object-initialization.js';
import {nativeSineTableWords} from '../native-math-tables.js';
import {objectInitializationFixture} from './helpers/native-object-initialization-fixture.mjs';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceObjectInitialization,prepareNativeRaceStuntRingUpdate,nativeRaceStuntAwardsView} from '../native-race-state.js';
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-object-initialization-reference.json',import.meta.url)));
const owners=['objectWordsC940','collisionPlaneWordsFd78','packedObjectMatrixWords0cd0'];
const sineTableWords4350=nativeSineTableWords();
function canonical(q){
 const scene=Object.fromEntries(['objectCountFa40','courseIndex','players','difficulty','mode620','reverseDab68','alternate8250'].map(k=>[k,q[k]]));
 Object.assign(scene,{activity624:-1,primaryHumanIndex:0,ringNext0cb0:0,ringStreak0cb4:0,ringCountB134:1});
 return createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),scene,...Object.fromEntries(owners.map(k=>[k,q[k]]))});
}
const resources=q=>({sineTableWords4350,planeTemplatesByAddress:q.planeTemplatesByAddress,kind11DisplayListWords:q.kind11DisplayListWords});

test('complete object initialization matches original744EC and all nested transforms for100 mixed-course cases',()=>{
 for(const c of reference.cases){
  const q=objectInitializationFixture(c.kinds,c.options),expected={collisionPlaneCount0578:c.expected.collisionPlaneCount0578};
  for(const key of owners){expected[key]=q[key].slice();for(const x of c.expected[key])expected[key][x.wordIndex]=x.value;}
  const out=prepareNativeObjectInitialization({...q,sineTableWords4350});
  assert.deepEqual(out,expected,JSON.stringify({kinds:c.kinds,options:c.options}));
  const before=canonical(q),initialized=prepareNativeRaceObjectInitialization(before,resources(q));
  for(const key of owners)assert.deepEqual(initialized.state[key],expected[key]);
  assert.equal(initialized.state.scene.collisionPlaneCount0578,expected.collisionPlaneCount0578);
  assert.deepEqual(initialized.state.raceWords1f94,before.raceWords1f94);
  assert.deepEqual(initialized.state.hudWords7788,before.hudWords7788);
 }
});

test('initialized rings collect through the same retained object owner while ramp planes and matrices remain intact',()=>{
 const q=objectInitializationFixture([1,8]),before=canonical(q),initialized=prepareNativeRaceObjectInitialization(before,resources(q));
 assert.equal(initialized.state.objectWordsC940[49+0xbc/4],0,'initialization clears old collection state');
 const collected=prepareNativeRaceStuntRingUpdate(initialized.state,{primaryBodyPositionNative:{x:-229,y:57,z:38}});
 assert.deepEqual(collected.diagnostic.collectedRows,[1]);
 assert.equal(collected.state.objectWordsC940[49+0xbc/4],1);
 assert.equal(nativeRaceStuntAwardsView(collected.state).slots[0].amount,50);
 assert.deepEqual(collected.state.collisionPlaneWordsFd78,initialized.state.collisionPlaneWordsFd78);
 assert.deepEqual(collected.state.packedObjectMatrixWords0cd0,initialized.state.packedObjectMatrixWords0cd0);
 assert.equal(collected.state.scene.collisionPlaneCount0578,6);
 assert.equal(collected.state.scene.ringCountB134,1);
 const second=prepareNativeRaceStuntRingUpdate(collected.state,{primaryBodyPositionNative:{x:-229,y:57,z:38}});
 assert.deepEqual(second.diagnostic.collectedRows,[]);
 assert.equal(second.state.objectWordsC940[49+0x6c/4],1);
});

test('source plane-cap check repeats during a template loop and preserves all unwritten storage',()=>{
 const q=objectInitializationFixture(Array(6).fill(1)),out=prepareNativeObjectInitialization({...q,sineTableWords4350});
 assert.equal(out.collisionPlaneCount0578,27);
 assert.equal(out.objectWordsC940[4*49+0x68/4],6,'requested plane count remains6 even when only3 are copied');
 assert.equal(out.objectWordsC940[5*49+0x64/4],27);
 assert.deepEqual(out.collisionPlaneWordsFd78.slice(27*16),q.collisionPlaneWordsFd78.slice(27*16));
});

test('missing late resources, overflow and duplicate owners leave the canonical input unchanged',()=>{
 const q=objectInitializationFixture([8],{course:7}),state=canonical(q),before=nativeRaceStateSnapshot(state);
 assert.throws(()=>prepareNativeRaceObjectInitialization(state,{...resources(q),planeTemplatesByAddress:{}}),/plane template/);
 assert.deepEqual(nativeRaceStateSnapshot(state),before);
 assert.throws(()=>prepareNativeRaceObjectInitialization(state,{...resources(q),objectWordsC940:q.objectWordsC940}),/overlaps/);
 const full=objectInitializationFixture(Array(6).fill(1),{course:7}),copy=structuredClone(full);
 assert.throws(()=>prepareNativeObjectInitialization({...full,sineTableWords4350}),/overflow/);
 assert.deepEqual(full,copy);
});
