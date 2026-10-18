import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRacePilot} from '../native-race-pilot.js';
import {GLACIER_NATIVE_ROUTE_ROWS_BY_CLASS as rows} from '../source-glacier-rows.js';
import {captureRaceWater} from '../race-water.js';

test('Glacier native selection installs complete source rows, visible markers, static geometry and twelve shared ice blocks',()=>{
 for(let difficulty=0;difficulty<4;difficulty++)for(const mode of ['time','versus']){
  const course=getCourse('glacier',difficulty),anchors=structuredClone(course.anchors);
  const s=createRace({course,difficulty,mode,physics:'native'}),scene=s.nativeLaunch.snapshot().scene;
  assert.equal(scene.courseIndex,8);assert.equal(scene.mode620,mode==='versus'?1:0);
  assert.equal(scene.primaryCount,difficulty===3?48:59);
  assert.equal(s.course.sourceRouteRowsByClass,rows);assert.equal(Object.keys(s.course.sourceVisibleGateIndices).length,17);
  assert.equal(s.nativeHost.primary.state.nodes.length,scene.primaryCount);
  assert.equal(s.nativeHost.ice.snapshot().length,12);assert.equal(s.nativeHost.floating,null);
  assert.equal(s.sourceSphereGrid,null);assert.equal(s.nativeHost.objects.fixedSnapshot().length,108);assert.equal(s.raceWater.amplitudeThresholdNative,14730.544921875);
  assert.equal(s.nativeContactAudio.snapshot().globals.courseIndex,8);
  assert.equal(course.sourceRouteRowsByClass,undefined);assert.equal(course.sourceBuoyLayout,undefined);assert.deepEqual(course.anchors,anchors);
  const modern=createRace({course,difficulty,mode});assert.equal(modern.physics,'modern');assert.equal(modern.course.sourceBuoyLayout,undefined);
 }
 for(const options of [{mode:'race'},{mode:'championship'},{mode:'stunt'},{mode:'practice'},{mode:'time',seaState:'surf'}])
  assert.throws(()=>createRace({course:getCourse('glacier'),physics:'native',...options}),/source-water/);
});

test('forward Glacier inspection anticipates drift without changing controls, route ownership or explicit policy',()=>{
 for(const difficulty of [0,3]){
  const s=createRace({course:getCourse('glacier',difficulty),difficulty,mode:'time',physics:'native'});
  assert.equal(createNativeRacePilot({course:s.course}).diagnostics().policy.velocityPredictionSeconds,difficulty===0?.5:.15);
  assert.equal(createNativeRacePilot({course:s.course,policy:{velocityPredictionSeconds:.3}}).diagnostics().policy.velocityPredictionSeconds,.3);
 }
});

test('Glacier forward solo and reverse versus finish three real laps with shared ice breaks, splashes and source audio',()=>{
 for(const [difficulty,mode]of [[0,'time'],[3,'versus']]){
  const original=getCourse('glacier',difficulty),anchors=structuredClone(original.anchors);
  const s=createRace({course:original,difficulty,mode,physics:'native'}),pilots=s.racers.map(()=>createNativeRacePilot({course:s.course}));
  let fragmentFrames=0,splashFrames=0,paused=false;
  for(let i=0;i<9000&&!['postrace','results'].includes(s.phase);i++){
   stepRace(s,s.racers.map((r,index)=>()=>pilots[index].input(s,r)),1/30);
   fragmentFrames+=Number(s.nativeIce.fragments.some(p=>p.active));splashFrames+=Number(s.nativeIce.splashes.some(p=>p.active));
   if(!paused&&s.time>20){
    paused=true;const phase=s.phase;s.phase='paused';
    const before=JSON.stringify([s.nativeLaunch.snapshot(),captureRaceWater(s.raceWater),s.nativeIce,s.nativeContactAudio.snapshot(),s.racers]);
    for(let n=0;n<5;n++)stepRace(s,{},1/30);
    assert.equal(JSON.stringify([s.nativeLaunch.snapshot(),captureRaceWater(s.raceWater),s.nativeIce,s.nativeContactAudio.snapshot(),s.racers]),before);
    s.phase=phase;
   }
  }
  const winner=s.racers.find(r=>r.finishTime!==null);
  assert.ok(winner,'a racer must cross the actual third finish line');assert.equal(winner.lapTimes.length,3);
  assert.ok(winner.finishTime<180);assert.ok(s.racers.every(r=>r.dq===''&&r.misses<5));
  assert.ok(s.nativeHost.ice.breakEvents().length>0);assert.ok(fragmentFrames>0);assert.ok(splashFrames>0);
  assert.ok(s.nativeContactAudio.snapshot().emitted>0);assert.deepEqual(original.anchors,anchors);
  assert.equal(s.nativeHost.world.frames,s.nativeContactAudio.snapshot().frame);
  // Continue the live result handoff through the same body/AI/audio owners.
  for(let n=0;n<180&&s.phase!=='results';n++)stepRace(s,s.racers.map(()=>({})),1/30);
  assert.ok(s.racers.every(r=>Number.isFinite(r.x)&&Number.isFinite(r.hydro.y)&&Number.isFinite(r.z)));
 }
});
