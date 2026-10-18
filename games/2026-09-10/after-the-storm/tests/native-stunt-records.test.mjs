import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshNativeStuntAwards,enqueueNativeStuntAward,displayNativeStuntAwards} from '../native-stunt-awards.js';
import {prepareNativeStuntRecords} from '../native-stunt-records.js';
import {createNativeStuntScoring,stepNativeStuntScoring} from '../native-stunt-scoring.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-award-owner-reference.json',import.meta.url)));
const context={mainState638:1,mode620:11,activity624:-1,state600:0,delayedAward39cc:0,
 finished2c2c:1,metadataD9b0:2,metadataCb32c:3,gameStateDab24:40,overlayMode8aa4:0};
const records=()=>({flag1fd8:0,recordPlace2928:77,courseRecords:[[900,10,11,12],[500,20,21,22],[100,30,31,32]]});
const enqueue=(s,points)=>enqueueNativeStuntAward(s,{kind:'trick',points,finish:true}).state;

test('source display ownership and all result gates match original instruction execution',()=>{
 const queued=enqueue(freshNativeStuntAwards(),1000);
 for(const c of reference.display){
  const out=displayNativeStuntAwards(queued,c.context);
  assert.equal(out.applied,c.applied);assert.equal(out.state.slots[0].age,c.applied?1:0);
  if(!c.applied){assert.deepEqual(out.state,queued);assert.equal(out.pulseBlend,null);}
 }
 for(const c of reference.records){
  const awards=structuredClone(freshNativeStuntAwards());awards.totals.total=c.total;
  c.slotTypes.forEach((type,i)=>awards.slots[i].type=type);
  const before=structuredClone(c.state),out=prepareNativeStuntRecords(c.state,{...c.context,awards});
  assert.deepEqual(out.state,c.expected);assert.deepEqual(c.state,before);
 }
});

test('final award transfers after the result gate and can unblock only the next source update',()=>{
 let awards=enqueue(freshNativeStuntAwards(),1000),state=records();
 for(let frame=1;frame<=23;frame++){
  const result=prepareNativeStuntRecords(state,{...context,awards});
  assert.equal(result.applied,false);state=result.state;
  awards=displayNativeStuntAwards(awards,context).state;
 }
 assert.equal(awards.totals.total,1000);assert.equal(state.flag1fd8,0);
 const result=prepareNativeStuntRecords(state,{...context,awards});
 assert.equal(result.applied,true);assert.equal(result.insertedPlace,1);
 assert.deepEqual(result.state.courseRecords,[[1000,2,3,12],[900,10,11,12],[500,20,21,22]]);
 const again=prepareNativeStuntRecords(result.state,{...context,awards});
 assert.equal(again.applied,false);assert.deepEqual(again.state,result.state);
});

test('a delayed finish trick must be enqueued and transferred before recording',()=>{
 let scoring=createNativeStuntScoring(),awards=freshNativeStuntAwards(),state=records();
 const consume=out=>{scoring=out.state;for(const award of out.awards)awards=enqueueNativeStuntAward(awards,award).state;};
 consume(stepNativeStuntScoring(scoring,{move:2,checkpoint:{atFinishLine:true,completeRun:true,remainingClockNative:0,crossingOffsetNative:0}}));
 assert.equal(scoring.delayedTicks,20);
 // A zero finish-time bonus emits no popup; the retained trick amount gates records.
 for(let frame=1;frame<=42;frame++){
  consume(stepNativeStuntScoring(scoring,{move:0,active:false}));
  const result=prepareNativeStuntRecords(state,{...context,delayedAward39cc:scoring.delayedTrick,awards});
  assert.equal(result.applied,false);state=result.state;
  awards=displayNativeStuntAwards(awards,context).state;
 }
 assert.equal(awards.totals.total,500);
 const result=prepareNativeStuntRecords(state,{...context,delayedAward39cc:scoring.delayedTrick,awards});
 assert.equal(result.applied,true);assert.equal(result.insertedPlace,3);
 // A tie with second place goes below it and preserves the third row's tail.
 assert.deepEqual(result.state.courseRecords[2],[500,2,3,32]);
});

test('no improvement clears the place, sets the latch, and leaves every retained row unchanged',()=>{
 const awards=freshNativeStuntAwards(),original=records();
 const out=prepareNativeStuntRecords(original,{...context,awards});
 assert.equal(out.applied,true);assert.equal(out.insertedPlace,null);
 assert.equal(out.state.flag1fd8,1);assert.equal(out.state.recordPlace2928,0);
 assert.deepEqual(out.state.courseRecords,original.courseRecords);
 assert.ok(Object.isFrozen(out.state.courseRecords[0]));assert.equal(original.flag1fd8,0);
});

test('delayed finish and non-gameplay contexts retain the complete result state',()=>{
 const awards=structuredClone(freshNativeStuntAwards());awards.totals.total=1000;
 for(const patch of [{delayedAward39cc:1},{mainState638:8},{mode620:4},{activity624:0},{state600:1},{finished2c2c:0}]){
  const state=records(),out=prepareNativeStuntRecords(state,{...context,...patch,awards});
  assert.equal(out.applied,false);assert.deepEqual(out.state,state);
 }
 assert.throws(()=>prepareNativeStuntRecords(records(),{...context,awards:{...awards,slots:[]}}));
 assert.throws(()=>prepareNativeStuntRecords(records(),{...context,awards,activity624:65535}));
 assert.throws(()=>displayNativeStuntAwards(awards,{...context,activity624:65535}));
});
