import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeAIMotionState,nativeAIMotionSnapshot,nativeAIMotionBehindThreshold,prepareNativeAIMotion} from '../native-ai-motion.js';

// Synthetic independently chosen histories/positions exercise numeric rules.
// No original racer initialization, geometry, animation or captured game state
// is included. Explicit values here are test setup, not production defaults.
const xyz=(x=0,y=0,z=0)=>({x,y,z}),xz=(x=0,z=0)=>({x,z});
const state=(overrides={})=>createNativeAIMotionState({previousMotionDirection:xyz(0,0,1),recoveryPhase:0,
 stuckFrames:0,dryMarkedContact:0,offCircleBehindFrames:0,flagB0:0,flagB4:1,...overrides});
const request=(overrides={})=>({motionDirection:xyz(0,0,1),actorState:22,animationFrame:0,
 priorControlActive:true,frameSpeedNative:20,markedBox:false,wetCount:8,positionNative:xz(),
 proximityObjectCentersNative:[],proximityCount:0,selectionCircleNative:{x:0,z:0,radiusSquared:10000},
 referenceProgress:0,racerProgress:1,racerIndex:1,players:1,difficulty:0,role:0,courseIndex:8,...overrides});
const run=(overrides={},old=state())=>prepareNativeAIMotion(old,request(overrides));

test('state creation requires the actual retained fields and makes a detached serializable copy',()=>{
 assert.throws(()=>createNativeAIMotionState());
 const input={previousMotionDirection:xyz(.25,.5,1),recoveryPhase:3,stuckFrames:49,
  dryMarkedContact:1,offCircleBehindFrames:999,flagB0:1,flagB4:0};
 const s=createNativeAIMotionState(input);input.previousMotionDirection.x=9;
 assert.equal(s.previousMotionDirection.x,.25);assert.ok(Object.isFrozen(s));assert.ok(Object.isFrozen(s.previousMotionDirection));
 const snapshot=nativeAIMotionSnapshot(s);snapshot.previousMotionDirection.x=8;assert.equal(s.previousMotionDirection.x,.25);
 assert.deepEqual(createNativeAIMotionState(JSON.parse(JSON.stringify(s))),s);
 for(const key of Object.keys(input)){const missing={...input};delete missing[key];assert.throws(()=>createNativeAIMotionState(missing));}
});

test('prediction uses current and preceding source motion directions, retaining Y and normalizing only its XZ output',()=>{
 const result=run({motionDirection:xyz(.25,.5,1)},state({previousMotionDirection:xyz(0,0,.5)}));
 assert.deepEqual(result.predictedMotionDirection,xyz(.5,1,1.5));
 assert.deepEqual(result.predictedDirectionXZ,xz(.3162277638912201,.9486832618713379));
 assert.deepEqual(result.state.previousMotionDirection,xyz(.25,.5,1));
 assert.throws(()=>prepareNativeAIMotion(state(),request({motionDirection:undefined})),/motionDirection/);
});

test('a purely vertical prediction retains zero XZ without inventing hull forward or velocity',()=>{
 const result=run({motionDirection:xyz(0,.5,0)},state({previousMotionDirection:xyz()}));
 assert.deepEqual(result.predictedMotionDirection,xyz(0,1,0));assert.deepEqual(result.predictedDirectionXZ,xz());
 const cancelled=run({motionDirection:xyz(.25,0,.5)},state({previousMotionDirection:xyz(.5,0,1)}));
 assert.deepEqual(cancelled.predictedMotionDirection,xyz());assert.deepEqual(cancelled.predictedDirectionXZ,xz());
});

test('source signed zero survives numeric history/snapshot copies without pretending JSON is a float-bit codec',()=>{
 const result=run({motionDirection:xyz(-0,0,0)},state({previousMotionDirection:xyz()}));
 assert.ok(Object.is(result.predictedMotionDirection.x,-0));assert.ok(Object.is(result.predictedDirectionXZ.x,-0));
 const copied=nativeAIMotionSnapshot(result.state);assert.ok(Object.is(copied.previousMotionDirection.x,-0));
 assert.deepEqual(createNativeAIMotionState(structuredClone(copied)),result.state);
 assert.equal(Object.is(JSON.parse(JSON.stringify(copied)).previousMotionDirection.x,-0),false);
});

test('prediction rounds both history reads and each native subtraction/addition to float32',()=>{
 const result=run({motionDirection:xyz(.1,0,1)},state({previousMotionDirection:xyz(.3,0,1)}));
 assert.equal(result.predictedMotionDirection.x,-.10000001639127731);
 assert.equal(result.state.previousMotionDirection.x,.10000000149011612);
 const rounded=run({motionDirection:xyz(1.00000004,0,0)},state({previousMotionDirection:xyz(1,0,0)}));
 assert.equal(rounded.predictedMotionDirection.x,1);
});

test('actor23 sets phase1 while actor7 can advance through phase2 to3 in the same frame56 call',()=>{
 assert.equal(run({actorState:23},state({recoveryPhase:3})).state.recoveryPhase,1);
 assert.equal(run({actorState:7,animationFrame:55},state({recoveryPhase:1})).state.recoveryPhase,2);
 assert.equal(run({actorState:7,animationFrame:56},state({recoveryPhase:1})).state.recoveryPhase,3);
 assert.equal(run({actorState:7,animationFrame:56},state({recoveryPhase:2})).state.recoveryPhase,3);
 assert.equal(run({actorState:7,animationFrame:100},state({recoveryPhase:0})).state.recoveryPhase,0);
 assert.equal(run({actorState:22},state({recoveryPhase:3})).state.recoveryPhase,3);
});

test('slow frames use prior control-active rather than an accelerator and compare source float32 speed strictly below30',()=>{
 const s=state({stuckFrames:49});
 assert.equal(run({priorControlActive:true,frameSpeedNative:0},s).state.stuckFrames,50);
 assert.equal(run({priorControlActive:false,frameSpeedNative:0},s).state.stuckFrames,0);
 const below=run({frameSpeedNative:16.66666603088379},s),above=run({frameSpeedNative:16.666667938232422},s);
 assert.equal(below.diagnostic.speedTimes1_8Native,29.999998092651367);assert.equal(below.state.stuckFrames,50);
 assert.equal(above.diagnostic.speedTimes1_8Native,30.000001907348633);assert.equal(above.state.stuckFrames,0);
 assert.throws(()=>run({priorControlActive:1}),/boolean/);
});

test('the source slow counter wraps signed32 rather than saturating or throwing',()=>{
 const result=run({frameSpeedNative:0},state({stuckFrames:2147483647}));
 assert.equal(result.state.stuckFrames,-2147483648);
 assert.equal(run({frameSpeedNative:0},result.state).state.stuckFrames,-2147483647);
});

test('marked-box dry latch persists without new contact and aggregate wet contact clears even a current mark',()=>{
 assert.equal(run({wetCount:0,markedBox:false},state({dryMarkedContact:1})).state.dryMarkedContact,1);
 assert.equal(run({wetCount:0,markedBox:true}).state.dryMarkedContact,1);
 assert.equal(run({wetCount:1,markedBox:true}).state.dryMarkedContact,0);
 assert.equal(run({wetCount:8},state({dryMarkedContact:1})).state.dryMarkedContact,0);
});

test('proximity uses a strict1500-native-unit circle and bounded10000-unit distance cap',()=>{
 const at=run({proximityObjectCentersNative:[xz(1500,0)],proximityCount:1});
 assert.equal(at.nearObjects,false);assert.equal(at.diagnostic.nearestObjectDistanceSquaredNative,2250000);
 assert.equal(run({proximityObjectCentersNative:[xz(1499.9998779296875,0)],proximityCount:1}).nearObjects,true);
 assert.equal(run().diagnostic.nearestObjectDistanceSquaredNative,100000000);
 assert.equal(run({proximityObjectCentersNative:[xz(30000,0)],proximityCount:1}).diagnostic.nearestObjectDistanceSquaredNative,100000000);
});

test('proximity scans only the counted raw prefix, preserving source order rather than selecting nearby/tagged objects',()=>{
 const points=[xz(2000,0),xz(1,0)];
 assert.equal(run({proximityObjectCentersNative:points,proximityCount:1}).nearObjects,false);
 assert.equal(run({proximityObjectCentersNative:points,proximityCount:2}).nearObjects,true);
 assert.equal(run({proximityObjectCentersNative:[xz()],proximityCount:0}).nearObjects,false);
 assert.throws(()=>run({proximityObjectCentersNative:points,proximityCount:3}),/proximityCount/);
 assert.throws(()=>run({proximityObjectCentersNative:Array(65).fill(xz()),proximityCount:0}),/64/);
});

test('selection circle includes its exact boundary and uses supplied native coordinates independently of proximity',()=>{
 const at=run({positionNative:xz(100,0)}),outside=run({positionNative:xz(100.00000762939453,0)});
 assert.equal(at.withinSelectionCircle,true);assert.equal(at.diagnostic.selectionDistanceSquaredNative,10000);
 assert.equal(outside.withinSelectionCircle,false);
 assert.equal(run({positionNative:xz(500,400),selectionCircleNative:{x:400,z:400,radiusSquared:10000}}).withinSelectionCircle,true);
 assert.equal(at.nearObjects,false);
});

test('outside-circle counter advances only for a strict progress comparison and retains a prior value above1000',()=>{
 const q={positionNative:xz(101,0)};
 assert.equal(run(q,state({offCircleBehindFrames:999})).state.offCircleBehindFrames,1000);
 assert.equal(run(q,state({offCircleBehindFrames:1000})).state.offCircleBehindFrames,1000);
 assert.equal(run(q,state({offCircleBehindFrames:1001})).state.offCircleBehindFrames,1001);
 assert.equal(run(q,state({offCircleBehindFrames:-1})).state.offCircleBehindFrames,0);
 assert.equal(run({...q,referenceProgress:1,racerProgress:1},state({offCircleBehindFrames:10})).state.offCircleBehindFrames,0);
 assert.equal(run({},state({offCircleBehindFrames:10})).state.offCircleBehindFrames,0);
});

test('all nine established difficulty/role thresholds are outer-update counts without a Reverse fourth row',()=>{
 const expected=[[60,120,180],[40,80,120],[20,60,100]];
 for(let difficulty=0;difficulty<3;difficulty++)for(let role=0;role<3;role++)
  assert.equal(nativeAIMotionBehindThreshold({difficulty,role}),expected[difficulty][role]);
 assert.throws(()=>nativeAIMotionBehindThreshold({difficulty:3,role:0}),/difficulty/);
 assert.throws(()=>nativeAIMotionBehindThreshold({difficulty:0,role:-1}),/role/);
});

test('single-player nonzero racer flags use strict threshold after incrementing the current outside counter',()=>{
 const equal=run({positionNative:xz(101,0)},state({offCircleBehindFrames:59}));
 const above=run({positionNative:xz(101,0)},state({offCircleBehindFrames:60}));
 assert.deepEqual([equal.state.offCircleBehindFrames,equal.state.flagB0,equal.state.flagB4],[60,0,1]);
 assert.deepEqual([above.state.offCircleBehindFrames,above.state.flagB0,above.state.flagB4],[61,1,0]);
 assert.equal(above.diagnostic.behindThresholdNative,60);
 assert.equal(above.diagnostic.thresholdSource,'native-difficulty-role-table');
});

test('racer0 and two-player paths retain both flags and do not read unused difficulty or human role',()=>{
 for(const q of [{racerIndex:0,players:1},{racerIndex:0,players:2},{racerIndex:1,players:2}]){
  const result=run({...q,difficulty:undefined,role:-1},state({flagB0:1,flagB4:0}));
  assert.deepEqual([result.state.flagB0,result.state.flagB4],[1,0]);assert.equal(result.diagnostic.behindThresholdNative,null);
 }
});

test('a gated human-role threshold read requires explicit evidence and cannot silently use adjacent table data',()=>{
 const q={role:-1,positionNative:xz(101,0)};
 assert.throws(()=>run(q),/explicit behindThresholdNative/);
 const result=run({...q,behindThresholdNative:17},state({offCircleBehindFrames:17}));
 assert.equal(result.state.flagB0,1);assert.equal(result.diagnostic.thresholdSource,'caller-supplied-original-read');
 assert.throws(()=>run({behindThresholdNative:61}),/contradicts/);
 assert.throws(()=>run({...q,difficulty:3,behindThresholdNative:17}),/difficulty/);
});

test('course6 forcesB4 only after ordinary flag calculation and can leave both flags set',()=>{
 const result=run({courseIndex:6,positionNative:xz(101,0)},state({offCircleBehindFrames:60}));
 assert.deepEqual([result.state.flagB0,result.state.flagB4],[1,1]);
 const unchanged=run({courseIndex:6,racerIndex:0},state({flagB0:1,flagB4:0}));
 assert.deepEqual([unchanged.state.flagB0,unchanged.state.flagB4],[1,1]);
});

test('pure outputs remain detached and malformed or overflowing arithmetic cannot mutate the supplied state',()=>{
 const s=state(),q=request({proximityObjectCentersNative:[xz(10,0)],proximityCount:1}),before=structuredClone(q);
 const result=prepareNativeAIMotion(s,q);q.motionDirection.z=9;q.proximityObjectCentersNative[0].x=2000;
 assert.equal(result.state.previousMotionDirection.z,1);assert.equal(result.nearObjects,true);
 assert.ok(Object.isFrozen(result));assert.ok(Object.isFrozen(result.predictedMotionDirection));assert.ok(Object.isFrozen(result.diagnostic));
 for(const change of [{motionDirection:xyz(Infinity,0,0)},{motionDirection:xyz(1e38,0,0)},
  {positionNative:xz(NaN,0)},{frameSpeedNative:-1},{markedBox:1},{wetCount:13},{players:0},
  {selectionCircleNative:{x:0,z:0,radiusSquared:-1}},{proximityCount:-1}])assert.throws(()=>prepareNativeAIMotion(s,{...before,...change}));
 assert.deepEqual(s,state());assert.throws(()=>{result.state.stuckFrames=99;},TypeError);
});

test('AI accepts all twelve hull water contacts without clamping the count',()=>{
 for(const wetCount of [9,10,11,12])assert.deepEqual(run({wetCount}),run({wetCount:8}));
});
