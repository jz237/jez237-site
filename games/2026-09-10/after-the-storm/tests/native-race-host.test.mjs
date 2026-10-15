import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeHostInput,NATIVE_HOST_DEFAULT_TUNE} from '../native-race-host.js';
import {nativeRaceSnapshot} from '../native-race-adapter.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureRaceWater} from '../race-water.js';
import {beginGhostRace} from '../time-trial-ghost.js';
import {verificationInput} from '../race-verification.js';

const create=(options={})=>createRace({mode:'time',course:getCourse('greyhaven'),physics:'native',...options});
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);

test('browser adaptation retains the digital A/B/R bits and native axis signs',()=>{
 assert.deepEqual(nativeHostInput({throttle:.01,steer:.5,lean:-.5,dampen:true,slide:true}),
  {rawXNative:-35,rawYNative:-35,heldButtons:0xc010});
 assert.equal(nativeHostInput({throttle:1,brake:true,dampen:true}).heldButtons,0x4000);
 assert.equal(nativeHostInput({throttle:false}).heldButtons,0);
 for(const input of [{steer:2},{lean:NaN},{throttle:-1},{brake:1},{slide:'R'},{dampen:1}])assert.throws(()=>nativeHostInput(input));
});

test('native preview creates actual point/rider solvers and explicit recovered tune defaults',()=>{
 const s=create(),host=s.nativeHost,a=host.world.adapters[0];
 assert.ok(s.nativePreview&&s.demoRun);assert.equal(beginGhostRace(s),null);
 assert.equal(a.hull.points.length,12);assert.equal(a.articulatedRider.points.length,19);
 for(const [key,value]of Object.entries(NATIVE_HOST_DEFAULT_TUNE))assert.equal(a.water.profile[key],value);
 assert.equal(host.contacts.geometry.shore.length,49);assert.equal(host.contacts.geometry.floor.length,231);
 assert.equal(host.provenance.actorRecoveryAndTricks,false);assert.equal(host.provenance.nativeRacerCollision,true);
 assert.equal(host.provenance.sourcePrimaryBuoyContacts,true);assert.equal(host.primary.snapshot().length,s.course.sourceBuoyLayout.nodes.length);
 assert.equal(a.surface,host.world.surface);assert.ok(a.surface.cellAtNative);
});

test('host adjudication reads current buoy centers before their once-per-frame motion',()=>{
 const s=create(),host=s.nativeHost,adjudicate=host.onFrame;let checks=0;
 host.onFrame=(h,c)=>{
  checks++;assert.equal(h.primary.state.motionFrames,c.logicalFrame-1);assert.equal(h.world.water.frames,c.logicalFrame);
  const row=s.racers[0].sourceBuoys.nextSourceRow;
  assert.deepEqual(h.primary.positionForSourceRow(row),h.primary.snapshot().find(n=>n.sourceRow===row).position);
  return adjudicate(h,c);
 };
 s.phase='running';for(let i=0;i<6;i++)stepRace(s,{throttle:1},1/60);
 assert.equal(checks,2);assert.equal(host.primary.state.motionFrames,2);
 assert.equal(s.primaryBuoys.length,s.course.sourceBuoyLayout.nodes.length);
 assert.equal(s.primaryBuoys[0].velocityNative,undefined);assert.equal(s.primaryBuoys[0].physicsEnabled,undefined);
});

test('native preview is restricted to its verified integration boundary',()=>{
 for(const options of [{mode:'stunt'},{mode:'race'},{seaState:'surf'},{course:getCourse('neon')}])assert.throws(()=>create(options),/Sunny Beach/);
 assert.equal(create({mode:'versus'}).racers.length,2);
 assert.throws(()=>create({mode:'versus',handicap:true}),/catch-up/);
 assert.throws(()=>createRace({physics:'other'}),/physics/);
 const ordinary=createRace({mode:'time'});assert.equal(ordinary.physics,'modern');assert.equal(ordinary.nativeHost,null);
});

test('actual point snapshots drive display pose without running the rigid solver or double-stepping water',()=>{
 const s=create();s.phase='running';
 for(let i=0;i<60;i++)stepRace(s,{throttle:1,steer:.2,lean:.15},1/60);
 const r=s.racers[0],a=s.nativeHost.world.adapters[0],q=nativeRaceSnapshot(a);
 assert.equal(a.hull.ticks,100);assert.equal(a.logicalFrames,20);assert.equal(s.raceWater.frames,20);assert.equal(s.raceWater.remainder,0);
 assert.equal(a.articulatedRider.logicalFrames,20);assert.equal(s.nativeHost.bundles[0].anchorState.logicalFrames,20);
 near(r.x,q.position.x);near(r.hydro.y,q.position.y);near(r.z,q.position.z);near(r.vx,q.velocity.x);near(r.vz,q.velocity.z);
 near(r.heading,q.heading);near(r.hydro.pitch,q.pitch);near(r.hydro.roll,q.roll);
 assert.equal(r.nativeTelemetry.hudSpeed,q.source.hudSpeed);assert.equal(r.nativeTelemetry.logicalFrame,20);
 assert.equal(r.hydro.landingId,0);assert.equal(r.stunt.score,0);assert.equal(r.flipArc,undefined);
 assert.equal(a.lastControls.rawXNative,-14);assert.equal(a.lastControls.rawYNative,10);
 near(r.sourceBuoyElapsed,0);assert.deepEqual(r.sourceBuoyPrevious,{x:r.x,z:r.z});
});

test('race host controls, nineteen-point history and water remain identical across host refresh rates',()=>{
 const states=[];
 for(const hz of [30,60,144]){
  const s=create();s.phase='running';for(let i=0;i<hz;i++)stepRace(s,{throttle:1,steer:.2,dampen:true},1/hz);states.push(s);
 }
 const base=states[0];
 for(const s of states.slice(1)){
  assert.deepEqual(nativeRaceSnapshot(s.nativeHost.world.adapters[0]),nativeRaceSnapshot(base.nativeHost.world.adapters[0]));
  assert.deepEqual(s.nativeHost.world.adapters[0].articulatedRider.points,base.nativeHost.world.adapters[0].articulatedRider.points);
  assert.deepEqual(captureRaceWater(s.raceWater),captureRaceWater(base.raceWater));
  assert.deepEqual(s.racers[0].sourceBuoys,base.racers[0].sourceBuoys);assert.equal(s.time,1);
 }
});

test('closed-loop yaw feedback consumes fixed physical samples and has identical trajectories across refresh rates',()=>{
 const states=[];
 for(const hz of [30,60,144]){
  const s=create();s.phase='running';
  for(let i=0;i<hz*2;i++)stepRace(s,()=>({throttle:1,
   steer:Math.max(-1,Math.min(1,.2-s.nativeHost.presentations[0].racer.yawVelocity*.4))}),1/hz);
  states.push(s);
 }
 const base=states[0];
 for(const s of states.slice(1)){
  assert.deepEqual(nativeRaceSnapshot(s.nativeHost.world.adapters[0]),nativeRaceSnapshot(base.nativeHost.world.adapters[0]));
  assert.deepEqual(s.nativeHost.presentations,base.nativeHost.presentations);
  assert.deepEqual(s.racers[0].sourceBuoys,base.racers[0].sourceBuoys);
  assert.deepEqual(captureRaceWater(s.raceWater),captureRaceWater(base.raceWater));
 }
});

test('native actor state remains explicit while all four numeric rider profiles can drive and trim',()=>{
 const results=[];
 for(let rider=0;rider<4;rider++){
  const s=create({rider});s.phase='running';for(let i=0;i<120;i++)stepRace(s,{throttle:1,lean:.1},1/60);
  const a=s.nativeHost.world.adapters[0];assert.equal(a.rider.riderIndex,rider);assert.equal(a.lastFrame.actorState,22);
  assert.ok(s.racers[0].speed>10);assert.ok(Object.values(a.articulatedRider.jointWorld).every(Number.isFinite));results.push(s.racers[0].speed);
 }
 assert.equal(new Set(results).size,4);
});

test('paused/countdown/result calls cannot pump source hull or camera history',()=>{
 const s=create(),a=s.nativeHost.world.adapters[0],initial=captureRaceWater(s.raceWater);
 stepRace(s,{throttle:1},1/60);assert.equal(a.hull.ticks,0);assert.deepEqual(captureRaceWater(s.raceWater),initial);
 s.phase='running';stepRace(s,{throttle:1},1/60);const q=nativeRaceSnapshot(a),field=captureRaceWater(s.raceWater),remaining=s.nativeHost.world.remainder;
 for(const phase of ['paused','results']){s.phase=phase;stepRace(s,{throttle:1},1/60);assert.deepEqual(nativeRaceSnapshot(a),q);assert.deepEqual(captureRaceWater(s.raceWater),field);assert.equal(s.nativeHost.world.remainder,remaining);}
});

test('display mutation cannot move the source hull or feed a modern rescue/force pass',()=>{
 const s=create();s.phase='running';stepRace(s,{},1/60);const a=s.nativeHost.world.adapters[0],before={...a.hull.center};
 s.racers[0].x=999;s.racers[0].vx=999;stepRace(s,{rescue:true},1/60);
 assert.ok(Math.abs(s.racers[0].x-before.x)<1);assert.ok(Math.abs(s.racers[0].vx)<1);near(s.racers[0].x,a.hull.center.x);
 assert.equal(a.hull.ticks,3);assert.equal(s.raceWater.frames,0);
});

test('local verification uses the authored native helm through normal frame-sampled controls',()=>{
 const s=create();s.phase='running';const r=s.racers[0];
 for(let i=0;i<180*60&&s.phase!=='results';i++)stepRace(s,()=>verificationInput(s,r),1/60);
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.misses,0);assert.equal(r.lap,4);
 assert.equal(r.passed,42);assert.equal(s.nativeHost.world.remainder,0);
 assert.equal(s.nativeHost.world.adapters[0].lastControls.heldButtons&0x4010,0);
 assert.equal(r.hydro.landingId,0);assert.equal(r.stunt.score,0);
});
