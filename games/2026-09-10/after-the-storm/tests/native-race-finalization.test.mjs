import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceFinalizationState,nativeRaceFinalizationSnapshot,prepareNativeRaceRecords,
 prepareNativeRaceFinalization,prepareNativeVersusRouteGap,prepareNativeRacePresentationTail} from '../native-race-finalization.js';
import {createNativeRaceRankingState,prepareNativeRaceRanking} from '../native-race-ranking.js';

const F=Math.fround,MIN=-2147483648,MAX=2147483647;
function racer(i=0,extra={}){const timingWords2a9c=Array(98).fill(0);timingWords2a9c[0]=1;
 return {lap2938:0,nextPrimary2944:0,place293c:i,finished2c2c:0,record2c24:0,splitDelta2c30:-7,
  splitState2c34:0,splitTimer2c38:9,splitPeer2c74:-1,routeGap2c68:.5,timingWords2a9c,...extra};}
function tables(){return {fastLap22c0:[100,1,2,3,91],normalTimes1ff0:[[3000,11,12,13,51],[4000,21,22,23,61],[5000,31,32,33,71]],
 reverseTime23b0:[6000,4,5,6,81],bestSplits24a0:Array(9).fill(-1),recordPlace2660:-2,bestLapFlag2690:-3};}
const state=()=>createNativeRaceFinalizationState({records:Array.from({length:4},(_,i)=>racer(i)),flag1fd4:0,flag1fd8:0,
 placeChanged8a9c:9,finishWait1fdc:0,recordPlace2650:0,bestLapFlag2654:0,courseRecords:tables()});
const snapshot=()=>nativeRaceFinalizationSnapshot(state());
const context=(extra={})=>({activity624:-1,mainState638:1,mode620:4,racerCount:4,primaryHumanIndex:0,secondaryHumanIndex:1,
 playerCountDab28:1,state600:0,reverseDab68:0,metadataD9b0:7,metadataCb32c:8,metadataCb338:2,oldPrimaryPlace293c:0,
 primaryRoute:{traversalBudget:0,nodes:[]},...extra});
const records=(s,q={})=>prepareNativeRaceRecords(s,context(q));
const finalize=(s,q={})=>prepareNativeRaceFinalization(s,context(q));
const calls=r=>r.effects.filter(x=>x.consumer==='splitFeedbackC3ef4').map(x=>x.argument);

test('retained canonical words and selected-course tables copy without invented reset state or scalar time aliases',()=>{
 const input=snapshot(),before=structuredClone(input),s=createNativeRaceFinalizationState(input);
 input.records[0].timingWords2a9c[14]=999;input.courseRecords.normalTimes1ff0[0][4]=999;
 assert.deepEqual(nativeRaceFinalizationSnapshot(s),before);assert.ok(Object.isFrozen(s.records[0].timingWords2a9c));
 assert.equal('finishTime2ad4' in s.records[0],false);assert.equal('orderByPlace' in s,false);
 assert.throws(()=>createNativeRaceFinalizationState({...before,records:[racer(0,{timingWords2a9c:Array(97).fill(0)})]}),/98/);
 assert.throws(()=>createNativeRaceFinalizationState({...before,flag1fd4:undefined}),/flag1fd4/);
});

test('selected primary record insertion shifts all five stored words and records exact best-run source indices',()=>{
 const s=snapshot(),p=s.records[2];p.finished2c2c=1;p.record2c24=-1;
 p.timingWords2a9c[3]=80;p.timingWords2a9c[14]=2000;p.timingWords2a9c[16]=1234;
 for(let i=0;i<8;i++)p.timingWords2a9c[24+i*8]=700+i;
 p.timingWords2a9c[97]=98765;
 const before=structuredClone(s),r=records(s,{primaryHumanIndex:2});
 assert.equal(r.applied,true);assert.equal(r.state.flag1fd8,1);assert.deepEqual(r.state.courseRecords.fastLap22c0,[80,7,8,2,91]);
 assert.deepEqual(r.state.courseRecords.normalTimes1ff0,[[2000,7,8,2,51],[3000,11,12,13,51],[4000,21,22,23,61]]);
 assert.deepEqual(r.state.courseRecords.bestSplits24a0,[1234,700,701,702,703,704,705,706,707]);
 assert.equal(r.state.recordPlace2650,1);assert.equal(r.state.courseRecords.recordPlace2660,1);assert.equal(r.state.courseRecords.bestLapFlag2690,1);
 assert.deepEqual(s,before,'record status is not an invented extra gate or a caller mutation');
});

test('strict record comparisons retain equal bests, allow a later tied finish row, and copy stale result latches verbatim',()=>{
 const s=snapshot();s.records[0].finished2c2c=-1;s.records[0].timingWords2a9c[3]=100;s.records[0].timingWords2a9c[14]=3000;
 const tied=records(s);assert.deepEqual(tied.state.courseRecords.normalTimes1ff0,[[3000,11,12,13,51],[3000,7,8,2,61],[4000,21,22,23,61]]);
 assert.equal(tied.state.bestLapFlag2654,0);assert.equal(tied.state.recordPlace2650,2);
 s.records[0].timingWords2a9c[14]=5000;s.recordPlace2650=-7;s.bestLapFlag2654=-9;
 const none=records(s);assert.equal(none.diagnostic.insertedPlace,null);assert.deepEqual(none.state.courseRecords.normalTimes1ff0,s.courseRecords.normalTimes1ff0);
 assert.equal(none.state.courseRecords.recordPlace2660,-7);assert.equal(none.state.courseRecords.bestLapFlag2690,-9);
});

test('reverse reads the signed16 selector, changes only its four record words, and leaves normal/best splits intact',()=>{
 const s=snapshot();s.records[0].finished2c2c=1;s.records[0].timingWords2a9c[3]=-100;s.records[0].timingWords2a9c[14]=5999;s.bestLapFlag2654=7;
 const r=records(s,{reverseDab68:-32768});assert.deepEqual(r.state.courseRecords.reverseTime23b0,[5999,7,8,2,81]);
 for(const k of ['normalTimes1ff0','fastLap22c0','bestSplits24a0'])assert.deepEqual(r.state.courseRecords[k],s.courseRecords[k]);
 assert.equal(r.state.courseRecords.bestLapFlag2690,7);assert.equal(r.state.recordPlace2650,1);
 const tie=structuredClone(s);tie.records[0].timingWords2a9c[14]=6000;
 assert.equal(records(tie,{reverseDab68:1}).diagnostic.reverseImproved,false);
 assert.throws(()=>records(s,{reverseDab68:32768}),/reverseDab68/);
});

test('record latch gates are literal activity/main/player/scene predicates with no phase650 or DQ gate',()=>{
 const s=snapshot();s.records[0].finished2c2c=1;
 for(const q of [{activity624:0},{mainState638:21},{playerCountDab28:2},{state600:1},{mode620:11}]){
  const r=records(s,q);assert.equal(r.applied,false);assert.deepEqual(r.state,s);
 }
 const latched=structuredClone(s);latched.flag1fd8=-1;assert.equal(records(latched).applied,false);
 assert.equal(records(s,{phase650:0,mode620:0}).applied,true);
 const missing=structuredClone(s);delete missing.courseRecords;delete missing.recordPlace2650;delete missing.bestLapFlag2654;
 assert.throws(()=>records(missing),/actual selected courseRecords/);assert.equal(records(missing,{state600:1}).applied,false);
});

test('race split reads both timing spans at the triggering record index and uses selected primary/predecessor slots',()=>{
 const s=snapshot();s.records[2].place293c=1;s.records[1].place293c=2;
 const own=s.records[2];own.lap2938=2;own.timingWords2a9c[0]=1;own.timingWords2a9c[17]=2501;own.splitState2c34=10;
 s.records[0].timingWords2a9c[17]=1000;s.records[0].timingWords2a9c[1]=9999;
 const r=finalize(s,{primaryHumanIndex:2,oldPrimaryPlace293c:1,mainState638:0});
 assert.equal(r.state.records[2].splitDelta2c30,1501);assert.equal(r.state.records[2].splitPeer2c74,0);
 assert.equal(r.state.records[2].splitState2c34,1);assert.equal(r.state.records[2].splitTimer2c38,40);assert.deepEqual(calls(r),[-2]);
 assert.equal(r.state.placeChanged8a9c,9,'no automatic latch reset');
});

test('zero/negative comparison time clears race split marker only; later active slots can read a retained trailing predecessor',()=>{
 for(const time of [0,-1]){
  const s=snapshot();s.records[1].splitState2c34=10;s.records[1].timingWords2a9c[1]=2501;s.records[0].timingWords2a9c[1]=time;
  const r=finalize(s);assert.equal(r.state.records[1].splitState2c34,0);
  assert.equal(r.state.records[1].splitDelta2c30,-7);assert.equal(r.state.records[1].splitTimer2c38,9);assert.deepEqual(calls(r),[]);
 }
 const s=snapshot();s.records[0].place293c=2;s.records[0].splitState2c34=10;s.records[0].timingWords2a9c[1]=3000;
 s.records[1].place293c=3;s.records[2].place293c=1;s.records[2].timingWords2a9c[1]=1000;
 const r=finalize(s,{racerCount:2,oldPrimaryPlace293c:2});assert.equal(r.state.records[0].splitPeer2c74,2);
 assert.equal(r.state.records[0].splitDelta2c30,2000);assert.deepEqual(calls(r),[]);
});

test('versus split uses whole signed times and updates selected counterpart before the next ascending record',()=>{
 const s=snapshot();s.records[2].place293c=1;s.records[3].place293c=0;s.records[2].splitState2c34=10;
 s.records[2].timingWords2a9c[1]=2501;s.records[3].timingWords2a9c[1]=1000;s.records[3].splitState2c34=10;
 const r=finalize(s,{mode620:1,primaryHumanIndex:2,secondaryHumanIndex:3});
 assert.deepEqual([r.state.records[2].splitState2c34,r.state.records[3].splitState2c34],[1,2]);
 assert.deepEqual([r.state.records[2].splitDelta2c30,r.state.records[3].splitDelta2c30],[1501,1501]);assert.deepEqual(calls(r),[-2]);
 const zero=structuredClone(s);zero.records[3].timingWords2a9c[1]=0;
 assert.deepEqual(calls(finalize(zero,{mode620:1,primaryHumanIndex:2,secondaryHumanIndex:3})),[0]);
});

test('signed32 split subtraction/add500/division and pointer shifts preserve source wrap instead of saturation',()=>{
 const s=snapshot();s.records[0].place293c=1;s.records[1].place293c=0;s.records[0].lap2938=0x20000000;
 s.records[0].splitState2c34=10;s.records[0].timingWords2a9c[1]=MIN;s.records[1].timingWords2a9c[1]=1;
 const r=finalize(s,{oldPrimaryPlace293c:1});assert.equal(r.state.records[0].splitDelta2c30,MAX);assert.deepEqual(calls(r),[2147483]);
 const negative=structuredClone(s);negative.records[0].timingWords2a9c[1]=-1500;
 assert.deepEqual(calls(finalize(negative,{oldPrimaryPlace293c:1})),[1],'source+500 then signed truncation is asymmetric for negative differences');
 const bad=structuredClone(s);bad.records[0].lap2938=0;bad.records[0].timingWords2a9c[0]=98;const before=structuredClone(bad);
 assert.throws(()=>finalize(bad,{oldPrimaryPlace293c:1}),/outside timingWords2a9c/);assert.deepEqual(bad,before);
});

test('versus terminal places favor the selected primary on ties, freeze once, and do not rewrite source ranking3990',()=>{
 const s=snapshot();s.records[2].finished2c2c=s.records[3].finished2c2c=1;s.records[2].timingWords2a9c[14]=2000;s.records[3].timingWords2a9c[14]=2000;
 const ranking=prepareNativeRaceRanking(createNativeRaceRankingState({orderByPlace:[3,2,1,0],records:s.records.map((r,i)=>({
  place293c:r.place293c,finished2c2c:r.finished2c2c,record2c24:r.record2c24,finishTime2ad4:r.timingWords2a9c[14],metric2c64:4-i,reconciled2c3c:1}))}),
  {activity624:-1,mainState638:1,mode620:1,phase650:3,flag1fd4:0,racerCount:4});
 const order=[...ranking.state.orderByPlace],r=finalize(s,{mode620:1,primaryHumanIndex:2,secondaryHumanIndex:3});
 assert.deepEqual([r.state.records[2].place293c,r.state.records[3].place293c],[0,1]);assert.equal(r.state.flag1fd4,1);assert.equal(r.state.flag1fd8,1);
 assert.deepEqual(ranking.state.orderByPlace,order);assert.deepEqual([r.state.records[0].place293c,r.state.records[1].place293c],[0,1]);
 const faster=structuredClone(s);faster.records[3].timingWords2a9c[14]=1999;
 assert.deepEqual([2,3].map(i=>finalize(faster,{mode620:1,primaryHumanIndex:2,secondaryHumanIndex:3}).state.records[i].place293c),[1,0]);
 const frozen=structuredClone(r.state);frozen.records[3].timingWords2a9c[14]=-1;
 assert.deepEqual([2,3].map(i=>finalize(frozen,{mode620:1,primaryHumanIndex:2,secondaryHumanIndex:3}).state.records[i].place293c),[0,1]);
});

test('versus global latch responds only to selected-human terminal flags and main1, independently of phase650',()=>{
 const s=snapshot();s.records[0].record2c24=1;
 assert.equal(finalize(s,{mode620:1,primaryHumanIndex:2,secondaryHumanIndex:3,phase650:0}).state.flag1fd8,0);
 s.records[3].record2c24=-1;const r=finalize(s,{mode620:1,primaryHumanIndex:2,secondaryHumanIndex:3,phase650:0});
 assert.equal(r.state.flag1fd8,1);assert.equal(r.state.flag1fd4,0);
 assert.equal(finalize(s,{mode620:1,primaryHumanIndex:2,secondaryHumanIndex:3,mainState638:0}).state.flag1fd8,0);
});

test('versus route gap follows primary next links, increments on kind3, and retains sourceF32/sign-zero/budget behavior',()=>{
 const s=snapshot();s.records[2].lap2938=1;s.records[2].nextPrimary2944=0;s.records[2].place293c=0;
 s.records[3].lap2938=0;s.records[3].nextPrimary2944=1;s.records[3].place293c=1;
 const primaryRoute={traversalBudget:3,nodes:[{length88:1.1,kind98:0,nextA0:1},{length88:2.2,kind98:3,nextA0:2},{length88:3.3,kind98:0,nextA0:0}]};
 const q=context({mode620:1,primaryHumanIndex:2,secondaryHumanIndex:3,primaryRoute}),r=prepareNativeVersusRouteGap(s,q);
 assert.deepEqual(r.diagnostic,{steps:2,reached:true,distanceNative:5.5});assert.equal(r.state.records[2].routeGap2c68,-5.5);assert.equal(r.state.records[3].routeGap2c68,5.5);
 const partial=prepareNativeVersusRouteGap(s,{...q,primaryRoute:{...primaryRoute,traversalBudget:1}});
 assert.deepEqual(partial.diagnostic,{steps:1,reached:false,distanceNative:F(2.2)});
 const equal=snapshot(),zero=prepareNativeVersusRouteGap(equal,context({mode620:1}));
 assert.equal(Object.is(zero.state.records[0].routeGap2c68,-0),true);assert.equal(Object.is(zero.state.records[1].routeGap2c68,-0),false);
 const wrap=snapshot();wrap.records[0].lap2938=MIN;wrap.records[1].lap2938=MAX;
 const wrapped=prepareNativeVersusRouteGap(wrap,context({mode620:1,primaryRoute:{traversalBudget:1,nodes:[{length88:7,kind98:3,nextA0:0}]}}));
 assert.equal(wrapped.diagnostic.reached,true);assert.equal(wrapped.state.records[0].routeGap2c68,-7);
 const float=snapshot();float.records[0].lap2938=1;
 const accumulated=prepareNativeVersusRouteGap(float,context({mode620:1,primaryRoute:{traversalBudget:3,nodes:[
  {length88:16777216,kind98:0,nextA0:1},{length88:1,kind98:0,nextA0:2},{length88:1,kind98:3,nextA0:0}]}}));
 assert.equal(accumulated.diagnostic.distanceNative,16777216,'each source sum rounds toF32');
});

test('race place-change latch and finish-wait counter retain exact independent source gates',()=>{
 const s=snapshot();s.records[0].finished2c2c=1;
 for(const [before,after]of [[MIN,MIN+1],[-1,0],[0,1],[MAX-1,MAX],[MAX,MAX]]){
  s.finishWait1fdc=before;const r=finalize(s,{mainState638:21,oldPrimaryPlace293c:1});
  assert.equal(r.state.finishWait1fdc,after);assert.equal(r.state.placeChanged8a9c,1);
 }
 assert.equal(finalize(s,{mode620:0}).state.finishWait1fdc,MAX);
 for(const q of [{mode620:11},{activity624:0}]){const r=finalize(s,q);assert.equal(r.applied,false);assert.equal(r.continuation,null);assert.deepEqual(r.effects,[]);assert.deepEqual(r.state,s);}
});

test('overlay tail uses a fresh signed16 event/status snapshot after the three ordered prelude calls',()=>{
 const r=finalize(state());assert.deepEqual(r.effects.map(e=>e.consumer),['overlayFc39c','overlayEf504','overlayF23a0']);
 assert.equal(r.continuation,'ordinaryPresentationTail');
 const fresh={record2c24BySlot:[0,0,-1,0],primaryHumanIndex:0,secondaryHumanIndex:1,playerCountDab28:2,state628:0};
 const allowed=prepareNativeRacePresentationTail(fresh);
 assert.deepEqual(allowed.effects.map(e=>e.consumer),['overlayF03e0','overlayF8dd0','overlayF9ea0','overlayF0e7c','overlayF1cfc']);
 for(const patch of [{state628:-32768},{state628:32767},{record2c24BySlot:[1,0,0,0]},{secondaryHumanIndex:2}]){
  const blocked=prepareNativeRacePresentationTail({...fresh,...patch});assert.equal(blocked.conditionalCalled,false);
  assert.deepEqual(blocked.effects.map(e=>e.consumer),['overlayF8dd0','overlayF9ea0','overlayF0e7c','overlayF1cfc']);
 }
 assert.throws(()=>prepareNativeRacePresentationTail({...fresh,state628:32768}),/state628/);
 assert.equal(prepareNativeRacePresentationTail({...fresh,playerCountDab28:1,secondaryHumanIndex:2}).conditionalCalled,true);
});

test('unavailable primary geometry or unsupported reads reject without a partial caller commit or main/phase guess',()=>{
 const s=state(),before=structuredClone(s);assert.throws(()=>finalize(s,{mode620:1,primaryRoute:undefined}),/primaryRoute/);
 assert.deepEqual(s,before);assert.throws(()=>finalize(s,{oldPrimaryPlace293c:undefined}),/oldPrimaryPlace293c/);
 const r=finalize(s,{mode620:0});assert.equal('mainState638' in r.state,false);assert.equal('phase650' in r.state,false);
 assert.throws(()=>{r.state.records[0].place293c=2;},TypeError);
});
