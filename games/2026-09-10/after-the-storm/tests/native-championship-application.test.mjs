import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRaceContactAudio} from '../native-race-contact-audio.js';
import {beginGhostRace} from '../time-trial-ghost.js';

const create=(options={})=>createRace({mode:'championship',physics:'native',course:getCourse('greyhaven'),...options});
function frames(s,n){
 const end=s.nativeHost.world.frames+n;
 for(let guard=0;s.nativeHost.world.frames<end;guard++){
  assert.ok(guard<n*10+10,'application unexpectedly stopped');stepRace(s,{throttle:1},1/60);
 }
}

test('application owns four prepared bodies, one human camera/audio channel and explicit pending presentation',()=>{
 for(const rider of [0,1,2,3]){
  const s=create({rider,laps:9,nativeTunes:[{tuneB6c:1,tuneB70:7,tuneB74:11}],nativeTuneModes:['custom']}),p=s.nativeLaunch.championshipLaunch;
  assert.equal(s.racers.length,4);assert.equal(s.nativeHost.world.adapters.length,4);assert.equal(s.nativeHost.world.water.players,1);
  assert.equal(s.laps,3);assert.equal(s.nativeLaunch.snapshot().scene.configuredLaps728,3);
  assert.equal(s.nativePreview,true);assert.equal(s.demoRun,true);assert.equal(beginGhostRace(s),null);
  for(let i=0;i<4;i++){
   const a=s.nativeHost.world.adapters[i],start=p.hullStarts[i].prepared,profile=p.bodyProfiles[i];
   assert.equal(a.controlOrigin,i?'ai':'human');assert.equal(a.computerProfile,i!==0);
   for(const key of ['tuneB6c','tuneB70','tuneB74'])assert.equal(a.water.profile[key],profile[key]);
   assert.deepEqual(a.hull.center,Object.fromEntries(Object.entries(start.centerNative).map(([k,v])=>[k,v*.025])));
   assert.equal(s.racers[i].x,a.hull.center.x);assert.equal(s.racers[i].z,a.hull.center.z);
  }
  const audio=createNativeRaceContactAudio({players:1,courseIndex:1,difficultyWord:0});
  audio.applyEffects(p.pendingEffects.filter(o=>o.consumer==='800c21f4'));
  assert.deepEqual(s.nativeContactAudio.snapshot(),audio.snapshot(),'source startup audio executes once');
  assert.deepEqual(s.nativeContactAudio.drain(),audio.drain());
  assert.deepEqual(s.nativePendingStartupPresentation,p.pendingEffects.filter(o=>o.consumer!=='800c21f4'));
  assert.equal(s.nativePendingStartupPresentation.filter(o=>o.kind==='presentationBufferWrite').length,128);
 }
});

test('application advances startup, all four source racers and human audio at the same20Hz cadence',()=>{
 let expected;
 for(const hz of [30,60,144]){
  const s=create();
  for(let i=0;i<hz*12;i++)stepRace(s,{throttle:1},1/hz);
  assert.equal(s.phase,'running');assert.equal(s.nativeHost.world.frames,240);assert.equal(s.nativeLaunch.scene().phase650,3);
  assert.equal(s.nativeHost.lastAIInput.frame.phase,'driving');assert.equal(s.nativeContactAudio.snapshot().frame,240);
  assert.equal(s.nativeContactAudio.snapshot().timerFrame,240);
  assert.equal(s.nativeContactAudio.snapshot().globals.raceMode,0,'three computers do not become three extra human channels');
  assert.deepEqual(s.nativeHost.world.adapters.map(a=>a.lastControls.controlOrigin),['human','ai','ai','ai']);
  const value={canonical:s.nativeLaunch.snapshot(),audio:s.nativeContactAudio.snapshot(),events:s.events,
   hulls:s.nativeHost.world.adapters.map(a=>a.hull.points),water:s.raceWater.field.heightQ};
  if(expected)assert.deepEqual(value,expected);else expected=structuredClone(value);
 }
});

test('championship finish entry uses the selected round and leaves rival results to the source owner',()=>{
 const s=create();frames(s,130);s.racers[0].finishTime=3.75;frames(s,1);
 const state=s.nativeLaunch.snapshot();
 assert.equal(s.phase,'postrace');assert.equal(state.scene.gameStateAb24,42);
 assert.deepEqual(state.profileWordsB330.slice(0,3),[1,1,0]);
 assert.equal(state.i1Words9440[(0x96cc-0x9440)/4],6,'source last round is loaded, not an empty BSS word');
 assert.equal(state.profileWordsB330[(0xb3d0-0xb330)/4+1],3750);
 assert.equal(state.profileWordsB330[(0xb3d0-0xb330)/4],0,'Dolphin warmup time is untouched');
 assert.equal(s.result.position,s.racers[0].nativePlace+1);assert.equal(s.result.time,3.75);
 assert.equal(s.finishWait,0);assert.ok(s.racers.slice(1).every(r=>r.finishTime===null&&!r.dq));
 // Exercise the application observer at the old40-second cutoff without
 // pretending to simulate40seconds of original physics. It must only read.
 s.finishWait=40;
 const before=s.nativeLaunch.snapshot();
 s.nativeHost.onLaunchFrame(s.nativeHost,{}, {view:s.nativeLaunch.view(),effects:[],operations:[]});
 assert.deepEqual(s.nativeLaunch.snapshot(),before);assert.equal(s.finishWait,40);
 assert.ok(s.racers.slice(1).every(r=>r.finishTime===null&&!r.dq));
});

test('fresh championship rejects mismatched state and unsupported class selections',()=>{
 assert.throws(()=>create({nativeInitialRaceState:{}}),/owns its initial/);
 assert.throws(()=>create({nativeObjectLayout:'authored'}),/canonical objects/);
 assert.throws(()=>create({course:getCourse('glacier',0)}),/does not belong/);
 assert.throws(()=>create({course:getCourse('practice')}),/verified course/);
 assert.throws(()=>create({seaState:'surf'}),/source-water/);
});
