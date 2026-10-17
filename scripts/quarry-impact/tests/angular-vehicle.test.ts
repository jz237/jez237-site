import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {ReplayRecorder} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
await R.init();const load=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=load;}
const ground={height:()=>0,surface:()=>'gravel' as const};
const fx={emit(){},mark(){},detach(){}}as any;
function fixture(){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(300,.5,300).setTranslation(0,-.5,0));
 const scene=new T.Scene(),setup=stockSetup('coupe'),car=new Vehicle(0,'coupe',setup.paint,scene,world,fx,setup,ground,'angular-v1');car.place(0,0,0);
 let time=0;const step=(n=1)=>{for(let i=0;i<n;i++){car.preStep(1/60);world.step();car.postStep(1/60,time+=1/60);car.render(1);}};
 step(180);return{world,scene,car,setup,step,close(){car.dispose();world.free();}};
}
test('actual Vehicle uses powered wheel angles, grounded slip effects, and recovery/repair reset',()=>{
 const f=fixture(),c=f.car;
 try{
  c.input.throttle=1;c.input.brake=.15;f.step(180);
  assert.ok(c.speed>3);assert.ok(c.rpm>1500);assert.ok(c.slip>1);
  const angle=c.wheelAngle(2);assert.ok(Math.abs(angle)>5);
  const expected=new T.Quaternion().setFromEuler(new T.Euler(0,0,0)).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),-angle));
  assert.ok(c.wheels[2].quaternion.angleTo(expected)<1e-6);
  c.engineDamage=.7;c.tyreDamage=[1,0,0,0];c.health=65;c.place(2,4,.5);
  assert.ok(c.drivetrain!.wheels.every(w=>w.omega===0&&w.angle===0));assert.equal(c.health,65);assert.equal(c.engineDamage,.7);assert.equal(c.tyreDamage[0],1);
  c.repair();assert.equal(c.health,100);assert.equal(c.engineDamage,0);assert.deepEqual(c.tyreDamage,[0,0,0,0]);assert.equal(c.gear,1);
  c.engineStall=2;c.input.throttle=0;f.step();assert.equal(c.rpm,0);
  c.input.throttle=1;f.step();assert.ok(c.rpm>=180&&c.rpm<=260);assert.ok(c.engineStall!<2);
 }finally{f.close();}
});
test('recorded powered wheel poses survive replay seeks without stepping replay physics',()=>{
 const f=fixture(),c=f.car;let replay:ReplayScene|undefined;
 try{
  const recorder=new ReplayRecorder({version:1,mode:'playground',reverse:false,cars:[{id:0,kind:'coupe',setup:f.setup}],props:0,created:'2026-10-16T12:00:00Z'});
  recorder.capture(0,()=>captureReplayFrame([c],[],[0]),true);
  c.input.throttle=1;c.input.brake=.15;f.step(180);
  const pose=c.wheels.map(w=>w.quaternion.clone()),angles=[0,1,2,3].map(i=>c.wheelAngle(i));
  recorder.capture(3,()=>captureReplayFrame([c],[],[0]),true);
  const doc=recorder.document();assert.ok(doc);
  replay=new ReplayScene(doc,f.scene,f.world,[],ground);
  for(const time of [3,0,3]){replay.seek(time);if(time===3)replay.cars[0].wheels.forEach((w,i)=>assert.ok(w.quaternion.angleTo(pose[i])<1e-4));}
  assert.deepEqual([0,1,2,3].map(i=>c.wheelAngle(i)),angles,'replay leaves live angular state intact');
 }finally{replay?.dispose();f.close();}
});
