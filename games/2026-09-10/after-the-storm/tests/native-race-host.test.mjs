import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeHostInput,NATIVE_HOST_DEFAULT_TUNE,stepNativeRaceHost} from '../native-race-host.js';
import {nativeRaceSnapshot} from '../native-race-adapter.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureRaceWater} from '../race-water.js';
import {beginGhostRace} from '../time-trial-ghost.js';
import {verificationInput} from '../race-verification.js';

const create=(options={})=>createRace({mode:'time',course:getCourse('greyhaven'),physics:'native',...options});
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);

test('canonical activity gates buoy and floating motion independently of frozen racer simulation',()=>{
 for(const mode of ['time','versus']){
  const initial=create({mode}).nativeLaunch.snapshot();
  for(const activity of [-32768,-1,0,1,32767])for(const simulation of [0,3]){
   const retained=structuredClone(initial);Object.assign(retained.scene,{activity624:activity,simulation648:simulation,phase650:3});
   const course={...getCourse('greyhaven'),dynamicObjectsForPlayers:()=>[{id:'gate-fixture',x:40,y:-.5,z:40}]};
   const s=create({mode,course,nativeInitialRaceState:retained}),h=s.nativeHost;
   const primary=h.primary.snapshot(),floating=h.floating.snapshot(),hulls=h.world.adapters.map(a=>structuredClone(a.hull));
   const input=s.racers.map(()=>({}));
   stepNativeRaceHost(h,.15,input);
   assert.equal(h.world.frames,3);assert.equal(h.primary.diagnostics().outerFrames,3);assert.equal(h.floating.diagnostics().outerFrames,3);
   assert.equal(h.primary.diagnostics().motionUpdates,activity===-1?3:0);
   assert.equal(h.floating.diagnostics().motionUpdates,activity===-1?3:0);
   assert.equal(h.world.ticks,simulation===0?0:15);
   if(simulation===0){
    assert.deepEqual(h.world.adapters.map(a=>a.hull),hulls);
    if(activity===-1){assert.notDeepEqual(h.primary.snapshot(),primary);assert.notDeepEqual(h.floating.snapshot(),floating);}
    else{assert.deepEqual(h.primary.snapshot(),primary);assert.deepEqual(h.floating.snapshot(),floating);}
   }
   assert.equal(s.nativeLaunch.objectMotionActive(),activity===-1);
   const before={primary:h.primary.snapshot(),floating:h.floating.snapshot(),water:captureRaceWater(s.raceWater),canonical:s.nativeLaunch.snapshot()};
   stepNativeRaceHost(h,1,input,{active:false});
   assert.equal(h.world.frames,3);assert.deepEqual({primary:h.primary.snapshot(),floating:h.floating.snapshot(),water:captureRaceWater(s.raceWater),canonical:s.nativeLaunch.snapshot()},before);
  }
 }
});

test('explicit host object-motion switches still hold an active canonical scene',()=>{
 const retained=create().nativeLaunch.snapshot();Object.assign(retained.scene,{activity624:-1,simulation648:0,phase650:3});
 const course={...getCourse('greyhaven'),dynamicObjectsForPlayers:()=>[{id:'preview-gate',x:40,y:-.5,z:40}]};
 const s=create({course,nativeInitialRaceState:retained}),h=s.nativeHost;
 h.primaryActive=false;h.floatingActive=false;stepNativeRaceHost(h,.1,[{}]);
 assert.equal(h.primary.diagnostics().motionUpdates,0);assert.equal(h.floating.diagnostics().motionUpdates,0);
 h.primaryActive=true;h.floatingActive=true;stepNativeRaceHost(h,.05,[{}]);
 assert.equal(h.primary.diagnostics().motionUpdates,1);assert.equal(h.floating.diagnostics().motionUpdates,1);
 assert.equal(h.world.ticks,0);assert.equal(h.world.frames,3);
});

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
 assert.equal(a.hull.initialization.transform,'packed16.16 decode and physical refit');
 assert.equal(host.provenance.hullStartup,'decoded packed16.16 transform; source point/frame/rest/damping recipe with authored local shape');
 assert.ok(a.hull.points.every(p=>Object.values(p.velocity).every(v=>v===0)));
 assert.ok(a.hull.yawFrame);assert.equal(a.hull.matrixWords,undefined);assert.equal(a.hull.prepared,undefined);
 for(const [key,value]of Object.entries(NATIVE_HOST_DEFAULT_TUNE))assert.equal(a.water.profile[key],value);
 assert.equal(host.contacts.geometry.shore.length,49);assert.equal(host.contacts.geometry.floor.length,231);
 assert.match(host.contacts.provenance.numericStatic.floor,/original grid/);
 assert.match(host.contacts.provenance.numericStatic.boxes,/binary32/);
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

test('source judge observation records the pre-motion primary center without owning that buoy',()=>{
 const s=create(),host=s.nativeHost,r=s.racers[0],original=host.onFrame,observations=[];
 host.onFrame=(h,c,ordinary)=>{
  const row=ordinary.before[0].row,center=h.primary.positionForSourceRow(row);
  const result=original(h,c,ordinary),observation=r.sourceBuoyObservation;
  if(observation?.logicalTick===r.sourceBuoys.logicalTicks&&observation.sourceRow===row){
   assert.equal(h.primary.state.motionFrames,c.logicalFrame-1);
   assert.deepEqual(observation.center,{x:center.x,z:center.z});
   assert.deepEqual(observation.position,r.sourceBuoyPrevious);observations.push(structuredClone(observation));
  }
  return result;
 };
 s.phase='running';for(let i=0;i<1800&&observations.length<3;i++)stepRace(s,()=>verificationInput(s,r),1/60);
 assert.ok(observations.length>=3);const before=host.primary.snapshot();r.sourceBuoyObservation.center.x=999;
 assert.deepEqual(host.primary.snapshot(),before);
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
  const s=create({rider});let startup=0;
  while((s.phase==='countdown'||s.nativeHost.world.adapters[0].riderLifecycle.state.actorState===15)&&startup++<600)stepRace(s,{},1/60);
  assert.ok(startup<600,'the actual countdown and starting pose complete');
  for(let i=0;i<120;i++)stepRace(s,{throttle:1,lean:.1},1/60);
  const a=s.nativeHost.world.adapters[0];assert.equal(a.rider.riderIndex,rider);assert.equal(a.lastFrame.actorState,22);
  assert.ok(s.racers[0].speed>10);assert.ok(Object.values(a.articulatedRider.jointWorld).every(Number.isFinite));results.push(s.racers[0].speed);
 }
 assert.equal(new Set(results).size,4);
});

test('source countdown evolves physical history with a stopped clock; pause/results preserve both owners',()=>{
 const s=create(),a=s.nativeHost.world.adapters[0],initial=captureRaceWater(s.raceWater);
 for(let i=0;i<3;i++)stepRace(s,{throttle:1},1/60);
 assert.equal(a.hull.ticks,5);assert.equal(s.raceWater.frames,1);assert.notDeepEqual(captureRaceWater(s.raceWater),initial);
 assert.equal(a.lastControls.throttle,false);assert.equal(a.lastFrame.actorState,15);assert.equal(s.racers[0].raceTime,0);
 const q=nativeRaceSnapshot(a),field=captureRaceWater(s.raceWater),remaining=s.nativeHost.world.remainder,owner=s.nativeLaunch.snapshot();
 for(const phase of ['paused','results']){s.phase=phase;stepRace(s,{throttle:1},1/60);assert.deepEqual(nativeRaceSnapshot(a),q);assert.deepEqual(captureRaceWater(s.raceWater),field);assert.equal(s.nativeHost.world.remainder,remaining);assert.deepEqual(s.nativeLaunch.snapshot(),owner);}
});

test('display mutation cannot move the source hull or feed a modern rescue/force pass',()=>{
 const s=create();s.phase='running';stepRace(s,{},1/60);const a=s.nativeHost.world.adapters[0],before={...a.hull.center};
 s.racers[0].x=999;s.racers[0].vx=999;stepRace(s,{rescue:true},1/60);
 assert.ok(Math.abs(s.racers[0].x-before.x)<1);assert.ok(Math.abs(s.racers[0].vx)<1);near(s.racers[0].x,a.hull.center.x);
 assert.equal(a.hull.ticks,3);assert.equal(s.raceWater.frames,0);
});

test('local verification uses the authored native helm through normal frame-sampled controls',()=>{
 const s=create();s.phase='running';const r=s.racers[0];
 for(let i=0;i<180*60&&s.phase!=='postrace';i++)stepRace(s,()=>verificationInput(s,r),1/60);
 assert.equal(s.phase,'postrace');assert.equal(r.dq,'');assert.equal(r.misses,0);assert.equal(r.lap,3);
 assert.equal(r.lapTimes.length,3);assert.ok(r.finishTime>0);
 assert.equal(r.passed,42);assert.equal(s.nativeHost.world.remainder,0);
 assert.equal(s.nativeHost.world.adapters[0].lastControls.heldButtons&0x4010,0);
 assert.equal(r.hydro.landingId,0);assert.equal(r.stunt.score,0);
});
