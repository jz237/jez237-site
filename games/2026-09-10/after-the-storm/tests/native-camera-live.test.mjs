import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureRaceWater} from '../race-water.js';
import {captureWindowFrame,readWindowFrame} from '../player-window-presentation.js';
import {encodeOnlinePacket,decodeOnlinePacket} from '../online-race-codec.js';
import {chaseFrame} from '../chase-camera.js';
import {captureNativeCamera,readNativeCamera} from '../native-camera-presentation.js';
const F=Math.fround;
const create=()=>createRace({mode:'versus',physics:'native',course:getCourse('greyhaven'),seaState:'course'});
function frames(s,n){const target=s.nativeHost.world.frames+n;while(s.nativeHost.world.frames<target)stepRace(s,[{},{}],1/60);}
const snap=s=>captureWindowFrame(s,{wake:[],impacts:[],craft:[],level:0,native:captureRaceWater(s.raceWater)});

test('source camera press takes effect after current water frame and only changes its own human view',()=>{
 const s=create(),control=create();frames(s,2);frames(control,2);
 s.nativeLaunch.queueCamera(1);frames(s,1);frames(control,1);
 assert.deepEqual(s.raceWater.cameras,control.raceWater.cameras,'current world camera precedes display-stage input');
 assert.deepEqual(s.raceWater.followControls.map(c=>c.zoomIndex),[1,2]);
 assert.equal(s.raceWater.follows[1].radiusNative,140);
 assert.equal(s.raceWater.follows[1].liftOffsetNative,F(12*F(.2)));
 frames(s,1);frames(control,1);
 assert.deepEqual(s.raceWater.cameras[0],control.raceWater.cameras[0]);
 assert.notDeepEqual(s.raceWater.cameras[1],control.raceWater.cameras[1]);
 assert.equal(s.raceWater.follows[1].radiusNative,130);
 assert.equal(s.raceWater.cameras[1].fovDegrees,78);
 assert.notDeepEqual(s.raceWater.lastPlan.patches[0],control.raceWater.lastPlan.patches[0]);
 assert.deepEqual(s.raceWater.lastPlan.patches.map(p=>p.playerIndex),[1,0]);
});

test('camera commands retain four modes, independent queues, wrap rates, and pause without stepping',()=>{
 const s=create();frames(s,1);
 s.nativeLaunch.queueCamera(0,'previous');s.nativeLaunch.queueCamera(0,'previous');s.nativeLaunch.queueCamera(1,'tilt');
 s.phase='paused';const before=s.nativeLaunch.snapshot();for(let i=0;i<10;i++)stepRace(s,[{},{}],1/60);
 assert.deepEqual(s.nativeLaunch.snapshot(),before);
 s.phase='countdown';frames(s,1);assert.deepEqual(s.raceWater.followControls.map(c=>c.zoomIndex),[0,1]);
 assert.deepEqual(s.raceWater.followControls.map(c=>c.tilt),[false,true]);
 frames(s,1);assert.equal(s.raceWater.followControls[0].zoomIndex,3);assert.equal(s.raceWater.followControls[0].radiusResponse,F(.3));
 frames(s,1);assert.equal(s.raceWater.followControls[0].zoomIndex,3);assert.equal(s.raceWater.followControls[0].radiusResponse,F(.2));
 for(const args of [[2],[-1],[0,'toString']])assert.throws(()=>s.nativeLaunch.queueCamera(...args));
});

test('source display input consumes completed actor values and lift is blended once per outer frame',()=>{
 const s=create();frames(s,108);s.nativeLaunch.queueCamera(1);frames(s,1);
 const first=s.raceWater.follows[1].liftOffsetNative;assert.equal(first,F(12*F(.2)));
 frames(s,1);const expected=F(first+F(F(12-first)*F(.07)));
 assert.equal(s.raceWater.follows[1].liftOffsetNative,expected);
 for(const [i,v] of s.nativeHost.lastCameraInput.diagnostic.views.entries()){
  assert.equal(v.actorStateC54,s.nativeHost.world.adapters[i].lastFrame.actorState);
 }
 assert.equal(s.nativeHost.world.adapters[1].lastFrame.animationFrame,58);
});

test('canonical follow writes reject a late bad player without partial mutation or duplicate initialization',()=>{
 const s=create(),store=s.nativeLaunch.cameraStorage,before=s.nativeLaunch.snapshot();
 const follows=s.raceWater.follows.map(f=>({...f,lagXZ:[...f.lagXZ]}));follows[0].radiusNative=120;follows[1].lagXZ[1]=NaN;
 assert.throws(()=>store.writeFollow(follows));assert.deepEqual(s.nativeLaunch.snapshot(),before);
 assert.throws(()=>store.initializeFollow(s.raceWater.follows),/already/);
 const copy=s.raceWater.followControls;copy[0].zoomIndex=3;assert.equal(s.raceWater.followControls[0].zoomIndex,1);
});

test('online camera transport is read-only and rendered endpoints match the host source scale',async()=>{
 const s=create();assert.equal(s.racers[0].nativeCamera,null);frames(s,3);
 s.nativeLaunch.queueCamera(1);frames(s,2);
 const raw=snap(s),read=readWindowFrame(await decodeOnlinePacket(await encodeOnlinePacket(raw)));assert.ok(read);
 for(let i=0;i<2;i++){
  const camera=captureNativeCamera(s.raceWater.cameras[i],s.raceWater.scale);
  assert.deepEqual(read.racers[i].nativeCamera,camera);
  const view=chaseFrame({},read.racers[i],1/60);
  assert.deepEqual(Object.values(view.position),camera.position);assert.deepEqual(Object.values(view.target),camera.target);assert.equal(view.fov,camera.fov);
 }
 const before=s.nativeLaunch.snapshot();read.racers[1].nativeCamera.position[0]+=10;assert.deepEqual(s.nativeLaunch.snapshot(),before);
 for(const bad of [{...raw.racers[1].nativeCamera,fov:180},{...raw.racers[1].nativeCamera,up:[0,0,0]},{...raw.racers[1].nativeCamera,position:[Infinity,0,0]}]){
  const frame=structuredClone(raw);frame.racers[1].nativeCamera=bad;assert.equal(readWindowFrame(frame),null);
 }
 assert.throws(()=>readNativeCamera({position:[0,0,1],target:[0,0,0],up:[0,0,1],fov:75}),/Collinear/);
});
