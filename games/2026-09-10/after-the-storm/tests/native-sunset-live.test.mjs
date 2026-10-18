import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace,stepRace} from '../race-core.js';
import {createNativeRacePilot} from '../native-race-pilot.js';
import {nativeRaceSnapshot} from '../native-race-adapter.js';
import {captureRaceWater} from '../race-water.js';
import {createNativeRiderRecovery} from '../native-rider-recovery.js';
import {captureWindowFrame,readWindowFrame} from '../player-window-presentation.js';

const create=(difficulty,mode='time')=>createRace({course:getCourse('amber',difficulty),difficulty,mode,physics:'native'});

test('Sunset two-player presentation carries both native riders, source cameras and selected buoy geometry',()=>{
 for(const difficulty of [0,1,2,3]){
  const s=create(difficulty,'versus');for(let i=0;i<12;i++)stepRace(s,[{},{}],1/60);
  const frame=readWindowFrame(structuredClone(captureWindowFrame(s,{native:captureRaceWater(s.raceWater),level:0,wake:[],impacts:[],craft:[]})));
  assert.ok(frame);assert.equal(frame.racers.length,2);assert.equal(frame.primaryBuoys.length,s.nativeHost.primary.snapshot().length);
  for(let i=0;i<2;i++){assert.deepEqual(frame.racers[i].nativeRiderPose,s.racers[i].nativeRiderPose);assert.deepEqual(frame.racers[i].nativeCamera,s.racers[i].nativeCamera);}
  assert.equal(frame.nativeHost,undefined);assert.equal(frame.water.native.field,undefined);
 }
});

for(const mode of ['time','versus'])for(const difficulty of [0,1])test(`native Sunset ${mode} class${difficulty} completes through ordinary human controls`,()=>{
 const s=create(difficulty,mode),pilots=s.racers.map(()=>createNativeRacePilot({course:s.course}));
 assert.equal(s.course.shoreContacts.edges.length,mode==='versus'?47:63);
 assert.equal(s.course.sourceCourseOutRegions.allowedRegionsNative.length,11);
 const anchors=structuredClone(s.course.anchors),rows=structuredClone(s.course.sourceRouteRowsByClass);
 for(let i=0;i<180*60&&s.phase!=='postrace';i++)stepRace(s,mode==='versus'?s.racers.map((r,j)=>()=>pilots[j].input(s,r)):()=>pilots[0].input(s),1/60);
 assert.equal(s.phase,'postrace');assert.equal(s.racers[0].dq,'');assert.equal(s.racers[0].misses,0);
 assert.equal(s.racers[0].lapTimes.length,3);assert.equal(s.racers[0].passed,s.course.gates.length*3);
 assert.ok(s.racers[0].finishTime>60&&s.racers[0].finishTime<180);
 assert.deepEqual(s.course.anchors,anchors);assert.deepEqual(s.course.sourceRouteRowsByClass,rows);
});

for(const difficulty of [0,1,2,3])test(`native Sunset class${difficulty} original AI takeover diagnostic completes the physical course`,()=>{
 const s=create(difficulty);
 // Explicit inspection setup: select the existing original AI input branch
 // on the single human slot. No position, buoy, clock, power or score is set.
 // This is not a claim that ordinary play selects AI before the finish.
 for(let i=0;i<180*60&&s.phase!=='postrace';i++){
  const lifecycle=s.nativeHost.world.adapters[0].riderLifecycle;
  if(s.phase==='running'&&lifecycle.state.selectionCountdown>=0)
   lifecycle.state=createNativeRiderRecovery({...lifecycle.state,selectionCountdown:-1});
  stepRace(s,{},1/60);
 }
 const r=s.racers[0];assert.equal(s.phase,'postrace');assert.equal(r.dq,'');assert.equal(r.lapTimes.length,3);
 // Full source objects include the kind1 ramp in890B4's proximity count;
 // exact fixed-sphere contacts also replace the earlier double solver. These
 // authored-hull inspection bounds describe this configuration, not an
 // original-ROM AI race trace. Ordinary human-control checks above stay clean.
 assert.equal(s.nativeHost.aiInitialization.proximityCount,1);
 assert.equal(r.passed,s.course.gates.length*3);assert.ok(r.misses<=[0,2,3,2][difficulty]);
 assert.ok(r.finishTime>60&&r.finishTime<180);assert.ok(s.nativeHost.lastAIInput);
});

test('all Sunset classes preserve two-player native physics, water and progress across render rates',()=>{
 for(const difficulty of [0,1,2,3]){
  let reference;
  for(const hz of [60,30,144]){
   const s=create(difficulty,'versus');
   const inputs=s.racers.map((_,i)=>(time)=>({throttle:time>4?1:0,steer:time>7?(i?-.2:.2):0}));
   for(let i=0;i<10*hz;i++)stepRace(s,inputs,1/hz);
   assert.equal(s.nativeHost.world.frames,200);assert.equal(s.nativeHost.world.ticks,1000);
   const snapshot={bodies:s.nativeHost.world.adapters.map(nativeRaceSnapshot),water:captureRaceWater(s.raceWater),state:s.nativeLaunch.snapshot(),progress:s.racers.map(r=>structuredClone(r.sourceBuoys))};
   if(reference)assert.deepEqual(snapshot,reference,`class${difficulty} ${hz}Hz`);else reference=snapshot;
  }
 }
});
