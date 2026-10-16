import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {nativeAIBodyFields} from '../native-ai-body-fields.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter,latchNativeRaceAdapterControls} from '../native-race-adapter.js';
import {createNativeHull} from '../native-hull.js';
import {createNativeLifecycleRider} from '../native-lifecycle-rider.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
import {stepNativeRaceHost} from '../native-race-host.js';
const F=Math.fround,base=(0x2938-0x1f94)/4;
const make=options=>createRace({mode:'time',physics:'native',course:getCourse('greyhaven'),...options});

test('AI body input reads solved motion, source controller gate and retained action owners',()=>{
 for(let rider=0;rider<4;rider++){
  let simulationState=3;
  const initialHull=createNativeHull({rider});
  const a=createNativeRaceAdapter({riderIndex:rider,...createNativeLifecycleRider({initialHull}),
   riderRecovery:{courseDatumNative:0,raceFinished:false},sourceState:()=>({simulationState})});
  assert.throws(()=>nativeAIBodyFields(a),/completed/);
  stepNativeRaceAdapter(a,.05,{throttle:0,steer:.5});
  const b=nativeAIBodyFields(a);
  assert.equal(b.priorControlActive,true);assert.equal(a.lastControls.throttle,false);
  for(const k of ['x','y','z']){
   assert.equal(b.positionNative[k],F(a.hull.center[k]/a.hull.scale));
   assert.equal(b.motionDirection[k],F(a.hull.motionDirection[k]));
   assert.equal(b.forwardNative[k],F(a.hull.frame.forward[k]));
   assert.equal(b.rightNative[k],F(a.hull.frame.right[k]));
  }
  assert.notDeepEqual(b.motionDirection,b.forwardNative);
  assert.equal(b.steeringDegrees,F(a.water.profile.steeringDegrees));
  assert.equal(b.frameSpeedNative,F(a.lastFrame.frameSpeedNative));
  assert.equal(b.actorState,a.riderLifecycle.state.actorState);
  assert.equal(b.pendingActorState,a.riderLifecycle.state.pendingActor);
  a.actionState.override=4;a.actionState.turnCount16d4=2;
  assert.equal(nativeAIBodyFields(a).action16f4,4);assert.equal(nativeAIBodyFields(a).actionState16d4,2);
  b.motionDirection.x=100;b.positionNative.x=100;
  assert.notEqual(nativeAIBodyFields(a).motionDirection.x,100);
  simulationState=1;stepNativeRaceAdapter(a,.05,{throttle:1});
  assert.equal(nativeAIBodyFields(a).priorControlActive,false);
  latchNativeRaceAdapterControls(a,{});
  assert.throws(()=>nativeAIBodyFields(a),/precede the next control latch/);
 }
});

test('ordinary AI tables share initialized source axes, endpoints and avatar links across classes',()=>{
 for(let difficulty=0;difficulty<4;difficulty++)for(const players of [1,2]){
  const runtime=createNativeRaceCourseRuntime({course:getCourse('greyhaven',difficulty),difficulty,players});
  for(const n of runtime.aiTargetTable.nodes){
   const source=runtime.data.nodes[n.sourceRow],words=runtime.data.recordWordsBySourceRow[n.sourceRow];
   assert.deepEqual(n.forwardXZ,source.forwardXZ);assert.deepEqual(n.passingDirectionXZ,source.rightXZ);
   assert.deepEqual(n.endpointPlusNativeXZ,source.endpointANativeXZ);
   assert.deepEqual(n.endpointMinusNativeXZ,source.endpointBNativeXZ);
   for(let avatar=0;avatar<4;avatar++){
    assert.equal(n.nextByAvatar[avatar],words[0xcc/4+avatar]);
    assert.equal(n.previousByAvatar[avatar],words[0xf4/4+avatar]);
   }
  }
 }
});

test('source navigation runs for both humans before descending device polls, including simulation0',()=>{
 const initial=make({mode:'versus'}).nativeLaunch.snapshot();
 Object.assign(initial.scene,{phase650:3,simulation648:0,activity624:0});
 const s=make({mode:'versus',nativeInitialRaceState:initial}),host=s.nativeHost,polls=[];
 const providers=[0,1].map(slot=>()=>{
  polls.push(slot);assert.equal(host.lastNavigation.diagnostics.length,2);
  assert.deepEqual(host.lastNavigation.diagnostics.map(d=>d.racerIndex),[0,1]);
  for(const d of host.lastNavigation.diagnostics){
   const row=host.raceRuntime.aiRecords()[d.racerIndex].navigationSourceRow;
   assert.ok(Number.isInteger(row));
   assert.equal(row,host.raceRuntime.snapshot().raceWords1f94[base+d.racerIndex*222+4]);
  }
  return {};
 });
 stepNativeRaceHost(host,.05,providers);assert.deepEqual(polls,[1,0]);assert.equal(host.world.ticks,0);
 const snapshot=s.nativeLaunch.snapshot(),last=host.lastNavigation;
 stepNativeRaceHost(host,.5,providers,{active:false});
 assert.deepEqual(s.nativeLaunch.snapshot(),snapshot);assert.equal(host.lastNavigation,last);assert.equal(polls.length,2);
});

test('navigation updates its canonical row atomically without awarding primary progress',()=>{
 const s=make({mode:'versus'}),runtime=s.nativeLaunch,host=s.nativeHost;
 const before=runtime.snapshot(),records=runtime.aiRecords(),nodes=host.primary.snapshot().map(n=>({
  sourceRow:n.sourceRow,x:n.position.x,z:n.position.z}));
 const bodies=host.world.adapters.map(a=>({avatar:a.hull.rider,position:{...a.hull.center}}));
 bodies[1].avatar=9;
 assert.throws(()=>runtime.advanceNavigation({bodiesBySlot:bodies,nodePositions:nodes}),/avatar/);
 assert.deepEqual(runtime.snapshot(),before);
 bodies[1].avatar=host.world.adapters[1].hull.rider;
 const result=runtime.advanceNavigation({bodiesBySlot:bodies,nodePositions:nodes}),after=runtime.snapshot();
 for(let i=0;i<after.raceWords1f94.length;i++)if(![base+4,base+222+4].includes(i))
  assert.equal(after.raceWords1f94[i],before.raceWords1f94[i]);
 assert.deepEqual(after.scene,before.scene);assert.deepEqual(after.hudWords7788,before.hudWords7788);
 assert.deepEqual(runtime.aiRecords().map(({navigationSourceRow,...r})=>r),records.map(({navigationSourceRow,...r})=>r));
 assert.equal(result.diagnostics.length,2);
});

test('live navigation history is independent of rendering frequency',()=>{
 let expected;
 for(const hz of [30,60,144]){
  const s=make();
  for(let i=0;i<hz;i++)stepRace(s,{throttle:1},1/hz);
  const value={records:s.nativeLaunch.aiRecords(),navigation:s.nativeHost.lastNavigation,water:s.raceWater.selectionMeshesNative};
  if(expected)assert.deepEqual(value,expected);else expected=structuredClone(value);
 }
});

test('source context overrides retained table only for main21 or versus mode1',()=>{
 for(const [mode,main638,accepted]of [['time',1,false],['time',21,true],['versus',1,true]]){
  const s=make({mode}),h=s.nativeHost,initial=s.nativeLaunch.snapshot();initial.scene.main638=main638;
  initial.raceWords1f94[base+212]=0x801b2f20;
  const players=mode==='versus'?2:1;
  const runtime=createNativeRaceLaunchRuntime({racers:structuredClone(s.racers),courseIndex:1,players,initialState:initial,
   course:s.course,courseRuntime:createNativeRaceCourseRuntime({course:s.course,difficulty:0,players})});
  const input={bodiesBySlot:h.world.adapters.map(a=>({avatar:a.hull.rider,position:a.hull.center})),
   nodePositions:h.primary.snapshot().map(n=>({sourceRow:n.sourceRow,x:n.position.x,z:n.position.z}))};
  if(accepted)assert.equal(runtime.advanceNavigation(input).diagnostics.length,s.racers.length);
  else assert.throws(()=>runtime.advanceNavigation(input),/retained primary table/);
  assert.equal(runtime.snapshot().raceWords1f94[base+212],0x801b2f20);
 }
});
