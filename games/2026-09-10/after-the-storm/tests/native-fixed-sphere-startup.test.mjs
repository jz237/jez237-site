import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {prepareNativeFixedSphereLoading,prepareNativeFixedSphereInitialization} from '../native-fixed-sphere-startup.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceFixedSphereLoading,prepareNativeRaceFixedSphereInitialization} from '../native-race-state.js';
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-fixed-sphere-startup-reference.json',import.meta.url)));
const seed=()=>({fixedSphereWordsB138:Array.from({length:1536},(_,i)=>0x12340000+i),fixedSphereGridWords1ce8:Array.from({length:166},(_,i)=>0x34560000+i)});
const keys=['fixedSphereCountC938','objectCountFa40','courseIndex','difficulty','main638','reverseDab68','alternate8250','rampFilterOverride8254'];
const selected=q=>Object.fromEntries(['fixedRows','markerRows','hiddenRows'].map(k=>[k,q[k]]));
const canonical=q=>createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),
 fixedSphereWordsB138:q.fixedSphereWordsB138,fixedSphereGridWords1ce8:q.fixedSphereGridWords1ce8,scene:Object.fromEntries(keys.map(k=>[k,q[k]]))});
function expected(q,delta){const r={};for(const k of ['fixedSphereWordsB138','fixedSphereGridWords1ce8']){r[k]=q[k].slice();for(const x of delta[k])r[k][x.wordIndex]=x.value;}return r;}

test('selected fixed-sphere loading and complete grid initialization match96 original execution cases',()=>{
 for(const c of reference.cases){
  const q={...seed(),...c.input},before=canonical(q),loaded=c.load?prepareNativeFixedSphereLoading(q):q,
   wrapped=c.load?prepareNativeRaceFixedSphereLoading(before,selected(q)).state:before;
  const loadedExpected=expected(q,c.loaded);
  for(const actual of [loaded,wrapped]){
   assert.deepEqual(actual.fixedSphereWordsB138,loadedExpected.fixedSphereWordsB138);
   const scene=actual.scene??actual;assert.equal(scene.fixedSphereCountC938,c.loaded.fixedSphereCountC938);assert.equal(scene.objectCountFa40,c.loaded.objectCountFa40);
  }
  const initialized=prepareNativeFixedSphereInitialization({...q,...loaded}),next=prepareNativeRaceFixedSphereInitialization(wrapped).state,
   initializedExpected=expected(q,c.initialized);
  for(const actual of [initialized,next])for(const k of Object.keys(initializedExpected))assert.deepEqual(actual[k],initializedExpected[k]);
  assert.deepEqual(next.raceWords1f94,before.raceWords1f94);assert.deepEqual(next.hudWords7788,before.hudWords7788);
  assert.deepEqual(nativeRaceStateSnapshot(before),nativeRaceStateSnapshot(canonical(q)));
 }
});

test('the full grid keeps source list order, caps at511 and preserves its last byte',()=>{
 const c=reference.cases.find(c=>!c.load&&c.input.fixedSphereCountC938===256),q={...seed(),...c.input},out=prepareNativeFixedSphereInitialization(q),g=out.fixedSphereGridWords1ce8;
 assert.equal(g.slice(150).reduce((n,v)=>n+v,0),511);
 assert.deepEqual(g.slice(150,154),[256,255,0,0]);
 assert.equal(g[6],0x00010203);assert.equal(g[133]&255,q.fixedSphereGridWords1ce8[133]&255);
 assert.equal(out.fixedSphereWordsB138[5*6+1],q.fixedSphereWordsB138[5*6+1],'hidden tag5 retains Y');
 assert.equal(out.fixedSphereWordsB138[6+1],0,'marker Y resets');
});

test('later marker overflow rejects atomically while full hidden groups stop before unread rows',()=>{
 const q={...seed(),...reference.cases[0].input,fixedSphereCountC938:255,fixedRows:[[0,0,0]],markerRows:[[0,0]],hiddenRows:[]},state=canonical(q),before=nativeRaceStateSnapshot(state);
 assert.throws(()=>prepareNativeRaceFixedSphereLoading(state,selected(q)),/overflow/);assert.deepEqual(nativeRaceStateSnapshot(state),before);
 const stopped=prepareNativeFixedSphereLoading({...q,markerRows:[],hiddenRows:[null]});assert.equal(stopped.fixedSphereCountC938,256);
 assert.throws(()=>prepareNativeRaceFixedSphereLoading(state,{...selected(q),fixedSphereCountC938:0}),/overlaps/);
});
