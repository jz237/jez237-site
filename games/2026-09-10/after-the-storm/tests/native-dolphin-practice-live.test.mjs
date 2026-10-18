import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {terrainIdentity,terrainKey,sampleTerrain} from '../terrain-data.js';
import {verificationInput} from '../race-verification.js';
const create=extra=>createRace({course:getCourse('practice'),mode:'practice',physics:'native',...extra});
const frames=(s,n,input={})=>{const end=s.nativeHost.world.frames+n;while(s.nativeHost.world.frames<end)stepRace(s,input,1/60);};

test('solo Practice immediately drives the original ordinary layout at full power without a countdown or lap race',()=>{
 const s=create(),r=s.racers[0],x=r.x,z=r.z;
 assert.equal(s.freeRide,true);assert.equal(s.phase,'running');assert.equal(s.nativePreview,true);
 assert.deepEqual(s.nativeLaunch.scene(),{simulationState:3,phase650:3});
 assert.equal(s.nativeLaunch.view().countdown,0);assert.equal(s.nativeLaunch.view().label,'');
 assert.equal(r.power,5);assert.equal(s.course.nativeSceneMode,'practice');
 assert.equal(s.course.ramps.length,2);assert.equal(s.course.rings.length,0);
 assert.equal(s.nativeCourseWorld.volumes.length,12);assert.equal(s.nativeHost.primary.snapshot().length,60);
 assert.equal(s.nativeLaunch.snapshot().scene.fixedSphereCountC938,205);
 frames(s,60,{throttle:1});
 assert.ok(Math.hypot(r.x-x,r.z-z)>40);assert.ok(r.speed>20);
 assert.equal(s.nativeHost.world.ticks,300);assert.equal(s.raceWater.frames,60);
 assert.equal(r.power,5);assert.equal(r.lap,0);assert.equal(r.finishTime,null);assert.equal(r.dq,'');
 assert.equal(s.nativeLaunch.view().clockStopped,true);assert.equal(r.raceTime,0);assert.equal(s.result,null);
 assert.equal(s.nativeLaunch.records()[0].finished,false);assert.deepEqual(r.lapTimes,[]);
});

test('Practice pause freezes physical, water and canonical state; restarting restores the source launch',()=>{
 const s=create(),start=s.nativeLaunch.snapshot(),position=[s.racers[0].x,s.racers[0].z];
 frames(s,20,{throttle:1,steer:.4});s.phase='paused';
 const before=s.nativeLaunch.snapshot(),ticks=s.nativeHost.world.ticks,water=s.raceWater.frames,p=[s.racers[0].x,s.racers[0].z];
 for(let i=0;i<120;i++)stepRace(s,{throttle:1,steer:-1},1/60);
 assert.deepEqual(s.nativeLaunch.snapshot(),before);assert.equal(s.nativeHost.world.ticks,ticks);
 assert.equal(s.raceWater.frames,water);assert.deepEqual([s.racers[0].x,s.racers[0].z],p);
 s.phase='running';frames(s,10,{throttle:1});assert.ok(s.nativeHost.world.ticks>ticks);
 const restarted=create();assert.deepEqual(restarted.nativeLaunch.snapshot(),start);
 assert.deepEqual([restarted.racers[0].x,restarted.racers[0].z],position);
 assert.equal(restarted.nativeHost.world.ticks,0);assert.equal(restarted.racers[0].power,5);
});

test('Practice retained state cannot turn the solo original layout into another game mode or class',()=>{
 const initial=create().nativeLaunch.snapshot();
 for(const patch of [{mode620:1},{mode608:11},{reverseDab68:1},{primaryHumanIndex:1}])
  assert.throws(()=>create({nativeInitialRaceState:{...initial,scene:{...initial.scene,...patch}}}),/Retained Practice/);
 const profileWordsB330=[...initial.profileWordsB330];profileWordsB330[2]=1;
 assert.throws(()=>create({nativeInitialRaceState:{...initial,profileWordsB330}}),/Retained Practice/);
});

test('shipped Practice terrain worker reproduces the main-thread shoreline at full resolution',async()=>{
 const s=create(),c=s.course,key=terrainKey(c),expected=sampleTerrain(c.renderGround),previous=globalThis.self;let reply;
 try{globalThis.self={postMessage:data=>reply=data};await import('../terrain-worker/terrain-worker.js');
  globalThis.self.onmessage({data:{...terrainIdentity(c),key}});
 }finally{if(previous===undefined)delete globalThis.self;else globalThis.self=previous;}
 assert.equal(reply.error,undefined);assert.equal(reply.key,key);
 assert.equal(reply.heights.length,361*361);assert.equal(reply.depth.length,512*512*4);
 assert.deepEqual(reply.heights,expected.heights);assert.deepEqual(reply.depth,expected.depth);
});

test('ordinary steering and throttle reach a Practice ramp, launch the hull and return to the water',()=>{
 const s=create(),r=s.racers[0],layout=JSON.stringify(s.course.nativeCourseLayout);
 // Authored inspection inputs only: no physical, timer, judge or course writes.
 let maxHeight=0,nearRamp=false,air=false,landed=false;
 for(let i=0;i<900;i++){
  stepRace(s,()=>verificationInput(s,r),1/30);maxHeight=Math.max(maxHeight,r.hydro.y);
  const ramp=s.course.ramps[1];if(Math.hypot(r.x-ramp.x,r.z-ramp.z)<15&&r.hydro.y>1)nearRamp=true;
  const dry=r.nativeTelemetry.derived.allPointsDry&&r.nativeTelemetry.actionState.noWetNoContactFrames>0;
  if(nearRamp&&dry)air=true;if(air&&s.time>24&&r.nativeTelemetry.derived.pointAnyWet)landed=true;
 }
 assert.equal(nearRamp,true);assert.equal(air,true);assert.equal(landed,true);
 assert.ok(maxHeight>3);assert.equal(r.dq,'');assert.equal(s.phase,'running');assert.equal(s.result,null);
 assert.equal(r.lap,0);assert.equal(r.raceTime,0);assert.equal(r.power,5);
 assert.equal(JSON.stringify(s.course.nativeCourseLayout),layout);
});
