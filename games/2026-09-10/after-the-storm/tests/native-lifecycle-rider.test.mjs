import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHull} from '../native-hull.js';
import {createNativeLifecycleRider} from '../native-lifecycle-rider.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter} from '../native-race-adapter.js';

// Prepared qualified-impact fixtures, with independently authored rider/rest
// geometry. They exercise the real hull, auxiliary and nineteen-point solves.
// The contact reports below are synthetic inputs, not claimed source collision
// trajectories or evidence that the authored geometry matches original assets.
// No position, physical joint, animation frame, actor or progress is injected.
const F=Math.fround,AXES=['x','y','z'],vec=(x=0,y=0,z=0)=>({x,y,z});
const ORDINARY=[1,1,1,1,1,1,2,1,1,4,4,1,1,1,3,1,1,4,4];
const RECOVERY=[0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0];
const STUMBLE=[0,0,5,5,0,0,2,5,0,0,0,5,0,0,3,5,0,0,0];
const copy=p=>({...p});
function physical(points){return points.map(p=>({position:copy(p.position),storedDelta:copy(p.storedDelta)}));}
function harness({riderIndex=0,incomingNative=12,inactive=()=>false}={}){
 const initialHull=createNativeHull({rider:riderIndex}),bundle=createNativeLifecycleRider({initialHull});
 const adapter=createNativeRaceAdapter({riderIndex,...bundle,riderRecovery:{courseDatumNative:0},
  sourceState:(h,c)=>({simulationState:inactive(c.logicalFrame)?0:3}),
  contacts:{racingBuoys:(h,c)=>{
   // Report at the end of the first already-running hull frame. Racer impact
   // has its own source threshold, independent of the completed speed gate.
   if(c.logicalFrame===0&&c.substep===4)c.recordImpact({channel:'racer',incomingNative,normal:vec(1,0,0)});
  }}});
 const savedDamping=adapter.hull.points.map(p=>p.damping);
 assert.deepEqual(savedDamping,adapter.riderLifecycle.state.hullDamping);
 assert.ok(savedDamping.every(value=>value===F(value)),'backup and actual initial coefficients are the same float32 stores');
 return {adapter,bundle,savedDamping,inactive};
}
function advance(h){
 const {adapter:a,bundle}=h,frame=a.logicalFrames;
 const before={state:a.riderLifecycle.state,jointNativeY:a.articulatedRider.jointWorld.y/a.hull.scale,
  body:physical(a.articulatedRider.points),auxiliary:physical(bundle.anchorState.points)};
 stepNativeRaceAdapter(a,.05,{heldButtons:0x8000});
 const record={frame,active:!h.inactive(frame),before,state:a.riderLifecycle.state,
  decision:a.riderLifecycle.lastDecision,mode:a.riderLifecycle.physicalMode,anchorMode:bundle.anchorState.mode,
  body:physical(a.articulatedRider.points),auxiliary:physical(bundle.anchorState.points),
  types:a.articulatedRider.points.map(p=>p.type),jointNativeY:a.articulatedRider.jointWorld.y/a.hull.scale,
  bodySolves:a.articulatedRider.logicalFrames,auxiliarySolves:bundle.anchorState.logicalFrames,
  damping:a.hull.points.map(p=>p.damping),wetCount:a.lastFrame.wetCount,upY:a.hull.frame.up.y,
  frameSpeedNative:a.lastFrame.frameSpeedNative,effects:structuredClone(a.riderLifecycle.lastEffects),
  controlActor:a.lastFrame.controlActorState,controlFrame:a.lastFrame.controlAnimationFrame};
 assert.deepEqual(a.articulatedRider.jointWorld,a.articulatedRider.points[2].position);
 assert.deepEqual(a.lastFrame.jointWorld,a.articulatedRider.points[2].position);
 for(const points of [record.body,record.auxiliary])for(const p of points)for(const field of ['position','storedDelta']){
  assert.ok(AXES.every(k=>Number.isFinite(p[field][k])),`${frame}: finite solved ${field}`);
 }
 assert.ok(a.hull.points.every(p=>AXES.every(k=>Number.isFinite(p.position[k])&&Number.isFinite(p.velocity[k]))));
 return record;
}
function run(h){
 const records=[];let special=false,returnedAt=-1;
 for(let i=0;i<240;i++){
  const r=advance(h);records.push(r);special||=r.state.actorState!==22;
  if(special&&r.state.actorState===22&&r.state.pendingActor===-1&&returnedAt<0)returnedAt=i;
  if(returnedAt>=0&&i===returnedAt+2)break;
 }
 assert.ok(returnedAt>=0,'the actual solved rider completes recovery without a forced joint or rescue timeout');
 return records;
}
function commonChecks(h,records){
 let active=0;const ids=[];
 for(const r of records){
  if(r.active)active++;
  assert.equal(r.bodySolves,active,`${r.frame}: exactly one body solve per active frame`);
  assert.equal(r.auxiliarySolves,active,`${r.frame}: exactly one auxiliary solve, even while evaluating two blended poses`);
  assert.equal(r.state.lifecycleFrame,active);assert.equal(r.state.phase,'ready');
  assert.equal(r.controlActor,r.before.state.actorState,'the preceding completed actor owns the five current hull ticks');
  assert.equal(r.controlFrame,r.before.state.animationFrame);
  assert.equal(r.mode,1);assert.equal(r.anchorMode,1);
  assert.deepEqual(r.state.hullDamping,h.savedDamping,'never recapture crash damping as the saved normal profile');
  const expected=r.state.pendingActor>=0?Array(19).fill(1):r.state.actorState===23?Array(19).fill(0):
   r.state.actorState===7?RECOVERY:r.state.actorState===24?STUMBLE:ORDINARY;
  assert.deepEqual(r.types,expected,`${r.frame}: post-pose initialization precedes actual projection/link solve`);
  assert.deepEqual(r.damping,r.state.crashDampingLatch?Array(12).fill(F(.999)):h.savedDamping);
  if(!r.active){
   assert.deepEqual(r.state,r.before.state);assert.deepEqual(r.body,r.before.body);assert.deepEqual(r.auxiliary,r.before.auxiliary);
   assert.equal(r.decision.skipped,true);assert.deepEqual(r.effects,[]);
  }
  ids.push(...r.effects.map(effect=>effect.effectId));
 }
 assert.equal(new Set(ids).size,ids.length,'each local effect recipe is emitted once');
 for(const r of records.slice(-3)){
  assert.equal(r.state.actorState,22);assert.equal(r.state.pendingActor,-1);assert.deepEqual(r.types,ORDINARY);
  assert.equal(r.mode,1);assert.deepEqual(r.damping,h.savedDamping);
 }
}
function realDatumGate(records){
 const crossings=[],recognitions=[];
 for(const r of records){
  if(!r.active||r.before.state.actorState!==23)continue;
  const old=r.before.state.recoveryCounter;
  if(old<0){
   const recognized=F(r.before.jointNativeY)<0;
   assert.equal(r.state.actorState,23);assert.equal(r.state.recoveryCounter,recognized?0:-1);
   if(recognized)recognitions.push(r.frame);
   if(!recognized&&F(r.jointNativeY)<0){
    crossings.push(r.frame);assert.equal(r.state.recoveryCounter,-1,'this frame\'s newly solved torso cannot admit itself retroactively');
   }
  }else{
   const next=old+4,eligible=next>=100||next>=10&&r.wetCount>=8&&F(r.upY)>F(.9)&&F(r.frameSpeedNative)<F(8.333333969116211);
   assert.equal(r.state.actorState,eligible?7:23);assert.equal(r.state.recoveryCounter,eligible?-1:next);
   if(eligible)assert.equal(r.decision.state.animationFrame,0,'actual recovery decision starts7 before its current pose evaluation');
  }
 }
 assert.ok(crossings.length>0,'the actual physical chain, not a target constant, crosses below the source datum');
 assert.ok(recognitions.length>0);
 const nextActive=records.find(r=>r.active&&r.frame>crossings[0]);
 assert.equal(recognitions[0],nextActive.frame,'recognition occurs on the next active post-hull decision');
}

for(const riderIndex of [0,1,2,3])test(`prepared severe impact: ordinal${riderIndex} completes23→7→22 through real physical solvers`,()=>{
 const h=harness({riderIndex}),records=run(h);commonChecks(h,records);realDatumGate(records);
 assert.deepEqual(records.slice(0,6).map(r=>r.state.crashCountdown),[5,4,3,2,1,0]);
 assert.deepEqual(records.slice(0,6).map(r=>r.state.actorState),[22,22,22,22,22,23]);
 const effects=records.flatMap(r=>r.effects);
 assert.equal(effects.filter(e=>e.kind==='crashHullKick').length,1);
 assert.equal(effects.filter(e=>e.kind==='restoreHullDamping').length,1);
 assert.equal(effects.filter(e=>e.kind==='clearRiderDeltas').length,1);
 const restore=records.find(r=>r.effects.some(e=>e.kind==='restoreHullDamping'));
 assert.equal(restore.before.state.actorState,7);assert.equal(restore.before.state.animationFrame,55);
 assert.equal(restore.state.animationFrame,56);assert.equal(restore.state.crashDampingLatch,false);
 const queued=records.find(r=>r.state.pendingActor===22);
 assert.equal(queued.before.state.animationFrame,76);assert.equal(queued.state.animationFrame,77);
 assert.equal(queued.state.blendProgress,F(.15));
 const complete=records.find(r=>r.frame>queued.frame&&r.state.actorState===22);
 assert.equal(complete.frame-queued.frame,6,'six subsequent blend evaluations complete the source return');
});

test('prepared moderate impact follows24→pending7(frame57)→7→22 without severe damping or duplicate blended solves',()=>{
 const h=harness({incomingNative:6}),records=run(h);commonChecks(h,records);
 assert.equal(records[0].state.stumbleCountdown,1);assert.equal(records[0].state.actorState,22);
 assert.equal(records[1].state.actorState,24);assert.equal(records[1].state.stumbleCounter,0);
 assert.deepEqual(records[1].types,STUMBLE);
 assert.ok(records.every(r=>!r.state.crashDampingLatch&&r.state.crashCountdown===0));
 assert.equal(records.flatMap(r=>r.effects).filter(e=>e.kind==='crashHullKick'||e.kind==='restoreHullDamping').length,0);
 const queued=records.find(r=>r.state.pendingActor===7);
 assert.ok(queued);assert.equal(queued.state.actorState,24);assert.equal(queued.state.recoveryInputLock,1);
 assert.deepEqual(queued.decision.actorRequest,{actorState:7,animationFrame:57,blend:F(.15),holdFrame:0});
 assert.equal(queued.state.pendingAnimationFrame,58,'the newly pending equivalent pose is evaluated once on its request frame');
 assert.equal(queued.state.blendProgress,F(.3),'post-hull requests enter that frame\'s blend, rather than waiting an extra frame');
 const recovery=records.find(r=>r.state.actorState===7&&r.state.pendingActor===-1);
 assert.equal(recovery.frame-queued.frame,5);assert.equal(recovery.state.animationFrame,63);
 assert.equal(recovery.state.recoveryInputLock,1);
 assert.equal(recovery.state.stumbleCounter,queued.state.stumbleCounter+5,'current24 keeps counting during its five subsequent wet blend frames');
 const final=records.at(-1).state;
 assert.equal(final.stumbleCounter,recovery.state.stumbleCounter,'7/22 initializers retain the completed stumble counter');
 assert.equal(final.recoveryInputLock,1,'ordinary initialization does not silently reset the source edge lock');
});

test('simulationState0 gap preserves actual prior physical history and resumes with one solve per active frame',()=>{
 const h=harness({inactive:frame=>frame>=7&&frame<10}),records=run(h);commonChecks(h,records);realDatumGate(records);
 const skipped=records.filter(r=>!r.active);assert.equal(skipped.length,3);
 assert.ok(skipped.every(r=>r.state.actorState===23));
 assert.equal(skipped[0].before.jointNativeY,skipped.at(-1).jointNativeY,'paused pose cannot fabricate a new datum crossing');
 assert.equal(h.adapter.logicalFrames-h.adapter.articulatedRider.logicalFrames,3);
 assert.equal(records[10].bodySolves,records[9].bodySolves+1,'resume accepts the elapsed outer-frame IDs without repeating missed poses');
});

test('identical local effect IDs stay owned by separate rider instances through damping restoration',()=>{
 const a=harness(),b=harness();
 const aEntry=advance(a),bEntry=advance(b);
 assert.equal(aEntry.effects[0].effectId,bEntry.effects[0].effectId,'IDs are deliberately local, not a global deduplication key');
 assert.notEqual(a.adapter.articulatedRider,b.adapter.articulatedRider);assert.notEqual(a.adapter.hull,b.adapter.hull);
 assert.deepEqual(aEntry.damping,Array(12).fill(F(.999)));assert.deepEqual(bEntry.damping,Array(12).fill(F(.999)));
 const frozenOther=structuredClone({rider:b.adapter.articulatedRider,anchors:b.bundle.anchorState,
  lifecycle:b.adapter.riderLifecycle.state,damping:b.adapter.hull.points.map(p=>p.damping)});
 let special=false,returned=false;
 for(let i=0;i<240;i++){
  const r=advance(a);special||=r.state.actorState!==22;
  if(special&&r.state.actorState===22&&r.state.pendingActor===-1){returned=true;break;}
 }
 assert.equal(returned,true);assert.deepEqual(a.adapter.hull.points.map(p=>p.damping),a.savedDamping);
 assert.deepEqual({rider:b.adapter.articulatedRider,anchors:b.bundle.anchorState,
  lifecycle:b.adapter.riderLifecycle.state,damping:b.adapter.hull.points.map(p=>p.damping)},frozenOther,
 'another rider\'s source effects cannot restore damping, advance history, or initialize this rider');
});
