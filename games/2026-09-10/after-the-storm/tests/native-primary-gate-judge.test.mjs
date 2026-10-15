import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativePrimaryGateState,nativePrimaryGateScratchPosition,
 prepareNativePrimaryGateJudge as judge} from '../native-primary-gate-judge.js';

const state=(side2954=-1,armed2958=1)=>({side2954,armed2958});
function sample(positionNativeXZ={x:0,z:1}){
 return {positionNativeXZ,selectedNode:{sourceRow:7,centerNativeXZ:{x:0,z:0},forwardXZ:{x:0,z:1},rightXZ:{x:1,z:0},
  classification98:0,checkpointFlag9c:0,enabledC8:1,nextSourceRowA0:13},regionsNative:[[-10000,10000,-10000,10000]]};
}
function checkpoint(x,{direction=0,slack=256,width=500}={}){
 const q=sample({x,z:50});Object.assign(q.selectedNode,{classification98:3,checkpointFlag9c:1,
  endpointANativeXZ:{x:1000,z:0},endpointBNativeXZ:{x:0,z:0},halfWidthNative8c:width});
 return {...q,directionFlag1f90:direction,checkpointSlackNative39c4:slack};
}

test('ordinary scratch copies actual selected body floats with binary32 rounding',()=>{
 const body={x:1.00000008,y:-12.0000008,z:3500.333333};
 for(const main of [-1,0,1,8,21]){
  const result=nativePrimaryGateScratchPosition({state638:main,bodyPositionNative:body,alternatePositionNativeXZ:null});
  assert.deepEqual(result,{x:Math.fround(body.x),y:Math.fround(body.y),z:Math.fround(body.z)});
 }
 assert.deepEqual(body,{x:1.00000008,y:-12.0000008,z:3500.333333});
});

test('main2 scratch uses the alternate XZ and forces positive zero Y without a body read',()=>{
 const result=nativePrimaryGateScratchPosition({state638:2,alternatePositionNativeXZ:{x:-0,z:12.1250004},bodyPositionNative:null});
 assert(Object.is(result.x,-0));assert(Object.is(result.y,0));assert.equal(result.z,Math.fround(12.1250004));
 assert(Object.isFrozen(result));
});

test('side classification uses the25-native shifted anchor and an inclusive cross sign',()=>{
 const at=judge(state(),sample({x:-25,z:1}));
 assert.deepEqual(at.diagnostic.anchorNativeXZ,{x:-25,z:0});assert.equal(at.state.side2954,1);assert.equal(at.diagnostic.sideCrossOrNull,0);
 assert.equal(judge(state(),sample({x:-26,z:1})).state.side2954,0);
 assert.equal(judge(state(),sample({x:-24,z:1})).state.side2954,1);
});

test('remembered side stays unchanged ahead of the gate until zero/negative forward dot resets it',()=>{
 for(const prior of [0,1,2,-2,-2147483648,2147483647]){
  assert.equal(judge(state(prior),sample({x:-26,z:1})).state.side2954,prior);
  assert.equal(judge(state(prior),sample({x:-26,z:0})).state.side2954,-1);
  assert.equal(judge(state(prior),sample({x:-26,z:-1})).state.side2954,-1);
 }
});

test('arming sets1 only from zero when the resulting side is exactly negative1',()=>{
 assert.deepEqual(judge(state(1,0),sample({x:0,z:-1})).state,state(-1,1));
 assert.deepEqual(judge(state(-1,0),sample({x:0,z:1})).state,state(1,0));
 for(const armed of [-2147483648,-1,1,2,2147483647])assert.equal(judge(state(0,armed),sample({x:0,z:-1})).state.armed2958,armed);
});

test('zero craft-to-anchor vector does not invent a normalized direction',()=>{
 const result=judge(state(1,0),sample({x:-25,z:0}));
 assert.deepEqual(result.diagnostic.relativeUnitXZ,{x:0,z:0});assert.equal(result.diagnostic.relativeLengthNative,0);
 assert.equal(result.diagnostic.sideForwardDot,0);assert.equal(result.diagnostic.sideCrossOrNull,null);
 assert.deepEqual(result.state,state(-1,1));
});

test('forward checkpoint limit is one-sided and includes equality',()=>{
 assert.equal(judge(state(),checkpoint(1256)).checkpointLimitPassed,true);
 assert.equal(judge(state(),checkpoint(1257)).checkpointLimitPassed,false);
 assert.equal(judge(state(),checkpoint(-100000)).checkpointLimitPassed,true,'there is no lower aperture bound');
 assert.equal(judge(state(),checkpoint(1256)).diagnostic.checkpointProjectionNative,1256);
});

test('nonzero direction checkpoint limit has only the inclusive negative-slack bound',()=>{
 for(const direction of [-2147483648,-1,1,2,2147483647]){
  assert.equal(judge(state(),checkpoint(-256,{direction})).checkpointLimitPassed,true);
  assert.equal(judge(state(),checkpoint(-257,{direction})).checkpointLimitPassed,false);
  assert.equal(judge(state(),checkpoint(100000,{direction})).checkpointLimitPassed,true,'there is no upper aperture bound');
 }
 const q=checkpoint(100000,{direction:1});delete q.selectedNode.halfWidthNative8c;
 assert.equal(judge(state(),q).checkpointLimitPassed,true,'reverse branch never reads width');
});

test('checkpoint projection uses actual endpoints measured from B toward A',()=>{
 const q=checkpoint(0);q.positionNativeXZ={x:7,z:16};
 q.selectedNode.endpointANativeXZ={x:4,z:8};q.selectedNode.endpointBNativeXZ={x:1,z:4};
 const result=judge(state(),q),F=Math.fround;
 assert.equal(result.diagnostic.checkpointLengthNative,5);
 assert.deepEqual(result.diagnostic.checkpointUnitXZ,{x:F(.6),z:F(.8)});
 assert.equal(result.diagnostic.checkpointProjectionNative,F(F(6*F(.6))+F(12*F(.8))));
});

test('coincident checkpoint endpoints retain zero projection instead of a made-up span axis',()=>{
 const q=checkpoint(1000);q.selectedNode.endpointANativeXZ=q.selectedNode.endpointBNativeXZ={x:10,z:20};
 const result=judge(state(),q);assert.equal(result.diagnostic.checkpointLengthNative,0);
 assert.equal(result.diagnostic.checkpointProjectionNative,0);assert.deepEqual(result.diagnostic.checkpointUnitXZ,{x:0,z:0});
 assert.equal(result.checkpointLimitPassed,true);
});

test('checkpointFlag9c is exactly1; class8/9 alone does not create an aperture',()=>{
 for(const flag of [-1,0,2])for(const classification of [0,1,3,8,9]){
  const q=sample({x:100000,z:100000});q.selectedNode.checkpointFlag9c=flag;q.selectedNode.classification98=classification;
  const result=judge(state(),q);assert.equal(result.checkpointLimitPassed,null);
  assert.equal(result.diagnostic.checkpointProjectionNative,null);assert.equal(result.state.side2954,1);
 }
});

test('coarse region bounds are inclusive and a single match has no last ID',()=>{
 const q=sample({x:10,z:10});q.regionsNative=[[0,10,0,10]];
 const result=judge(state(),q);assert.deepEqual(result.craftRegionIds,[0,-1]);assert.deepEqual(result.nodeRegionIds,[0,-1]);
 assert.equal(result.regionShared,true);
 q.positionNativeXZ={x:11,z:10};assert.equal(judge(state(),q).regionShared,false);
});

test('only first and last overlap matches survive; a shared middle region is not enough',()=>{
 const q=sample({x:-50,z:1});q.regionsNative=[[-100,-25,-100,100],[-100,100,-100,100],[-100,-25,-100,100]];
 const hiddenMiddle=judge(state(),q);
 assert.deepEqual(hiddenMiddle.craftRegionIds,[0,2]);assert.deepEqual(hiddenMiddle.nodeRegionIds,[1,-1]);assert.equal(hiddenMiddle.regionShared,false);
 q.regionsNative.push([-100,100,-100,100]);
 const last=judge(state(),q);assert.deepEqual(last.craftRegionIds,[0,3]);assert.deepEqual(last.nodeRegionIds,[1,3]);assert.equal(last.regionShared,true);
});

test('two absent regions are not a shared region',()=>{
 const q=sample();q.regionsNative=[];
 const r=judge(state(),q);assert.deepEqual(r.craftRegionIds,[-1,-1]);assert.deepEqual(r.nodeRegionIds,[-1,-1]);assert.equal(r.regionShared,false);
});

test('moving center affects the shifted side anchor and coarse admission without moving the supplied endpoints',()=>{
 const q=checkpoint(0);q.positionNativeXZ={x:0,z:1};q.regionsNative=[[-10,10,-10,10]];
 const before=judge(state(),q);q.selectedNode.centerNativeXZ={x:100,z:0};const after=judge(state(),q);
 assert.equal(before.state.side2954,1);assert.equal(after.state.side2954,0);
 assert.equal(before.regionShared,true);assert.equal(after.regionShared,false);
 assert.equal(after.diagnostic.checkpointProjectionNative,before.diagnostic.checkpointProjectionNative);
 assert.deepEqual(after.selectedNode.endpointBNativeXZ,{x:0,z:0});
});

test('raw source row, enabled flag and primary nextA0 are copied independently of side and region outcomes',()=>{
 const q=sample();Object.assign(q.selectedNode,{sourceRow:63,nextSourceRowA0:7,enabledC8:-1,classification98:9});
 const r=judge(state(),q);assert.equal(r.selectedNode.sourceRow,63);assert.equal(r.selectedNode.nextSourceRowA0,7);
 assert.equal(r.selectedNode.enabledC8,-1);assert.equal(r.selectedNode.classification98,9);
 assert.equal('eventCode2960'in r,false);assert.equal('lap2938'in r.state,false);
});

test('state and numeric snapshots are detached immutable values with no source setup defaults',()=>{
 const s=state(),q=checkpoint(0),before=structuredClone(q),r=judge(s,q);
 assert.deepEqual(q,before);assert.deepEqual(s,state());assert(Object.isFrozen(r));assert(Object.isFrozen(r.selectedNode.centerNativeXZ));
 q.selectedNode.centerNativeXZ.x=99;assert.equal(r.selectedNode.centerNativeXZ.x,0);
 assert.throws(()=>{r.state.side2954=0;},TypeError);
 assert.throws(()=>createNativePrimaryGateState({side2954:-1}),/armed2958/);
 assert.deepEqual(createNativePrimaryGateState(JSON.parse(JSON.stringify(r.state))),r.state);
});

test('invalid native inputs reject without mutating retained state or injecting finite fallbacks',()=>{
 const s=state(),q=sample();
 assert.throws(()=>judge(s,{...q,positionNativeXZ:{x:Infinity,z:0}}),/float32/);
 assert.throws(()=>judge(s,{...q,regionsNative:[[0,0,0,0]]}),/sentinel/);
 assert.throws(()=>judge(s,{...q,regionsNative:[[1,0,0,1]]}),/reversed/);
 assert.throws(()=>judge(s,{...q,selectedNode:{...q.selectedNode,nextSourceRowA0:64}}),/nextSourceRowA0/);
 const cp=checkpoint(0);delete cp.checkpointSlackNative39c4;assert.throws(()=>judge(s,cp),/float32/);
 assert.throws(()=>judge(s,{...q,positionNativeXZ:{x:3e38,z:3e38}}),/float32/);
 assert.deepEqual(s,state());
});
