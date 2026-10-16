import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceUnfinishedEstimates as estimate,prepareNativeRaceResultStageUpdate as stage} from '../native-race-state.js';
import {getCourse} from '../courses.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {prepareNativePrimaryRaceClock} from '../native-primary-race-clock.js';
const ri=a=>(a-0x1f94)/4,record=i=>0x2938+i*0x378;
const bits=n=>{const v=new DataView(new ArrayBuffer(4));v.setFloat32(0,n);return v.getUint32(0);};
function fixture(count=2){
 const state={scene:{racerCount:count,courseIndex:1,configuredLaps728:3},raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0)};
 const put=(i,offset,v)=>{state.raceWords1f94[ri(record(i)+offset)]=v>>>0;};
 for(let i=0;i<count;i++){put(i,0,3);put(i,4,i);put(i,0xc,0);put(i,0x19c,1000);}
 const nodes=Array.from({length:2},(_,i)=>{
  const r=Array(65).fill(0);r[8/4]=bits(i*100);r[0x74/4]=bits(1);r[0x88/4]=bits(100);
  r[0x98/4]=i===1?3:0;r[0xa0/4]=1-i;r[0xa8/4]=1-i;return r;
 });
 return {state,put,input:{primaryRecordWordsBySourceRow:nodes,bodyPositionsNativeBySlot:Array.from({length:count},()=>({x:0,z:100}))}};
}
const value=(r,i,offset)=>r.state.raceWords1f94[ri(record(i)+offset)]|0;

test('unfinished estimates use initialized lengths, previous-node projection and current lap before walking to final finish',()=>{
 const f=fixture(),before=structuredClone(f.state),r=estimate(f.state,f.input);
 assert.equal(value(r,0,0x19c),1135);assert.equal(value(r,1,0x19c),1144);
 assert.deepEqual(f.state,before);
 assert.deepEqual(r.diagnostic.estimates[0].walkedRows,[0]);assert.equal(r.diagnostic.estimates[0].remainingDistanceNative,120);
 f.put(0,0,2);const lap=estimate(f.state,f.input);
 assert.deepEqual(lap.diagnostic.estimates[0].walkedRows,[0,1,0]);assert.equal(value(lap,0,0x19c),1360);
 const writes=new Set([ri(0x1fd4),ri(0x26c0),ri(0x26c4),ri(record(0)+0x19c),ri(record(1)+0x19c)]);
 assert.deepEqual(r.state.raceWords1f94.filter((_,i)=>!writes.has(i)),before.raceWords1f94.filter((_,i)=>!writes.has(i)));
 assert.deepEqual(estimate(r.state).operations,[],'one-shot must not require route/body/scene inputs again');
});

test('equal estimates preserve places and projection clamps only the remaining fraction',()=>{
 const f=fixture();f.put(1,0x19c,991);
 const tied=estimate(f.state,f.input);assert.equal(value(tied,0,0x19c),1135);assert.equal(value(tied,1,0x19c),1135);
 assert.deepEqual([value(tied,0,4),value(tied,1,4)],[0,1]);
 for(const [z,distance]of [[-100,120],[100,120],[150,110],[200,100],[300,100]]){
  f.input.bodyPositionsNativeBySlot[0].z=z;
  assert.equal(estimate(f.state,f.input).diagnostic.estimates[0].remainingDistanceNative,distance);
 }
});

test('strict time comparisons swap only unfinished places and export current place words in slot order',()=>{
 const f=fixture(4);f.put(0,0x19c,2000);f.put(1,0x19c,0);
 f.put(2,0x2f4,1);f.put(2,0x19c,750000);f.put(3,0x2ec,1);f.put(3,0x19c,700000);
 const r=estimate(f.state,f.input);
 assert.deepEqual([0,1,2,3].map(i=>value(r,i,4)),[1,0,2,3]);
 assert.deepEqual(r.state.raceWords1f94.slice(ri(0x26c0),ri(0x26c0)+4),[1,0,2,3]);
 assert.equal(value(r,2,0x19c),599999);assert.equal(value(r,3,0x19c),599999);
 assert.equal(value(r,2,0x2f4),1);assert.equal(value(r,3,0x2ec),1);
 f.state.scene.courseIndex=0;f.state.raceWords1f94.fill(0x12345678,ri(0x26c0),ri(0x26c0)+4);
 assert.deepEqual(estimate(f.state,f.input).state.raceWords1f94.slice(ri(0x26c0),ri(0x26c0)+4),Array(4).fill(0x12345678));
});

test('all finished/DQ records and zero racers do not read route or body data',()=>{
 for(const count of [0,2]){
  const f=fixture(count);for(let i=0;i<count;i++)f.put(i,i?0x2ec:0x2f4,1);
  delete f.state.scene.configuredLaps728;
  assert.equal(estimate(f.state).state.raceWords1f94[ri(0x1fd4)],1);
 }
 const f=fixture();f.state.raceWords1f94[ri(0x1fd4)]=0xffffffff;f.state.scene={};
 assert.deepEqual(estimate(f.state).operations,[]);
});

test('invalid course walks or arithmetic reject without committing the one-shot latch',()=>{
 const f=fixture(),before=structuredClone(f.state);
 f.input.primaryRecordWordsBySourceRow[1][0x98/4]=0;
 assert.throws(()=>estimate(f.state,f.input),/bounded final finish/);assert.deepEqual(f.state,before);
 f.input.primaryRecordWordsBySourceRow[1][0x88/4]=0;
 assert.throws(()=>estimate(f.state,f.input),/finite float32/);assert.deepEqual(f.state,before);
});

test('finish and DQ stages expand the estimator at its ordered canonical call boundary',()=>{
 for(const consumer of ['802c6550','802c63b4']){
  const f=fixture();Object.assign(f.state.scene,{players:1,mode608:4,gameStateAb24:42,metadataD9b0:0,reverseDab68:0,pressed65a:0,unlockAb60:0});
  f.state.i1Words9440=Array(168).fill(0);f.state.i1Words9440[(0x9500-0x9440)/4]=1;
  f.state.profileWordsB330=Array(52).fill(0);f.state.profileWordsB330[0]=1;
  f.state.hudWords7788[(0x8a14-0x7788)/4]=1;
  const before=structuredClone(f.state),pending=stage(f.state,consumer),r=stage(f.state,consumer,{...f.input,expandEstimates:true});
  assert.ok(pending.effects.some(o=>o.consumer==='80077f5c'));assert.ok(!r.effects.some(o=>o.consumer==='80077f5c'));
  assert.equal(value(r,0,0x19c),1135);assert.equal(r.state.raceWords1f94[ri(0x1fd4)],1);
  const latch=r.operations.findIndex(o=>o.kind==='raceWordWrite'&&o.wordIndex===ri(0x1fd4));
  assert.ok(latch>=0&&latch<r.operations.findIndex(o=>o.consumer==='801ec0d4'));
  assert.deepEqual(f.state,before);assert.deepEqual(stage(r.state,consumer,{expandEstimates:true}).state.raceWords1f94,r.state.raceWords1f94);
 }
});

test('initialized Sunny class records feed estimates while the canonical one-shot flag stops subsequent clock advancement',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  const course=getCourse('greyhaven',difficulty),runtime=createNativeRaceCourseRuntime({course,difficulty,players:1});
  const f=fixture(4),rows=runtime.data.recordWordsBySourceRow,finish=runtime.data.finishSourceRow;
  for(let i=0;i<4;i++){f.put(i,0,2);f.put(i,0xc,finish);}
  const before=structuredClone(rows),input={primaryRecordWordsBySourceRow:rows,
   bodyPositionsNativeBySlot:runtime.data.nodes.slice(0,4).map(n=>({...n.centerNativeXZ}))};
  const r=estimate(f.state,input);assert.equal(r.diagnostic.estimates.length,4);
  assert.ok(r.diagnostic.estimates.every(e=>e.walkedRows.length>0&&e.remainingDistanceNative>0));
  const clock=prepareNativePrimaryRaceClock({main638:1,finished2c2c:0,record2c24:0,clockStopped817c:0,
   flag1fd4:r.state.raceWords1f94[ri(0x1fd4)],courseIndex:1,lapMs:500,totalMs:value(r,0,0x19c),ambientWord:0,ambientD4b00:0});
  assert.equal(clock.advanced,false);assert.equal(clock.totalMs,value(r,0,0x19c));assert.deepEqual(rows,before);
 }
});
