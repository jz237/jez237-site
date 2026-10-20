import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceAdapter,latchNativeRaceAdapterControls,prepareNativeRaceAdapterFrame,completeNativeRaceAdapterFrame,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld,nativeRaceWorldSnapshot} from '../native-race-world.js';
import {createRaceWater,captureRaceWater} from '../race-water.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeHull} from '../native-hull.js';
import {createAuthoredNativeRider} from '../authored-native-rider.js';

const input=basePowerFactor=>({rawXNative:0,rawYNative:0,heldButtons:0x8000,...(basePowerFactor===undefined?{}:{basePowerFactor})});
function setup({beforeFrame=null,joints=[],sourceStates=[]}={}){
 const adapters=Array.from({length:4},(_,i)=>createNativeRaceAdapter({riderIndex:i,position:{x:i*6,y:0,z:0},
  computerProfile:i!==2,controlOrigin:i===2?'human':'ai',jointWorld:joints[i]??{x:i*6,y:1,z:0},sourceState:sourceStates[i]??{}}));
 const water=createRaceWater({crafts:[{x:12,z:0,heading:0}],baseAmplitudeNative:10,seed:17});
 const world=createNativeRaceWorld({adapters,water,humanIndices:[2],beforeFrame});
 return {adapters,water,world};
}

test('all navigation precedes descending input/61184, then every sampled control precedes all force preparations',()=>{
 const trace=[],joints=Array.from({length:4},(_,i)=>()=>{trace.push('prepare'+i);
  assert.ok(adapters.every(a=>a.controlState.heldButtons===0x8000));return {x:i*6,y:1,z:0};});
 const sourceStates=Array.from({length:4},(_,i)=>()=>{trace.push('source'+i);return {};});
 const {world,water,adapters}=setup({joints,sourceStates,beforeFrame:(w,c)=>{
  assert.deepEqual(c,{logicalFrame:0,time:0,step:.05});for(let i=0;i<4;i++)trace.push('navigation'+i);
 }});
 stepNativeRaceWorld(world,.05,adapters.map((a,i)=>()=>{trace.push('input'+i);return input(i===2?undefined:1.1);}));
 assert.deepEqual(trace,['navigation0','navigation1','navigation2','navigation3','input3','source3','input2','source2','input1','source1','input0','source0','prepare3','prepare2','prepare1','prepare0']);
 assert.equal(world.ticks,5);assert.equal(water.frames,1);assert.deepEqual(world.humanIndices,[2]);
 assert.ok(adapters.every(a=>a.sampledHullTick===null&&a.logicalFrames===1));
});

test('an explicit input latch consumes its history once and the force phase never repolls its provider',()=>{
 let calls=0;const a=createNativeRaceAdapter({jointWorld:{x:0,y:1,z:0}}),provider=()=>{calls++;return input();};
 latchNativeRaceAdapterControls(a,provider);assert.equal(a.sampledHullTick,0);assert.equal(a.controlState.heldButtons,0x8000);
 assert.equal(a.frame,null);assert.equal(a.hull.ticks,0);assert.equal(calls,1);
 assert.throws(()=>latchNativeRaceAdapterControls(a,provider),/already/);
 prepareNativeRaceAdapterFrame(a,provider);assert.equal(calls,1);assert.equal(a.sampledHullTick,null);
 assert.equal(a.lastControls.pressedButtons,0x8000);assert.throws(()=>latchNativeRaceAdapterControls(a,provider),/already/);
 stepNativeRaceAdapter(a,.05,provider);assert.equal(calls,1);
 stepNativeRaceAdapter(a,.01,provider);assert.equal(calls,2);assert.equal(a.lastControls.pressedButtons,0);
});

test('input and force callbacks cannot recursively sample, prepare or step their adapter',()=>{
 const a=createNativeRaceAdapter({jointWorld:()=>{
  for(const action of [()=>latchNativeRaceAdapterControls(a),()=>prepareNativeRaceAdapterFrame(a),()=>stepNativeRaceAdapter(a,.01)])
   assert.throws(action,/not reentrant/);
  return {x:0,y:1,z:0};
 }});
 let samples=0;latchNativeRaceAdapterControls(a,()=>{
  samples++;for(const action of [()=>latchNativeRaceAdapterControls(a,input()),()=>prepareNativeRaceAdapterFrame(a),()=>stepNativeRaceAdapter(a,.01)])
   assert.throws(action,/not reentrant/);
  return input();
 });
 prepareNativeRaceAdapterFrame(a);assert.equal(samples,1);assert.equal(a.hull.ticks,0);assert.equal(a.sampledHullTick,null);
 assert.equal(a.lastControls.pressedButtons,0x8000);assert.equal(a.lastControls.releasedButtons,0);
 stepNativeRaceAdapter(a,.05);assert.equal(a.hull.ticks,5);
 stepNativeRaceAdapter(a,.01,()=>{assert.throws(()=>stepNativeRaceAdapter(a,.01),/not reentrant/);return input();});
 assert.equal(a.hull.ticks,6);
});

test('deferred physical rider completion cannot recursively consume the same fifth-tick pose or start a next tick',()=>{
 const bundle=createAuthoredNativeRider({initialHull:createNativeHull()}),pose=bundle.riderPose;
 let solves=0;const a=createNativeRaceAdapter({...bundle,riderPose:(h,c)=>{
  solves++;assert.throws(()=>completeNativeRaceAdapterFrame(a),/not reentrant/);
  assert.throws(()=>stepNativeRaceAdapter(a,.01),/not reentrant/);return pose(h,c);
 }});
 stepNativeRaceAdapter(a,.05,{}, {deferFrameCompletion:true});assert.equal(solves,0);assert.equal(a.pendingFrameCompletion,true);
 completeNativeRaceAdapterFrame(a);assert.equal(solves,1);assert.equal(a.hull.ticks,5);assert.equal(a.pendingFrameCompletion,false);
 assert.equal(a.articulatedRider.logicalFrames,1);assert.throws(()=>completeNativeRaceAdapterFrame(a),/No deferred/);
});

test('failed force preparation retains an explicit input sample and permits repair without repeating button edges',()=>{
 let calls=0;const a=createNativeRaceAdapter(),before=nativeRaceSnapshot(a);
 latchNativeRaceAdapterControls(a,()=>{calls++;return {...input(),rawYNative:20};});const controls=structuredClone(a.controlState);
 assert.throws(()=>prepareNativeRaceAdapterFrame(a),/jointWorld/);
 assert.equal(a.sampledHullTick,0);assert.deepEqual(a.controlState,controls);assert.equal(calls,1);
 assert.deepEqual(a.actionState,before.source.actionState);assert.equal(a.hull.ticks,0);assert.equal(a.water.lastHullTick,null);
 prepareNativeRaceAdapterFrame(a,()=>{throw new Error('polled twice');},{jointWorld:{x:0,y:1,z:.2}});
 assert.equal(a.sampledHullTick,null);assert.equal(a.lastControls.pressedButtons,0x8000);assert.equal(calls,1);
});

test('implicit standalone preparation preserves atomic validation and a latched origin cannot change during force preparation',()=>{
 const a=createNativeRaceAdapter(),old=structuredClone(a.controlState);
 assert.throws(()=>prepareNativeRaceAdapterFrame(a,{...input(),rawYNative:20}),/jointWorld/);
 assert.deepEqual(a.controlState,old);assert.equal(a.sampledHullTick,null);assert.equal(a.lastControls,null);
 latchNativeRaceAdapterControls(a,input(.8),{controlOrigin:'ai'});
 assert.throws(()=>prepareNativeRaceAdapterFrame(a,{}, {controlOrigin:'human'}),/already latched/);
 assert.equal(a.sampledHullTick,0);prepareNativeRaceAdapterFrame(a);assert.equal(a.lastControls.controlOrigin,'ai');
});

test('navigation hooks and control latches do not run on pause, render-only or fractional calls without a physical tick',()=>{
 let navigation=0,samples=0;const {world}=setup({beforeFrame:()=>navigation++});
 const controls=world.adapters.map((a,i)=>()=>{samples++;return input(i===2?undefined:1);});
 for(let i=0;i<20;i++){stepNativeRaceWorld(world,0,controls);stepNativeRaceWorld(world,.5,controls,{active:false});}
 stepNativeRaceWorld(world,.009,controls);assert.equal(navigation,0);assert.equal(samples,0);
 stepNativeRaceWorld(world,.001,controls);assert.equal(navigation,1);assert.equal(samples,4);
 const before=nativeRaceWorldSnapshot(world);for(let i=0;i<20;i++)nativeRaceWorldSnapshot(world);
 assert.deepEqual(nativeRaceWorldSnapshot(world),before);
 stepNativeRaceWorld(world,.04,controls);assert.equal(navigation,1);assert.equal(samples,4);
 stepNativeRaceWorld(world,.01,controls);assert.equal(navigation,2);assert.equal(samples,8);
});

test('failed hook and already-sampled construction reject before reserving new ownership or taking hull ticks',()=>{
 const a=createNativeRaceAdapter(),b=createNativeRaceAdapter({position:{x:6,y:0,z:0}});
 const water=createRaceWater({crafts:[{x:0,z:0,heading:0}],baseAmplitudeNative:10,seed:17});latchNativeRaceAdapterControls(a);
 assert.throws(()=>createNativeRaceWorld({adapters:[b,a],water}),/completed-frame clock/);
 const world=createNativeRaceWorld({adapters:[b],water,beforeFrame:()=>{throw new Error('navigation failed');}});
 assert.throws(()=>stepNativeRaceWorld(world,.05,[{}]),/navigation failed/);assert.equal(world.ticks,0);assert.equal(b.lastControls,null);
 assert.equal(water.frames,0);assert.throws(()=>stepNativeRaceWorld(world,.05,[{}]),/faulted/);
});

test('mixed computer/human profiles and sampled source inputs retain identical physical clocks and histories at30/60/144Hz',()=>{
 let reference=null;
 for(const hz of [30,60,144]){
  let navigation=0;const {world,water}=setup({beforeFrame:()=>navigation++});
  const controls=world.adapters.map((a,i)=>(time,frame)=>({...input(i===2?undefined:1.2),rawXNative:frame%12<6?20:-20}));
  for(let i=0;i<hz*2;i++)stepNativeRaceWorld(world,1/hz,controls);
  const value={world:nativeRaceWorldSnapshot(world),water:captureRaceWater(water),navigation};
  assert.equal(navigation,40);assert.equal(world.ticks,200);assert.equal(world.frames,40);
  if(reference)assert.deepEqual(value,reference);else reference=structuredClone(value);
 }
});

test('prepared finish-wait advances once per native logical frame',()=>{
 // Native Championship is admitted now; its own launch owns the finish wait.
 assert.ok(createRace({mode:'championship',course:getCourse('greyhaven'),physics:'native'}).nativeLaunch.championshipLaunch);
 for(const hz of [30,60,144]){
  // Isolate the future wait branch using two already-supported native human
  // adapters. This prepared state does not enable championship or invent AI.
  const s=createRace({mode:'versus',course:getCourse('greyhaven'),physics:'native',waveSeed:17});
  s.mode='championship';s.phase='running';s.racers[0].finishTime=0;
  for(let i=0;i<hz*2;i++)stepRace(s,[{},{}],1/hz);
  assert.equal(s.time,2);assert.equal(s.nativeHost.world.frames,40);assert.equal(s.phase,'running');
  assert.ok(Math.abs(s.finishWait-2)<1e-12);assert.equal(s.racers[1].finishTime,null);
 }
});
