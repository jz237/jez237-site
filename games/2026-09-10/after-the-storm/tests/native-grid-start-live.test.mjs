import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';

const create=(mode='time',difficulty=0,extra={})=>createRace({mode,difficulty,physics:'native',course:getCourse('greyhaven',difficulty),...extra});
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);

test('source grid initializes every Sunny class and both physical players before water history',()=>{
 for(const mode of ['time','versus'])for(let difficulty=0;difficulty<4;difficulty++)for(let rider=0;rider<4;rider++){
  const s=create(mode,difficulty,{rider,secondRider:(rider+1)%4}),reverse=difficulty===3;
  const expected=mode==='time'?[reverse?[-1309,0,831]:[-2302,0,780]]:
   reverse?[[-1309,0,931],[-1309,0,835]]:[[-2302,0,680],[-2302,0,776]];
  for(let i=0;i<s.racers.length;i++){
   const r=s.racers[i],a=s.nativeHost.world.adapters[i],scale=s.raceWater.scale,[x,y,z]=expected[i];
   assert.deepEqual(s.nativeLaunch.gridStart(i).decoded.positionNative,{x,y,z});
   for(const [key,n]of Object.entries({x,y,z}))near(a.hull.center[key],n*scale);
   assert.equal(r.x,a.hull.center.x);assert.equal(r.z,a.hull.center.z);assert.equal(r.hydro.y,a.hull.center.y);
   assert.deepEqual(a.hull.frame.forward,{x:reverse?-1:1,y:0,z:0});
   assert.deepEqual(r.sourceForwardXZ,[a.hull.frame.forward.x,a.hull.frame.forward.z]);
   assert.deepEqual(s.raceWater.previousPositions[i],{x,y,z});
   assert.deepEqual(s.raceWater.follows[i].lagXZ,[x+(reverse?100:-100),z]);
   assert.equal(a.hull.computerProfile,false);assert.equal(a.riderLifecycle.state.actorState,15);
   assert.deepEqual(a.hull.velocity,{x:0,y:0,z:0});assert.equal(s.raceWater.frames,0);
  }
 }
});

test('browser gate art cannot move the source grid, physical points or initial camera lag',()=>{
 const course=getCourse('greyhaven',0),reference=create();
 const changed={...course,gates:course.gates.map((g,i)=>i?g:{...g,x:g.x+100,z:g.z-200,tx:0,tz:-1})};
 const s=create('time',0,{course:changed}),a=s.nativeHost.world.adapters[0],b=reference.nativeHost.world.adapters[0];
 assert.deepEqual(a.hull.points,b.hull.points);assert.deepEqual(a.hull.center,b.hull.center);
 assert.deepEqual(a.hull.frame,b.hull.frame);assert.deepEqual(s.raceWater.follows,reference.raceWater.follows);
 // Source62E50 places local point0(-12,-7,-36) through this packed grid basis.
 near(a.hull.points[0].position.x,-2338*.025);near(a.hull.points[0].position.y,-7*.025);near(a.hull.points[0].position.z,792*.025);
});

test('physical profile selection reads the canonical halfword and selected simulation state',()=>{
 const template=create('versus',0,{rider:3,secondRider:3}).nativeLaunch.snapshot();
 const flagged=structuredClone(template);flagged.scene.field4964=1;
 const s=create('versus',0,{rider:3,secondRider:3,nativeInitialRaceState:flagged,
  nativeTunes:[{computerProfile:false},{computerProfile:true}]});
 assert.deepEqual(s.nativeHost.world.adapters.map(a=>a.hull.computerProfile),[true,false]);
 const normal=create('versus',0,{rider:3,secondRider:3});
 assert.notDeepEqual(s.nativeHost.world.adapters[0].hull.points.map(p=>p.damping),normal.nativeHost.world.adapters[0].hull.points.map(p=>p.damping));
 const replay=structuredClone(template);replay.scene.simulation648=2;
 assert.deepEqual(create('versus',0,{nativeInitialRaceState:replay}).nativeHost.world.adapters.map(a=>a.hull.computerProfile),[true,true]);
 const missing=structuredClone(template);delete missing.scene.field4964;
 assert.throws(()=>create('versus',0,{nativeInitialRaceState:missing}),/field4964/);
 const before=s.nativeLaunch.snapshot();s.nativeLaunch.gridStart(0);s.nativeLaunch.gridStart(1);
 assert.deepEqual(s.nativeLaunch.snapshot(),before);
 for(let i=0;i<3;i++)stepRace(normal,[{},{}],1/60);assert.equal(normal.raceWater.frames,1);
 assert.equal(normal.nativeHost.world.adapters[0].hull.ticks,5);
});
