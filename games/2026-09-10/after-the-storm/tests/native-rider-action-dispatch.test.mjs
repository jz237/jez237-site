import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeControlState,sampleNativeControls} from '../native-controls.js';
import {
 createNativeRiderActionInputHistory,stepNativeRiderActionInputHistory,
 createNativeRiderActionDispatchState,nativeRiderActionNeedsRandom,dispatchNativeRiderActionRequest,
 prepareNativeRiderInversion,finishNativeRiderArcState,nativeRiderActionActorInitialization,prepareNativeRiderDiveReturn,
} from '../native-rider-action-dispatch.js';

const history=extra=>createNativeRiderActionInputHistory({gestureTick15f0:123,flag1600:1,directionMask15f6:0,
 sequence15f8:0,sequence15fa:0,lastPressedDirections15fc:0,quietFrames15fe:0,...extra});
const sampled=extra=>({actorState:22,rawXNative:0,rawYNative:0,preCurveYNative:0,
 heldButtonsB56:0,engineMaskC66:0,tick:5,...extra});
const state=extra=>createNativeRiderActionDispatchState({action16f4:0,idleFramesC6c:0,idleChoice16c4:-1,...extra});
const snapshot=extra=>({actorState:22,manipulationAction:0,heldButtonsB56:0,rawYNative:0,
 workingXNative:0,workingYNative:0,tick:5,gestureTick15f0:0,gestureWindowNative:3,
 flag1600:0,sequence15f8:0,sequence15fa:0,alternate16cc:0,state650:3,
 frameSpeedNative:10,bodyUpY:1,idleThresholdNative:100,...extra});
const recipe=(actorState,animationFrame,blend=.15,holdFrame=1)=>({actorState,animationFrame,blend:Math.fround(blend),holdFrame});

test('history creation requires every source field and copies storage bits without inventing initialization',()=>{
 assert.throws(()=>createNativeRiderActionInputHistory({}),/gestureTick15f0/);
 const input={...history(),sequence15f8:65535},copy=createNativeRiderActionInputHistory(input);
 input.sequence15f8=1;assert.equal(copy.sequence15f8,65535);assert.ok(Object.isFrozen(copy));
 assert.throws(()=>createNativeRiderActionInputHistory({...copy,quietFrames15fe:65536}),/native integer/);
});

test('negative-Y stamp uses filtered pre-curve axis and copied held word, then rawX can set1600 again',()=>{
 const s=history();
 assert.equal(stepNativeRiderActionInputHistory(s,sampled({rawYNative:-70,preCurveYNative:0})).state.gestureTick15f0,123);
 assert.equal(stepNativeRiderActionInputHistory(s,sampled({preCurveYNative:-14})).state.gestureTick15f0,123);
 const active=stepNativeRiderActionInputHistory(s,sampled({preCurveYNative:-15,tick:0xffffffff}));
 assert.equal(active.state.gestureTick15f0,0xffffffff);assert.equal(active.state.flag1600,0);
 assert.equal(stepNativeRiderActionInputHistory(s,sampled({preCurveYNative:-70,heldButtonsB56:0xa000})).state.gestureTick15f0,123);
 const diagonal=stepNativeRiderActionInputHistory(s,sampled({preCurveYNative:-70,rawXNative:70}));
 assert.equal(diagonal.state.gestureTick15f0,5);assert.equal(diagonal.state.flag1600,1);
});

test('sequence admission uses actual C66 rather than deriving an engine gate from held buttons',()=>{
 const q=sampled({rawXNative:70,heldButtonsB56:0xa000,engineMaskC66:0});
 assert.equal(stepNativeRiderActionInputHistory(history(),q).state.sequence15f8,1);
 const gated=stepNativeRiderActionInputHistory(history(),{...q,heldButtonsB56:0,engineMaskC66:0xa000});
 assert.equal(gated.state.sequence15f8,0);assert.equal(gated.state.quietFrames15fe,1);
});

test('exact cardinal edges progress each source circle in its own direction',()=>{
 let a=history(),b=history();
 for(const [x,y]of [[70,0],[0,70],[-70,0],[0,-70]])a=stepNativeRiderActionInputHistory(a,sampled({rawXNative:x,rawYNative:y})).state;
 for(const [x,y]of [[70,0],[0,-70],[-70,0],[0,70]])b=stepNativeRiderActionInputHistory(b,sampled({rawXNative:x,rawYNative:y})).state;
 assert.equal(a.sequence15f8,4);assert.equal(a.sequence15fa,0);
 assert.equal(b.sequence15fa,4);assert.equal(b.sequence15f8,0);
 assert.equal(a.lastPressedDirections15fc,0x400);assert.equal(b.lastPressedDirections15fc,0x800);
});

test('diagonal prior edges are retained intact, without decomposing or resetting unknown combinations',()=>{
 const prior=history({sequence15f8:3,sequence15fa:2,lastPressedDirections15fc:0x900});
 const r=stepNativeRiderActionInputHistory(prior,sampled({rawXNative:-70}));
 assert.equal(r.pressedDirections15f4,0x200);
 assert.equal(r.state.sequence15f8,3);assert.equal(r.state.sequence15fa,2);
 assert.equal(r.state.lastPressedDirections15fc,0x200);
});

test('quiet frames expire at5, preserve uint16 wrap, and held directions do not become new edges',()=>{
 const prior=history({sequence15f8:3,sequence15fa:2,directionMask15f6:0x100,quietFrames15fe:3});
 const fourth=stepNativeRiderActionInputHistory(prior,sampled({rawXNative:70}));
 assert.equal(fourth.pressedDirections15f4,0);assert.equal(fourth.state.sequence15f8,3);assert.equal(fourth.state.quietFrames15fe,4);
 const fifth=stepNativeRiderActionInputHistory(fourth.state,sampled({rawXNative:70}));
 assert.equal(fifth.state.sequence15f8,0);assert.equal(fifth.state.sequence15fa,0);
 const wrapped=stepNativeRiderActionInputHistory({...prior,quietFrames15fe:65535},sampled());
 assert.equal(wrapped.state.quietFrames15fe,0);assert.equal(wrapped.state.sequence15f8,3);
 const countWrapped=stepNativeRiderActionInputHistory(history({sequence15f8:65535,lastPressedDirections15fc:0x100}),sampled({rawYNative:70}));
 assert.equal(countWrapped.state.sequence15f8,0);
});

test('nonordinary actors clear both circle counts while preserving other actual history',()=>{
 const prior=history({sequence15f8:3,sequence15fa:4,lastPressedDirections15fc:0x900,quietFrames15fe:4});
 const r=stepNativeRiderActionInputHistory(prior,sampled({actorState:8,rawXNative:70}));
 assert.equal(r.state.sequence15f8,0);assert.equal(r.state.sequence15fa,0);
 assert.equal(r.state.quietFrames15fe,4);assert.equal(r.state.lastPressedDirections15fc,0x900);
});

test('real AI control samples feed one action-history latch and produce the source actor17 request',()=>{
 let controls=createNativeControlState(),h=history();
 for(const [tick,[x,y]]of [[70,0],[0,70],[-70,0],[0,-70]].entries()){
  const c=sampleNativeControls(controls,{controlOrigin:'ai',basePowerFactor:1,rawXNative:x,rawYNative:y,
   heldButtons:0,tick,actorState:22,animationFrame:0,simulationState:2});
  const result=stepNativeRiderActionInputHistory(h,sampled({rawXNative:c.rawXNative,rawYNative:c.rawYNative,
   preCurveYNative:c.preCurveYNative,heldButtonsB56:c.heldButtons,engineMaskC66:c.engineMask,tick}));
  assert.equal(result.pressedDirections15f4,c.pressedDirections);assert.equal(result.state.directionMask15f6,c.directionMask);
  controls=c.state;h=result.state;
 }
 const r=dispatchNativeRiderActionRequest(state(),snapshot({...h,rawYNative:-70,tick:3}));
 assert.deepEqual(r.actorRequest,recipe(17,1));assert.equal(r.requestCleared,true);
});

test('request1, counter15fa/request2, then counter15f8/request9 have source priority',()=>{
 assert.deepEqual(dispatchNativeRiderActionRequest(state({action16f4:1}),snapshot({sequence15fa:4,sequence15f8:4})).actorRequest,recipe(8,1));
 assert.deepEqual(dispatchNativeRiderActionRequest(state({action16f4:9}),snapshot({sequence15fa:4})).actorRequest,recipe(9,1));
 assert.deepEqual(dispatchNativeRiderActionRequest(state({action16f4:2}),snapshot({sequence15f8:4})).actorRequest,recipe(9,1));
 assert.deepEqual(dispatchNativeRiderActionRequest(state({action16f4:9}),snapshot()).actorRequest,recipe(17,1));
});

test('recent no-A|Z rawY gesture precedes another request and uses unsigned age with a strict3 window',()=>{
 const s=state({action16f4:2}),q=snapshot({rawYNative:70,tick:1,gestureTick15f0:0xffffffff});
 assert.deepEqual(dispatchNativeRiderActionRequest(s,q).actorRequest,recipe(8,1));
 assert.deepEqual(dispatchNativeRiderActionRequest(s,{...q,gestureTick15f0:0xfffffffe}).actorRequest,recipe(9,1));
 assert.deepEqual(dispatchNativeRiderActionRequest(s,{...q,flag1600:1}).actorRequest,recipe(9,1));
 assert.deepEqual(dispatchNativeRiderActionRequest(s,{...q,heldButtonsB56:0xa000}).actorRequest,recipe(9,1));
});

test('request writes clear BEFORE scene/alternate rejection, while unknown requests otherwise remain',()=>{
 for(const [state650,alternate16cc]of [[2,0],[3,1]]){
  const r=dispatchNativeRiderActionRequest(state({action16f4:2}),snapshot({state650,alternate16cc}));
  assert.equal(r.state.action16f4,0);assert.equal(r.requestCleared,true);assert.equal(r.actorRequest,null);
 }
 const unknown=dispatchNativeRiderActionRequest(state({action16f4:65535}),snapshot());
 assert.equal(unknown.state.action16f4,65535);assert.equal(unknown.requestCleared,false);assert.equal(unknown.actorRequest,null);
});

test('manipulation3 requests actor25 before every gesture gate and retains the shared request word',()=>{
 const r=dispatchNativeRiderActionRequest(state({action16f4:1,idleFramesC6c:500}),snapshot({manipulationAction:3,state650:2,alternate16cc:1}));
 assert.deepEqual(r.actorRequest,recipe(25,0,.15,0));assert.equal(r.state.action16f4,1);
 assert.equal(r.state.idleFramesC6c,500);assert.equal(r.requestCleared,false);assert.equal(r.randomRead,false);
});

test('idle draw is conditional on the incremented counter and explicit supplied RNG, never an invented policy',()=>{
 const q=snapshot({frameSpeedNative:0}),s=state({idleFramesC6c:99});
 assert.equal(nativeRiderActionNeedsRandom(s,q),false);
 const first=dispatchNativeRiderActionRequest(s,q);assert.equal(first.state.idleFramesC6c,100);assert.equal(first.actorRequest,null);
 assert.equal(nativeRiderActionNeedsRandom(first.state,q),true);
 assert.throws(()=>dispatchNativeRiderActionRequest(first.state,q),/actual randomUnsigned32/);
 for(const [randomUnsigned32,animationFrame]of [[0,26],[1,26],[2,1],[3,1],[0xffffffff,1]]){
  const r=dispatchNativeRiderActionRequest(first.state,q,{randomUnsigned32});
  assert.equal(r.state.idleChoice16c4,randomUnsigned32&3);assert.equal(r.randomRead,true);
  assert.deepEqual(r.actorRequest,recipe(10,animationFrame,1,1));
 }
});

test('idle numeric boundaries preserve float32 speed/double up, signed wrap and no failure reset',()=>{
 const s=state({idleFramesC6c:100}),q=snapshot({frameSpeedNative:0});
 for(const extra of [{actorState:15},{frameSpeedNative:2.777777910232544},{bodyUpY:Math.fround(.95)},
  {workingXNative:-12},{workingXNative:12},{workingYNative:12}]){
  assert.equal(nativeRiderActionNeedsRandom(s,{...q,...extra}),false);
  assert.equal(dispatchNativeRiderActionRequest(s,{...q,...extra}).state.idleFramesC6c,100);
 }
 assert.equal(nativeRiderActionNeedsRandom(s,{...q,bodyUpY:.9500000476837158,workingXNative:-11}),true);
 const r=dispatchNativeRiderActionRequest(state({idleFramesC6c:2147483647}),q);
 assert.equal(r.state.idleFramesC6c,-2147483648);assert.equal(r.randomRead,false);
});

test('16d4 counts actor22 up-sign transitions with int32 wrap and zero remains upright',()=>{
 const first=prepareNativeRiderInversion({upsideDown16f0:0,turnCount16d4:0},{actorState:22,upY:-1});
 assert.deepEqual(first,{upsideDown16f0:1,previousUpsideDown16f2:0,turnCount16d4:1});
 assert.equal(prepareNativeRiderInversion(first,{actorState:22,upY:-0}).turnCount16d4,2);
 assert.equal(prepareNativeRiderInversion(first,{actorState:25,upY:1}).turnCount16d4,1);
 assert.equal(prepareNativeRiderInversion({upsideDown16f0:0,turnCount16d4:2147483647},{actorState:22,upY:-1}).turnCount16d4,-2147483648);
});

test('arc contact reset clears turn/arc only for action0 and preserves the accumulating dry counter',()=>{
 const s={turnCount16d4:2,noWetNoContactFrames16dc:8,arcActive16e2:1};
 const q={fieldC7c:0,manipulationAction:0,floorImpactNative:0,boxImpactNative:0,shoreImpactNative:0};
 assert.deepEqual(finishNativeRiderArcState(s,q),{...s,noWetNoContactFrames16dc:9});
 assert.deepEqual(finishNativeRiderArcState(s,{...q,fieldC7c:1}),{turnCount16d4:0,noWetNoContactFrames16dc:8,arcActive16e2:0});
 assert.deepEqual(finishNativeRiderArcState(s,{...q,boxImpactNative:.01}),{turnCount16d4:0,noWetNoContactFrames16dc:8,arcActive16e2:0});
 assert.deepEqual(finishNativeRiderArcState(s,{...q,fieldC7c:1,manipulationAction:3}),s);
 assert.equal(finishNativeRiderArcState({...s,noWetNoContactFrames16dc:2147483647},q).noWetNoContactFrames16dc,-2147483648);
});

test('additional actor initializer recipes carry actual point types and auxiliary modes, with no pose geometry',()=>{
 const p8=nativeRiderActionActorInitialization({actorState:8,alternate16cc:0});
 assert.equal(p8.physicalMode,0);assert.deepEqual(p8.riderJointTypes,[1,1,0,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1]);
 const p9=nativeRiderActionActorInitialization({actorState:9,alternate16cc:0});
 assert.equal(p9.physicalMode,1);assert.deepEqual(p9.riderJointTypes,[1,1,0,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1]);
 assert.deepEqual(nativeRiderActionActorInitialization({actorState:17,alternate16cc:0}),{physicalMode:0,riderJointTypes:Array(19).fill(0)});
 const p25=nativeRiderActionActorInitialization({actorState:25,alternate16cc:0});
 assert.equal(p25.riderJointTypes[6],2);assert.equal(p25.riderJointTypes[14],3);
 assert.deepEqual([9,10,17,18].map(i=>p25.riderJointTypes[i]),[4,4,4,4]);
 assert.equal(nativeRiderActionActorInitialization({actorState:25,alternate16cc:1}).riderJointTypes[2],0);
 assert.ok(Object.isFrozen(p9.riderJointTypes));
});

test('actor25 return requests its real ordinary blend and preserves ongoing manipulation state',()=>{
 assert.deepEqual(prepareNativeRiderDiveReturn({actorState:25,manipulationAction:0,secondaryCounterC70:8}),
  {actorRequest:recipe(22,0,.15,0),secondaryCounterC70:-1});
 assert.deepEqual(prepareNativeRiderDiveReturn({actorState:25,manipulationAction:3,secondaryCounterC70:8}),
  {actorRequest:null,secondaryCounterC70:8});
});

test('pure helper failures cannot mutate caller history and unsupported actors are explicit',()=>{
 const s=state({action16f4:2}),q=snapshot(),before=structuredClone({s,q});
 const r=dispatchNativeRiderActionRequest(s,q);assert.notEqual(r.state,s);assert.ok(Object.isFrozen(r));
 assert.deepEqual({s,q},before);
 assert.throws(()=>dispatchNativeRiderActionRequest(s,{...q,actorState:8}),/eligible actor22 or15/);
 assert.throws(()=>dispatchNativeRiderActionRequest(s,{...q,tick:-1}),/native integer/);
 assert.throws(()=>dispatchNativeRiderActionRequest(s,{...q,sequence15fa:65536}),/native integer/);
 assert.throws(()=>dispatchNativeRiderActionRequest(s,{...q,bodyUpY:NaN}),/float32/);
 assert.throws(()=>stepNativeRiderActionInputHistory(history(),sampled({engineMaskC66:undefined})),/native integer/);
 assert.throws(()=>stepNativeRiderActionInputHistory(history(),sampled({rawXNative:128})),/native integer/);
 assert.throws(()=>nativeRiderActionActorInitialization({actorState:22,alternate16cc:0}),/Only action actors/);
 assert.throws(()=>prepareNativeRiderDiveReturn({actorState:22,manipulationAction:0,secondaryCounterC70:0}),/requires actor25/);
});
