import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativePrimaryRaceLayout,createNativePrimaryRaceState,prepareNativePrimaryRaceProgress} from '../native-primary-race-progress.js';

// Authored prepared state, not a claim about ROM cold/reset defaults. The
// complete retained timing span is explicit so overlapping source words have
// one owner rather than separate lap/best/total scalar copies.
function fixture(){
 const nodes=Array.from({length:4},(_,i)=>({sourceRow:i,centerNativeXZ:{x:0,z:i*1000},forwardXZ:{x:0,z:1},rightXZ:{x:1,z:0},
  endpointANativeXZ:{x:100,z:i*1000},endpointBNativeXZ:{x:-100,z:i*1000},halfWidthNative8c:100,classification98:i===0?3:i%2,
  checkpointFlag9c:i===0?1:0,enabledC8:1,nextSourceRowA0:(i+1)%4,previousSourceRowA8:(i+3)%4,routeGroupC0:0}));
 const layout={nodes,regionsNative:[[-100000,100000,-100000,100000]],fortressRegionsNative:[]};
 const state={lap2938:1,place293c:0,progressRow2940:0,nextPrimary2944:0,side2954:-1,armed2958:1,gateResult2960:0,
  power2a64:3,lapMisses2a68:0,totalMisses2a6c:0,displayPower2a70:1,record2c24:0,gateTimer2c28:0,finished2c2c:0,
  splitDelta2c30:0,splitState2c34:0,splitTimer2c38:0,lapFlag2c40:0,postJudgeSourceRow2c48:0,powerChanged2c4c:0,
  legalLapCounter2c58:1,finishSide2c5c:0,gateFlags2964:Array(64).fill(0),missWords2a74:Array(10).fill(0),
  timingWords2a9c:Array(98).fill(0),metric2c64:0,projectionDistance39a0:0,recordFamily:'primary'};
 state.timingWords2a9c[1]=65000;state.timingWords2a9c[3]=70000;state.timingWords2a9c[14]=190000;
 const globals={primaryHumanIndex:0,secondaryHumanIndex:1,players:1,courseIndex:1,missLimit8174:5,noFinish8178:0,clockStopped817c:0,
  event628:0,state638:1,mode620:4,configuredLaps728:3,difficulty:0,directionFlag1f90:0,fortressFlag1fc8:0,southernLap1fcc:0,
  drakeFog1fd0:0,flag1fc4:0,flag1fd4:0,flag1fd8:0,bestTime1fe0:80000,bestLapFlag2658:0,recordFlag8a98:0,ambientD4b00:0,
  fortressD8240:0,primaryCount:4,finishSourceRow:0,missesEnabled72e:1,reverse:0,finishMetric39b0:100000,dqMetric39b4:-100000,
  checkpointSlackNative39c4:50};
 return {layout,state,input:{racerIndex:0,globals,positionNativeXZ:{x:-10,z:10},priorBodyPointNative:{x:-10,z:-10},
  comparisonTimes:Array(9).fill(0),gateObjectNativeXZ:{x:0,z:0},gateCamerasNativeXZ:[{x:10000,z:10000},{x:10000,z:10000}]}};
}
const run=c=>prepareNativePrimaryRaceProgress(createNativePrimaryRaceLayout(c.layout),createNativePrimaryRaceState(c.state),c.input);

test('actual checkpoint crossing stores the source fractional-frame split, lap record and next legal lap',()=>{
 const c=fixture(),r=run(c),s=r.state,t=s.timingWords2a9c;
 assert.equal(r.diagnostic.crossingCorrectionMs,25);assert.equal(t[1],25);assert.equal(t[3],65025);assert.equal(t[4],1);
 assert.equal(t[5],65025);assert.equal(t[14],190050);assert.equal(t[16],190025);
 assert.equal(s.lap2938,2);assert.equal(s.legalLapCounter2c58,2);assert.equal(s.nextPrimary2944,1);
 assert.equal(s.splitState2c34,10);assert.equal(s.lapFlag2c40,1);assert.equal(s.gateFlags2964[0],1);
 assert.equal(r.globalWrites.bestTime1fe0,65025);assert.equal(r.globalWrites.bestLapFlag2658,1);
 assert.deepEqual(r.effects,[{kind:'raceCue',arguments:[33,1]},{kind:'placeCue',arguments:[2]}]);
});

test('source actual previous center controls interpolation rather than a fixed finish-time rounding',()=>{
 for(const [before,after,correction]of [[-30,10,12],[-10,30,37],[-.1,.1,25],[-90,10,5]]){
  const c=fixture();c.input.priorBodyPointNative.z=before;c.input.positionNativeXZ.z=after;
  const r=run(c);assert.equal(r.diagnostic.crossingCorrectionMs,correction);assert.equal(r.state.timingWords2a9c[5],65050-correction);
 }
});

test('time prefix preserves signed32 wrap, caps independently and returns through real DQ rules',()=>{
 const c=fixture();c.state.timingWords2a9c[1]=2147483647;c.state.timingWords2a9c[14]=599950;
 const r=run(c);assert.equal(r.diagnostic.earlyReturn,'total-time-limit');assert.equal(r.state.timingWords2a9c[1],-2147483599);
 assert.equal(r.state.timingWords2a9c[14],599999);assert.equal(r.state.record2c24,2);
 assert.equal(r.state.metric2c64,-100000);assert.equal(r.globalWrites.dqMetric39b4,-90000);assert.equal(r.state.nextPrimary2944,0);
 const versus=fixture();versus.input.globals.mode620=1;versus.state.timingWords2a9c[14]=599950;
 const v=run(versus);assert.equal(v.state.record2c24,2);assert.equal(v.state.metric2c64,0);assert.equal(v.globalWrites.dqMetric39b4,undefined);
});

test('selected-racer event gates use actual human slots and leave already-disqualified records alone',()=>{
 for(const [players,primary,secondary,racer,event,expected]of [[1,2,3,2,1,true],[1,2,3,3,2,false],[2,2,3,3,2,true],
  [2,2,3,0,1,false],[2,2,3,2,-32768,false]]){
  const c=fixture();Object.assign(c.input.globals,{players,primaryHumanIndex:primary,secondaryHumanIndex:secondary,event628:event});c.input.racerIndex=racer;
  const r=run(c);assert.equal(r.diagnostic.earlyReturn==='selected-racer-event',expected);assert.equal(r.state.record2c24,expected?1:0);
  if(expected){assert.equal(r.state.timingWords2a9c[14],190000);assert.equal(r.state.nextPrimary2944,0);}
 }
 const c=fixture();c.input.globals.event628=1;c.state.record2c24=2;const r=run(c);
 assert.equal(r.state.record2c24,2);assert.equal(r.globalWrites.dqMetric39b4,undefined);
});

test('proper gate side increments source power while misses increment only human counters',()=>{
 for(const [kind,x,correct]of [[0,-50,true],[0,50,false],[1,50,true],[1,-50,false]])for(const racer of [0,1]){
  const c=fixture();c.layout.nodes[0].classification98=kind;c.layout.nodes[0].checkpointFlag9c=0;c.input.globals.finishSourceRow=3;
  c.input.positionNativeXZ.x=x;c.input.racerIndex=racer;
  const r=run(c);assert.equal(r.state.nextPrimary2944,1);assert.equal(r.state.gateResult2960,correct?1:2);
  assert.equal(r.state.power2a64,correct?4:3);assert.equal(r.state.powerChanged2c4c,correct?1:0);
  assert.equal(r.state.totalMisses2a6c,!correct&&racer===0?1:0);assert.equal(r.state.lapMisses2a68,!correct&&racer===0?1:0);
  assert.equal(r.effects.length,racer===0?1:0);
 }
});

test('zero miss allowance takes the real early return before advancing the selected node',()=>{
 const c=fixture();c.layout.nodes[0].classification98=0;c.layout.nodes[0].checkpointFlag9c=0;c.input.positionNativeXZ.x=50;
 c.input.globals.missLimit8174=0;c.input.globals.finishSourceRow=3;
 const r=run(c);assert.equal(r.diagnostic.earlyReturn,'zero-miss-allowance');assert.equal(r.state.record2c24,1);
 assert.equal(r.state.totalMisses2a6c,1);assert.equal(r.state.missWords2a74[0],1);assert.equal(r.state.nextPrimary2944,0);
 assert.equal(r.effects.length,0);
});

test('same-region and checkpoint endpoint gates reject without a synthetic side aperture',()=>{
 const c=fixture();c.layout.regionsNative=[[-100,100,-100,0]];
 const r=run(c);assert.equal(r.state.nextPrimary2944,0);assert.equal(r.state.armed2958,0);
 const edge=fixture();edge.input.positionNativeXZ.x=200;
 const outside=run(edge);assert.equal(outside.diagnostic.gate.checkpointLimitPassed,false);assert.equal(outside.state.nextPrimary2944,0);
 const enabled=fixture();enabled.layout.nodes[0].checkpointFlag9c=0;enabled.layout.nodes[0].enabledC8=0;
 enabled.layout.regionsNative=[];enabled.input.globals.finishSourceRow=3;
 const absent=run(enabled);assert.equal(absent.state.nextPrimary2944,1);assert.equal(absent.state.postJudgeSourceRow2c48,0);
});

test('the nine retained lap slots roll in literal source order without overwriting the timer owner',()=>{
 const c=fixture();c.state.lap2938=10;c.state.legalLapCounter2c58=10;c.input.globals.configuredLaps728=12;
 for(let i=1;i<=9;i++){c.state.timingWords2a9c[4+i]=i*10000;c.state.missWords2a74[i]=i+20;}
 c.state.lapMisses2a68=7;c.state.gateFlags2964.fill(1);
 const r=run(c);assert.deepEqual(r.state.timingWords2a9c.slice(5,14),[20000,30000,40000,50000,60000,70000,80000,90000,65025]);
 assert.deepEqual(r.state.missWords2a74.slice(1),[22,23,24,25,26,27,28,29,7]);
 assert.equal(r.state.timingWords2a9c[88],190025);assert.equal(r.state.timingWords2a9c[1],25);assert.equal(r.state.lap2938,11);
 assert.deepEqual(r.state.gateFlags2964.slice(0,5),[1,0,0,0,1]);assert.equal(r.state.lapMisses2a68,0);
});

test('finish recomputes from retained lap slots, assigns shared metric and preserves selected-human power',()=>{
 for(const racer of [0,1]){
  const c=fixture();c.input.racerIndex=racer;c.state.lap2938=3;c.state.legalLapCounter2c58=3;
  c.state.timingWords2a9c[5]=60000;c.state.timingWords2a9c[6]=61000;
  const r=run(c);assert.equal(r.state.finished2c2c,1);assert.equal(r.state.timingWords2a9c[14],186025);
  assert.equal(r.state.metric2c64,100000);assert.equal(r.globalWrites.finishMetric39b0,90000);
  assert.equal(r.state.lap2938,3);assert.equal(r.state.power2a64,racer===0?3:0);
 }
});

test('course-specific history writes remain shared and preserve actual secondary/tertiary families',()=>{
 const drake=fixture();drake.input.globals.courseIndex=4;const a=run(drake);assert.equal(a.globalWrites.drakeFog1fd0,1);
 const southern=fixture();southern.input.globals.courseIndex=7;southern.input.globals.southernLap1fcc=1;
 southern.state.lap2938=2;southern.state.legalLapCounter2c58=2;
 const b=run(southern);assert.equal(b.state.recordFamily,'secondary');assert.equal(b.globalWrites.southernLap1fcc,2);
 const c=run({...southern,state:{...southern.state,...b.state},input:{...southern.input,globals:{...southern.input.globals,...b.globalWrites}}});
 assert.equal(c.state.recordFamily,'tertiary');
 const secondary=fixture();secondary.input.globals.courseIndex=9;secondary.input.racerIndex=1;
 assert.equal(run(secondary).state.recordFamily,'secondary');
});

test('Fortress opening and its feedback consume actual object/camera positions with strict squared distance',()=>{
 for(const [distance,calls]of [[3999,1],[4000,0],[4001,0]]){
  const c=fixture();Object.assign(c.input.globals,{courseIndex:3,difficulty:1,reverse:1,finishSourceRow:3});
  c.state.lap2938=2;c.state.legalLapCounter2c58=2;c.input.gateCamerasNativeXZ[0]={x:distance,z:0};
  const r=run(c);assert.equal(r.globalWrites.fortressFlag1fc8,1);assert.equal(r.effects.filter(e=>e.kind==='fortressGateCue').length,calls);
 }
});

test('best-split subtraction retains signed wrap rather than taking an invented absolute value',()=>{
 const c=fixture();c.input.globals.mode620=0;c.input.globals.clockStopped817c=1;c.input.comparisonTimes[1]=2147483647;
 c.state.timingWords2a9c[14]=-2147483600;
 const r=run(c);assert.equal(r.state.splitState2c34,2);assert.equal(r.state.splitDelta2c30,-24);assert.equal(r.state.splitTimer2c38,40);
});

test('power display moves one signed step, even when the source difference wraps',()=>{
 const c=fixture();c.input.positionNativeXZ.z=-10;c.state.power2a64=2147483647;c.state.displayPower2a70=-2147483648;
 const r=run(c);assert.equal(r.state.displayPower2a70,2147483647);assert.equal(r.state.power2a64,2147483647);
});

test('prepared inputs and results are detached; missing source state and unsafe dynamic writes reject',()=>{
 const c=fixture(),before=structuredClone(c),r=run(c);assert.deepEqual(c,before);assert.ok(Object.isFrozen(r.state.timingWords2a9c));
 for(const change of [s=>{delete s.power2a64;},s=>{s.timingWords2a9c=s.timingWords2a9c.slice(1);},s=>{s.recordFamily='normal';}]){
  const bad=fixture();change(bad.state);assert.throws(()=>run(bad));
 }
 const bad=fixture();bad.input.globals.event628=32768;assert.throws(()=>run(bad),/event628/);
 const bounds=fixture();bounds.state.lap2938=20;bounds.state.legalLapCounter2c58=20;bounds.input.globals.configuredLaps728=25;
 assert.throws(()=>run(bounds),/timing write index/);assert.equal(bounds.state.lap2938,20);
});
