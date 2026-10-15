import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRiderRecovery,decideNativeActorAfterHull,finishNativeActorPose,nativeRecoveryEffectValues} from '../native-rider-recovery.js';

const F=Math.fround,vec=(x=0,y=0,z=0)=>({x,y,z}),damping=Array.from({length:12},(_,i)=>F(.8+i*.001));
const fields=['primaryBuoyImpactNative','fixedSphereImpactNative','racerImpactNative','shoreImpactNative',
 'boxImpactNative','floorImpactNative','objectImpactNative'];
const zero=()=>({...Object.fromEntries(fields.map(k=>[k,0])),normal:vec(1,0,0),markedBox:false});
const initial=(options={})=>createNativeRiderRecovery({riderIndex:0,hullDamping:damping,...options});
const hull=(options={})=>({simulationState:3,raceFinished:false,frameSpeedNative:30,wetCount:8,upY:1,
 manipulationAction:0,physicalJoint2YNative:0,courseDatumNative:0,engineEnabled:true,
 frameForwardNative:vec(0,0,1),...options,impacts:{...zero(),...options.impacts}});
const pose=(state,overrides={})=>finishNativeActorPose(state,{nextAnimationFrame:0,pressedButtons:0,releasedButtons:0,
 ...(state.pendingActor>=0?{pendingNextAnimationFrame:state.pendingAnimationFrame}:{}),...overrides});
const cycle=(state,q=hull(),outcome={})=>{const decision=decideNativeActorAfterHull(state,q);return decision.skipped?decision:pose(decision.state,outcome);};
function adjacent(value,direction=1){
 const bits=new Uint32Array(new Float32Array([value]).buffer);bits[0]+=direction;
 return new Float32Array(bits.buffer)[0];
}
function deepFreeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(deepFreeze);Object.freeze(v);}return v;}

test('all seven severe thresholds are strict float32, rider-specific, and actor-scaled (588 prepared cases)',()=>{
 const tables=[[10,10.5,9.5,10],[9.5,10,9,8],[9.5,10,9,8],[8.5,9,8,8],
  [8.5,9,8,8],[8.5,9.5,8,9],[10,10.5,9.5,10]];
 let count=0;
 for(let riderIndex=0;riderIndex<4;riderIndex++)for(const actorState of [22,7,23,8,9,17,25]){
  const factor=actorState===8?F(.1):actorState===9?F(.15):actorState===17?F(.2):1;
  for(let j=0;j<fields.length;j++)for(const relation of [-1,0,1]){
   const threshold=F(F(tables[j][riderIndex])*factor),value=relation?adjacent(threshold,relation):threshold;
   const out=decideNativeActorAfterHull(initial({riderIndex,actorState}),hull({impacts:{[fields[j]]:value}}));
   assert.equal(out.state.crashCountdown,relation===1&&![7,23].includes(actorState)?5:0,
    `${riderIndex}/${actorState}/${fields[j]}/${relation}`);count++;
  }
 }
 assert.equal(count,588);
});

test('severe speed/finished gate, independent racer impact, and partial-wet tilt boundaries are distinct',()=>{
 const speed=F(22.22222328186035);
 for(const field of fields)for(const frameSpeedNative of [0,speed,adjacent(speed)])for(const raceFinished of [false,true]){
  const out=decideNativeActorAfterHull(initial(),hull({frameSpeedNative,raceFinished,impacts:{[field]:100}}));
  assert.equal(out.state.crashCountdown,field==='racerImpactNative'||frameSpeedNative>speed&&!raceFinished?5:0);
 }
 for(let riderIndex=0;riderIndex<4;riderIndex++)for(const wetCount of [0,1,7,8,12])for(const relation of [-1,0,1]){
  const threshold=F([.38,.43,.43,.4][riderIndex]),upY=relation?adjacent(threshold,relation):threshold;
  const out=decideNativeActorAfterHull(initial({riderIndex}),hull({frameSpeedNative:0,raceFinished:true,wetCount,upY}));
  assert.equal(out.state.crashCountdown,wetCount>=1&&wetCount<=7&&relation<0?5:0);
 }
});

test('severe entry stages five later updates and one native twelve-point kick without changing hull/progress/actions',()=>{
 const s=initial(),q=deepFreeze(hull({manipulationAction:3,impacts:{shoreImpactNative:100,normal:vec(1,0,0)}}));
 const entry=decideNativeActorAfterHull(s,q);
 assert.equal(s.crashCountdown,0);assert.equal(q.manipulationAction,3);
 assert.equal(entry.state.actorState,22);assert.equal(entry.state.crashCountdown,5);assert.equal(entry.state.contactMode,1);
 assert.equal(entry.actorRequest,null);assert.deepEqual(entry.effects.map(e=>e.kind),['crashHullKick']);
 const input=deepFreeze(Array.from({length:12},()=>vec(2,3,4)));
 const kick=nativeRecoveryEffectValues(entry.effects[0],{hullVelocitiesNative:input});
 assert.deepEqual(kick.hullVelocitiesNative,Array.from({length:12},()=>vec(1,4.5,6)));
 assert.deepEqual(kick.hullDamping,Array(12).fill(F(.999)));assert.deepEqual(input[0],vec(2,3,4));
 const repeated=decideNativeActorAfterHull(initial({...pose(entry.state).state,crashCountdown:0}),q);
 assert.equal(repeated.effects.length,0);assert.equal(repeated.state.crashCountdown,5);
 let state=pose(entry.state).state;
 for(let n=1;n<=5;n++){
  const next=decideNativeActorAfterHull(state,hull());
  assert.equal(next.state.crashCountdown,5-n);assert.equal(next.state.actorState,n===5?23:22);
  assert.equal(next.effects.some(e=>e.kind==='crashHullKick'),false);
  if(n===5){
   assert.deepEqual(next.actorRequest,{actorState:23,animationFrame:0,blend:1,holdFrame:0});
   assert.deepEqual(next.effects.map(e=>e.kind),['initializeRiderActor','transformRiderDeltas']);
   assert.deepEqual(next.effects[0].jointTypes,Array(19).fill(0));
   const values=nativeRecoveryEffectValues(next.effects[1],{riderDeltasNative:Array.from({length:19},()=>vec(2,-3,4))});
   assert.deepEqual(values.riderDeltasNative[0],vec(F(2*F(.8)),0,F(4*F(.8))));
   assert.equal(next.state.recoveryCounter,-1);assert.equal(next.state.secondaryCounter,-1);
  }
  state=pose(next.state).state;
 }
 assert.equal(state.lifecycleFrame,6);assert.equal(state.actorState,23);
 assert.equal('position' in state,false);assert.equal('manipulationAction' in state,false);
});

test('crash rider-delta clamp is strict at float32 .6 and preserves positive Y',()=>{
 for(const upY of [F(.6),adjacent(F(.6))]){
  const d=decideNativeActorAfterHull(initial({crashCountdown:1}),hull({upY}));
  const e=d.effects.find(e=>e.kind==='transformRiderDeltas');
  const out=nativeRecoveryEffectValues(e,{riderDeltasNative:Array.from({length:19},(_,i)=>vec(2,i%2?-3:3,4))});
  assert.equal(out.riderDeltasNative[0].y,3);assert.equal(out.riderDeltasNative[1].y,upY>F(.6)?0:-3);
 }
});

test('actor23 waits indefinitely for actual joint2 below the signed datum; recognition does not increment',()=>{
 let state=initial({actorState:23,crashDampingLatch:true});
 for(let frame=0;frame<200;frame++)state=cycle(state,hull({physicalJoint2YNative:-100,courseDatumNative:-100})).state;
 assert.equal(state.actorState,23);assert.equal(state.recoveryCounter,-1);
 const recognized=decideNativeActorAfterHull(state,hull({physicalJoint2YNative:-101,courseDatumNative:-100}));
 assert.equal(recognized.state.recoveryCounter,0);assert.equal(recognized.actorRequest,null);
 assert.throws(()=>decideNativeActorAfterHull(state,hull({physicalJoint2YNative:undefined})),/physicalJoint2YNative/);
 assert.throws(()=>decideNativeActorAfterHull(state,hull({courseDatumNative:-100.1})),/courseDatumNative/);
});

test('recovery counts4 only on later logical frames, with strict early gates or25 maximal increments',()=>{
 const cases=[
  [0,12,1,0,23,4],[4,12,1,0,23,8],[8,7,1,0,23,12],
  [8,8,F(.9),0,23,12],[8,8,1,F(8.333333969116211),23,12],
  [8,8,1,0,7,-1],[96,0,-1,100,7,-1]
 ];
 for(const [counter,wetCount,upY,frameSpeedNative,actor,expectedCounter] of cases){
  const out=decideNativeActorAfterHull(initial({actorState:23,recoveryCounter:counter,contactMode:1,recoveryInputLock:1}),
   hull({wetCount,upY,frameSpeedNative}));
  assert.equal(out.state.actorState,actor);assert.equal(out.state.recoveryCounter,expectedCounter);
  if(actor===7){
   assert.equal(out.state.recoveryInputLock,0);assert.equal(out.state.contactMode,0);
   assert.deepEqual(out.effects.map(e=>e.kind),['clearRiderDeltas','initializeRiderActor']);
   assert.deepEqual(nativeRecoveryEffectValues(out.effects[0]).riderDeltasNative,Array.from({length:19},()=>vec()));
  }
 }
 let state=cycle(initial({actorState:23}),hull({physicalJoint2YNative:-1,wetCount:0,upY:-1,frameSpeedNative:100})).state;
 assert.equal(state.recoveryCounter,0);
 for(let n=1;n<=25;n++){
  state=cycle(state,hull({physicalJoint2YNative:100,wetCount:0,upY:-1,frameSpeedNative:100})).state;
  assert.equal(state.actorState,n===25?7:23);
 }
});

test('actor7 consumes explicit evaluator frames, restores saved damping only56..76, and samples A/Z edges',()=>{
 const masks=[[0,0,0],[0,0,0x8000],[0x8000,0,0x8000],[0,0x8000,0],[0x2000,0,0x2000],[0,0x2000,0],[0x4000,0,0x4000]];
 for(const nextAnimationFrame of [1,55,56,76,77])for(const [pressedButtons,releasedButtons,heldButtons] of masks){
  const d=decideNativeActorAfterHull(initial({actorState:7,animationFrame:30,crashDampingLatch:true}),hull());
  const out=pose(d.state,{nextAnimationFrame,pressedButtons,releasedButtons,heldButtons});
  assert.equal(out.state.animationFrame,nextAnimationFrame+Number(Boolean((pressedButtons|releasedButtons)&0xa000)));
  assert.equal(out.state.pendingActor,nextAnimationFrame>=77?22:-1);
  const restore=out.effects.find(e=>e.kind==='restoreHullDamping');
  assert.equal(Boolean(restore),nextAnimationFrame>=56&&nextAnimationFrame<77);
  assert.equal(out.state.crashDampingLatch,!(nextAnimationFrame>=56&&nextAnimationFrame<77));
  if(restore)assert.deepEqual(nativeRecoveryEffectValues(restore).hullDamping,damping);
  if(nextAnimationFrame>=77)assert.equal(out.state.blendProgress,F(.15));
 }
 const locked=pose(decideNativeActorAfterHull(initial({actorState:7,recoveryInputLock:1}),hull()).state,
  {nextAnimationFrame:76,pressedButtons:0x8000});
 assert.equal(locked.state.animationFrame,76);assert.equal(locked.state.pendingActor,-1);
 const edge=pose(decideNativeActorAfterHull(initial({actorState:7}),hull()).state,{nextAnimationFrame:76,pressedButtons:0x8000});
 assert.equal(edge.state.animationFrame,77);assert.equal(edge.state.pendingActor,-1,'decision uses unaccelerated evaluator return');
});

test('actor7 queues .15 then six later equivalent blend evaluations install22; holds and initializer state persist',()=>{
 const d=decideNativeActorAfterHull(initial({actorState:7,holdFrame:1,stumbleCounter:13,recoveryInputLock:1}),hull());
 let state=pose(d.state,{nextAnimationFrame:77}).state;
 assert.equal(state.actorState,7);assert.equal(state.pendingActor,22);assert.equal(state.blendProgress,F(.15));
 assert.equal('actorAuxState' in state,false);assert.equal(state.holdFrame,0);
 const expected=[F(.3),F(.45000001788139343),F(.6000000238418579),F(.75),F(.8999999761581421),0];
 for(let i=0;i<6;i++){
  const decision=decideNativeActorAfterHull(state,hull());
  const out=pose(decision.state,{nextAnimationFrame:78+i,pendingNextAnimationFrame:1+i});
  assert.equal(out.state.blendProgress,expected[i]);assert.equal(out.state.actorState,i===5?22:7);
  assert.equal(out.effects.some(e=>e.kind==='restoreHullDamping'),false);
  if(i===5){
   assert.equal(out.state.animationFrame,6);assert.equal(out.state.pendingActor,-1);assert.equal(out.state.blendStep,F(.15));
   assert.equal(out.state.stumbleCounter,13);assert.equal(out.state.recoveryInputLock,1);
   const types=Array(19).fill(1);for(const j of [9,10,17,18])types[j]=4;types[6]=2;types[14]=3;
   assert.deepEqual(out.effects[0].jointTypes,types);
  }
  state=out.state;
 }
 const held=initial({actorState:7,pendingActor:22,pendingAnimationFrame:5,holdFrame:1,blendProgress:F(.15),blendStep:F(.15),crashDampingLatch:true});
 const heldResult=pose(decideNativeActorAfterHull(held,hull()).state,{nextAnimationFrame:56,pendingNextAnimationFrame:6,pressedButtons:0xa000});
 assert.equal(heldResult.state.pendingAnimationFrame,5);assert.equal(heldResult.state.animationFrame,56);
 assert.equal(heldResult.state.crashDampingLatch,true,'active blend skips actor7 edge/damping consumer');
});

test('moderate tables use independent strict boundaries and racer channel ignores speed/finish',()=>{
 const tables={objectImpactNative:[5,6,5.9,5.5],fixedSphereImpactNative:[4,4,3,3.3],shoreImpactNative:[4,4,3,3.3],
  floorImpactNative:[5,7,4,6],boxImpactNative:[4,4,3,4],racerImpactNative:[5,6,5,5.5]};
 for(let riderIndex=0;riderIndex<4;riderIndex++)for(const [field,table] of Object.entries(tables))for(const above of [false,true]){
  const v=F(table[riderIndex]),out=decideNativeActorAfterHull(initial({riderIndex}),hull({impacts:{[field]:above?adjacent(v):v}}));
  assert.equal(out.state.crashCountdown,0);assert.equal(out.state.stumbleCountdown,above?1:0);
 }
 for(const field of Object.keys(tables)){
  const out=decideNativeActorAfterHull(initial(),hull({frameSpeedNative:0,raceFinished:true,impacts:{[field]:6}}));
  assert.equal(out.state.stumbleCountdown,field==='racerImpactNative'?1:0);
 }
});

test('normal stagger requires the signed selection gates; selected actors use frame1/hold1 rather than stagger',()=>{
 for(const [selectedActor,selectionCountdown,expected] of [[7,1,0],[7,0,0],[-1,5,1],[7,-1,1]]){
  const out=decideNativeActorAfterHull(initial({selectedActor,selectionCountdown}),hull({impacts:{shoreImpactNative:5}}));
  assert.equal(out.state.stumbleCountdown,expected);
  if(selectedActor===7&&selectionCountdown===1)assert.equal(out.state.selectionCountdown,0);
  if(selectedActor===7&&selectionCountdown===0){
   assert.deepEqual(out.actorRequest,{actorState:7,animationFrame:1,blend:F(.15),holdFrame:1});
   assert.deepEqual(out.effects[0].jointTypes,Array(19).fill(1));
  }
 }
 const severe=decideNativeActorAfterHull(initial({selectedActor:7,selectionCountdown:1}),hull({impacts:{shoreImpactNative:100}}));
 assert.equal(severe.state.crashCountdown,5);assert.equal(severe.state.selectionCountdown,1,'severe selection runs first');
});

test('mild movable-primary/wet tilt starts26; upright cancellation is strict and action/expiry takes priority',()=>{
 for(let riderIndex=0;riderIndex<4;riderIndex++)for(const kind of ['primary','tilt'])for(const cross of [false,true]){
  const v=F([5,6,5.9,5.5][riderIndex]),tilt=F([.48,.53,.53,.5][riderIndex]);
  const out=decideNativeActorAfterHull(initial({riderIndex}),hull(kind==='primary'?
   {impacts:{primaryBuoyImpactNative:cross?adjacent(v):v}}:{upY:cross?adjacent(tilt,-1):tilt}));
  assert.equal(out.state.stumbleCountdown,cross?26:0);assert.equal(out.state.contactMode,cross?2:0);
 }
 for(let riderIndex=0;riderIndex<4;riderIndex++)for(const remaining of [1,2,26])for(const action of [0,3])for(const above of [false,true]){
  const threshold=F(F(F([.48,.53,.53,.5][riderIndex])*F(F(1)-F(.6)))+F(.6));
  const out=decideNativeActorAfterHull(initial({riderIndex,stumbleCountdown:remaining,contactMode:2}),
   hull({upY:above?adjacent(threshold):threshold,manipulationAction:action,frameForwardNative:vec(.2,.3,.4)}));
  const switched=remaining===1||action!==0,cancelled=!switched&&above;
  assert.equal(out.state.actorState,switched?24:22);assert.equal(out.state.stumbleCountdown,switched||cancelled?0:remaining-1);
  assert.equal(out.state.contactMode,switched||cancelled?0:2);
  if(switched){
   const e=out.effects.find(e=>e.kind==='transformRiderDeltas');
   const values=nativeRecoveryEffectValues(e,{riderDeltasNative:Array.from({length:19},()=>vec(2,-3,4))});
   assert.deepEqual(values.riderDeltasNative[0],vec(F(F(2*F(.8))-F(.2)),F(-F(.3)),F(F(4*F(.8))-F(.4))));
   assert.equal(out.state.stumbleCounter,0);assert.equal(out.actorRequest.holdFrame,1);
  }
 }
 assert.throws(()=>decideNativeActorAfterHull(initial({stumbleCountdown:1}),hull({frameForwardNative:undefined})),/frameForwardNative/);
});

test('actor24 counter needs contact; exact11/41 gates queue recovery57 or alternate22 without resetting repeated blends',()=>{
 const dry=decideNativeActorAfterHull(initial({actorState:24,stumbleCounter:40}),hull({wetCount:0}));
 assert.equal(dry.state.stumbleCounter,40);assert.equal(dry.actorRequest,null);
 for(const previous of [0,9,10,39,40])for(const engineEnabled of [false,true])for(const speed of [0,F(11.111111640930176),30]){
  const out=decideNativeActorAfterHull(initial({actorState:24,stumbleCounter:previous}),hull({engineEnabled,frameSpeedNative:speed}));
  const requested=previous+1>=41||previous+1>=11&&(!engineEnabled||speed<F(11.111111640930176));
  assert.equal(Boolean(out.actorRequest),requested);
  if(requested){
   assert.deepEqual(out.actorRequest,{actorState:7,animationFrame:57,blend:F(.15),holdFrame:0});
   assert.equal(out.state.recoveryInputLock,1);assert.equal(out.state.actorState,24);
   const completed=pose(out.state,{pendingNextAnimationFrame:58});
   assert.equal(completed.state.blendProgress,F(.3));assert.equal(completed.state.pendingAnimationFrame,58);
   const again=decideNativeActorAfterHull(completed.state,hull({engineEnabled:false}));
   assert.equal(again.actorRequest,null);assert.equal(again.state.blendProgress,F(.3));
  }
 }
 const alternate=decideNativeActorAfterHull(initial({actorState:24,alternateStumble:1,stumbleCounter:40,recoveryInputLock:9}),hull());
 assert.deepEqual(alternate.actorRequest,{actorState:22,animationFrame:0,blend:F(.075),holdFrame:0});
 assert.equal(alternate.state.recoveryInputLock,9);
 const touched=decideNativeActorAfterHull(initial({actorState:24,stumbleCounter:9}),hull({wetCount:0,impacts:{floorImpactNative:.01}}));
 assert.equal(touched.state.stumbleCounter,10);
 assert.throws(()=>decideNativeActorAfterHull(initial({actorState:24}),hull({engineEnabled:undefined})),/engineEnabled/);
});

test('immediate initialization preserves source hold/blend-step fields; actor7 joint types and alternate22 are exact',()=>{
 const remount=decideNativeActorAfterHull(initial({actorState:23,recoveryCounter:96,holdFrame:1,blendStep:F(.075)}),hull());
 assert.equal(remount.state.holdFrame,1);assert.equal(remount.state.blendStep,F(.075));
 const expected=Array(19).fill(1);for(const i of [0,1,2,6,7,8,9,10,14,15,16,17,18])expected[i]=0;
 assert.deepEqual(nativeRecoveryEffectValues(remount.effects[1]).riderJointTypes,expected);
 const ordinary=initial({actorState:7,pendingActor:22,pendingAnimationFrame:0,blendProgress:F(.9),blendStep:F(.15),alternateStumble:1});
 const out=pose(decideNativeActorAfterHull(ordinary,hull()).state,{nextAnimationFrame:80,pendingNextAnimationFrame:1});
 const types=Array(19).fill(1);for(const i of [2,6,7,14,15])types[i]=0;
 assert.deepEqual(out.effects[0].jointTypes,types);
});

test('JSON-resumable phase ownership prevents duplicate decisions/completions and simulation0 advances nothing',()=>{
 const s=initial({crashCountdown:1}),decision=decideNativeActorAfterHull(s,hull());
 assert.throws(()=>decideNativeActorAfterHull(decision.state,hull()),/phase ready/);
 const restored=createNativeRiderRecovery(JSON.parse(JSON.stringify(decision.state)));
 assert.deepEqual(pose(restored),pose(decision.state));
 const completed=pose(restored);assert.throws(()=>pose(completed.state),/phase pose/);
 const paused=decideNativeActorAfterHull(s,{simulationState:0});
 assert.deepEqual(paused.state,s);assert.equal(paused.skipped,true);assert.equal(paused.poseRequest,null);assert.deepEqual(paused.effects,[]);
 assert.ok(Object.isFrozen(decision.state));assert.ok(Object.isFrozen(decision.effects[0].jointTypes));
 assert.notEqual(decision.effects[0].effectId,decision.effects[1].effectId);
});

test('strict inputs never substitute a pose clock, fake joint, unknown initializer or nonfinite native data',()=>{
 assert.throws(()=>createNativeRiderRecovery(),/hullDamping/);
 assert.throws(()=>createNativeRiderRecovery({hullDamping:damping}),/riderIndex/);
 assert.throws(()=>initial({riderIndex:4}),/riderIndex/);
 assert.throws(()=>initial({unsupported:()=>0}),/Unknown recovery state field/);
 assert.throws(()=>initial({pendingActor:7}),/blend/);
 assert.throws(()=>decideNativeActorAfterHull(initial(),hull({impacts:{normal:vec(NaN,0,0)}})),/normal.x/);
 const d=decideNativeActorAfterHull(initial({actorState:7}),hull());
 assert.throws(()=>finishNativeActorPose(d.state,{pressedButtons:0,releasedButtons:0}),/nextAnimationFrame/);
 assert.throws(()=>finishNativeActorPose(d.state,{nextAnimationFrame:1,releasedButtons:0}),/pressedButtons/);
 const p=decideNativeActorAfterHull(initial({actorState:23}),hull());
 assert.throws(()=>pose(p.state,{nextAnimationFrame:1}),/return0/);
 const action=decideNativeActorAfterHull(initial({actorState:8}),hull());
 assert.equal(action.poseRequest.actorSpecificCompletionSupported,true);
 assert.throws(()=>pose(action.state),/physicalMode/);
 const selected=decideNativeActorAfterHull(initial({selectedActor:8,selectionCountdown:0}),hull());
 const blend=pose(selected.state,{pendingNextAnimationFrame:2});assert.equal(blend.state.actorState,22);
 const last=initial({...blend.state,blendProgress:F(.9)});
 const done=pose(decideNativeActorAfterHull(last,hull()).state,{pendingNextAnimationFrame:3});
 assert.equal(done.effects[0].requiresEquivalentInitializer,false);
 assert.equal(nativeRecoveryEffectValues(done.effects[0]).riderPhysicalMode,0);
 const unsupported={kind:'initializeRiderActor',requiresEquivalentInitializer:true};
 assert.throws(()=>nativeRecoveryEffectValues(unsupported),/equivalent source initializer/);
 assert.throws(()=>nativeRecoveryEffectValues({kind:'unknown'}),/Unknown recovery effect/);
 const entry=decideNativeActorAfterHull(initial(),hull({impacts:{shoreImpactNative:100}}));
 assert.throws(()=>nativeRecoveryEffectValues(entry.effects[0],{hullVelocitiesNative:Array.from({length:12},()=>vec(0,3.4e38,0))}),/finite float32/);
});
