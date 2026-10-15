import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHull} from '../native-hull.js';
import {createAuthoredNativeRider} from '../authored-native-rider.js';
import {createNativeRiderRecovery} from '../native-rider-recovery.js';
import {nativeRiderStartFrameView} from '../native-rider-start-pose.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter,latchNativeRaceAdapterControls,nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
import {createRaceWater} from '../race-water.js';

// Explicit post-initialization fixture with authored ordinary anatomy. This
// isolates frame/lifecycle phase ownership; it is not the source actor15 pose
// provider or evidence that the complete original physical startup is live.
const START=[1,1,0,1,1,1,2,0,0,1,1,1,1,1,3,0,0,1,1];
const input={heldButtons:0x8000};
function fixture({sourceState,contacts,animationFrame=56,riderActions}={}){
 const hull=createNativeHull(),bundle=createAuthoredNativeRider({initialHull:hull});
 bundle.articulatedRider.points.forEach((p,i)=>p.type=START[i]);
 const state=createNativeRiderRecovery({riderIndex:0,hullDamping:hull.points.map(p=>p.damping),actorState:15,animationFrame});
 const poses=[];
 const riderPose=(h,c)=>{
  poses.push(structuredClone(c.poseRequest));const pose=bundle.riderPose(h,c),q=c.poseRequest;
  const next=(actor,frame)=>actor===15?nativeRiderStartFrameView({animationFrame:frame}).nextAnimationFrame:0;
  return {...pose,animationOutcome:{nextAnimationFrame:next(q.actorState,q.animationFrame),
   ...(q.pending?{pendingNextAnimationFrame:next(q.pending.actorState,q.pending.animationFrame)}:{})}};
 };
 const a=createNativeRaceAdapter({...bundle,riderPose,sourceState,contacts,riderActions,
  riderRecovery:{courseDatumNative:0,state,physicalMode:1}});
 return {a,poses};
}
const actionSource=phase=>({state650:phase,gestureWindowNative:3,idleThresholdNative:1000,
 poseCompletion:{finished2c2c:0,record2c24:0,racerIndex:0,primaryRacerIndex:0,gameMode648:1}});
const actions=source=>({inputHistory:{gestureTick15f0:0,flag1600:0,sequence15f8:0,sequence15fa:0,lastPressedDirections15fc:0,quietFrames15fe:0},
 idleFramesC6c:0,idleChoice16c4:0,source});

test('the physical adapter holds and advances actor15 from650 independently of simulation648',()=>{
 for(const [simulationState,phase650,expected,throttle]of [[3,1,56,true],[1,3,57,false],[3,0,56,true],[3,2,57,true]]){
  const {a,poses}=fixture({sourceState:{simulationState,phase650}});stepNativeRaceAdapter(a,.05,input);
  assert.equal(a.riderLifecycle.state.animationFrame,expected);assert.equal(a.riderLifecycle.state.actorState,15);
  assert.equal(a.lastControls.throttle,throttle);assert.equal(poses.length,1);assert.equal(a.articulatedRider.logicalFrames,1);
  assert.equal('phase650'in a.riderLifecycle.state,false);
 }
});

test('a scene phase changed during hull work belongs to the following input frame',()=>{
 let phase650=1,calls=0;
 const {a}=fixture({sourceState:()=>{calls++;return {simulationState:3,phase650};},contacts:{floor:()=>{phase650=3;}}});
 stepNativeRaceAdapter(a,.05,input);assert.equal(phase650,3);assert.equal(a.riderLifecycle.state.animationFrame,56);
 stepNativeRaceAdapter(a,.05,input);assert.equal(a.riderLifecycle.state.animationFrame,57);assert.equal(calls,2);
});

test('an explicit control latch preserves the same launch phase across five ticks',()=>{
 let phase650=1,calls=0;const {a}=fixture({sourceState:()=>{calls++;return {simulationState:3,phase650};}});
 latchNativeRaceAdapterControls(a,input);phase650=2;
 for(let i=0;i<5;i++)stepNativeRaceAdapter(a,.01,input);
 assert.equal(calls,1);assert.equal(a.riderLifecycle.state.animationFrame,56);
 stepNativeRaceAdapter(a,.05,input);assert.equal(calls,2);assert.equal(a.riderLifecycle.state.animationFrame,57);
});

test('active actor15 rejects missing or malformed phase before mutating input or physics',()=>{
 for(const sourceState of [{simulationState:3},{simulationState:1},{simulationState:3,phase650:NaN},{simulationState:3,phase650:1.5}]){
  const {a}=fixture({sourceState:()=>sourceState}),before={hull:nativeRaceSnapshot(a),controls:structuredClone(a.controlState),lifecycle:structuredClone(a.riderLifecycle.state)};
  assert.throws(()=>latchNativeRaceAdapterControls(a,input),/phase650/);
  assert.deepEqual(nativeRaceSnapshot(a),before.hull);assert.deepEqual(a.controlState,before.controls);
  assert.deepEqual(a.riderLifecycle.state,before.lifecycle);assert.equal(a.sampledHullTick,null);
 }
});

test('the existing action source can supply the same canonical650 without another phase owner',()=>{
 const {a}=fixture({sourceState:{simulationState:3},riderActions:actions(actionSource(2))});
 stepNativeRaceAdapter(a,.05,input);assert.equal(a.riderLifecycle.state.animationFrame,57);
 const conflict=fixture({sourceState:{simulationState:3,phase650:1},riderActions:actions(actionSource(3))}).a;
 const before=nativeRaceSnapshot(conflict);assert.throws(()=>latchNativeRaceAdapterControls(conflict,input),/same|share.*owner/);
 assert.deepEqual(nativeRaceSnapshot(conflict),before);assert.equal(conflict.sampledHullTick,null);
});

test('terminal start animation queues the source idle blend without becoming stuck in15',()=>{
 const {a}=fixture({animationFrame:84,sourceState:{simulationState:3,phase650:3}});
 stepNativeRaceAdapter(a,.05,input);assert.equal(a.riderLifecycle.state.actorState,15);assert.equal(a.riderLifecycle.state.pendingActor,22);
 for(let i=0;i<8;i++)stepNativeRaceAdapter(a,.05,input);
 assert.equal(a.riderLifecycle.state.actorState,22);assert.equal(a.riderLifecycle.state.pendingActor,-1);
 assert.equal(a.articulatedRider.logicalFrames,9);
});

test('render cadence does not resample phase or change the launch lifecycle',()=>{
 const run=hz=>{
  let count=0;const {a}=fixture({sourceState:(_h,c)=>{count++;return {simulationState:c.logicalFrame<4?1:3,phase650:c.logicalFrame<4?1:2};}});
  for(let i=0;i<hz;i++)stepNativeRaceAdapter(a,1/hz,input);
  return {snapshot:nativeRaceSnapshot(a),lifecycle:structuredClone(a.riderLifecycle.state),count};
 };
 const reference=run(60);for(const hz of [30,144])assert.deepEqual(run(hz),reference);
});

test('both riders complete the old shared launch phase before the post-water phase change',()=>{
 const scene={simulationState:1,phase650:1},adapters=[0,1].map(()=>fixture({sourceState:()=>scene}).a),completed=[];
 const water=createRaceWater({crafts:adapters.map(a=>({...a.hull.center,sourceForwardXZ:[0,1]})),baseAmplitudeNative:20,seed:17,initialNoise:false});
 const world=createNativeRaceWorld({adapters,water,humanIndices:[0,1],craftContacts:false,afterFrame:w=>{
  completed.push(w.adapters.map(a=>a.riderLifecycle.state.animationFrame));
  assert.equal(w.water.frames,completed.length);
  scene.phase650=2;scene.simulationState=3;
 }});
 stepNativeRaceWorld(world,.05,[input,input]);assert.deepEqual(completed,[[56,56]]);
 assert.deepEqual(adapters.map(a=>a.lastControls.throttle),[false,false]);
 stepNativeRaceWorld(world,.05,[input,input]);assert.deepEqual(completed,[[56,56],[57,57]]);
 assert.deepEqual(adapters.map(a=>a.lastControls.throttle),[true,true]);
 assert.deepEqual(adapters.map(a=>a.articulatedRider.logicalFrames),[2,2]);
});
