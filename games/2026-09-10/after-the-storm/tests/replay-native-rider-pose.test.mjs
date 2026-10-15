import test from 'node:test';
import assert from 'node:assert/strict';
import {createRecorder,recordMoment,replaySample} from '../instant-replay.js';
import {RIDER_TARGET_BONES,prepareRiderTargetPose} from '../rider-target-pose.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureRaceWater} from '../race-water.js';

const ABSENT=Symbol('no physical pose');
const near=(a,b,e=1e-12)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const nearPoint=(a,b)=>a.forEach((n,i)=>near(n,b[i]));
function physicalPose(offset=0,sourceLogicalFrame=10){
 return {targets:Object.fromEntries(RIDER_TARGET_BONES.map((name,i)=>[name,[
  [i*.1+offset,.5+i*.05+offset*2,-.2+i*.03-offset],
  [.02+i*.1+offset*3,.65+i*.05+offset,.1+i*.03+offset*2]
 ]])),yaw:offset?-.3:.15,headYaw:offset?.8:.25,
 diagnostics:{presentationOnly:true,source:'solved-19-world-points',coordinateSpace:'craft-local-world-units',
  sourceLogicalFrame,pelvisAxis:'hip-midpoint-to-root',capturedFlags:[sourceLogicalFrame],constraintError:offset?9:1}};
}
function racer(pose=ABSENT,id=0){
 const r={id,x:0,z:0,speed:0,turn:0,vx:0,vz:0,heading:0,misses:0,power:0,lap:1,
  hydro:{y:0,waterHeight:0,airborne:false,pitch:0,roll:0},stunt:{trick:'',angle:0}};
 if(pose!==ABSENT)r.nativeRiderPose=pose;return r;
}
function recording(a,b,{firstId=0,lastId=0}={}){
 const recorder=createRecorder(),state={phase:'running',time:0,racers:[racer(a,firstId)],weather:{},breakables:null};
 recordMoment(recorder,state,null);state.time=.05;state.racers=[racer(b,lastId)];recordMoment(recorder,state,null);
 return {recorder,state,clip:{frames:recorder.frames}};
}
function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}

test('all15 physical display bones interpolate endpointXYZ with discrete recorded provenance and yaw',()=>{
 const a=physicalPose(),b=physicalPose(.4,11),{clip}=recording(a,b);
 const result=replaySample(clip,.0125).racers[0].nativeRiderPose;
 for(const name of RIDER_TARGET_BONES){
  nearPoint(result.targets[name][0],a.targets[name][0].map((n,i)=>n+[.1,.2,-.1][i]));
  nearPoint(result.targets[name][1],a.targets[name][1].map((n,i)=>n+[.3,.1,.2][i]));
 }
 nearPoint(result.targets.torso[0],[.1,.7,-.3]);nearPoint(result.targets.torso[1],[.32,.75,.3]);
 assert.equal(result.yaw,.15);assert.equal(result.headYaw,.25);assert.deepEqual(result.diagnostics,a.diagnostics);
 assert.equal(result.diagnostics.sourceLogicalFrame,10);assert.equal(result.diagnostics.constraintError,1);
 assert.deepEqual(result.replayPresentation,{policy:'display-endpoints-only',targetsInterpolated:true,fromRecordedTime:0,toRecordedTime:.05,blend:.25});
 assert.doesNotThrow(()=>prepareRiderTargetPose(result));
});

test('exact recorded times and clamped ends select exact detached DTOs instead of fractional physical frames',()=>{
 const a=physicalPose(),b=physicalPose(.4,11),{clip}=recording(a,b);
 for(const time of [-1,0])assert.deepEqual(replaySample(clip,time).racers[0].nativeRiderPose,a);
 for(const time of [.05,1]){
  const result=replaySample(clip,time).racers[0].nativeRiderPose;
  assert.deepEqual(result,b);assert.notEqual(result,b);assert.equal(result.diagnostics.sourceLogicalFrame,11);
  assert.equal(result.replayPresentation,undefined);
 }
});

test('native, modern, null and missing-pose boundaries hold the earlier recorded property until the next frame',()=>{
 const a=physicalPose(),b=physicalPose(.4,11);
 for(const [first,last]of [[a,ABSENT],[ABSENT,b],[a,null],[null,b],[ABSENT,null],[null,ABSENT]]){
  const {clip}=recording(first,last),middle=replaySample(clip,.025).racers[0],end=replaySample(clip,.05).racers[0];
  if(first===ABSENT)assert.equal(Object.hasOwn(middle,'nativeRiderPose'),false);
  else assert.deepEqual(middle.nativeRiderPose,first);
  if(last===ABSENT)assert.equal(Object.hasOwn(end,'nativeRiderPose'),false);
  else assert.deepEqual(end.nativeRiderPose,last);
 }
});

test('different rider identity or display provenance cannot blend unrelated physical anatomy',()=>{
 const a=physicalPose(),b=physicalPose(.4,11),differentSpace=structuredClone(b),differentSource=structuredClone(b);
 differentSpace.diagnostics.coordinateSpace='another-display-frame';differentSource.diagnostics.source='different-solver-record';
 for(const [last,ids]of [[b,{firstId:0,lastId:1}],[differentSpace,{}],[differentSource,{}]]){
  const {clip}=recording(a,last,ids);
  assert.deepEqual(replaySample(clip,.025).racers[0].nativeRiderPose,a);
  assert.deepEqual(replaySample(clip,.05).racers[0].nativeRiderPose,last);
 }
});

test('recorded physical targets and provenance are detached from live edits and every sampled replay DTO',()=>{
 const live=physicalPose(),later=physicalPose(.4,11),{recorder,state,clip}=recording(live,later);
 const saved=structuredClone(recorder.frames);later.targets.handR[1][2]=999;live.diagnostics.capturedFlags.push(999);
 assert.deepEqual(recorder.frames,saved);
 freeze(recorder.frames);
 const sample=replaySample(clip,.025).racers[0].nativeRiderPose;
 assert.equal(new Set(Object.values(sample.targets).flat()).size,30);
 sample.targets.handL[0][0]=999;sample.diagnostics.sourceLogicalFrame=999;sample.diagnostics.capturedFlags.push(999);
 sample.replayPresentation.fromRecordedTime=999;
 const again=replaySample(clip,.025).racers[0].nativeRiderPose;
 assert.notEqual(again.targets.handL[0][0],999);assert.equal(again.diagnostics.sourceLogicalFrame,10);
 assert.deepEqual(again.diagnostics.capturedFlags,[10]);assert.equal(again.replayPresentation.fromRecordedTime,0);
 assert.deepEqual(recorder.frames,saved);assert.equal(state.time,.05);assert.equal(state.racers[0].misses,0);
});

test('malformed matching physical anatomy rejects without rewriting either recorded frame',()=>{
 const a=physicalPose(),b=physicalPose(.4,11);delete b.targets.footR;
 const {clip}=recording(a,b),before=structuredClone(clip.frames);freeze(clip.frames);
 assert.throws(()=>replaySample(clip,.025),/footR/);assert.deepEqual(clip.frames,before);
});

test('repeated paused replay samples of an actual native recording cannot pump body, rider, anchors, water or live counters',()=>{
 const state=createRace({course:getCourse('greyhaven'),mode:'time',physics:'native'});state.phase='running';
 const recorder=createRecorder();recordMoment(recorder,state,{native:captureRaceWater(state.raceWater)});
 for(let i=0;i<3;i++)stepRace(state,{throttle:1,steer:.2,lean:.15},1/60);
 recordMoment(recorder,state,{native:captureRaceWater(state.raceWater)});
 assert.equal(recorder.frames.length,2);state.phase='paused';
 const host=state.nativeHost,adapter=host.world.adapters[0],clip={frames:recorder.frames},saved=structuredClone(recorder.frames);
 const fingerprint=()=>JSON.stringify({time:state.time,phase:state.phase,
  counters:state.racers.map(r=>({lap:r.lap,power:r.power,misses:r.misses,sourceBuoys:r.sourceBuoys,pose:r.nativeRiderPose})),
  clock:{ticks:host.world.ticks,frames:host.world.frames,remainder:host.world.remainder},
  hull:adapter.hull,rider:adapter.articulatedRider,anchors:host.bundles[0].anchorState,impacts:adapter.impacts,
  controls:adapter.controlState,water:captureRaceWater(state.raceWater),primary:host.primary.state});
 const before=fingerprint();
 assert.equal(recorder.frames[0].racers[0].nativeRiderPose.diagnostics.sourceLogicalFrame,0);
 assert.equal(recorder.frames[1].racers[0].nativeRiderPose.diagnostics.sourceLogicalFrame,1);
 const expected=replaySample(clip,.025).racers[0].nativeRiderPose;
 for(let i=0;i<120;i++){
  const p=replaySample(clip,.025).racers[0].nativeRiderPose;
  assert.deepEqual(p,expected);assert.doesNotThrow(()=>prepareRiderTargetPose(p));
  p.targets.head[0][0]=999;p.diagnostics.sourceLogicalFrame=999;
 }
 assert.equal(fingerprint(),before);assert.deepEqual(recorder.frames,saved);
 assert.equal(adapter.hull.ticks,5);assert.equal(adapter.articulatedRider.logicalFrames,1);
 assert.equal(host.bundles[0].anchorState.logicalFrames,1);assert.equal(state.raceWater.frames,1);
 assert.equal(state.phase,'paused');assert.equal(state.time,.05);
});
