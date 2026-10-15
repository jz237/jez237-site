import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHull} from '../native-hull.js';
import {createNativeLifecycleRider} from '../native-lifecycle-rider.js';
import {createNativeRiderRecovery} from '../native-rider-recovery.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
import {createRaceWater,captureRaceWater} from '../race-water.js';
import {createNativeRaceAdapter,latchNativeRaceAdapterControls,prepareNativeRaceAdapterFrame,
 completeNativeRaceAdapterFrame,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';

const v=(x=0,y=0,z=0)=>({x,y,z});
// Explicit authored fixtures, not a claim about source cold-start/reset state.
const history=()=>({gestureTick15f0:0,flag1600:0,sequence15f8:0,sequence15fa:0,
 lastPressedDirections15fc:0,quietFrames15fe:0});
const source=()=>({state650:3,gestureWindowNative:3,idleThresholdNative:1000,
 poseCompletion:{finished2c2c:0,record2c24:0,racerIndex:0,primaryRacerIndex:0,gameMode648:4}});
function make({hullOptions={},actions={},recovery={},...options}={}){
 const initialHull=createNativeHull(hullOptions),bundle=createNativeLifecycleRider({initialHull}),poses=[];
 let anchors=0;
 const riderPose=(h,c)=>{
  const pose=bundle.riderPose(h,c);
  poses.push({logicalFrame:c.logicalFrame,actor:c.actorState,request:structuredClone(c.poseRequest),
   outcome:{...pose.animationOutcome},idleChoice:c.actionPoseState?.idleChoice16c4,
   targets:pose.targets.map(p=>({...p}))});
  return {...pose,resolveAnchors(args){anchors++;return pose.resolveAnchors(args);}};
 };
 const a=createNativeRaceAdapter({...hullOptions,...bundle,riderPose,
  riderRecovery:{courseDatumNative:0,...recovery},
  riderActions:{inputHistory:history(),idleFramesC6c:0,idleChoice16c4:0,source:source(),...actions},...options});
 return {a,bundle,poses,get anchors(){return anchors;}};
}
const current=a=>({control:structuredClone(a.controlState),history:structuredClone(a.riderActions?.inputHistory),
 action:structuredClone(a.actionState),idle:a.riderActions?.idleFramesC6c,rider:structuredClone(a.riderControlState),
 snapshot:nativeRaceSnapshot(a),sampled:a.sampledHullTick,prepared:a.preparedHullTick});

test('additional actions require explicit retained history/scene context and one direction-mask owner',()=>{
 assert.throws(()=>createNativeRaceAdapter({riderActions:{}}),/physical rider lifecycle/);
 for(const actions of [
  {inputHistory:undefined},{inputHistory:{...history(),directionMask15f6:0}},
  {inputHistory:{...history(),quietFrames15fe:-1}},{idleFramesC6c:0x80000000},
  {source:{...source(),state650:undefined}},{source:{...source(),randomUnsigned32:1}},
  {source:{...source(),poseCompletion:{...source().poseCompletion,racerIndex:4}}},
  {source:{...source(),poseCompletion:{...source().poseCompletion,record2c24:0x80000000}}}
 ])assert.throws(()=>make({actions}));
 const {a}=make({actions:{source:{...source(),poseCompletion:{...source().poseCompletion,finished2c2c:-1,record2c24:-2}}}});
 assert.equal(Object.hasOwn(a.riderActions.inputHistory,'directionMask15f6'),false);
 assert.equal(a.lastFrame.riderActions.inputHistory.directionMask15f6,a.controlState.directionMask);
});

test('explicit latch captures gesture history, request word and source once across a failed preparation',()=>{
 let inputCalls=0,sourceCalls=0;
 const built=make({actions:{inputHistory:{...history(),gestureTick15f0:999},source:()=>{sourceCalls++;return source();}}}),{a}=built;
 latchNativeRaceAdapterControls(a,()=>{inputCalls++;return {rawYNative:-15,action16f4:2};});
 assert.equal(inputCalls,1);assert.equal(sourceCalls,1);assert.equal(a.sampledHullTick,0);
 assert.equal(a.lastControls.preCurveYNative,-15);assert.ok(a.lastControls.workingYNative> -14);
 assert.equal(a.riderActions.inputHistory.gestureTick15f0,0,'history uses pre-curve negativeY, not the later human curve');
 assert.equal(a.actionState.override,2);assert.equal(a.articulatedRider.logicalFrames,0);
 const captured=current(a);
 assert.throws(()=>prepareNativeRaceAdapterFrame(a,()=>{throw new Error('repolled input');},{riderPose:3}),/riderPose/);
 assert.deepEqual(current(a),captured);assert.equal(sourceCalls,1);
 prepareNativeRaceAdapterFrame(a,()=>{throw new Error('repolled input');});
 assert.equal(a.sampledHullTick,null);assert.equal(inputCalls,1);assert.equal(sourceCalls,1);
 stepNativeRaceAdapter(a,.05,()=>{throw new Error('repolled input');});
 assert.equal(a.actionState.override,0);assert.equal(a.riderLifecycle.state.pendingActor,9);
 assert.equal(a.articulatedRider.logicalFrames,1);assert.equal(built.anchors,1);
 const paused=current(a);
 for(let i=0;i<5;i++){nativeRaceSnapshot(a);stepNativeRaceAdapter(a,0,()=>{throw new Error('paused input');});}
 assert.deepEqual(current(a),paused);assert.equal(sourceCalls,1);
});

test('implicit preparation validates controls, source and pose before committing either input history',()=>{
 let calls=0;
 const {a}=make({actions:{source:()=>{calls++;return source();}}}),before=current(a);
 assert.throws(()=>prepareNativeRaceAdapterFrame(a,{rawYNative:-70,action16f4:1},{riderPose:3}),/riderPose/);
 assert.deepEqual(current(a),before);assert.equal(calls,1);assert.equal(a.frame,null);
 prepareNativeRaceAdapterFrame(a,{rawYNative:-70,action16f4:1});
 assert.equal(calls,2);assert.equal(a.riderActions.inputHistory.gestureTick15f0,0);assert.equal(a.controlState.directionMask,0x400);
 assert.equal(a.actionState.override,1);assert.equal(a.preparedHullTick,0);
});

test('malformed captured source and conflicting action-word writers reject atomically at input latch',()=>{
 for(const [input,options]of [
  [{action16f4:-1},{}],[{action16f4:65536},{}],[{action16f4:1.5},{}],
  [{action16f4:undefined},{}],[{action16f4:true},{}],
  [{action16f4:1},{sourceState:{actionState:{override:2}}}]
 ]){
  const {a}=make(),before=current(a);
  assert.throws(()=>latchNativeRaceAdapterControls(a,input,options),/action16f4/);assert.deepEqual(current(a),before);
 }
 let malformed=true;
 const {a}=make({actions:{source:()=>({...source(),poseCompletion:{...source().poseCompletion,gameMode648:malformed?null:4}})}}),before=current(a);
 assert.throws(()=>latchNativeRaceAdapterControls(a,{rawXNative:70}),/gameMode648/);assert.deepEqual(current(a),before);
 malformed=false;latchNativeRaceAdapterControls(a,{action16f4:1},{sourceState:{actionState:{override:1}}});
 assert.equal(a.actionState.override,1);assert.equal(a.sampledHullTick,0);
});

test('raw gesture sequence retains one15f6 history across human/AI takeover and scene-gated requests',()=>{
 const {a}=make({actions:{source:{...source(),state650:0}}});
 const moves=[[70,0],[0,-70],[-70,0],[0,70]];
 for(let i=0;i<moves.length;i++){
  const [rawXNative,rawYNative]=moves[i],ai=i%2===1;
  stepNativeRaceAdapter(a,.05,{rawXNative,rawYNative,...(ai?{basePowerFactor:1}:{})},{controlOrigin:ai?'ai':'human'});
 }
 assert.equal(a.riderActions.inputHistory.sequence15fa,4);assert.equal(a.riderActions.inputHistory.sequence15f8,0);
 assert.equal(a.riderActions.inputHistory.lastPressedDirections15fc,0x800);assert.equal(a.riderActions.inputHistory.quietFrames15fe,0);
 assert.equal(a.controlState.directionMask,0x800);assert.equal(a.lastFrame.riderActions.inputHistory.directionMask15f6,0x800);
 assert.equal(a.riderLifecycle.state.pendingActor,-1);assert.equal(a.actionState.override,0);
 assert.equal(a.articulatedRider.logicalFrames,4);assert.equal(a.controlState.tick,3);
});

test('an explicit shared source clock preserves retained gesture epochs and unsigned wrap',()=>{
 for(const [gestureTick15f0,sourceTick,pending]of [[1000,1002,8],[1000,1003,-1],[0xffffffff,0,8]]){
  let reads=0;
  const {a}=make({sourceState:()=>{reads++;return {sourceTick};},actions:{inputHistory:{...history(),gestureTick15f0}}});
  latchNativeRaceAdapterControls(a,{rawYNative:70});prepareNativeRaceAdapterFrame(a,{});stepNativeRaceAdapter(a,.05,{});
  assert.equal(reads,1);assert.equal(a.lastControls.state.tick,sourceTick);assert.equal(a.controlState.gestureTicks.positiveY,sourceTick);
  assert.equal(a.riderLifecycle.state.pendingActor,pending);
 }
 const {a}=make({hullOptions:{position:v(0,10),velocity:v(0,0,25)},surface:-100,
  sourceState:(h,c)=>({sourceTick:2000+2*c.logicalFrame})});
 stepNativeRaceAdapter(a,.05,{rawXNative:-70,heldButtons:0x8000});
 prepareNativeRaceAdapterFrame(a,{rawXNative:70,heldButtons:0x8000});
 assert.equal(a.lastControls.state.tick,2002);assert.equal(a.actionState.action,1,'pre-hull manipulation uses the same source clock as its gesture stamps');
 for(const sourceTick of [-1,0x100000000,1.5,undefined]){
  const {a:invalid}=make(),before=current(invalid);
  assert.throws(()=>latchNativeRaceAdapterControls(invalid,{}, {sourceState:{sourceTick}}),/sourceTick/);
  assert.deepEqual(current(invalid),before);
 }
});

test('transported manipulation requests share16f4 and reset only a newly entered arc',()=>{
 for(const [word,raw,action]of [[3,{rawXNative:-70},2],[4,{rawXNative:70},1],[5,{rawYNative:-70},4]]){
  const built=make({hullOptions:{position:v(0,10),velocity:v(0,0,25)},surface:-100,
   sourceState:{actionState:{turnCount16d4:7,noWetNoContactFrames:8,field15ecBits:0xdeadbeef,field16e8:55,field16ec:99}}}),{a}=built;
  stepNativeRaceAdapter(a,.05,{action16f4:word,heldButtons:0x8000});
  assert.equal(a.actionState.override,word,'wet/ineligible pre-hull request is retained');assert.equal(a.water.wetCount,0);
  prepareNativeRaceAdapterFrame(a,{...raw,action16f4:word,heldButtons:0x8000});
  assert.equal(a.actionState.action,action);assert.equal(a.actionState.override,0);assert.equal(a.frame.action.entered,true);
  assert.equal(a.actionState.turnCount16d4,0);assert.equal(a.actionState.noWetNoContactFrames,0);
  assert.equal(a.actionState.field15ecBits,0);assert.equal(a.actionState.field16e8,3);assert.equal(a.actionState.field16ec,0);
  assert.equal(a.actionState.arcActive,true);assert.equal(a.frame.prepared.jetStraight,false);
  stepNativeRaceAdapter(a,.05,{});assert.equal(a.actionState.noWetNoContactFrames,1);assert.equal(built.anchors,2);
 }
 const a=createNativeRaceAdapter({position:v(0,10),velocity:v(0,0,25),surface:-100,
  sourceState:{actionState:{arcActive:true,turnCount16d4:9,noWetNoContactFrames:10,field15ecBits:77}}});
 stepNativeRaceAdapter(a,.05,{heldButtons:0x8000});prepareNativeRaceAdapterFrame(a,{rawXNative:70,heldButtons:0x8000,action16f4:4});
 assert.equal(a.actionState.action,1);assert.equal(a.actionState.turnCount16d4,9);
 assert.equal(a.actionState.noWetNoContactFrames,11);assert.equal(a.actionState.field15ecBits,77);
});

test('actual frame preparation counts inversion sign changes and completed dry frames wrap signed32',()=>{
 const a=createNativeRaceAdapter({roll:Math.PI,sourceState:{actionState:{turnCount16d4:0x7fffffff}}});
 prepareNativeRaceAdapterFrame(a,{});assert.equal(a.actionState.turnCount16d4,-0x80000000);
 assert.equal(a.actionState.upsideDown16f0,1);assert.equal(a.actionState.previousUpsideDown16f2,0);
 const b=createNativeRaceAdapter({roll:Math.PI,sourceState:{actorState:8,actionState:{turnCount16d4:7}}});
 prepareNativeRaceAdapterFrame(b,{});assert.equal(b.actionState.turnCount16d4,7);assert.equal(b.actionState.upsideDown16f0,1);
 const c=createNativeRaceAdapter({position:v(0,10),surface:-100,sourceState:{actionState:{noWetNoContactFrames:0x7fffffff}}});
 stepNativeRaceAdapter(c,.05,{});assert.equal(c.actionState.noWetNoContactFrames,-0x80000000);
 const d=createNativeRaceAdapter({sourceState:{actionState:{action:1,actionMagnitudeNative:.72,arcActive:true,noWetNoContactFrames:-1}}});
 d.lastFrame.contacts.floorImpactNative=1;prepareNativeRaceAdapterFrame(d,{rawXNative:70,heldButtons:0x8000});
 assert.equal(d.actionState.action,1,'signed wrapped counter does not satisfy source >5 landing gate');
});

test('idle consumes the actual shared RNG once, applies actor10 and resets C6c before its physical pose',()=>{
 let draws=0;
 const built=make({actions:{idleFramesC6c:100,idleChoice16c4:3,source:{...source(),idleThresholdNative:100,
  randomUnsigned32:()=>{draws++;return 0xabcdef01;}}}}),{a}=built;
 stepNativeRaceAdapter(a,.05,{});
 assert.equal(draws,1);assert.equal(a.riderLifecycle.state.actorState,10);assert.equal(a.riderActions.idleChoice16c4,1);
 assert.equal(a.riderActions.idleFramesC6c,0);assert.equal(built.poses[0].idleChoice,1);
 assert.equal(built.poses[0].request.animationFrame,26);assert.equal(a.riderLifecycle.state.animationFrame,27);
 assert.equal(a.articulatedRider.points[6].type,2);assert.equal(a.articulatedRider.points[14].type,3);
 for(const i of [9,10,17,18])assert.equal(a.articulatedRider.points[i].type,0);
 stepNativeRaceAdapter(a,.05,{heldButtons:1});
 assert.equal(draws,1);assert.equal(a.riderLifecycle.state.pendingActor,22);assert.equal(a.riderActions.idleFramesC6c,0);
 assert.equal(a.articulatedRider.logicalFrames,2);assert.equal(built.anchors,2);
 const snapshot=nativeRaceSnapshot(a);snapshot.source.riderActions.inputHistory.flag1600=999;
 snapshot.source.riderActions.idleFramesC6c=999;assert.notEqual(a.lastFrame.riderActions.inputHistory.flag1600,999);
 assert.notEqual(a.riderActions.idleFramesC6c,999);
});

test('higher-priority recovery skips idle RNG while its successful common request resets the shared counter',()=>{
 let draws=0;
 const state=createNativeRiderRecovery({riderIndex:0,hullDamping:Array(12).fill(Math.fround(.999)),selectedActor:24,selectionCountdown:0});
 const {a}=make({recovery:{state},actions:{idleFramesC6c:101,source:{...source(),idleThresholdNative:100,randomUnsigned32:()=>{draws++;return 0;}}}});
 stepNativeRaceAdapter(a,.05,{});assert.equal(draws,0);assert.equal(a.riderLifecycle.state.pendingActor,24);
 assert.equal(a.riderActions.idleFramesC6c,0);assert.equal(a.articulatedRider.logicalFrames,1);
});

test('input/source/RNG callbacks cannot reenter an adapter or advance physical work twice',()=>{
 let a,blocked=0;
 ({a}=make({actions:{idleFramesC6c:100,source:()=>{
  assert.throws(()=>prepareNativeRaceAdapterFrame(a,{}),/reentrant/);blocked++;
  return {...source(),idleThresholdNative:100,randomUnsigned32:()=>{
   assert.throws(()=>stepNativeRaceAdapter(a,.05,{}),/reentrant/);blocked++;return 0;
  }};
 }}}));
 stepNativeRaceAdapter(a,.05,()=>{assert.throws(()=>latchNativeRaceAdapterControls(a,{}),/reentrant/);blocked++;return {};});
 assert.equal(blocked,3);assert.equal(a.logicalFrames,1);assert.equal(a.articulatedRider.logicalFrames,1);
 assert.equal(a.riderLifecycle.state.actorState,10);
});

test('deferred world completion does not dispatch or evaluate an action until all five hull ticks finish',()=>{
 const built=make(),{a}=built;
 latchNativeRaceAdapterControls(a,{action16f4:1});prepareNativeRaceAdapterFrame(a,{});
 stepNativeRaceAdapter(a,.05,{}, {deferFrameCompletion:true});
 assert.equal(a.hull.ticks,5);assert.equal(a.actionState.override,1);assert.equal(a.logicalFrames,0);
 assert.equal(a.articulatedRider.logicalFrames,0);assert.equal(built.poses.length,0);
 completeNativeRaceAdapterFrame(a);assert.equal(a.actionState.override,0);assert.equal(a.riderLifecycle.state.pendingActor,8);
 assert.equal(a.articulatedRider.logicalFrames,1);assert.equal(built.poses.length,1);assert.equal(built.anchors,1);
 assert.throws(()=>completeNativeRaceAdapterFrame(a),/No deferred/);
});

test('four physical action riders share descending input/completion and RNG order at30/60/144Hz',()=>{
 let reference;
 for(const hz of [30,60,144]){
  const trace=[],draws=[],seen=[new Set(),new Set(),new Set(),new Set()];let clock=5000;
  const built=Array.from({length:4},(_,i)=>make({hullOptions:{position:v(i*8)},controlOrigin:i===0?'human':'ai',
   sourceState:()=>{trace.push(`clock${i}:${clock}`);return {sourceTick:clock};},
   actions:{inputHistory:{...history(),gestureTick15f0:4000},idleFramesC6c:i===3?100:0,source:{...source(),
    idleThresholdNative:i===3?100:1000,randomUnsigned32:()=>{draws.push({i,clock});return 2;},
    poseCompletion:{...source().poseCompletion,racerIndex:i}}}}));
  const adapters=built.map(b=>b.a),water=createRaceWater({crafts:[{x:0,z:0,heading:0}],baseAmplitudeNative:0,seed:17});
  const world=createNativeRaceWorld({adapters,water,humanIndices:[0],craftContacts:false,
   beforeFrame:(w,c)=>{clock=5000+c.logicalFrame;trace.push(`before:${clock}`);},
   afterFrame:()=>adapters.forEach((a,i)=>seen[i].add(a.lastFrame.actorState))});
  const words=[1,2,9,0],inputs=adapters.map((a,i)=>(time,frame)=>{
   trace.push(`input${i}:${clock}`);
   return {rawXNative:0,rawYNative:0,heldButtons:0,...(i?{basePowerFactor:1}:{}),...(frame===0?{action16f4:words[i]}:{})};
  });
  for(let frame=0;frame<4*hz;frame++){
   stepNativeRaceWorld(world,1/hz,inputs);
   if(frame%7===0){
    const before=trace.length;stepNativeRaceWorld(world,1/hz,inputs,{active:false});
    adapters.forEach(nativeRaceSnapshot);assert.equal(trace.length,before,'pause/render cannot poll inputs or RNG');
   }
  }
  assert.equal(world.ticks,400);assert.equal(world.frames,80);assert.equal(water.frames,80);
  assert.deepEqual(draws,[{i:3,clock:5000}]);
  for(const [i,actor]of [8,9,17,10].entries()){
   assert.ok(seen[i].has(actor),`rider${i} actually entered${actor}`);assert.ok(seen[i].has(22));
   assert.equal(adapters[i].articulatedRider.logicalFrames,80);assert.equal(built[i].anchors,80);assert.equal(built[i].poses.length,80);
   assert.ok(adapters[i].articulatedRider.points.every(p=>['x','y','z'].every(k=>Number.isFinite(p.position[k]))));
  }
  assert.deepEqual(trace.slice(0,9),['before:5000','input3:5000','clock3:5000','input2:5000','clock2:5000','input1:5000','clock1:5000','input0:5000','clock0:5000']);
  const result={trace,draws,seen:seen.map(s=>[...s]),water:captureRaceWater(water),
   snapshots:adapters.map(a=>{const {remainder,...snapshot}=nativeRaceSnapshot(a);return snapshot;}),
   riders:adapters.map(a=>structuredClone(a.articulatedRider))};
  if(reference)assert.deepEqual(result,reference);else reference=result;
 }
});
