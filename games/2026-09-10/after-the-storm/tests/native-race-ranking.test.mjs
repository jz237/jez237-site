import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceRankingState,nativeRaceRankingSnapshot,prepareNativeRaceFinishMetrics,prepareNativeRaceRanking,prepareNativeRaceStandings} from '../native-race-ranking.js';

// Synthetic records expose the source numeric rules, not original startup
// order, primary progress, player identities or final race admission.
const record=(extra={})=>({metric2c64:0,place293c:17,finished2c2c:0,record2c24:0,
 reconciled2c3c:0,finishTime2ad4:0,...extra});
const state=(scores=[1,2,3,4],extra=[])=>createNativeRaceRankingState({
 orderByPlace:scores.map((_,i)=>9-i),records:scores.map((v,i)=>record({metric2c64:v,place293c:17+i,...extra[i]}))});
const context=(extra={})=>({activity624:-1,mainState638:1,mode620:4,phase650:3,flag1fd4:0,racerCount:4,primaryHumanIndex:0,...extra});
const sort=(s,extra={})=>prepareNativeRaceRanking(s,context(extra));
const finish=(s,extra={})=>prepareNativeRaceFinishMetrics(s,context(extra));

test('retained state is explicit, copied, frozen and independent of setup/grid order',()=>{
 const input={orderByPlace:[77,-1],records:[record({metric2c64:.1}),record({place293c:-1})]};
 const s=createNativeRaceRankingState(input);input.records[0].place293c=99;input.orderByPlace[0]=0;
 assert.equal(s.records[0].place293c,17);assert.equal(s.orderByPlace[0],77);
 assert.equal(s.records[0].metric2c64,.10000000149011612);assert.ok(Object.isFrozen(s.records[0]));
 const snap=nativeRaceRankingSnapshot(s);snap.records[0].place293c=98;assert.equal(s.records[0].place293c,17);
 assert.deepEqual(createNativeRaceRankingState(structuredClone(snap)).records[1],s.records[1]);
 assert.throws(()=>createNativeRaceRankingState({records:[record()]}),/orderByPlace/);
 for(const key of Object.keys(record())){const r=record();delete r[key];assert.throws(()=>createNativeRaceRankingState({records:[r],orderByPlace:[0]}));}
});

test('descending F32 nested swaps publish source zero-based inverse places',()=>{
 const r=sort(state([10,30,20,40]));
 assert.deepEqual(r.state.orderByPlace,[3,1,2,0]);assert.deepEqual(r.state.records.map(x=>x.place293c),[3,1,2,0]);
 assert.equal(r.diagnostic.comparisons,6);assert.equal(r.applied,true);
 assert.deepEqual(r.state.records.map(x=>x.metric2c64),[10,30,20,40]);
});

test('equal keys can change relative order after another immediate swap',()=>{
 const r=sort(state([2,2,3,1]));
 assert.deepEqual(r.state.orderByPlace,[2,1,0,3]);
 assert.deepEqual(r.state.records.map(x=>x.place293c),[2,1,0,3]);
 assert.deepEqual(r.diagnostic.swaps,[{placeA:0,placeB:2,racerA:0,racerB:2}]);
});

test('ties reset to source index order each active call and compare rounded floats without integer truncation',()=>{
 assert.deepEqual(sort(state([1.00000004,1,1,1])).state.orderByPlace,[0,1,2,3]);
 assert.deepEqual(sort(state([1.25,1.75,1.5,1])).state.orderByPlace,[1,2,0,3]);
 assert.deepEqual(sort(state([-0,0,-0,0])).state.orderByPlace,[0,1,2,3]);
});

test('active prefix0..count-1 is the only order/record region written',()=>{
 const s=state([10,20,999,1000]),r=sort(s,{racerCount:2});
 assert.deepEqual(r.state.orderByPlace,[1,0,7,6]);assert.deepEqual(r.state.records.slice(2),s.records.slice(2));
 assert.deepEqual(sort(s,{racerCount:0}).state,s);
 const one=sort(s,{racerCount:1});assert.deepEqual(one.state.orderByPlace,[0,8,7,6]);assert.equal(one.state.records[0].place293c,0);
});

test('all ranking gates retain previous order and places instead of manufacturing new standings',()=>{
 const s=state([2,1,4,3]);
 for(const q of [{activity624:0},{activity624:1},{mainState638:0},{mainState638:21},
  {phase650:2},{flag1fd4:1},{flag1fd4:-1},{mode620:11},{mode620:0}]){
  const r=sort(s,q);assert.equal(r.applied,false);assert.deepEqual(r.state,s);assert.equal(r.diagnostic.comparisons,0);
 }
 assert.equal(sort(s,{mode620:1}).applied,true);assert.equal(sort(s,{mode620:4}).applied,true);
});

test('new eligible finish receives other metric and displaces its own value through signed truncation',()=>{
 const s=state([1.75,2.75],[{finished2c2c:1,finishTime2ad4:100},{finished2c2c:1,reconciled2c3c:1,finishTime2ad4:200}]);
 const r=finish(s,{racerCount:2});
 assert.deepEqual(r.state.records.map(x=>x.metric2c64),[2.75,1]);assert.equal(r.state.records[0].reconciled2c3c,1);
 assert.deepEqual(r.state.records.map(x=>x.place293c),s.records.map(x=>x.place293c));assert.deepEqual(r.state.orderByPlace,s.orderByPlace);
 assert.deepEqual(r.diagnostic.processed,[0]);assert.equal(r.diagnostic.metricSwaps.length,1);
});

test('negative fractional displacement truncates toward zero and integer zero returns positive F32 zero',()=>{
 for(const [metric,expected] of[[-1.75,-1],[-.75,0]]){
  const s=state([metric,2.75],[{finished2c2c:1,finishTime2ad4:0},{finished2c2c:1,reconciled2c3c:1,finishTime2ad4:1}]);
  const r=finish(s,{racerCount:2});assert.equal(r.state.records[1].metric2c64,expected);
  if(expected===0)assert.equal(Object.is(r.state.records[1].metric2c64,-0),false);
 }
});

test('finish reconciliation is independent of rank phase650/1fd4 but requires activity/main1/mode4',()=>{
 const s=state([1.75,2.75],[{finished2c2c:1,finishTime2ad4:0},{finished2c2c:1,reconciled2c3c:1,finishTime2ad4:1}]);
 const r=finish(s,{racerCount:2,phase650:0,flag1fd4:1});assert.equal(r.applied,true);assert.equal(r.state.records[0].metric2c64,2.75);
 for(const q of[{activity624:0},{mainState638:0},{mode620:1},{mode620:11}]){
  const out=finish(s,{racerCount:2,...q});assert.equal(out.applied,false);assert.deepEqual(out.state,s);
 }
});

test('finish/status/reconciliation words use zero predicates, and other already-reconciled finishers remain eligible peers',()=>{
 const peer={finished2c2c:1,reconciled2c3c:7,finishTime2ad4:1};
 for(const own of[{finished2c2c:0},{finished2c2c:1,record2c24:1},{finished2c2c:1,reconciled2c3c:2}]){
  const s=state([1,2],[own,peer]),r=finish(s,{racerCount:2});assert.deepEqual(r.state,s);
 }
 assert.equal(finish(state([1,2],[{finished2c2c:-1},peer]),{racerCount:2}).state.records[0].metric2c64,2);
 const s=state([1,2],[{finished2c2c:1},{...peer,record2c24:-1}]);assert.equal(finish(s,{racerCount:2}).state.records[0].metric2c64,1);
});

test('equal-time fallback uses OLD places and excludes the selected primary human rather than source slot zero',()=>{
 const s=state([10,10],[{place293c:0,finished2c2c:1,finishTime2ad4:100},{place293c:1,finished2c2c:1,reconciled2c3c:1,finishTime2ad4:100}]);
 assert.deepEqual(finish(s,{racerCount:2,primaryHumanIndex:0}).state.records.map(x=>x.finishTime2ad4),[100,101]);
 assert.deepEqual(finish(s,{racerCount:2,primaryHumanIndex:1}).state.records.map(x=>x.finishTime2ad4),[100,100]);
 const reversed=nativeRaceRankingSnapshot(s);reversed.records[0].place293c=2;
 assert.deepEqual(finish(reversed,{racerCount:2}).state.records.map(x=>x.finishTime2ad4),[100,100]);
});

test('the equal-time increment wraps signed32 and subsequent comparisons see the new value',()=>{
 const s=state([10,10],[{place293c:0,finished2c2c:1,finishTime2ad4:2147483647},
  {place293c:1,finished2c2c:1,reconciled2c3c:1,finishTime2ad4:2147483647}]);
 const r=finish(s,{racerCount:2});assert.equal(r.state.records[1].finishTime2ad4,-2147483648);
 assert.deepEqual(r.diagnostic.timeIncrements,[{processingRacer:0,racerIndex:1,before:2147483647,after:-2147483648}]);
});

test('combined phase reconciles before sorting, retains source input, and never assigns a race finish',()=>{
 const s=state([1.75,2.75],[{finished2c2c:1,finishTime2ad4:100},{finished2c2c:1,reconciled2c3c:1,finishTime2ad4:200}]),before=structuredClone(s);
 const q=context({racerCount:2}),r=prepareNativeRaceStandings(s,q);
 assert.deepEqual(r.state.orderByPlace,[0,1]);assert.deepEqual(r.state.records.map(x=>x.metric2c64),[2.75,1]);
 assert.equal(r.finishMetrics.applied,true);assert.equal(r.ranking.applied,true);assert.deepEqual(s,before);
 assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.state.orderByPlace));
 const unfinished=prepareNativeRaceStandings(state(),context());assert.ok(unfinished.state.records.every(x=>x.finished2c2c===0));
});

test('supported finite conversion endpoints are exact and invalid conversion rejects without a partial caller commit',()=>{
 const s=state([-2147483648,2147483520],[{finished2c2c:1,finishTime2ad4:0},{finished2c2c:1,reconciled2c3c:1,finishTime2ad4:1}]);
 assert.equal(finish(s,{racerCount:2}).state.records[1].metric2c64,-2147483648);
 const bad=state([2147483648,3e38],[{finished2c2c:1,finishTime2ad4:0},{finished2c2c:1,reconciled2c3c:1,finishTime2ad4:1}]),before=structuredClone(bad);
 assert.throws(()=>finish(bad,{racerCount:2}),/trunc.w.s/);assert.deepEqual(bad,before);
 // A huge finite value does not execute conversion on the ranking-only path.
 assert.deepEqual(sort(state([3e38,-3e38]),{racerCount:2,mode620:1}).state.orderByPlace,[0,1]);
 const q=context({racerCount:2,phase650:undefined});assert.throws(()=>prepareNativeRaceStandings(s,q),/phase650/);assert.equal(s.records[0].reconciled2c3c,0);
});

test('nonfinite/out-of-domain snapshots reject explicitly rather than sanitize or corrupt standings',()=>{
 for(const value of[NaN,Infinity,-Infinity,1e100])assert.throws(()=>state([value]),/metric2c64/);
 const s=state();for(const q of[{racerCount:5},{racerCount:-1},{activity624:32768},{mainState638:1.5},{flag1fd4:NaN}])assert.throws(()=>sort(s,q));
 assert.throws(()=>finish(s,{primaryHumanIndex:4}),/primaryHumanIndex/);
 assert.throws(()=>createNativeRaceRankingState({records:[],orderByPlace:[]}),/one to four/);
 assert.throws(()=>{s.records[0].place293c=0;},TypeError);
});
