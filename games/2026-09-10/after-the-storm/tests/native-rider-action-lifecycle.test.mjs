import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRiderRecovery,decideNativeActorAfterHull,finishNativeActorPose,nativeRecoveryEffectValues} from '../native-rider-recovery.js';
import {createNativeHull} from '../native-hull.js';
import {createAuthoredNativeRider} from '../authored-native-rider.js';
import {createNativeRiderLifecycle,decideNativeRiderLifecycle,finishNativeRiderLifecycle,nativeRiderLifecycleSnapshot} from '../native-rider-lifecycle.js';

const F=Math.fround,v=(x=0,y=0,z=0)=>({x,y,z});
const impact=()=>({primaryBuoyImpactNative:0,fixedSphereImpactNative:0,racerImpactNative:0,
 shoreImpactNative:0,boxImpactNative:0,floorImpactNative:0,objectImpactNative:0,normal:v(1),markedBox:false});
const state=(extra={})=>createNativeRiderRecovery({riderIndex:0,hullDamping:Array(12).fill(F(.992)),...extra});
const action=(extra={})=>({state:{action16f4:0,idleFramesC6c:47,idleChoice16c4:-1,...extra.state},
 history:{gestureTick15f0:0,flag1600:0,sequence15f8:0,sequence15fa:0,...extra.history},
 tick:5,state650:3,gestureWindowNative:3,idleThresholdNative:100,rawYNative:0,
 workingXNative:0,workingYNative:0,heldButtonsB56:0,...extra,
 ...(extra.state?{state:{action16f4:0,idleFramesC6c:47,idleChoice16c4:-1,...extra.state}}:{}),
 ...(extra.history?{history:{gestureTick15f0:0,flag1600:0,sequence15f8:0,sequence15fa:0,...extra.history}}:{})});
const snapshot=(extra={})=>({simulationState:3,raceFinished:false,frameSpeedNative:30,wetCount:8,upY:1,
 manipulationAction:0,engineEnabled:true,frameForwardNative:v(0,0,1),physicalJoint2YNative:0,courseDatumNative:0,
 ...extra,impacts:{...impact(),...extra.impacts}});
const source=(extra={})=>({finished2c2c:0,record2c24:0,racerIndex:0,primaryRacerIndex:0,gameMode648:3,...extra});
const controls=(extra={})=>({rawYNative:0,workingXNative:0,workingYNative:0,heldButtons:0,
 directionMask:0,engineMask:0,throttle:false,pressedButtons:0,releasedButtons:0,...extra});
function make(extra={}){
 const hull=createNativeHull(),bundle=createAuthoredNativeRider({initialHull:hull});
 const lifecycle=createNativeRiderLifecycle({hull,rider:bundle.articulatedRider,courseDatumNative:0,...extra});
 return {hull,rider:bundle.articulatedRider,lifecycle};
}
function decide(lifecycle,{control=controls(),actions=action(),manipulationAction=0,...extra}={}){
 return decideNativeRiderLifecycle(lifecycle,{completedFrame:{frameSpeedNative:30,wetCount:8,impacts:impact(),...extra.completedFrame},
  simulationState:3,controls:control,manipulationAction,actionDispatch:actions,...extra});
}
const finish=(lifecycle,next,control=controls(),extra={},outcome={})=>finishNativeRiderLifecycle(lifecycle,
 {nextAnimationFrame:next,...outcome},control,source(extra));

test('request clearing uses actual race650 after upstream eligibility, independently of simulation state',()=>{
 const gated=decideNativeActorAfterHull(state(),snapshot({simulationState:3,actionDispatch:action({state:{action16f4:1},state650:2})}));
 assert.deepEqual(gated.actionWrites,{action16f4:0,idleFramesC6c:47,idleChoice16c4:-1});
 assert.equal(gated.actorRequest,null);assert.equal(gated.state.pendingActor,-1);
 const admitted=decideNativeActorAfterHull(state(),snapshot({simulationState:2,actionDispatch:action({state:{action16f4:1},state650:3})}));
 assert.deepEqual(admitted.actorRequest,{actorState:8,animationFrame:1,blend:F(.15),holdFrame:1});
 assert.deepEqual(admitted.actionWrites,{action16f4:0,idleFramesC6c:0,idleChoice16c4:-1});
 assert.equal(admitted.state.actorState,22);assert.equal(admitted.state.pendingActor,8);
 assert.equal('actorAuxState' in admitted.state,false,'idle counter has one adapter owner');
});

test('crash, stumble, selected actor and contact branches retain action word and precede any RNG read',()=>{
 const cases=[
  [{crashCountdown:2},{},0,47],[{crashCountdown:1},{},23,0],
  [{stumbleCountdown:2},{},0,47],[{stumbleCountdown:1},{},24,0],
  [{selectedActor:7,selectionCountdown:1},{},0,47],[{selectedActor:7,selectionCountdown:0},{},7,0],
  [{},{impacts:{shoreImpactNative:100}},0,47],[{},{impacts:{shoreImpactNative:5}},0,47],
  [{},{impacts:{primaryBuoyImpactNative:6}},0,47]
 ];
 for(const [s,q,actor,idle]of cases){
  let reads=0;const result=decideNativeActorAfterHull(state(s),snapshot({...q,actionDispatch:action({state:{action16f4:2},randomUnsigned32:()=>{reads++;return 0;}})}));
  assert.equal(result.actionWrites.action16f4,2);assert.equal(result.actionWrites.idleFramesC6c,idle);
  assert.equal(result.actorRequest?.actorState??0,actor);assert.equal(result.actionDispatch.eligible,false);assert.equal(reads,0);
 }
});

test('conditional idle draw runs once and immediate actor10 initialization resets the one idle counter',()=>{
 for(const [random,frame]of [[0,26],[1,26],[2,1],[0xffffffff,1]]){
  let reads=0;const a=action({state:{idleFramesC6c:100},randomUnsigned32:()=>{reads++;return random;}});
  const result=decideNativeActorAfterHull(state(),snapshot({frameSpeedNative:0,actionDispatch:a}));
  assert.equal(reads,1);assert.equal(result.state.actorState,10);assert.equal(result.state.animationFrame,frame);
  assert.deepEqual(result.actionWrites,{action16f4:0,idleFramesC6c:0,idleChoice16c4:random&3});
  assert.equal(result.actionDispatch.randomRead,true);
  const physical=nativeRecoveryEffectValues(result.effects[0]);
  assert.equal(physical.riderPhysicalMode,1);assert.equal(physical.riderJointTypes[2],1);
  assert.deepEqual([9,10,17,18].map(i=>physical.riderJointTypes[i]),[0,0,0,0]);
  assert.deepEqual([physical.riderJointTypes[6],physical.riderJointTypes[14]],[2,3]);
 }
 const noDraw=decideNativeActorAfterHull(state(),snapshot({frameSpeedNative:0,actionDispatch:action({state:{idleFramesC6c:99}})}));
 assert.equal(noDraw.actionWrites.idleFramesC6c,100);assert.equal(noDraw.actorRequest,null);
 const wrapped=decideNativeActorAfterHull(state(),snapshot({frameSpeedNative:0,actionDispatch:action({state:{idleFramesC6c:0x7fffffff}})}));
 assert.equal(wrapped.actionWrites.idleFramesC6c,-0x80000000);assert.equal(wrapped.actionDispatch.randomRead,false);
});

test('same-pending request clears action but never repeats initialization or idle reset',()=>{
 const initial=state({pendingActor:8,pendingAnimationFrame:1,blendProgress:F(.3),blendStep:F(.15)});
 const result=decideNativeActorAfterHull(initial,snapshot({actionDispatch:action({state:{action16f4:1}})}));
 assert.equal(result.actorRequest,null);assert.deepEqual(result.effects,[]);
 assert.equal(result.actionWrites.action16f4,0);assert.equal(result.actionWrites.idleFramesC6c,47);
 assert.equal(result.state.blendProgress,F(.3));
});

test('submarine actor25 entry precedes scene gates and its separate pre-pose return retains request word',()=>{
 const entry=decideNativeActorAfterHull(state(),snapshot({manipulationAction:3,
  actionDispatch:action({state:{action16f4:2},state650:1})}));
 assert.deepEqual(entry.actorRequest,{actorState:25,animationFrame:0,blend:F(.15),holdFrame:0});
 assert.equal(entry.actionWrites.action16f4,2);
 for(const manipulationAction of [0,1,3,4]){
  const result=decideNativeActorAfterHull(state({actorState:25,secondaryCounter:17}),snapshot({manipulationAction,
   actionDispatch:action({state:{action16f4:2}})}));
  assert.equal(result.actorRequest?.actorState??null,manipulationAction===0?22:null);
  assert.equal(result.state.secondaryCounter,manipulationAction===0?-1:17);
  assert.equal(result.actionWrites.idleFramesC6c,manipulationAction===0?0:47);
  assert.equal(result.actionWrites.action16f4,2);
 }
});

test('real physical points receive action initialization only when held blend actually completes',()=>{
 const {hull,rider,lifecycle}=make(),positions=rider.points.map(p=>({...p.position})),hullPositions=hull.points.map(p=>({...p.position}));
 let writes=action({state:{action16f4:1}}).state;
 for(let frame=0;frame<6;frame++){
  const d=decide(lifecycle,{actions:action({state:writes})});writes=d.actionWrites;
  const completed=finish(lifecycle,30,controls({rawYNative:70}),{}, {pendingNextAnimationFrame:31});
  assert.deepEqual(completed.actionWrites,{},'blend initialization is not another actor request');
  assert.equal(lifecycle.state.actorState,frame===5?8:22);
  assert.equal(lifecycle.physicalMode,frame===5?0:1);
  if(frame<5)assert.ok(rider.points.every(p=>p.type===1));
 }
 assert.equal(lifecycle.state.animationFrame,1,'pending hold keeps source initial frame');
 assert.deepEqual([2,6,7,14,15].map(i=>rider.points[i].type),[0,0,0,0,0]);
 assert.equal(rider.points[9].type,1);assert.deepEqual(rider.points.map(p=>p.position),positions);
 assert.deepEqual(hull.points.map(p=>p.position),hullPositions);
 decide(lifecycle);finish(lifecycle,31,controls({rawYNative:35}));
 assert.equal(lifecycle.state.animationFrame,1,'raw-Y hold runs only after active blend ends');
});

test('actor9 patches actual grips, uses raw direction history and retains frame46 only under strict hold inputs',()=>{
 const {rider,lifecycle}=make({state:{riderIndex:0,hullDamping:Array(12).fill(F(.992)),actorState:9,animationFrame:24}});
 decide(lifecycle);finish(lifecycle,25,controls({directionMask:0}));
 assert.equal(lifecycle.state.animationFrame,62);assert.deepEqual([rider.points[6].type,rider.points[14].type],[3,2]);
 assert.deepEqual(lifecycle.lastEffects.map(e=>e.kind),['updateRiderPhysicalState','actionPoseCue']);
 decide(lifecycle);finish(lifecycle,46,controls({rawYNative:-35}));
 assert.equal(lifecycle.state.animationFrame,62);
 decide(lifecycle);finish(lifecycle,46,controls({rawYNative:-35}),{finished2c2c:-1});
 assert.equal(lifecycle.state.animationFrame,46,'nonzero signed finished word disables hold');
 decide(lifecycle);finish(lifecycle,60);assert.deepEqual([rider.points[6].type,rider.points[14].type],[1,1]);
 decide(lifecycle);finish(lifecycle,84);assert.deepEqual([rider.points[6].type,rider.points[14].type],[2,3]);
});

test('actor17 changes physicalMode without actor change and real types survive the raw-Y hold',()=>{
 const setup={state:{riderIndex:0,hullDamping:Array(12).fill(F(.992)),actorState:17,animationFrame:22},physicalMode:0};
 const {rider,lifecycle}=make(setup);rider.points.forEach(p=>{p.type=0;});
 decide(lifecycle);finish(lifecycle,23);assert.equal(lifecycle.physicalMode,1);
 assert.deepEqual([rider.points[2].type,rider.points[6].type,rider.points[14].type,rider.points[18].type],[1,2,3,0]);
 const held=rider.points.map(p=>p.type);
 decide(lifecycle);finish(lifecycle,24,controls({rawYNative:35}));
 assert.equal(lifecycle.state.animationFrame,23);assert.equal(lifecycle.physicalMode,1);assert.deepEqual(rider.points.map(p=>p.type),held);
 decide(lifecycle);finish(lifecycle,24,controls({rawYNative:-36}));
 assert.equal(lifecycle.state.animationFrame,40);assert.equal(lifecycle.physicalMode,0);assert.ok(rider.points.every(p=>p.type===0));
 assert.equal(lifecycle.state.actorState,17);
});

test('post-pose requests return one adapter idle reset, while held pose/cue reads consume no random state',()=>{
 const {lifecycle}=make({state:{riderIndex:0,hullDamping:Array(12).fill(F(.992)),actorState:10,animationFrame:26}});
 decide(lifecycle);const result=finish(lifecycle,27,controls({heldButtons:1}));
 assert.deepEqual(result.actionWrites,{idleFramesC6c:0});assert.equal(result.state.animationFrame,27);assert.equal(result.state.pendingActor,22);
 const actionState=state({actorState:8,animationFrame:30}),d=decideNativeActorAfterHull(actionState,snapshot());
 const ended=finishNativeActorPose(d.state,{nextAnimationFrame:-1,pressedButtons:0,releasedButtons:0},
  {physicalMode:0,poseCompletion:{}});
 assert.equal(ended.state.animationFrame,30);assert.equal(ended.state.pendingActor,22);
 assert.deepEqual(ended.actionWrites,{idleFramesC6c:0});
 assert.equal('actionWrites' in finishNativeActorPose(decideNativeActorAfterHull(state(),snapshot()).state,
  {nextAnimationFrame:0,pressedButtons:0,releasedButtons:0}),false,'legacy preview retains its existing API');
});

test('enabled source data validates before physical writes; no history, scene or RNG defaults are invented',()=>{
 const {hull,rider,lifecycle}=make(),before=nativeRiderLifecycleSnapshot(lifecycle),types=rider.points.map(p=>p.type),points=hull.points.map(p=>({...p.position}));
 assert.throws(()=>decide(lifecycle,{actions:action({state650:undefined})}),/state650/);
 assert.throws(()=>decide(lifecycle,{actions:action(),control:controls({engineMask:undefined})}),/engineMaskC66/);
 assert.throws(()=>decide(lifecycle,{actions:action({state:{idleFramesC6c:101}}),completedFrame:{frameSpeedNative:0,wetCount:8,impacts:impact()}}),/shared randomUnsigned32/);
 assert.deepEqual(nativeRiderLifecycleSnapshot(lifecycle),before);assert.deepEqual(rider.points.map(p=>p.type),types);assert.deepEqual(hull.points.map(p=>p.position),points);
 assert.throws(()=>createNativeRiderRecovery({...before.state,actorAuxState:3}),/Unknown recovery state field/);
 const inactive=decideNativeActorAfterHull(state(),{simulationState:0,actionDispatch:action({state:{action16f4:1},randomUnsigned32:()=>{throw Error('unexpected RNG');}})});
 assert.equal(inactive.skipped,true);assert.equal(inactive.actionWrites.action16f4,1);assert.equal(inactive.state.lifecycleFrame,0);
});

test('completion source snapshot is atomic and actor17 restore explicitly carries actual physicalMode',()=>{
 const {rider,lifecycle}=make({state:{riderIndex:0,hullDamping:Array(12).fill(F(.992)),actorState:17,animationFrame:22},physicalMode:0});
 decide(lifecycle);const before=rider.points.map(p=>p.type);
 assert.throws(()=>finish(lifecycle,23,controls(),{gameMode648:undefined}),/gameMode648/);
 assert.deepEqual(rider.points.map(p=>p.type),before);assert.equal(lifecycle.state.phase,'pose');
 const result=finish(lifecycle,23);assert.equal(result.state.phase,'ready');
 assert.throws(()=>finish(lifecycle,24),/phase pose/);
 const saved=nativeRiderLifecycleSnapshot(lifecycle);
 assert.throws(()=>make({state:saved.state}),/actual physicalMode/);
 const restored=make({state:saved.state,physicalMode:saved.physicalMode});
 assert.equal(restored.lifecycle.physicalMode,1);assert.equal(restored.lifecycle.state.actorState,17);
});

test('active blend restore requires actual mode instead of inferring actor8 mode0 after actor-1 initialization',()=>{
 for(const [actorState,pendingActor]of [[8,22],[22,8]]){
  const hull=createNativeHull(),bundle=createAuthoredNativeRider({initialHull:hull}),rider=bundle.articulatedRider;
  // Prepared source53eac/53c08(-1) state: actual types/mode are those of the
  // blend initializer, while the old current actor number is retained.
  rider.points.forEach(p=>{p.type=1;});
  const saved=state({actorState,animationFrame:30,pendingActor,pendingAnimationFrame:1,
   blendProgress:F(.15),blendStep:F(.15),holdFrame:1});
  const options={hull,rider,courseDatumNative:0,state:saved};
  assert.throws(()=>createNativeRiderLifecycle(options),/active rider blend.*actual physicalMode/);
  assert.ok(rider.points.every(p=>p.type===1));
  const lifecycle=createNativeRiderLifecycle({...options,physicalMode:1});
  assert.equal(lifecycle.physicalMode,1);assert.equal(lifecycle.state.actorState,actorState);
  decide(lifecycle);finish(lifecycle,31,controls({rawYNative:70}),{}, {pendingNextAnimationFrame:2});
  assert.equal(lifecycle.state.blendProgress,F(.3));assert.equal(lifecycle.physicalMode,1);
  assert.ok(rider.points.every(p=>p.type===1));
  assert.equal(nativeRiderLifecycleSnapshot(lifecycle).physicalMode,1);
 }
});
