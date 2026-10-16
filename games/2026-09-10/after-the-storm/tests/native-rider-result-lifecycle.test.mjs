import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRiderRecovery,decideNativeActorAfterHull,finishNativeActorPose,nativeRecoveryEffectValues} from '../native-rider-recovery.js';

// Prepared pose returns isolate the original result post-pose consumer.
// No replacement animation targets or driven finish are asserted here.
const F=Math.fround;
const TYPES={
 1:[1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0],
 2:[1,1,1,1,1,1,1,1,1,0,0,1,1,1,3,1,1,0,0],
 3:[1,1,1,1,1,1,1,1,1,0,0,1,1,1,3,1,1,0,0],
 4:[1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0],
 5:Array(19).fill(1),
 6:[1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0]
};
const state=(q={})=>createNativeRiderRecovery({riderIndex:0,hullDamping:Array(12).fill(F(.9)),...q});
const hull={simulationState:3,raceFinished:true,frameSpeedNative:0,wetCount:12,upY:1,manipulationAction:0,
 impacts:{primaryBuoyImpactNative:0,fixedSphereImpactNative:0,racerImpactNative:0,shoreImpactNative:0,
 boxImpactNative:0,floorImpactNative:0,objectImpactNative:0,normal:{x:0,y:1,z:0},markedBox:false}};
const decide=s=>decideNativeActorAfterHull(s,hull);
const finish=(s,next,pendingNext)=>finishNativeActorPose(s,{nextAnimationFrame:next,pressedButtons:0,releasedButtons:0,
 ...(pendingNext===undefined?{}:{pendingNextAnimationFrame:pendingNext})},{poseCompletion:{}});

test('all six result actors enter only after the source selection delay and held blend, then install their physical constraints',()=>{
 for(const actor of [1,2,3,4,5,6])for(const alternateStumble of [0,1,65535]){
  let s=state({selectedActor:actor,selectionCountdown:10,alternateStumble});
  for(let frame=0;frame<10;frame++){
   const d=decide(s);assert.equal(d.actorRequest,null);assert.equal(d.state.selectionCountdown,9-frame);
   s=finish(d.state,0).state;
  }
  const d=decide(s);
  assert.deepEqual(d.actorRequest,{actorState:actor,animationFrame:1,blend:F(.15),holdFrame:1});
  assert.deepEqual(nativeRecoveryEffectValues(d.effects[0]),{riderJointTypes:Array(19).fill(1),riderPhysicalMode:1});
  s=d.state;let initialized=0;
  while(s.actorState!==actor){
   const f=finish(s,0,42);
   if(f.effects.length){
    initialized++;assert.deepEqual(nativeRecoveryEffectValues(f.effects[0]),{riderJointTypes:TYPES[actor],riderPhysicalMode:1});
   }
   s=f.state;
   assert.equal(s.pendingAnimationFrame,1,'held pending result does not consume sampled frame42');
   if(s.actorState!==actor)s=decide(s).state;
  }
  assert.equal(initialized,1);assert.equal(s.animationFrame,1);assert.equal(s.selectionCountdown,0);
  assert.equal(s.selectedActor,actor);assert.equal(s.pendingActor,-1);
 }
});

test('result completion clears the selection delay; retirement alone unlocks and takes the slower held remount return',()=>{
 for(const actor of [1,2,3,4,5,6])for(const selectionCountdown of [-32768,-1,0,10,32767])for(const recoveryInputLock of [-1,0,1,2147483647]){
  const initial=state({actorState:actor,animationFrame:19,selectedActor:actor,selectionCountdown,recoveryInputLock});
  const d=decide(initial),f=finish(d.state,-1);
  assert.equal(f.state.animationFrame,19,'negative evaluator return retains current frame');
  assert.equal(f.state.selectionCountdown,-1);assert.equal(f.state.selectedActor,actor);
  assert.equal(f.state.recoveryInputLock,actor===5?0:recoveryInputLock);
  assert.deepEqual(f.actorRequest,{actorState:actor===5?7:22,animationFrame:0,blend:F(actor===5?.05:.15),holdFrame:actor===5?1:0});
  assert.deepEqual(f.actionWrites,{idleFramesC6c:0});
  assert.equal(f.effects.length,1);assert.equal(f.effects[0].actorState,-1);
  assert.equal(initial.selectionCountdown,selectionCountdown,'immutable input owner');
 }
});

test('unfinished result samples retain result selection and input lock without creating another request',()=>{
 for(const actor of [1,2,3,4,5,6])for(const next of [0,1,23,100,2147483647]){
  const s=state({actorState:actor,animationFrame:19,selectedActor:actor,selectionCountdown:10,recoveryInputLock:1});
  const f=finish(decide(s).state,next);
  assert.equal(f.state.animationFrame,next);assert.equal(f.state.selectionCountdown,10);
  assert.equal(f.state.recoveryInputLock,1);assert.equal(f.state.selectedActor,actor);
  assert.equal(f.actorRequest,null);assert.deepEqual(f.effects,[]);assert.deepEqual(f.actionWrites,{});
 }
});

test('active blends skip result completion even on negative current and pending evaluator returns',()=>{
 for(const actor of [1,2,3,4,5,6])for(const holdFrame of [0,1]){
  const s=state({actorState:actor,animationFrame:19,selectedActor:actor,selectionCountdown:10,recoveryInputLock:1,
   pendingActor:22,pendingAnimationFrame:4,blendProgress:F(.15),blendStep:F(.15),holdFrame});
  const f=finish(decide(s).state,-1,-1);
  assert.equal(f.state.selectionCountdown,10);assert.equal(f.state.recoveryInputLock,1);
  assert.equal(f.state.animationFrame,19);assert.equal(f.state.pendingAnimationFrame,4);
  assert.equal(f.state.blendProgress,F(F(.15)+F(.15)));assert.equal(f.actorRequest,null);
  assert.deepEqual(f.effects,[]);assert.deepEqual(f.actionWrites,{});
 }
});

test('completed selection stays disabled through ordinary return and cannot replay the retained result',()=>{
 for(const actor of [1,2,3,4,6]){
  let s=finish(decide(state({actorState:actor,animationFrame:19,selectedActor:actor,selectionCountdown:0})).state,-1).state;
  for(let n=0;n<6;n++)s=finish(decide(s).state,-1,0).state;
  assert.equal(s.actorState,22);assert.equal(s.pendingActor,-1);assert.equal(s.selectionCountdown,-1);
  for(let n=0;n<20;n++){
   const d=decide(s);assert.equal(d.actorRequest,null);s=finish(d.state,0).state;
  }
  assert.equal(s.selectedActor,actor);assert.equal(s.selectionCountdown,-1);
 }
});
