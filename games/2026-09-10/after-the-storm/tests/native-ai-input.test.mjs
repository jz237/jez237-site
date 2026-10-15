import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeControlState,sampleNativeControls} from '../native-controls.js';
import {createNativeRaceAdapter,prepareNativeRaceAdapterFrame,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';

// Independently reproduced input arithmetic. These numeric fixtures exercise
// dispatch preparation only; no source AI steering, navigation, avatar choice
// or computer physics profile is invented by a controls test.
const ai={controlOrigin:'ai',basePowerFactor:.6,rawXNative:35,rawYNative:20,heldButtons:0x8000};
const near=(a,b,e=1e-12)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const raw=(x=35,heldButtons=0x8000,basePowerFactor=.6)=>({rawXNative:x,rawYNative:0,heldButtons,basePowerFactor});

test('AI preserves signed working bytes while human input retains its separate nonlinear curve',()=>{
 const state=createNativeControlState();
 const computer=sampleNativeControls(state,ai),human=sampleNativeControls(state,{rawXNative:35,rawYNative:20,heldButtons:0x8000});
 assert.deepEqual([computer.workingXNative,computer.workingYNative],[35,20]);
 assert.deepEqual([human.workingXNative,human.workingYNative],[23,8]);
 assert.equal(computer.controlOrigin,'ai');assert.equal(computer.basePowerFactor,.6000000238418579);assert.equal(human.controlOrigin,'human');assert.equal(human.powerFactor,1);
 for(const [x,y]of [[-128,127],[127,-128],[-70,35],[15,-14],[-5,5],[0,0]]){
  const c=sampleNativeControls(state,{...ai,rawXNative:x,rawYNative:y});assert.deepEqual([c.workingXNative,c.workingYNative],[x,y]);
 }
 assert.equal(sampleNativeControls(state,{...ai,rawXNative:5,rawYNative:0}).workingXNative,5);
 assert.equal(sampleNativeControls(state,{rawXNative:5}).workingXNative,0);
});

test('actor multipliers consume AI baseline with binary32 operation order and handstand scales only workingX',()=>{
 for(const [actorState,x,power]of [[22,35,.6000000238418579],[8,28,.5100000500679016],[9,35,.5400000214576721],
  [17,35,.5400000214576721],[24,35,.18000000715255737]]){
  const c=sampleNativeControls(createNativeControlState(),{...ai,actorState});
  assert.deepEqual([c.workingXNative,c.workingYNative],[x,20]);assert.equal(c.powerFactor,power);assert.equal(c.engineMask,0x8000);
 }
 const negative=sampleNativeControls(createNativeControlState(),{...ai,rawXNative:-35,actorState:8});assert.equal(negative.workingXNative,-28);
 const boosted=sampleNativeControls(createNativeControlState(),{...ai,basePowerFactor:1.2});assert.equal(boosted.powerFactor,1.2000000476837158);
 assert.equal(sampleNativeControls(createNativeControlState(),{...ai,basePowerFactor:0}).powerFactor,0);
});

test('muted AI retains its producer baseline and raw input history while suppressing force axes and engine',()=>{
 for(const options of [{crash:true},{actorState:23},{actorState:7,animationFrame:55},{actorState:1},{actorState:6},{simulationState:0},{simulationState:1}]){
  const state=createNativeControlState({tick:9});state.heldButtons=0x2000;
  const c=sampleNativeControls(state,{...ai,tick:10,...options});
  assert.deepEqual([c.rawXNative,c.rawYNative],[35,20]);assert.deepEqual([c.workingXNative,c.workingYNative],[0,0]);
  assert.equal(c.powerFactor,.6000000238418579);assert.equal(c.basePowerFactor,.6000000238418579);assert.equal(c.engineMask,0);assert.equal(c.muted,true);
  assert.equal(c.pressedButtons,0x8000);assert.equal(c.releasedButtons,0x2000);assert.equal(c.smoothedXNative,15);
  assert.deepEqual(c.gestureTicks,{negativeX:9,positiveX:9,negativeY:9,positiveY:9});assert.equal(state.heldButtons,0x2000);
 }
 for(const options of [{actorState:7,animationFrame:56},{simulationState:2},{simulationState:3}]){
  const c=sampleNativeControls(createNativeControlState(),{...ai,...options});assert.equal(c.muted,false);assert.equal(c.workingXNative,35);
 }
});

test('AI and human share button edges, raw direction thresholds, gesture stamps and15-step rawX slew',()=>{
 const state=createNativeControlState({tick:10});state.heldButtons=0x2000;
 const c=sampleNativeControls(state,{...ai,rawXNative:65,rawYNative:-65,tick:11});
 assert.equal(c.pressedButtons,0x8000);assert.equal(c.releasedButtons,0x2000);assert.equal(c.directionMask,0x500);assert.equal(c.pressedDirections,0x500);
 assert.equal(c.smoothedXNative,15);assert.equal(c.gestureTicks.positiveX,11);assert.equal(c.gestureTicks.negativeY,11);
 const next=sampleNativeControls(c.state,{...ai,rawXNative:65,rawYNative:-65,tick:12});assert.equal(next.pressedDirections,0);assert.equal(next.pressedButtons,0);assert.equal(next.smoothedXNative,30);
 const final=sampleNativeControls(next.state,{...ai,rawXNative:15,rawYNative:-14,tick:13});assert.equal(final.workingXNative,15);assert.equal(final.workingYNative,-14);
 assert.equal(final.gestureTicks.positiveX,13);assert.equal(final.gestureTicks.negativeY,12);assert.equal(final.directionMask,0);
});

test('invalid origins/baselines fail without changing pure control history',()=>{
 const state=createNativeControlState(),before=structuredClone(state);
 for(const controlOrigin of ['computer',null,1])assert.throws(()=>sampleNativeControls(state,{...ai,controlOrigin}),/controlOrigin/);
 for(const basePowerFactor of [undefined,null,'1',NaN,Infinity,-Infinity,1e40])assert.throws(()=>sampleNativeControls(state,{...ai,basePowerFactor}),/basePowerFactor/);
 assert.throws(()=>sampleNativeControls(state,{basePowerFactor:.6}),/Human/);
 assert.deepEqual(state,before);
});

test('only trusted adapter dispatch selects AI preparation; payload and source hooks cannot select it implicitly',()=>{
 const a=createNativeRaceAdapter(),before=nativeRaceSnapshot(a),controlState=structuredClone(a.controlState);
 assert.throws(()=>prepareNativeRaceAdapterFrame(a,ai),/match/);assert.deepEqual(nativeRaceSnapshot(a),before);assert.deepEqual(a.controlState,controlState);assert.equal(a.frame,null);
 prepareNativeRaceAdapterFrame(a,{rawXNative:35,heldButtons:0x8000},{sourceState:()=>({actorState:22,controlOrigin:'ai',basePowerFactor:.6})});
 assert.equal(a.lastControls.controlOrigin,'human');assert.equal(a.lastControls.workingXNative,18);assert.equal(a.lastControls.powerFactor,1);
 assert.throws(()=>{a.controlOrigin='ai';},TypeError);assert.equal(a.controlOrigin,'human');
 const b=createNativeRaceAdapter({controlOrigin:'ai'});prepareNativeRaceAdapterFrame(b,raw());
 assert.equal(b.lastControls.controlOrigin,'ai');assert.equal(b.lastControls.workingXNative,35);assert.equal(b.lastControls.powerFactor,.6000000238418579);
});

test('trusted human→AI→human takeover retains one adapter history and never changes its computer/human physics profile',()=>{
 for(const computerProfile of [false,true]){
 const a=createNativeRaceAdapter({computerProfile}),profile=a.water.profile;
 stepNativeRaceAdapter(a,.05,{rawXNative:35,heldButtons:0x8000});
 assert.equal(a.lastControls.controlOrigin,'human');assert.equal(a.lastControls.workingXNative,18);assert.equal(a.controlState.smoothedXNative,15);
 assert.equal(a.lastControls.pressedButtons,0x8000);assert.equal(a.lastControls.releasedButtons,0);
 stepNativeRaceAdapter(a,.05,raw(),{controlOrigin:'ai'});
 assert.equal(a.lastControls.controlOrigin,'ai');assert.equal(a.lastControls.workingXNative,35);assert.equal(a.controlState.smoothedXNative,30);
 assert.equal(a.lastControls.pressedButtons,0);assert.equal(a.lastControls.releasedButtons,0);assert.equal(a.lastControls.powerFactor,.6000000238418579);
 stepNativeRaceAdapter(a,.05,{rawXNative:35,heldButtons:0x2000});
 assert.equal(a.lastControls.controlOrigin,'human');assert.equal(a.lastControls.workingXNative,18);assert.equal(a.controlState.smoothedXNative,35);
 assert.equal(a.lastControls.pressedButtons,0x2000);assert.equal(a.lastControls.releasedButtons,0x8000);assert.equal(a.lastControls.powerFactor,1);
 assert.equal(a.hull.ticks,15);assert.equal(a.logicalFrames,3);assert.equal(a.controlState.tick,2);
 assert.equal(a.water.profile,profile);assert.equal(a.computerProfile,computerProfile);assert.equal(a.controlOrigin,'human');assert.ok(a.hull.center.z>0);
 }
});

test('AI baseline reaches the actual first jet impulse without changing ordinary human default forces',()=>{
 const a=createNativeRaceAdapter({controlOrigin:'ai'}),b=createNativeRaceAdapter(),c=createNativeRaceAdapter();
 stepNativeRaceAdapter(a,.01,raw(0));stepNativeRaceAdapter(b,.01,{rawXNative:0,heldButtons:0x8000});stepNativeRaceAdapter(c,.01,{throttle:true});
 assert.equal(a.lastControls.powerFactor,.6000000238418579);assert.ok(a.water.lastJet.magnitudeNative>0);
 near(a.water.lastJet.magnitudeNative/b.water.lastJet.magnitudeNative,.6000000238418579);
 assert.deepEqual(nativeRaceSnapshot(b),nativeRaceSnapshot(c));assert.deepEqual(b.controlState,c.controlState);
});

test('malformed AI payloads and trusted origin overrides fail before adapter sampling or force-history mutation',()=>{
 for(const [input,options]of [
  [{throttle:true,basePowerFactor:.6},{}],[{rawXNative:35},{}],[raw(128),{}],[raw(.5),{}],
  [{...raw(),basePowerFactor:Infinity},{}],[{...raw(),throttle:true},{}],[{...raw(),controlOrigin:'human'},{}],
  [raw(),{controlOrigin:'computer'}],[raw(),{controlOrigin:null}]
 ]){
  const a=createNativeRaceAdapter({controlOrigin:'ai'}),before={snapshot:nativeRaceSnapshot(a),control:structuredClone(a.controlState),riderControl:structuredClone(a.riderControlState),action:structuredClone(a.actionState)};
  assert.throws(()=>prepareNativeRaceAdapterFrame(a,input,options));
  assert.deepEqual(nativeRaceSnapshot(a),before.snapshot);assert.deepEqual(a.controlState,before.control);assert.deepEqual(a.riderControlState,before.riderControl);assert.deepEqual(a.actionState,before.action);
  assert.equal(a.preparedHullTick,null);assert.equal(a.frame,null);assert.equal(a.lastControls,null);
 }
 for(const controlOrigin of [null,0,'native-ai'])assert.throws(()=>createNativeRaceAdapter({controlOrigin}),/controlOrigin/);
 for(const computerProfile of [null,0,1,'ai'])assert.throws(()=>createNativeRaceAdapter({computerProfile}),/computerProfile/);
});
