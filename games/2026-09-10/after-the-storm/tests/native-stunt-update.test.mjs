import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {stuntFixture} from './helpers/native-stunt-update-fixture.mjs';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStuntUpdate,prepareNativeRaceStuntRingUpdate,nativeRaceStuntAwardsView} from '../native-race-state.js';
const ri=a=>(a-0x1f94)/4;
const consumers=['overlayFc39c','overlayEf504','overlayF23a0','overlayF03e0','overlayF8dd0','overlayF9ea0','overlayF0e7c','overlayF1cfc'];
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-stunt-update-reference.json',import.meta.url)));

test('complete Stunt79528 matches original execution across prepared racer, finish, countdown and retained-object cases',()=>{
 for(const c of reference.cases){
  const f=stuntFixture(c.options),initial=nativeRaceStateSnapshot(f.state);
  for(const [key,changes]of [['raceWords1f94',c.initial.raceChanges],['hudWords7788',c.initial.hudChanges]])
   for(const x of changes)initial[key][x.wordIndex]=x.value;
  Object.assign(initial.scene,c.initial.scene);
  if(c.initial.objectChanges){initial.objectWordsC940=Array(3136).fill(0);for(const x of c.initial.objectChanges)initial.objectWordsC940[x.wordIndex]=x.value;}
  const expected=structuredClone(initial);
  for(const [key,changes]of [['raceWords1f94',c.expected.raceChanges],['hudWords7788',c.expected.hudChanges]])
   for(const x of changes)expected[key][x.wordIndex]=x.value;
  Object.assign(expected.scene,c.expected.sceneChanges);
  const state=createNativeRaceState(initial),out=prepareNativeRaceStuntUpdate(state,{...f.input,...c.initial.input});
  assert.deepEqual(out.state,createNativeRaceState(expected),c.label);
  assert.deepEqual(out.effects,c.expected.effects,c.label);
  assert.deepEqual(out.diagnostic.consumers.map(x=>x.consumer),c.expected.consumers,c.label);
  assert.deepEqual(out.diagnostic.racers.map(x=>x.racerIndex),c.expected.phaseCalls.filter(x=>x.consumer==='800783ac').map(x=>x.racerIndex),c.label);
  assert.deepEqual(nativeRaceStateSnapshot(state),initial,'source state remains immutable');
 }
});

test('Stunt79528 updates racers in ascending order, shares the primary arc and ticks delayed awards per invocation',()=>{
 const f=stuntFixture({racers:2,primary:1}),s=nativeRaceStateSnapshot(f.state);
 s.raceWords1f94[ri(0x39d0)]=2;s.raceWords1f94[ri(0x39cc)]=100;
 f.input.bodiesBySlot[0].stuntMove1604=6;
 const out=prepareNativeRaceStuntUpdate(createNativeRaceState(s),f.input);
 assert.deepEqual(out.diagnostic.racers.map(r=>r.racerIndex),[0,1]);
 assert.deepEqual(out.diagnostic.consumers.map(r=>r.consumer),consumers);
 assert.equal(out.diagnostic.racers[0].moveAwards[0].points,157,'uses primary arc11, not racer0 arc10');
 assert.equal(out.state.raceWords1f94[ri(0x39d0)],0);assert.equal(out.state.raceWords1f94[ri(0x39cc)],0);
 assert.deepEqual(nativeRaceStuntAwardsView(out.state).slots.slice(0,2).map(s=>s.amount),[157,100]);
 assert.equal(nativeRaceStuntAwardsView(out.state).totals.total,0,'display transfer has not run');
});

test('late boundary retirement affects the following start gate and the subsequent ring stage',()=>{
 const f=stuntFixture(),s=nativeRaceStateSnapshot(f.state);
 s.raceWords1f94[ri(0x2c1c)]=1;s.raceWords1f94[ri(0x2c20)]=0;
 f.input.bodiesBySlot[0].positionNative.x=12000;
 const first=prepareNativeRaceStuntUpdate(createNativeRaceState(s),f.input);
 assert.equal(first.diagnostic.conditionalStart,true);assert.equal(first.state.raceWords1f94[ri(0x2c24)],1);
 const rings=prepareNativeRaceStuntRingUpdate(first.state);
 assert.deepEqual(rings.operations,[],'ring stage reads the newly committed retirement');
 const second=prepareNativeRaceStuntUpdate(first.state,f.input);
 assert.equal(second.diagnostic.conditionalStart,false);
 assert.deepEqual(second.diagnostic.consumers.map(r=>r.consumer),consumers.filter(n=>n!=='overlayF03e0'));
});

test('inactive mode guards and a late invalid boundary preserve the supplied canonical state',()=>{
 const f=stuntFixture(),s=nativeRaceStateSnapshot(f.state),before=nativeRaceStateSnapshot(f.state);
 for(const patch of [{activity624:0},{mode620:0}]){
  const state=createNativeRaceState({...s,scene:{...s.scene,...patch}}),out=prepareNativeRaceStuntUpdate(state);
  assert.equal(out.applied,false);assert.deepEqual(out.state,state);
 }
 assert.throws(()=>prepareNativeRaceStuntUpdate(f.state,{...f.input,allowedRegionsNative:[[0,0,0,0]]}),/sentinel/);
 assert.deepEqual(nativeRaceStateSnapshot(f.state),before);
 assert.throws(()=>prepareNativeRaceStuntUpdate(f.state,{...f.input,genericObjects:[]}),/overlaps/);
});
