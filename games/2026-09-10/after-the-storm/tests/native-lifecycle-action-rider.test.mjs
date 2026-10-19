import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHull} from '../native-hull.js';
import {createNativeLifecycleRider} from '../native-lifecycle-rider.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter} from '../native-race-adapter.js';
import {createNativeRiderRecovery} from '../native-rider-recovery.js';
import {nativeRiderActionPoseInitialization} from '../native-rider-action-pose-lifecycle.js';
import {NATIVE_RIDER_LINKS} from '../native-articulated-rider.js';
import {createAuthoredNativeActionPoses} from '../authored-native-action-poses.js';
import {stepNativeArticulatedRider} from '../native-articulated-rider.js';
import {createNativeRaceContactAudio} from '../native-race-contact-audio.js';
import {createNativeWaterField,queryNativeWaterField} from '../native-water-field.js';

// Independently prepared source requests/scene inputs exercise the ACTUAL
// hull, auxiliary and nineteen-point solvers with authored equivalent art.
// These are not original complete gameplay trajectories or original targets.
// Actor25 starts from an explicit prepared restore; no physical point, solved
// joint, actor, animation frame or progress is changed during these runs.
const AXES=['x','y','z'],copy=p=>({...p}),distance=(a,b)=>Math.hypot(...AXES.map(k=>a[k]-b[k]));
const ORDINARY=[1,1,1,1,1,1,2,1,1,4,4,1,1,1,3,1,1,4,4];
const ALTERNATE=[1,1,0,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1];
function harness({actor,choice=0,alternate=0,fastRelease=false,skipReverseHold=false,cancelIdle=false,crash=false,feedbackAudio=false}={}){
 const initialHull=createNativeHull(),bundle=createNativeLifecycleRider({initialHull}),samples=[];
 let randomReads=0,heldFrames=0,returned=-1,qualifiedImpact=false;
 const restore=actor===25?createNativeRiderRecovery({riderIndex:0,actorState:25,alternateStumble:alternate,
  hullDamping:initialHull.points.map(p=>Math.fround(p.damping))}):undefined;
 if(restore){
  const init=nativeRiderActionPoseInitialization({actorState:25,alternate16cc:alternate});
  bundle.articulatedRider.points.forEach((p,i)=>{p.type=init.riderJointTypes[i];});
 }
 const adapter=createNativeRaceAdapter({...bundle,
  ...(feedbackAudio?{riderWaterQuery:(x,z)=>queryNativeWaterField(audioField,x,z).sourcePlaneQueryNative}:{}),
  riderPose:(h,c)=>{const p=bundle.riderPose(h,c);samples.push({logicalFrame:c.logicalFrame,
   request:structuredClone(c.poseRequest),outcome:structuredClone(p.animationOutcome),targets:p.targets.map(copy)});return p;},
  riderRecovery:{courseDatumNative:0,...(restore?{state:restore}:{})},
  sourceState:{simulationState:3,actionState:actor===25?{action:3,arcActive:true}:{override:actor===8?1:actor===9?2:actor===17?9:0}},
  riderActions:{inputHistory:{gestureTick15f0:0,flag1600:0,sequence15f8:0,sequence15fa:0,lastPressedDirections15fc:0,quietFrames15fe:0},
   idleFramesC6c:actor===10?100:0,idleChoice16c4:actor===10?choice:-1,
   source:{state650:3,gestureWindowNative:3,idleThresholdNative:100,randomUnsigned32:()=>{randomReads++;return choice;},
    poseCompletion:{finished2c2c:0,record2c24:0,racerIndex:0,primaryRacerIndex:0,gameMode648:3}}},
  contacts:{racingBuoys:(h,c)=>{
   // A qualified synthetic channel report, never a forced hull/rider state.
   if(crash&&!qualifiedImpact&&c.substep===4&&c.actorState===8&&adapter.riderLifecycle.state.animationFrame>=30){
    qualifiedImpact=true;c.recordImpact({channel:'racer',incomingNative:3,normal:{x:1,y:0,z:0}});
   }
  }}});
 const controls=()=>{
  const s=adapter.riderLifecycle.state;let y=0,held=0;
  if(returned>=0)held=0x8000;
  else if(actor===8&&s.actorState===8&&s.animationFrame===30&&heldFrames++<4)y=70;
  else if(actor===9&&s.actorState===9&&!skipReverseHold){
   if(s.animationFrame<45)y=-70;else if(s.animationFrame===45&&heldFrames++<4)y=-70;
  }else if(actor===17&&s.actorState===17&&s.animationFrame===23){
   if(heldFrames++<4)y=70;else if(fastRelease)y=-70;
  }else if(actor===25&&adapter.logicalFrames<8)y=70;
  else if(actor===10&&cancelIdle&&adapter.logicalFrames>0)held=1;
  return {rawXNative:0,rawYNative:y,heldButtons:held};
 };
 const audio=feedbackAudio?createNativeRaceContactAudio({players:1,courseIndex:1}):null,feedback=[];
 const audioField=audio?createNativeWaterField({datumNative:0}):null;
 if(audio){audio.applyEffects([{kind:'externalCall',consumer:'800c21f4',arguments:[7,1]}]);audio.drain();}
 const records=[];let entered=actor===25;
 for(let frame=0;frame<240;frame++){
  const prior=adapter.riderLifecycle.state;
  if(audio)audio.beforeFrame(frame+1);
  stepNativeRaceAdapter(adapter,.05,controls);
  if(audio){
   audio.advance([adapter],audioField,{recordFlags318:[0],recordMotion2c8:[0],recordPower12c:[0],recordPlace4:[0],sprayLeft1c5c:[0],sprayRight1c60:[0]});
   feedback.push(...audio.drain().filter(c=>c.arguments[0]===0x06000b00));
  }
  const state=adapter.riderLifecycle.state;entered||=state.actorState===actor||state.pendingActor===actor;
  records.push({frame,prior,state,mode:adapter.riderLifecycle.physicalMode,types:adapter.articulatedRider.points.map(p=>p.type),
   bodySolves:adapter.articulatedRider.logicalFrames,auxSolves:bundle.anchorState.logicalFrames,
   controlActor:adapter.lastFrame.controlActorState,action:adapter.actionState.action,
   engineMask:adapter.lastControls.engineMask,effects:structuredClone(adapter.riderLifecycle.lastEffects),
   joint:copy(adapter.articulatedRider.jointWorld),points:adapter.articulatedRider.points.map(p=>copy(p.position)),
   anchors:structuredClone(bundle.anchorState.anchors)});
  if(entered&&state.actorState===22&&state.pendingActor<0&&returned<0)returned=frame;
  if(returned>=0&&frame===returned+2)break;
 }
 assert.equal(entered,true);assert.ok(returned>=0,'source transitions complete through real authored target/physical evaluations');
 assert.equal(samples.length,records.length,'one current/pending pose preparation per active outer frame');
 for(const r of records){
  assert.equal(r.bodySolves,r.frame+1);assert.equal(r.auxSolves,r.frame+1,'two blended evaluations still resolve one auxiliary solve');
  assert.equal(r.controlActor,r.prior.actorState,'the preceding completed actor owns the five current hull ticks');
  assert.ok(r.points.every(p=>AXES.every(k=>Number.isFinite(p[k]))));assert.deepEqual(r.joint,r.points[2]);
  assert.equal(r.state.phase,'ready');assert.equal(r.state.lifecycleFrame,r.frame+1);
  for(const i of [6,14])if(r.types[i]===2||r.types[i]===3)assert.deepEqual(r.points[i],r.anchors[r.types[i]],'actual source grip binding survives link solve');
 }
 assert.deepEqual(adapter.lastFrame.jointWorld,adapter.articulatedRider.points[2].position);
 assert.deepEqual(records.at(-1).types,alternate?ALTERNATE:ORDINARY);assert.equal(records.at(-1).mode,1);
 if(!crash)assert.ok(records.every(r=>r.state.crashCountdown===0&&r.state.stumbleCountdown===0&&![7,23,24].includes(r.state.actorState)),
  'successful action completion cannot be disguised by a separate wipeout/recovery');
 return {adapter,bundle,records,samples,returned,randomReads,qualifiedImpact,feedback};
}

test('actual action pose completions reach the cue channel once without altering physical trajectories or gameplay RNG',()=>{
 for(const actor of [8,9,17]){
  const ordinary=harness({actor}),audible=harness({actor,feedbackAudio:true});
  assert.deepEqual(audible.records,ordinary.records);assert.equal(audible.randomReads,ordinary.randomReads);
  const effects=audible.records.filter(r=>r.effects.some(e=>e.kind==='actionPoseCue'));
  assert.equal(effects.length,1);assert.equal(audible.feedback.length,1);
  const frame=effects[0].frame+1,random=(Math.imul(frame,1664525)+1013904223)>>>0;
  assert.deepEqual(audible.feedback[0],{frame,player:0,consumer:'c53d4',arguments:[0x06000b00,8+(random&1)]});
 }
});

test('actor8 request blends into real inversion targets, holds30 and returns22 through one physical solve per frame',()=>{
 const h=harness({actor:8}),held=h.records.filter(r=>r.state.actorState===8&&r.state.animationFrame===30);
 assert.ok(held.length>=5);assert.ok(held.every(r=>r.mode===0));assert.equal(h.randomReads,0);
 assert.ok(h.samples.some(s=>s.request.pending?.actorState===8&&s.request.pending.animationFrame===1));
 assert.ok(h.samples.some(s=>s.request.actorState===8&&s.request.pending?.actorState===22));
 assert.equal(h.adapter.actionState.override,0);
});

test('actor9 preserves exchanged source grip types without crossing authored forearms, holds45 then returns22',()=>{
 const h=harness({actor:9});assert.equal(h.randomReads,0);
 assert.ok(h.records.filter(r=>r.state.actorState===9&&r.state.animationFrame===45).length>=5);
 const reverse=h.records.filter(r=>r.state.actorState===9&&r.state.pendingActor<0&&r.types[6]===3&&r.types[14]===2);
 assert.ok(reverse.length>20);
 for(const r of reverse)for(const [a,b]of [[4,5],[12,13]]){
  const i=NATIVE_RIDER_LINKS.findIndex(link=>link[0]===a&&link[1]===b);
  assert.ok(Math.abs(distance(r.points[a],r.points[b])-h.adapter.articulatedRider.restLengths[i])<.025,
   'authored hand ordering must follow final actual2/3 bindings');
 }
 assert.ok(h.records.some(r=>r.state.actorState===9&&r.state.animationFrame===25));
});

test('actor9 direct25→62 source jump stays finite and completes without inventing intermediate animation frames',()=>{
 const h=harness({actor:9,skipReverseHold:true});
 const jumped=h.records.find(r=>r.prior.actorState===9&&r.prior.animationFrame===24);
 assert.equal(jumped.state.animationFrame,62);
 assert.equal(h.records.some(r=>r.state.actorState===9&&r.state.animationFrame===25),false);
 assert.equal(h.randomReads,0);
});

for(const fastRelease of [false,true])test(`actor17 physical hold/release ${fastRelease?'jump40':'normal24'} preserves source mode/type changes and recovery to22`,()=>{
 const h=harness({actor:17,fastRelease}),held=h.records.filter(r=>r.state.actorState===17&&r.state.animationFrame===23);
 assert.ok(held.length>=5);assert.ok(held.every(r=>r.mode===1&&r.types[6]===2&&r.types[14]===3));
 const release=h.records.find(r=>r.prior.actorState===17&&r.prior.animationFrame===23&&r.state.animationFrame!==23);
 assert.equal(release.state.animationFrame,fastRelease?40:24);assert.equal(release.mode,0);assert.deepEqual(release.types,Array(19).fill(0));
 assert.equal(h.randomReads,0);
});

test('all four idle choices reach the authored physical poses with one shared conditional draw and exact restart timing',()=>{
 const runs=[0,1,2,3].map(choice=>harness({actor:10,choice}));
 for(const [choice,h]of runs.entries()){
  assert.equal(h.randomReads,1);assert.equal(h.samples[0].request.actorState,10);
  assert.equal(h.samples[0].request.animationFrame,choice<2?26:1);
  const idle=h.records.find(r=>r.state.actorState===10&&r.state.pendingActor<0);
  assert.ok([9,10,17,18].every(i=>idle.types[i]===0));assert.equal(idle.mode,1);
 }
 assert.equal(runs[1].returned-runs[0].returned,24,'choice1 wraps once to1 before its next25 termination');
 assert.equal(runs[3].returned-runs[2].returned,24,'choice3 uses the whole49-frame descriptor');
});

test('a non-engine held button exits actor10 through its real blend while its physical targets keep evaluating',()=>{
 const h=harness({actor:10,cancelIdle:true});
 assert.equal(h.randomReads,1);assert.equal(h.records[1].engineMask,0);
 assert.equal(h.records[1].state.actorState,10);assert.equal(h.records[1].state.pendingActor,22);
 assert.ok(h.returned<10);assert.ok(h.samples.some(s=>s.request.actorState===10&&s.request.pending?.actorState===22));
});

for(const alternate of [0,1])test(`prepared actor25 alternate${alternate} uses fixed equivalent targets until real manipulation release, then blends22`,()=>{
 const h=harness({actor:25,alternate});assert.equal(h.randomReads,0);
 assert.ok(h.records.slice(0,8).every(r=>r.action===3&&r.state.actorState===25&&r.state.animationFrame===0));
 assert.equal(h.records[8].action,0);assert.equal(h.records[8].state.pendingActor,22);
 assert.equal(h.records[8].state.secondaryCounter,-1);
 assert.ok(h.samples.filter(s=>s.request.actorState===25).every(s=>s.outcome.nextAnimationFrame===0));
 assert.equal(h.records.at(-1).state.alternateStumble,alternate);
});

test('qualified impact during authored8 completes actual23→7→22 recovery rather than forcing a torso/datum',()=>{
 const h=harness({actor:8,crash:true});assert.equal(h.qualifiedImpact,true);
 assert.ok(h.records.some(r=>r.state.actorState===23));assert.ok(h.records.some(r=>r.state.actorState===7));
 assert.equal(h.records.flatMap(r=>r.effects).filter(e=>e.kind==='crashHullKick').length,1);
 assert.equal(h.records.flatMap(r=>r.effects).filter(e=>e.kind==='restoreHullDamping').length,1);
 const crossed=h.records.find(r=>r.state.actorState===23&&r.joint.y<0);assert.ok(crossed,'a real solved physical torso crosses the datum');
 assert.equal(h.records.at(-1).state.crashDampingLatch,false);
});

test('two action poses prepare purely then resolve one auxiliary/body solve, with required explicit selectors',()=>{
 const hull=createNativeHull(),b=createNativeLifecycleRider({initialHull:hull});
 const restLocal=b.restTargets.map(p=>Object.fromEntries(AXES.map(k=>[k,p[k]/hull.scale]))),actions=createAuthoredNativeActionPoses({scale:hull.scale,restTargetsLocal:restLocal});
 const context={logicalFrame:0,time:0,controls:{workingXNative:0},poseRequest:{actorState:8,animationFrame:30,
  pending:{actorState:9,animationFrame:46,holdFrame:1},blendProgress:.4}};
 const before=structuredClone({body:b.articulatedRider,aux:b.anchorState,hull}),p=b.riderPose(hull,context);
 assert.deepEqual({body:b.articulatedRider,aux:b.anchorState,hull},before);
 assert.deepEqual(p.animationOutcome,{nextAnimationFrame:31,pendingNextAnimationFrame:47});
 const a=actions.evaluate({actorState:8,animationFrame:30,hull}),c=actions.evaluate({actorState:9,animationFrame:46,hull});
 p.targets.forEach((v,i)=>AXES.forEach(k=>assert.ok(Math.abs(v[k]-(a.targets[i][k]*.6+c.targets[i][k]*.4))<1e-6)));
 const anchors=p.resolveAnchors({mode:1});assert.equal(b.anchorState.logicalFrames,1);assert.equal(b.articulatedRider.logicalFrames,0);
 assert.throws(()=>p.resolveAnchors({mode:1}),/once/);
 stepNativeArticulatedRider(b.articulatedRider,{targets:p.targets,historyTargets:p.historyTargets,anchors,center:hull.center,up:hull.frame.up});
 assert.equal(b.articulatedRider.logicalFrames,1);
 const idle=createNativeLifecycleRider({initialHull:hull}),idleContext={...context,poseRequest:{actorState:10,animationFrame:1,pending:null,blendProgress:0}};
 assert.throws(()=>idle.riderPose(hull,idleContext),/actual idleChoice16c4/);
 const recovered=idle.riderPose(hull,{...idleContext,actionPoseState:{idleChoice16c4:2}});assert.equal(recovered.animationOutcome.nextAnimationFrame,2);
 const dive=createNativeLifecycleRider({initialHull:hull});
 assert.throws(()=>dive.riderPose(hull,{...context,recoveryState:{alternateStumble:0},actionPoseState:{alternate16cc:1},
  poseRequest:{actorState:25,animationFrame:0,pending:null,blendProgress:0}}),/actual lifecycle owner/);
});
