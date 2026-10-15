import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRiderRecovery,decideNativeActorAfterHull,finishNativeActorPose,nativeRecoveryEffectValues} from '../native-rider-recovery.js';
import {createNativeRiderLifecycle,decideNativeRiderLifecycle,finishNativeRiderLifecycle,nativeRiderLifecycleSnapshot} from '../native-rider-lifecycle.js';
import {createNativeHull} from '../native-hull.js';
import {createAuthoredNativeRider} from '../authored-native-rider.js';

const F=Math.fround,vec=(x=0,y=0,z=0)=>({x,y,z});
const START_TYPES=[1,1,0,1,1,1,2,0,0,1,1,1,1,1,3,0,0,1,1];
const damping=Array(12).fill(F(.98));
const ready=(options={})=>createNativeRiderRecovery({riderIndex:0,hullDamping:damping,actorState:15,animationFrame:56,...options});
const posing=(options={})=>ready({phase:'pose',pose:{blendAtEvaluation:(options.blendProgress??0)>0},...options});
const outcome=(next=57,extra={})=>({nextAnimationFrame:next,pressedButtons:0,releasedButtons:0,heldButtons:0,...extra});
const controls={throttle:false,pressedButtons:0,releasedButtons:0,heldButtons:0,rawYNative:0,workingXNative:0,workingYNative:0,directionMask:0};
const zeroImpacts=()=>({...Object.fromEntries(['primaryBuoyImpactNative','fixedSphereImpactNative','racerImpactNative','shoreImpactNative',
 'boxImpactNative','floorImpactNative','objectImpactNative'].map(k=>[k,0])),normal:vec(1),markedBox:false});
const completed=()=>({frameSpeedNative:0,wetCount:8,impacts:zeroImpacts()});
const hullSnapshot=(simulationState=1)=>({simulationState,raceFinished:false,frameSpeedNative:0,wetCount:8,upY:1,
 manipulationAction:0,frameForwardNative:vec(0,0,1),impacts:zeroImpacts()});
function physical(options={},physicalMode=1){
 const hull=createNativeHull(),bundle=createAuthoredNativeRider({initialHull:hull});
 const state=ready({riderIndex:hull.rider,hullDamping:hull.points.map(p=>p.damping),...options});
 const lifecycle=createNativeRiderLifecycle({hull,rider:bundle.articulatedRider,courseDatumNative:0,state,physicalMode});
 return {hull,bundle,lifecycle};
}
const actionRecord=(gameMode648=1)=>({finished2c2c:0,record2c24:0,racerIndex:0,primaryRacerIndex:0,gameMode648});

test('actor15 is admitted for its supplied pose without synthesizing physical initialization',()=>{
 const initial=ready(),decision=decideNativeActorAfterHull(initial,hullSnapshot());
 assert.equal(decision.poseRequest.actorState,15);assert.equal(decision.poseRequest.animationFrame,56);
 assert.equal(decision.poseRequest.actorSpecificCompletionSupported,true);assert.deepEqual(decision.effects,[]);
 assert.equal(initial.animationFrame,56);assert.equal(initial.phase,'ready');
});

test('nonnegative actor15 returns advance only in explicit source phases2/3',()=>{
 for(const next of [0,1,57,84,2147483647])for(const phase650 of [-2147483648,-1,0,1,2,3,4,2147483647]){
  const before=posing({holdFrame:7,blendStep:F(.25)});
  const out=finishNativeActorPose(before,outcome(next,{pressedButtons:0xa000,releasedButtons:0xa000}),{phase650});
  assert.equal(out.state.animationFrame,phase650===2||phase650===3?next:56);
  assert.equal(out.state.actorState,15);assert.equal(out.state.holdFrame,7);assert.equal(out.state.blendStep,F(.25));
  assert.equal(out.actorRequest,null);assert.deepEqual(out.effects,[]);assert.equal(out.state.phase,'ready');
  assert.equal(before.animationFrame,56);assert.equal('phase650'in out.state,false);
 }
});

test('phase650 validates lazily and never defaults to648 or an action completion value',()=>{
 const state=posing(),before=structuredClone(state);
 for(const phase650 of [undefined,NaN,1.5,2147483648])assert.throws(()=>finishNativeActorPose(state,outcome(),{phase650}),/phase650/);
 assert.throws(()=>finishNativeActorPose(state,outcome(),{poseCompletion:actionRecord(2)}),/phase650/);
 assert.deepEqual(state,before);
 assert.equal(finishNativeActorPose(state,outcome(-1),{phase650:NaN}).state.pendingActor,22);
 const ordinary=finishNativeActorPose(posing({actorState:22}),outcome(0),{phase650:NaN});
 assert.equal(ordinary.state.actorState,22);
});

test('negative completion retains the current frame and queues the generic source blend/profile',()=>{
 for(const phase650 of [undefined,-1,0,1,2,3,2147483647]){
  const out=finishNativeActorPose(posing({animationFrame:84,holdFrame:7,blendStep:F(.25)}),outcome(-1),
   {phase650,poseCompletion:actionRecord()});
  assert.equal(out.state.actorState,15);assert.equal(out.state.animationFrame,84);
  assert.equal(out.state.pendingActor,22);assert.equal(out.state.pendingAnimationFrame,0);
  assert.equal(out.state.holdFrame,0);assert.equal(out.state.blendProgress,F(.15));assert.equal(out.state.blendStep,F(.15));
  assert.deepEqual(out.actorRequest,{actorState:22,animationFrame:0,blend:F(.15),holdFrame:0});
  const effect=nativeRecoveryEffectValues(out.effects[0]);
  assert.deepEqual(effect.riderJointTypes,Array(19).fill(1));assert.equal(effect.riderPhysicalMode,1);
  assert.deepEqual(out.actionWrites,{idleFramesC6c:0});
 }
});

test('active outgoing15 blends skip the phase hold and keep genuine negative outcomes',()=>{
 const state=posing({pendingActor:22,pendingAnimationFrame:0,blendProgress:F(.5),blendStep:F(.25)});
 const advancing=finishNativeActorPose(state,outcome(57,{pendingNextAnimationFrame:1}),{phase650:1});
 assert.equal(advancing.state.animationFrame,57);assert.equal(advancing.state.pendingAnimationFrame,1);
 assert.equal(advancing.state.blendProgress,F(.75));assert.deepEqual(advancing.effects,[]);
 const terminal=finishNativeActorPose(posing({...state,animationFrame:84}),outcome(-1,{pendingNextAnimationFrame:0}),{phase650:NaN});
 assert.equal(terminal.state.animationFrame,84);assert.equal(terminal.state.pendingActor,22);assert.equal(terminal.actorRequest,null);
 assert.throws(()=>finishNativeActorPose(state,outcome(),{phase650:1}),/pendingNextAnimationFrame/);
});

test('committing pending15 applies exact start types/mode independently of the alternate flag',()=>{
 for(const alternateStumble of [0,1])for(const holdFrame of [0,7]){
  const state=posing({actorState:22,animationFrame:0,pendingActor:15,pendingAnimationFrame:56,
   blendProgress:F(.75),blendStep:F(.25),holdFrame,alternateStumble});
  const out=finishNativeActorPose(state,outcome(0,{pendingNextAnimationFrame:57}));
  assert.equal(out.state.actorState,15);assert.equal(out.state.animationFrame,holdFrame?56:57);
  assert.equal(out.state.pendingActor,-1);assert.equal(out.state.blendProgress,0);
  assert.equal(out.state.holdFrame,holdFrame);assert.equal(out.state.blendStep,F(.25));
  assert.equal(out.effects.length,1);assert.equal(out.effects[0].requiresEquivalentInitializer,false);
  assert.deepEqual(nativeRecoveryEffectValues(out.effects[0]),{riderJointTypes:START_TYPES,riderPhysicalMode:1});
 }
});

test('actor15 stays in its own completion path rather than requiring action-specific records',()=>{
 const out=finishNativeActorPose(posing(),outcome(),{phase650:2,physicalMode:undefined,poseCompletion:undefined});
 assert.equal(out.state.animationFrame,57);assert.equal(out.actorRequest,null);
 // An actual gesture actor still requires its existing action context.
 assert.throws(()=>finishNativeActorPose(posing({actorState:8}),outcome(30)),/physicalMode/);
});

test('the fifth lifecycle context keeps phase650 separate from simulation648 and the fourth API',()=>{
 for(const [simulationState,phase650,expected]of [[1,3,57],[3,1,56]]){
  const {lifecycle}=physical();
  decideNativeRiderLifecycle(lifecycle,{completedFrame:completed(),simulationState,controls,manipulationAction:0});
  finishNativeRiderLifecycle(lifecycle,{nextAnimationFrame:57},controls,actionRecord(simulationState),{phase650});
  assert.equal(lifecycle.state.animationFrame,expected);
 }
 const {lifecycle}=physical();
 decideNativeRiderLifecycle(lifecycle,{completedFrame:completed(),simulationState:3,controls,manipulationAction:0});
 assert.throws(()=>finishNativeRiderLifecycle(lifecycle,{nextAnimationFrame:57},controls,actionRecord(2)),/phase650/);
 assert.equal(lifecycle.state.phase,'pose');assert.equal(lifecycle.state.animationFrame,56);
 finishNativeRiderLifecycle(lifecycle,{nextAnimationFrame:57},controls,undefined,{phase650:2});
 assert.equal(lifecycle.state.animationFrame,57);
});

test('simulation648 zero skips completion without requiring any650 context',()=>{
 const {bundle,lifecycle}=physical(),before=bundle.articulatedRider.points.map(p=>structuredClone(p));
 const d=decideNativeRiderLifecycle(lifecycle,{completedFrame:completed(),simulationState:0,controls,manipulationAction:0});
 assert.equal(d.skipped,true);assert.equal(d.state.phase,'ready');
 assert.equal(finishNativeRiderLifecycle(lifecycle,null,controls,undefined,{phase650:NaN}),null);
 assert.equal(lifecycle.state.animationFrame,56);assert.equal(lifecycle.state.lifecycleFrame,0);
 assert.deepEqual(bundle.articulatedRider.points,before);assert.equal(bundle.articulatedRider.logicalFrames,0);
});

test('lifecycle applies the15 initializer to existing points once without moving or solving them',()=>{
 const {hull,bundle,lifecycle}=physical({actorState:22,animationFrame:0,pendingActor:15,pendingAnimationFrame:56,
  blendProgress:F(.75),blendStep:F(.25),holdFrame:1},0);
 const rider=bundle.articulatedRider;
 rider.points.forEach((p,i)=>p.storedDelta=vec(.01*i,-.02*i,.03*i));
 const points=rider.points.map(p=>({position:structuredClone(p.position),storedDelta:structuredClone(p.storedDelta)}));
 const hullPoints=structuredClone(hull.points);
 decideNativeRiderLifecycle(lifecycle,{completedFrame:completed(),simulationState:1,controls,manipulationAction:0});
 finishNativeRiderLifecycle(lifecycle,{nextAnimationFrame:0,pendingNextAnimationFrame:57},controls);
 assert.equal(lifecycle.state.actorState,15);assert.equal(lifecycle.state.animationFrame,56);assert.equal(lifecycle.physicalMode,1);
 assert.deepEqual(rider.points.map(p=>p.type),START_TYPES);
 assert.deepEqual(rider.points.map(p=>({position:p.position,storedDelta:p.storedDelta})),points);
 assert.deepEqual(hull.points,hullPoints);assert.equal(rider.logicalFrames,0);assert.equal(bundle.anchorState.logicalFrames,0);
});

test('restoring actor15 retains caller physical state instead of initializing it from an actor label',()=>{
 const {bundle,lifecycle}=physical({holdFrame:7,blendStep:F(.25)});
 const before=bundle.articulatedRider.points.map(p=>p.type);
 // The constructor is a restore boundary; bootstrap points/types come from
 // the caller. Numeric pose admission must not silently seed an ordinary rig.
 assert.equal(before[9],4);
 decideNativeRiderLifecycle(lifecycle,{completedFrame:completed(),simulationState:1,controls,manipulationAction:0});
 finishNativeRiderLifecycle(lifecycle,{nextAnimationFrame:57},controls,undefined,{phase650:1});
 assert.deepEqual(bundle.articulatedRider.points.map(p=>p.type),before);
 const snapshot=nativeRiderLifecycleSnapshot(lifecycle);
 assert.equal(snapshot.state.holdFrame,7);assert.equal(snapshot.state.blendStep,F(.25));
 assert.equal('phase650'in snapshot.state,false);
});

test('terminal15 blends finish through ordinary22 initialization with no extra phase requirement',()=>{
 let state=finishNativeActorPose(posing({animationFrame:84}),outcome(-1)).state,completedPoses=0;
 while(state.actorState===15&&completedPoses<8){
  const decision=decideNativeActorAfterHull(state,hullSnapshot());
  const result=finishNativeActorPose(decision.state,outcome(-1,{pendingNextAnimationFrame:0}));
  state=result.state;completedPoses++;
  if(state.actorState===22){
   const types=nativeRecoveryEffectValues(result.effects[0]).riderJointTypes;
   assert.deepEqual([9,10,17,18].map(i=>types[i]),[4,4,4,4]);
  }else assert.equal(state.animationFrame,84);
 }
 assert.equal(completedPoses,6);assert.equal(state.actorState,22);assert.equal(state.animationFrame,0);
 assert.equal(state.pendingActor,-1);assert.equal(state.blendProgress,0);
});
