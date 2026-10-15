import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {verificationInput} from '../race-verification.js';
import {nativeRaceWorldSnapshot} from '../native-race-world.js';
import {captureRaceWater} from '../race-water.js';
import {sourceWaterConditions} from '../source-water-conditions.js';
import {beginGhostRace} from '../time-trial-ghost.js';

const create=(options={})=>createRace({mode:'versus',course:getCourse('greyhaven'),physics:'native',waveSeed:17,
 rider:0,secondRider:2,...options});
const input=s=>s.racers.map(r=>()=>verificationInput(s,r));

test('native two-player setup uses both physical riders, the selected class objects and two-camera source water',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  const s=create({course:getCourse('greyhaven',difficulty),difficulty}),w=s.nativeHost.world;
  assert.equal(s.racers.length,2);assert.ok(s.racers.every(r=>r.human));assert.equal(s.course.playerCount,2);
  const visibleCount=[0,3,5,5][difficulty],spheres=s.course.rocks;
  assert.equal(spheres.length,[43,46,48,48][difficulty]);
  assert.ok(spheres.every(q=>q.sourceFixedSphere&&q.fixedSphere&&q.absoluteY&&!q.followsWaterDatum));
  assert.deepEqual(spheres.map(q=>q.sourceSphereFamily),[
   ...Array(visibleCount).fill('generic-xz'),...Array(39).fill('marker'),...Array(4).fill('hidden-xyz')]);
  assert.deepEqual(spheres.filter(q=>!q.hidden).map(q=>q.runtimeTag).sort((a,b)=>a-b),difficulty===0?[]:
   difficulty===1?[2,2,2]:[2,2,2,3,3]);
  assert.equal(spheres.filter(q=>q.sourceBoundaryMarker&&q.hidden&&q.runtimeTag===1&&q.y===0).length,39);
  assert.deepEqual(spheres.slice(-4).map(q=>[q.x,q.y,q.z]),
   [[7582,23,292],[7483,18,659],[-7136,20,779],[-7272,13,424]].map(p=>p.map(v=>v*.025)));
  assert.ok(spheres.slice(-4).every(q=>q.hidden&&q.runtimeTag===5));
  assert.equal(s.sourceSphereGrid.spheres.length,[43,46,48,48][difficulty]);
  assert.deepEqual(s.course.sourceDecorations,[]);assert.deepEqual(s.course.ramps,[]);
  assert.equal(s.raceWater.players,2);assert.equal(s.raceWater.baseAmplitudeNative,
   sourceWaterConditions({courseIndex:1,players:2,stunt:false,reverse:!!s.course.reverse}).baseAmplitudeNative);
  assert.deepEqual(w.humanIndices,[0,1]);assert.equal(w.craftContacts,true);
  assert.deepEqual(w.adapters.map(a=>a.rider.riderIndex),[0,2]);assert.notEqual(w.craftContactStates[0],w.craftContactStates[1]);
  assert.ok(s.racers.every(r=>r.nativeRiderPose&&r.sourceBuoys));assert.equal(beginGhostRace(s),null);
  assert.ok(s.nativePreview&&s.demoRun);
 }
 const same=create({rider:2,secondRider:2});assert.deepEqual(same.nativeHost.world.adapters.map(a=>a.hull.rider),[2,2]);
 assert.notEqual(same.nativeHost.bundles[0].articulatedRider,same.nativeHost.bundles[1].articulatedRider);
});

test('the two normal control streams independently reach their own native accelerator, B, R and trim samples',()=>{
 const s=create({rider:0,secondRider:0});s.phase='running';
 for(let i=0;i<120;i++)stepRace(s,[{throttle:1,dampen:true,lean:.1},{throttle:0,slide:true}],1/60);
 const [a,b]=s.nativeHost.world.adapters;
 assert.ok(s.racers[0].speed>s.racers[1].speed+5);
 assert.equal(a.lastControls.heldButtons,0xc000);assert.equal(a.lastControls.rawYNative,7);
 assert.equal(b.lastControls.heldButtons,0x10);assert.equal(b.lastControls.throttle,false);
 assert.equal(a.hull.ticks,200);assert.equal(b.hull.ticks,200);assert.equal(s.raceWater.frames,40);
 assert.ok(s.racers.every(r=>r.stunt.score===0&&r.hydro.landingId===0));
});

test('single-player input objects and logical-frame providers leave the other human neutral',()=>{
 for(const controls of [{throttle:1},()=>({throttle:1})]){
  const s=create();s.phase='running';
  for(let i=0;i<4;i++)stepRace(s,controls,1/60);
  assert.deepEqual(s.nativeHost.world.adapters.map(a=>a.lastControls.throttle),[true,false]);
  assert.deepEqual(s.nativeHost.world.adapters.map(a=>a.lastControls.heldButtons),[0x8000,0]);
 }
});

for(let difficulty=0;difficulty<4;difficulty++)test(`native two-player class${difficulty} completes a real three-lap match with shared craft contacts`,()=>{
 const s=create({course:getCourse('greyhaven',difficulty),difficulty});s.phase='running';const controls=input(s);
 for(let i=0;i<180*60&&s.phase!=='results';i++)stepRace(s,controls,1/60);
 assert.equal(s.phase,'results');assert.equal(s.result.dq,'');assert.ok([0,1].includes(s.result.winner));
 const winner=s.racers[s.result.winner],other=s.racers[1-s.result.winner],w=s.nativeHost.world;
 assert.equal(winner.lap,4);assert.equal(winner.passed,s.course.gates.length*3);assert.equal(winner.misses,0);
 assert.ok(other.passed>30);assert.ok(s.racers.every(r=>r.misses===0&&r.dq===''));
 assert.ok(w.craftContactCount>0,'the match retains actual shared pair contacts');
 assert.equal(w.craftContactPasses,w.ticks);assert.equal(w.ticks,w.frames*5);assert.equal(w.remainder,0);
 assert.equal(s.nativeHost.primary.state.motionFrames,w.frames);
 assert.ok(w.adapters.every(a=>a.articulatedRider.logicalFrames===w.frames));
 assert.ok(s.nativeHost.bundles.every(b=>b.anchorState.logicalFrames===w.frames));
 const before=nativeRaceWorldSnapshot(w);stepRace(s,[{throttle:1},{throttle:1}],1/60);assert.deepEqual(nativeRaceWorldSnapshot(w),before);
});

test('two independent logical-frame helm providers give identical physical match finishes at30/60/144Hz',()=>{
 let reference=null;
 for(const hz of [30,60,144]){
  const s=create();s.phase='running';const controls=input(s);
  for(let i=0;i<180*hz&&s.phase!=='results';i++)stepRace(s,controls,1/hz);
  assert.equal(s.phase,'results');
  const value={world:nativeRaceWorldSnapshot(s.nativeHost.world),water:captureRaceWater(s.raceWater),
   racers:s.racers.map(r=>({progress:r.sourceBuoys,passed:r.passed,misses:r.misses,lap:r.lap,finishTime:r.finishTime})),
   bodies:s.nativeHost.world.adapters.map(a=>a.articulatedRider.points),anchors:s.nativeHost.bundles.map(b=>b.anchorState),
   primary:s.nativeHost.primary.snapshot(),time:s.time,result:s.result};
  if(reference)assert.deepEqual(value,reference);else reference=structuredClone(value);
 }
});

test('shared pause and restart cannot pump proxy history, impacts, body, rider or water; unsupported selections stay explicit',()=>{
 const s=create();s.phase='running';for(let i=0;i<90;i++)stepRace(s,[{throttle:1},{throttle:1}],1/60);
 s.phase='paused';const before={world:nativeRaceWorldSnapshot(s.nativeHost.world),water:captureRaceWater(s.raceWater)};
 for(let i=0;i<60;i++)stepRace(s,[{throttle:1,steer:1},{throttle:1,steer:-1}],1/60);
 assert.deepEqual({world:nativeRaceWorldSnapshot(s.nativeHost.world),water:captureRaceWater(s.raceWater)},before);
 const fresh=create();assert.equal(fresh.time,0);assert.equal(fresh.nativeHost.world.craftContactPasses,0);
 assert.ok(fresh.nativeHost.world.adapters.every(a=>a.hull.ticks===0&&a.lastFrame.impacts.racerImpactNative===0));
 assert.throws(()=>create({handicap:true}),/catch-up/);assert.throws(()=>create({course:getCourse('practice')}),/Sunny Beach/);
 assert.throws(()=>create({seaState:'surf'}),/Sunny Beach/);
});
