import test from 'node:test';
import assert from 'node:assert/strict';
import {conditionNativeStick,createNativeControlState,sampleNativeControls} from '../native-controls.js';
import {createNativeRiderProfile,decideNativeRiderAction} from '../native-rider-forces.js';

test('native axis curve preserves sign and intentionally changes diagonal gain',()=>{
  for(const [x,y,expected] of [[35,0,[18,0]],[35,35,[35,35]],[70,35,[70,22]],[-35,20,[-23,8]],
    [5,0,[0,0]],[6,0,[1,0]],[80,80,[70,70]],[-80,-80,[-70,-70]]]){
    const c=conditionNativeStick(x,y);assert.deepEqual([c.workingXNative,c.workingYNative],expected);
  }
  for(let x=-80;x<=80;x++)for(const y of [-70,-35,0,35,70]){
    const a=conditionNativeStick(x,y),b=conditionNativeStick(-x,-y);
    assert.equal(a.workingXNative,b.workingXNative===0?0:-b.workingXNative);
    assert.equal(a.workingYNative,b.workingYNative===0?0:-b.workingYNative);
    assert.ok(Math.abs(a.workingXNative)<=70&&Math.abs(a.workingYNative)<=70);
  }
});

test('gesture timestamps consume pre-curve working input, distinct from raw direction edges',()=>{
  const state=createNativeControlState({tick:50});
  const a=sampleNativeControls(state,{rawXNative:15,rawYNative:-14,tick:100});
  assert.equal(a.preCurveXNative,15);assert.equal(a.workingXNative,6);
  assert.equal(a.gestureTicks.positiveX,100);assert.equal(a.gestureTicks.negativeY,50);
  assert.equal(a.directionMask,0);
  const b=sampleNativeControls(a.state,{rawXNative:65,rawYNative:-65,tick:101});
  assert.equal(b.directionMask,0x500);assert.equal(b.pressedDirections,0x500);
  assert.equal(b.gestureTicks.negativeY,101);
  const c=sampleNativeControls(b.state,{rawXNative:65,rawYNative:-65,tick:102});
  assert.equal(c.pressedDirections,0);
});

test('slewed raw X moves at most 15 per logical frame and is not force steering',()=>{
  let state=createNativeControlState();const slew=[];
  for(let i=0;i<5;i++){
    const c=sampleNativeControls(state,{rawXNative:70});state=c.state;slew.push(c.smoothedXNative);
    assert.equal(c.workingXNative,70);
  }
  assert.deepEqual(slew,[15,30,45,60,70]);
  assert.equal(sampleNativeControls(state,{rawXNative:-70}).smoothedXNative,55);
});

test('held A or Z drives the engine and pressed/released edges are independent',()=>{
  const a=sampleNativeControls(createNativeControlState(),{heldButtons:0x8000});
  assert.equal(a.engineMask,0x8000);assert.equal(a.throttle,true);assert.equal(a.pressedButtons,0x8000);
  const b=sampleNativeControls(a.state,{heldButtons:0x2000});
  assert.equal(b.engineMask,0x2000);assert.equal(b.pressedButtons,0x2000);assert.equal(b.releasedButtons,0x8000);
  const c=sampleNativeControls(b.state,{heldButtons:0x4000});
  assert.equal(c.engineMask,0);assert.equal(c.throttle,false);assert.equal(c.releasedButtons,0x2000);
});

test('crash and source actor/startup gates mute working controls while preserving raw sampling',()=>{
  for(const options of [{crash:true},{actorState:23},{actorState:7,animationFrame:55},
    {actorState:1},{actorState:6},{simulationState:0},{simulationState:1}]){
    const c=sampleNativeControls(createNativeControlState(),{rawXNative:70,rawYNative:-70,heldButtons:0x8000,...options});
    assert.equal(c.rawXNative,70);assert.equal(c.rawYNative,-70);assert.equal(c.smoothedXNative,15);
    assert.equal(c.workingXNative,0);assert.equal(c.workingYNative,0);assert.equal(c.engineMask,0);
  }
  assert.equal(sampleNativeControls(createNativeControlState(),{actorState:7,animationFrame:56,rawXNative:70}).workingXNative,70);
});

test('pose power factors and handstand scaling precede the nonlinear curve',()=>{
  const c=sampleNativeControls(createNativeControlState(),{rawXNative:35,rawYNative:20,actorState:8});
  assert.equal(c.preCurveXNative,28);assert.equal(c.powerFactor,Math.fround(.85));
  assert.deepEqual(conditionNativeStick(28,20),{workingXNative:c.workingXNative,workingYNative:c.workingYNative});
  for(const [actorState,factor] of [[9,.9],[17,.9],[24,.3],[22,1]]){
    assert.equal(sampleNativeControls(createNativeControlState(),{actorState}).powerFactor,Math.fround(factor));
  }
});

test('raw manipulation entry thresholds cannot be replaced by conditioned force axes',()=>{
  const s=createNativeControlState({tick:0}),p=createNativeRiderProfile();
  const c=sampleNativeControls(s,{rawXNative:69,rawYNative:69,heldButtons:0x8000,tick:10});
  assert.equal(c.workingXNative,70);
  // The force axis saturates at70, but source raw69 still cannot enter a roll.
  const action=decideNativeRiderAction(p,{rawXNative:c.rawXNative,rawYNative:0,frameSpeedNative:40,
    wetCount:0,throttle:c.throttle,tick:10,gestureTicks:{negativeX:9}});
  assert.equal(action.action,0);
});

test('states and returned direction stamps are independent, including uint tick wrap',()=>{
  const state=createNativeControlState({tick:0xffffffff}),snapshot=structuredClone(state);
  const c=sampleNativeControls(state,{rawXNative:-70});
  assert.equal(c.state.tick,0);assert.equal(c.gestureTicks.negativeX,0);
  c.gestureTicks.negativeX=500;
  assert.equal(c.state.gestureTicks.negativeX,0);
  assert.deepEqual(state,snapshot);
  assert.equal(createNativeControlState().smoothedXNative,0);
});

test('invalid raw/device values are rejected without changing control history',()=>{
  const state=createNativeControlState(),snapshot=structuredClone(state);
  for(const options of [{rawXNative:128},{rawYNative:-129},{rawXNative:.5},{heldButtons:0x10000},
    {tick:-1},{crash:1},{simulationState:4}])assert.throws(()=>sampleNativeControls(state,options));
  assert.throws(()=>conditionNativeStick(NaN,0));assert.deepEqual(state,snapshot);
});
