import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRacePilot,NATIVE_RACE_PILOT_POLICY} from '../native-race-pilot.js';
import {nativeHostInput} from '../native-race-host.js';
import {nativeRaceSnapshot} from '../native-race-adapter.js';
import {captureRaceWater} from '../race-water.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';

const neutral={throttle:0,steer:0,brake:false,lean:0,dampen:false,slide:false};
function fixture(patch={}){
 const course={sourceWaterCourseIndex:1,difficulty:0,anchors:[[0,0],[0,50],[50,50],[50,0]],
  sourceBuoyLayout:{scale:.025,nodes:[
   {sourceRow:5,x:0,z:0,tx:1,tz:0,classification:1,enabled:true},
   {sourceRow:6,x:0,z:10,tx:1,tz:0,classification:0,enabled:true},
   {sourceRow:7,x:0,z:20,tx:1,tz:0,classification:4,enabled:false}]}};
 const presentation={x:0,z:-10,vx:0,vz:0,speed:0,heading:0,yawVelocity:0,...patch};
 const racer={id:0,x:0,z:-10,heading:0,speed:0,finishTime:null,dq:'',misses:0,passed:0,lap:1,power:0,
  sourceBuoys:{nextSourceRow:5,logicalTicks:0},sourceBuoyPrevious:{x:0,z:-10}};
 const state={physics:'native',phase:'running',course,racers:[racer],
  nativeHost:{world:{frames:0},presentations:[{racer:presentation}]}};
 return {state,racer,course,presentation};
}
function deepFreeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(deepFreeze);Object.freeze(v);}return v;}

test('the helm can operate on frozen race/navigation/physical presentation state',()=>{
 const f=fixture(),before=structuredClone(f.state),pilot=createNativeRacePilot({course:f.course});
 deepFreeze(f.state);const controls=pilot.input(f.state,f.racer);
 assert.equal(controls.throttle,1);assert.equal(controls.steer,0);
 assert.deepEqual(f.state,before);assert.equal(pilot.diagnostics().samples,1);
});

test('digital A/coast retains a bounded turning jet without B, R or trim',()=>{
 const straight=fixture({speed:22,vz:22});
 assert.deepEqual(createNativeRacePilot({course:straight.course}).input(straight.state),neutral);
 const turning=fixture({speed:22,vz:22,heading:-.3}),pilot=createNativeRacePilot({course:turning.course});
 const c=pilot.input(turning.state);assert.equal(c.throttle,1);assert.equal(c.steer,1);
 assert.equal(pilot.diagnostics().last.steeringEngineReserve,true);
 assert.deepEqual(nativeHostInput(c),{rawXNative:-70,rawYNative:0,heldButtons:0x8000});
 const fast=fixture({speed:25,vz:25,heading:-.3}),fastPilot=createNativeRacePilot({course:fast.course});
 assert.equal(fastPilot.input(fast.state).throttle,0);assert.equal(fastPilot.diagnostics().last.steeringEngineReserve,false);
});

test('lookahead follows the existing polyline through a corner and scales with physical speed',()=>{
 const f=fixture(),pilot=createNativeRacePilot({course:f.course});
 pilot.input(f.state);assert.deepEqual(pilot.diagnostics().last.target,[0,6]);
 Object.assign(f.presentation,{z:49,speed:0});f.state.nativeHost.world.frames=1;
 pilot.input(f.state);let d=pilot.diagnostics();
 assert.equal(d.navigation.index,1);assert.deepEqual(d.last.target,[15,50]);
 assert.equal(d.last.desiredSpeedWorld,NATIVE_RACE_PILOT_POLICY.cornerSpeedWorld);
 const fast=fixture({speed:30,vz:30}),p=createNativeRacePilot({course:fast.course});
 p.input(fast.state);d=p.diagnostics();assert.equal(d.last.lookaheadWorld,24);assert.deepEqual(d.last.target,[0,14]);
});

test('overshooting a steering anchor advances its private cursor without awarding a buoy',()=>{
 const f=fixture(),pilot=createNativeRacePilot({course:f.course});pilot.input(f.state);
 Object.assign(f.presentation,{x:8,z:1});f.state.nativeHost.world.frames=1;
 const before=structuredClone(f.racer);pilot.input(f.state);
 assert.equal(pilot.diagnostics().navigation.index,1);assert.deepEqual(f.racer,before);
 assert.equal(f.racer.sourceBuoys.nextSourceRow,5);assert.equal(f.racer.passed,0);assert.equal(f.racer.lap,1);
});

test('each logical frame holds one decision and returned objects cannot mutate that decision',()=>{
 const f=fixture({heading:-.2}),pilot=createNativeRacePilot({course:f.course});
 const c=pilot.input(f.state);c.steer=999;
 Object.assign(f.presentation,{heading:.2});assert.equal(pilot.input(f.state).steer,1);
 assert.equal(pilot.diagnostics().samples,1);
 f.state.nativeHost.world.frames=1;assert.equal(pilot.input(f.state).steer,-1);
 assert.equal(pilot.diagnostics().samples,2);
 const d=pilot.diagnostics();d.last.target[0]=999;d.last.controls.steer=999;
 assert.notEqual(pilot.diagnostics().last.target[0],999);assert.equal(pilot.input(f.state).steer,-1);
});

test('yaw damping averages actual logical-frame rotation instead of one impact tick',()=>{
 const f=fixture(),pilot=createNativeRacePilot({course:f.course});pilot.input(f.state);
 Object.assign(f.presentation,{heading:.005,yawVelocity:7});f.state.nativeHost.world.frames=1;
 const c=pilot.input(f.state),d=pilot.diagnostics();
 assert.ok(Math.abs(d.last.controlYawVelocity-.1)<1e-12);
 assert.ok(Math.abs(c.steer-(-.005*6-.1*1.5))<1e-12);assert.equal(d.last.yawVelocity,7);
});

test('navigation reads the actual native presentation rather than mutable display racer fields or outcomes',()=>{
 const a=fixture({heading:-.2}),b=fixture({heading:-.2});
 Object.assign(b.racer,{x:999,z:999,heading:999,speed:999,misses:4,power:5,passed:25});
 const pa=createNativeRacePilot({course:a.course}),pb=createNativeRacePilot({course:b.course});
 assert.deepEqual(pa.input(a.state),pb.input(b.state));
});

test('source-row observations retain genuine misses and geometry diagnostics without fixing them',()=>{
 const f=fixture(),pilot=createNativeRacePilot({course:f.course,traceLimit:1});pilot.input(f.state);
 Object.assign(f.racer,{misses:1,passed:1,sourceBuoyPrevious:{x:.01,z:2}});
 Object.assign(f.racer.sourceBuoys,{nextSourceRow:6,logicalTicks:1});f.state.nativeHost.world.frames=1;
 const before=structuredClone(f.state);pilot.input(f.state);assert.deepEqual(f.state,before);
 let t=pilot.diagnostics().transitions[0];
 assert.equal(t.fromSourceRow,5);assert.equal(t.toSourceRow,6);assert.equal(t.missDelta,1);
 assert.equal(t.classification,1);assert.equal(t.enabled,true);assert.equal(t.time,.05);
 assert.equal(t.sideMarginWorld,-1.375);assert.deepEqual(t.sourcePosition,{x:.01,z:2});
 Object.assign(f.racer.sourceBuoys,{nextSourceRow:7,logicalTicks:2});f.racer.passed=2;f.state.nativeHost.world.frames=2;
 pilot.input(f.state);const trace=pilot.diagnostics().transitions;
 assert.equal(trace.length,1);assert.equal(trace[0].fromSourceRow,6);assert.equal(f.racer.misses,1);
});

test('pause, finish and reset do not continue private navigation or leak acceleration',()=>{
 const f=fixture(),pilot=createNativeRacePilot({course:f.course});pilot.input(f.state);
 const old=pilot.diagnostics();f.state.phase='paused';f.state.nativeHost.world.frames=10;
 assert.deepEqual(pilot.input(f.state),neutral);assert.deepEqual(pilot.diagnostics().last,old.last);
 f.state.phase='results';f.racer.finishTime=1;assert.deepEqual(pilot.input(f.state),neutral);
 const other=fixture();assert.throws(()=>pilot.input(other.state),/Reset/);
 pilot.reset();assert.equal(pilot.diagnostics().samples,0);assert.deepEqual(pilot.diagnostics().transitions,[]);
 assert.equal(pilot.input(other.state).throttle,1);
});

test('judge diagnostics use the sampled moving center while helm decisions stay independent of that record',()=>{
 const f=fixture(),pilot=createNativeRacePilot({course:f.course});pilot.input(f.state);
 Object.assign(f.racer,{misses:1,passed:1,sourceBuoyPrevious:{x:.01,z:.2},sourceBuoyObservation:{
  sourceRow:5,logicalTick:1,position:{x:.01,z:.2},center:{x:0,z:-1},side:0,correct:false}});
 Object.assign(f.racer.sourceBuoys,{nextSourceRow:6,logicalTicks:1});f.state.nativeHost.world.frames=1;
 const before=structuredClone(f.state);pilot.input(f.state);assert.deepEqual(f.state,before);
 const row=pilot.diagnostics().transitions[0];
 assert.deepEqual(row.buoyCenterWorld,{x:0,z:-1});assert.ok(Math.abs(row.sideMarginWorld+.575)<1e-12);
 assert.equal(row.judgeSide,0);assert.equal(row.judgeCorrect,false);
 const a=fixture({heading:-.2}),b=fixture({heading:-.2});
 b.racer.sourceBuoyObservation={sourceRow:999,logicalTick:0,position:{x:999,z:999},center:{x:999,z:999},side:0,correct:false};
 assert.deepEqual(createNativeRacePilot({course:a.course}).input(a.state),createNativeRacePilot({course:b.course}).input(b.state));
});

test('helm follows the visible marker displacement without editing its route or buoy',()=>{
 const f=fixture({x:-10,z:0,heading:Math.PI/2}),moving={x:0,z:1};
 f.course.sourceVisibleGateIndices={5:1};f.racer.next=1;
 f.state.nativeHost.primary={positionForSourceRow:()=>({...moving})};
 const pilot=createNativeRacePilot({course:f.course,policy:{buoyClearanceWorld:0}}),before=JSON.stringify(f.state);deepFreeze(f.state);
 const controls=pilot.input(f.state),d=pilot.diagnostics().last;
 assert.equal(JSON.stringify(f.state),before);assert.deepEqual(moving,{x:0,z:1});
 assert.deepEqual(d.target,[0,7]);assert.deepEqual(d.buoyTracking,{sourceRow:5,lateralShiftWorld:-1,weight:1});
 assert.equal(controls.slide,false);assert.equal(controls.lean,0);
 const near=fixture({x:-4,z:0,heading:Math.PI/2}),late={x:0,z:1};
 near.course.sourceVisibleGateIndices={5:1};near.racer.next=1;
 near.state.nativeHost.primary={positionForSourceRow:()=>({...late})};
 const following=createNativeRacePilot({course:near.course,policy:{buoyClearanceWorld:0}});
 following.input(near.state);const target=following.diagnostics().last.target;
 late.z=2;near.state.nativeHost.world.frames=1;following.input(near.state);
 assert.deepEqual(following.diagnostics().last.target,[target[0],target[1]+1]);
 assert.deepEqual(near.course.anchors,[[0,0],[0,50],[50,50],[50,0]]);
 assert.equal(near.racer.passed,0);assert.equal(near.racer.misses,0);
});

test('invalid geometry, policy, backend, class and backward clock are rejected',()=>{
 const f=fixture();
 for(const options of [{course:{}},{course:{...f.course,anchors:[[0,0],[1,1],[NaN,2]]}},
  {course:f.course,policy:{unknown:1}},{course:f.course,policy:{lookaheadSeconds:NaN}},
  {course:f.course,policy:{cornerSpeedWorld:20,straightSpeedWorld:10}},{course:f.course,traceLimit:Infinity}])
  assert.throws(()=>createNativeRacePilot(options));
 const pilot=createNativeRacePilot({course:f.course});f.state.physics='modern';assert.throws(()=>pilot.input(f.state),/native race/);
 f.state.physics='native';f.state.course={...f.course,difficulty:1};assert.throws(()=>pilot.input(f.state),/class/);
 f.state.course=f.course;pilot.input(f.state);f.state.nativeHost.world.frames=2;pilot.input(f.state);
 f.state.nativeHost.world.frames=1;assert.throws(()=>pilot.input(f.state),/backwards/);
});

function drive(difficulty,rider,hz){
 const course=getCourse('greyhaven',difficulty),s=createRace({course,difficulty,rider,mode:'time',physics:'native'}),r=s.racers[0];
 const anchors=JSON.stringify(s.course.anchors),pilot=createNativeRacePilot({course:s.course});
 for(let i=0;i<180*hz&&s.phase!=='results';i++)stepRace(s,()=>pilot.input(s,r),1/hz);
 // Capture the final judge observation; inactive input performs no simulation.
 assert.deepEqual(pilot.input(s,r),neutral);const d=pilot.diagnostics();
 assert.equal(s.phase,'results',`unfinished class${difficulty} rider${rider} at${hz}Hz`);
 assert.equal(r.dq,'',`DQ class${difficulty} rider${rider}: ${r.dq}`);assert.equal(r.lap,3);assert.equal(r.lapTimes.length,3);
 assert.ok(r.finishTime>60&&r.finishTime<180);assert.equal(r.passed,s.course.gates.length*3);
 assert.equal(JSON.stringify(s.course.anchors),anchors);
 assert.equal(d.transitions.filter(t=>t.enabled&&!t.initialStartLine).length,r.passed);
 assert.equal(d.transitions.filter(t=>t.initialStartLine).length,1);
 assert.equal(d.transitions.reduce((n,t)=>n+t.missDelta,0),r.misses);
 assert.ok(d.coastFrames>0&&d.reserveFrames>0);
 for(const t of d.transitions.filter(t=>t.missDelta))assert.ok(t.sideMarginWorld<0,JSON.stringify(t));
 return {r,d,s};
}

for(let rider=0;rider<4;rider++)for(let difficulty=0;difficulty<4;difficulty++){
 test(`native Sunny class${difficulty}, rider${rider}: three genuine laps through the human source judge`,()=>{
  const {r,d}=drive(difficulty,rider,60);
  // The heavy profile's Hard/Expert margin remains observable. With the
  // recovered physical grid and drift anticipation, the genuine missed rows
  // are47/46. The zero/one-miss limits and physical judge remain unchanged.
  assert.ok(r.misses<=(rider===1&&[1,2].includes(difficulty)?1:0));
  if(r.misses)assert.equal(d.transitions.find(t=>t.missDelta).fromSourceRow,difficulty===1?47:46);
 });
}
for(let difficulty=0;difficulty<4;difficulty++){
 test(`native Sunny class${difficulty}, rider0: clean and exactly matching finishes at30/60/144Hz`,()=>{
  let reference=null;
  for(const hz of [60,30,144]){
   const {r,d,s}=drive(difficulty,0,hz);assert.equal(r.misses,0);
   const sample={finishTime:r.finishTime,time:s.time,progress:structuredClone(r.sourceBuoys),
    native:nativeRaceSnapshot(s.nativeHost.world.adapters[0]),water:captureRaceWater(s.raceWater),driver:d,
    worldRemainder:s.nativeHost.world.remainder};
   assert.equal(sample.worldRemainder,0);
   if(reference)assert.deepEqual(sample,reference,`class${difficulty} finish at${hz}Hz`);else reference=sample;
  }
 });
}

test('closed-loop physical pose, human progress and water history are exactly independent of render cadence',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  let reference=null;
  for(const hz of [60,30,144]){
   const s=createRace({course:getCourse('greyhaven',difficulty),difficulty,mode:'time',physics:'native'}),r=s.racers[0];
   const pilot=createNativeRacePilot({course:s.course});
   for(let i=0;i<40*hz;i++)stepRace(s,()=>pilot.input(s,r),1/hz);
   assert.equal(s.nativeHost.world.ticks,4000);assert.equal(s.nativeHost.world.frames,800);assert.equal(s.phase,'running');
   const sample={native:nativeRaceSnapshot(s.nativeHost.world.adapters[0]),progress:structuredClone(r.sourceBuoys),
    passed:r.passed,misses:r.misses,power:r.power,lap:r.lap,lapTimes:[...r.lapTimes],
    water:captureRaceWater(s.raceWater),driver:pilot.diagnostics()};
   if(reference)assert.deepEqual(sample,reference,`class${difficulty} at${hz}Hz`);else reference=sample;
  }
 }
});
