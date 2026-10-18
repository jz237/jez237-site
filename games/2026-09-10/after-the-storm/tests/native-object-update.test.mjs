import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {prepareNativeObjectUpdate} from '../native-object-update.js';
import {nativeSineTableWords} from '../native-math-tables.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceObjectUpdate,prepareNativeRaceObjectLoading,prepareNativeRaceObjectInitialization,prepareNativeRaceStuntRingUpdate} from '../native-race-state.js';
import {nativeStuntObjectResources} from '../native-stunt-object-resources.js';
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-object-update-reference.json',import.meta.url)));
const patch=(words,changes)=>{const result=words.slice();for(const c of changes)result[c.wordIndex]=c.value;return result;};
const sineTableWords4350=nativeSineTableWords();
function input(q){return {...q,objectWordsC940:patch(Array.from({length:3136},(_,i)=>0x12340000+i),q.objectWordPatches),
 collisionPlaneWordsFd78:Array.from({length:512},(_,i)=>0x34560000+i),packedObjectMatrixWords0cd0:Array.from({length:1024},(_,i)=>0x45670000+i),sineTableWords4350};}
function canonical(q,activity624=-1){const raceWords1f94=Array(1693).fill(0);raceWords1f94[(0x1fc8-0x1f94)/4]=q.fortressFlag1fc8>>>0;
 return createNativeRaceState({raceWords1f94,hudWords7788:Array(1442).fill(0),objectWordsC940:q.objectWordsC940,collisionPlaneWordsFd78:q.collisionPlaneWordsFd78,packedObjectMatrixWords0cd0:q.packedObjectMatrixWords0cd0,
  scene:{objectCountFa40:q.objectCountFa40,activity624}});}
const resources=q=>({sineTableWords4350,planeTemplatesByAddress:q.planeTemplatesByAddress});

test('full6E0F4 and original transform callees match208 retained cases through leaf and canonical owner',()=>{
 for(const c of reference.cases){
  const q=input(c.input),state=canonical(q),before=nativeRaceStateSnapshot(state),out=prepareNativeObjectUpdate(q),wrapped=prepareNativeRaceObjectUpdate(state,resources(q));
  for(const k of ['objectWordsC940','collisionPlaneWordsFd78']){
   const expected=patch(q[k],c.expected[k]);assert.deepEqual(out[k],expected);assert.deepEqual(wrapped.state[k],expected);
  }
  assert.deepEqual(wrapped.state.packedObjectMatrixWords0cd0,q.packedObjectMatrixWords0cd0);
  assert.deepEqual(wrapped.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(wrapped.state.hudWords7788,state.hudWords7788);assert.deepEqual(wrapped.state.scene,state.scene);
  assert.deepEqual(nativeRaceStateSnapshot(state),before);
 }
});

test('moving planes update only origins and large float positions need no packed transform',()=>{
 const c=reference.cases.at(-3),q=input(c.input),out=prepareNativeObjectUpdate(q);
 assert.deepEqual(out.diagnostic.planeOrigins,[{objectIndex:0,planeIndex:30},{objectIndex:0,planeIndex:31}]);
 for(let plane=0;plane<32;plane++)assert.deepEqual(out.collisionPlaneWordsFd78.slice(plane*16+3,(plane+1)*16),q.collisionPlaneWordsFd78.slice(plane*16+3,(plane+1)*16));
 assert.deepEqual(out.collisionPlaneWordsFd78.slice(0,30*16),q.collisionPlaneWordsFd78.slice(0,30*16));
 assert.notDeepEqual(out.objectWordsC940.slice(0x74/4,0x74/4+16),q.objectWordsC940.slice(0x74/4,0x74/4+16));
});

test('ring spin retains initialized collection axes and still feeds the shared collection stage',()=>{
 const r=nativeStuntObjectResources({courseIndex:1,players:1});
 let state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),objectWordsC940:Array(3136).fill(0),collisionPlaneWordsFd78:Array(512).fill(0),packedObjectMatrixWords0cd0:Array(1024).fill(0),
  scene:{objectCountFa40:0,ringCountB134:0,courseIndex:1,players:1,mode620:11,difficulty:2,forceStunt824c:0,rampFilterOverride8254:0,reverseDab68:0,alternate8250:0,activity624:-1,primaryHumanIndex:0,ringNext0cb0:0,ringStreak0cb4:0}});
 state=prepareNativeRaceObjectLoading(state,{rampRows:[],genericRows:[],ringRows:[[100,64,200,0,0,90]]}).state;
 state=prepareNativeRaceObjectInitialization(state,{sineTableWords4350,planeTemplatesByAddress:r.planeTemplatesByAddress}).state;
 const spun=prepareNativeRaceObjectUpdate(state,{sineTableWords4350});
 assert.deepEqual(spun.state.objectWordsC940.slice(0x30/4,0x40/4),state.objectWordsC940.slice(0x30/4,0x40/4));
 assert.notEqual(spun.state.objectWordsC940[0x14/4],state.objectWordsC940[0x14/4]);
 assert.deepEqual(prepareNativeRaceStuntRingUpdate(spun.state,{primaryBodyPositionNative:{x:100,y:56,z:200}}).diagnostic.collectedRows,[0]);
});

test('inactive updates and late plane overflow preserve complete retained input',()=>{
 const q=input(reference.cases.at(-3).input),state=canonical(q),before=nativeRaceStateSnapshot(state);
 const invalid=nativeRaceStateSnapshot(state);invalid.objectWordsC940[0x64/4]=31;const overflowing=createNativeRaceState(invalid);
 assert.throws(()=>prepareNativeRaceObjectUpdate(overflowing,resources(q)),/overflow/);assert.deepEqual(nativeRaceStateSnapshot(overflowing),invalid);
 assert.deepEqual(nativeRaceStateSnapshot(state),before);
 const inactive=prepareNativeRaceObjectUpdate(canonical(q,0));assert.equal(inactive.applied,false);assert.deepEqual(inactive.state.objectWordsC940,q.objectWordsC940);
 assert.throws(()=>prepareNativeRaceObjectUpdate(state,{...resources(q),fortressFlag1fc8:0}),/overlaps/);
});
