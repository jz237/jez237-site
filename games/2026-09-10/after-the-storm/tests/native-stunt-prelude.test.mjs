import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations,
 prepareNativeRaceStuntPreludeUpdate,prepareNativeRaceStuntMoveUpdate,nativeRaceStuntAwardsView} from '../native-race-state.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-prelude-reference.json',import.meta.url)));
const ri=a=>(a-0x1f94)/4;
const fields={powerChanged2c4c:0x314,family2c88:0x350,record2c24:0x2ec,finished2c2c:0x2f4,
 lapTime2aa0:0x168,totalTime2ad4:0x19c,ambient2aa4:0x16c,remaining2bfc:0x2c4,expired2c6c:0x334,
 power2a64:0x12c,displayPower2a70:0x138,metricBits2c64:0x32c};
const globalFields={flag1fd4:0x1fd4,delayedAmount39cc:0x39cc,delayedTicks39d0:0x39d0,dqMetricBits39b4:0x39b4};
function fixture(c){
 const raceWords1f94=Array(1693).fill(0),base=0x2938+c.racerIndex*0x378;
 for(const [k,a]of Object.entries(fields))raceWords1f94[ri(base+a)]=c.record[k]>>>0;
 for(const [k,a]of Object.entries(globalFields))raceWords1f94[ri(a)]=c.globalState[k]>>>0;
 return createNativeRaceState({raceWords1f94,hudWords7788:Array(1442).fill(0),scene:{...c.globals,activity624:-1}});
}
const initial={globals:{courseIndex:1,primaryHumanIndex:0,secondaryHumanIndex:1,players:1,event628:0,main638:1,mode620:11,clockStopped817c:0,ambientD4b00:0},
 record:{powerChanged2c4c:5,family2c88:0x801aee20,record2c24:0,finished2c2c:0,lapTime2aa0:0,totalTime2ad4:0,ambient2aa4:0,
 remaining2bfc:0,expired2c6c:0,power2a64:5,displayPower2a70:0,metricBits2c64:0},
 globalState:{flag1fd4:0,delayedAmount39cc:500,delayedTicks39d0:1,dqMetricBits39b4:0},racerIndex:0,speedB90Native:10};

test('complete prelude and nested retirement match original execution across all synthetic cases',()=>{
 for(const c of reference.cases){
  const state=fixture(c),before=nativeRaceStateSnapshot(state),out=prepareNativeRaceStuntPreludeUpdate(state,c),base=0x2938+c.racerIndex*0x378;
  for(const [k,a]of Object.entries(fields)){
   const bits=out.state.raceWords1f94[ri(base+a)],actual=k==='family2c88'||k==='metricBits2c64'?bits:bits|0;
   assert.equal(actual,c.expected.record[k],`${k} case${reference.cases.indexOf(c)}`);
  }
  for(const [k,a]of Object.entries(globalFields))assert.equal(k==='dqMetricBits39b4'?out.state.raceWords1f94[ri(a)]:out.state.raceWords1f94[ri(a)]|0,c.expected.globalState[k],k);
  assert.deepEqual(out.operations.filter(o=>o.kind==='stuntAwardEnqueue').map(o=>o.award),c.expected.awards);
  assert.equal(out.diagnostic.earlyReturn,c.expected.earlyReturn);assert.equal(out.diagnostic.reason,c.expected.reason);
  const allowed=new Set([...Object.values(fields).map(a=>ri(base+a)),...Object.values(globalFields).map(ri)]);
  before.raceWords1f94.forEach((value,i)=>{if(!allowed.has(i))assert.equal(out.state.raceWords1f94[i],value);});
  assert.deepEqual(out.state.scene,before.scene);assert.deepEqual(nativeRaceStateSnapshot(state),before);
 }
});

test('event retirement returns before the delayed bonus, timeout retires after its enqueue',()=>{
 const event=fixture({...initial,globals:{...initial.globals,event628:1}}),stopped=prepareNativeRaceStuntPreludeUpdate(event,{racerIndex:0});
 assert.equal(stopped.diagnostic.reason,'event');assert.equal(stopped.state.raceWords1f94[ri(0x39d0)],1);
 assert.equal(nativeRaceStuntAwardsView(stopped.state).slots[0].type,0);
 const timeout=prepareNativeRaceStuntPreludeUpdate(fixture(initial),{racerIndex:0,speedB90Native:0});
 assert.equal(timeout.diagnostic.reason,'timeout');assert.equal(timeout.state.raceWords1f94[ri(0x39d0)],0);
 assert.equal(nativeRaceStuntAwardsView(timeout.state).slots[0].amount,500);
 const enqueue=timeout.operations.findIndex(o=>o.kind==='stuntAwardEnqueue');
 const retired=timeout.operations.findIndex(o=>o.kind==='recordWordWrite'&&o.wordIndex===0x2ec/4);
 assert.ok(enqueue>=0&&retired>enqueue);assert.equal(timeout.state.raceWords1f94[ri(0x2c24)],2);
 assert.equal(prepareNativeRaceStuntMoveUpdate(timeout.state,{racerIndex:0,move:1}).applied,false);
});

test('time-expired coasting survives200 calls and retires once on201 with shared DQ metric',()=>{
 let state=fixture({...initial,globalState:{...initial.globalState,delayedAmount39cc:0,delayedTicks39d0:0}});
 for(let frame=1;frame<=201;frame++){
  const out=prepareNativeRaceStuntPreludeUpdate(state,{racerIndex:0,speedB90Native:10});state=out.state;
  assert.equal(out.diagnostic.earlyReturn,frame===201);assert.equal(state.raceWords1f94[ri(0x2c6c)],frame);
 }
 assert.equal(state.raceWords1f94[ri(0x2c24)],2);const metric=state.raceWords1f94[ri(0x39b4)];
 for(let i=0;i<5;i++)state=prepareNativeRaceStuntPreludeUpdate(state,{racerIndex:0}).state;
 assert.equal(state.raceWords1f94[ri(0x39b4)],metric);assert.equal(state.raceWords1f94[ri(0x2c6c)],201);
});

test('a live remaining timer clears coast count; stopped clocks retain it while displayed power approaches',()=>{
 const live=fixture({...initial,record:{...initial.record,remaining2bfc:51,expired2c6c:33}});
 const advanced=prepareNativeRaceStuntPreludeUpdate(live,{racerIndex:0});
 assert.equal(advanced.state.raceWords1f94[ri(0x2bfc)],1);assert.equal(advanced.state.raceWords1f94[ri(0x2c6c)],0);
 const held=fixture({...initial,globals:{...initial.globals,clockStopped817c:1},record:{...initial.record,expired2c6c:33}});
 const out=prepareNativeRaceStuntPreludeUpdate(held,{racerIndex:0});
 assert.equal(out.state.raceWords1f94[ri(0x2c6c)],33);assert.equal(out.state.raceWords1f94[ri(0x2aa0)],0);
 assert.equal(out.state.raceWords1f94[ri(0x2a70)],1);assert.equal(out.state.raceWords1f94[ri(0x39d0)],0);
});

test('inactive modes hold all state and a late invalid speed cannot partially enqueue a bonus',()=>{
 const state=fixture(initial),before=nativeRaceStateSnapshot(state);
 assert.throws(()=>prepareNativeRaceStuntPreludeUpdate(state,{racerIndex:0}),/speedB90Native/);
 assert.deepEqual(nativeRaceStateSnapshot(state),before);
 const ordinary=prepareNativeRaceStateOperations(state,[{kind:'sourceWordWrite',field:'mode620',value:4}]).state;
 assert.deepEqual(prepareNativeRaceStuntPreludeUpdate(ordinary).state,ordinary);
});
