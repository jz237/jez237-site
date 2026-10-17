import test from 'node:test';import assert from 'node:assert/strict';
import {tyreFeedback} from '../src/tyre-feedback';
import R from '@dimforge/rapier3d-compat';import * as T from 'three';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';import {loadCars} from '../src/assets';import {Vehicle} from '../src/vehicle';
import {Simulation} from '../multiplayer/simulation';import {validOnlineSnapshot} from '../src/network-validation';import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';import type {Snapshot} from '../multiplayer/protocol';
await R.init();const load=GLTFLoader.prototype.loadAsync;try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=load;}
test('feedback follows individual grounded tires and distinguishes asphalt smoke, gravel and mud',()=>{
 assert.equal(tyreFeedback('asphalt',0,12,false,2,true).type,5);assert.ok(tyreFeedback('asphalt',0,12,false,2,true).count>0);
 assert.equal(tyreFeedback('asphalt',0,0,false,0,true).count,0);
 for(const surface of ['asphalt','gravel','mud']as const){assert.equal(tyreFeedback(surface,20,30,false,2,false).count,0);assert.equal(tyreFeedback(surface,20,30,false,2,true,true).count,0);assert.equal(tyreFeedback(surface,0,0,true,2,true).count,0);}
 assert.equal(tyreFeedback('mud',0,12,false,2,true).type,4);assert.equal(tyreFeedback('gravel',0,12,false,2,true).type,0);
 assert.equal(tyreFeedback('asphalt',10,0,true,0,true).skid,false);assert.equal(tyreFeedback('asphalt',10,0,true,2,true).skid,true);
});
test('real stationary RWD burnout emits smoke and marks only at slipping rear tires',()=>{
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));
 const particles:{z:number;type:number}[]=[],marks:number[]=[],fx={emit(p:T.Vector3,_n:number,type:number){particles.push({z:p.z-car.body.translation().z,type});},mark(p:T.Vector3){marks.push(p.z-car.body.translation().z);},detach(){}}as any;
 const car=new Vehicle(0,'coupe',0xffffff,new T.Scene(),world,fx,undefined,{height:()=>0,surface:()=>'asphalt'},'angular-v1');let time=0;
 const step=()=>{car.preStep(1/60);world.step();car.postStep(1/60,time+=1/60);};
 try{
  car.place(0,0,0);for(let i=0;i<180;i++)step();bodyPin();particles.length=0;marks.length=0;car.input.throttle=1;
  for(let i=0;i<180;i++)step();
  assert.ok(particles.some(p=>p.type===5));assert.ok(particles.every(p=>p.z<0),'rolling front tires do not emit rear burnout smoke');assert.ok(marks.length>0&&marks.every(z=>z<0));
  assert.ok(car.wheelSlips[2]>car.wheelSlips[0]+2);
  car.place(0,0,0);assert.deepEqual(car.wheelSlips,[0,0,0,0]);
 }finally{car.dispose();world.free();}
 function bodyPin(){car.body.setEnabledTranslations(false,false,false,true);car.body.setEnabledRotations(false,false,false,true);car.body.setLinvel({x:0,y:0,z:0},true);car.body.setAngvel({x:0,y:0,z:0},true);}
});
test('individual tire slip survives network transport and invalid slip is rejected',()=>{
 const sim=new Simulation(R,'playground',[],8,[],undefined,0,'angular-v1');
 try{
  sim.phase='playing';sim.step(new Set());const original:Snapshot={...sim.snapshot(),members:[],ack:{}};
  assert.ok(original.cars.every(c=>c.wheels.length===4&&c.wheels.every(w=>typeof w.slip==='number'&&w.slip>=0)));
  const decoded=decodeSnapshotWire(encodeSnapshotWire(original))as Snapshot;assert.ok(validOnlineSnapshot(decoded));assert.deepEqual(decoded.cars.map(c=>c.wheels),original.cars.map(c=>c.wheels));
  decoded.cars[0].wheels[0].slip=-1;assert.equal(validOnlineSnapshot(decoded),false);
 }finally{sim.dispose();}
});

import {OnlineView} from '../src/online-view';
test('online effects use each transmitted contact and slip rather than aggregate car slip',()=>{
 const authority=new Simulation(R,'playground',[],8,[],undefined,0,'angular-v1'),world=new R.World({x:0,y:0,z:0}),scene=new T.Scene();
 const emitted:{x:number;z:number;type:number}[]=[],marks:number[]=[],fx={emit(p:T.Vector3,_count:number,type:number){emitted.push({x:p.x,z:p.z,type});},mark(p:T.Vector3){marks.push(p.z);},detach(){}}as any;
 const car=new Vehicle(0,'coupe',0xffffff,scene,world,fx),view=new OnlineView(scene,world,fx,{}as any,()=>[car],()=>{});
 try{
  const snapshot:Snapshot={...authority.snapshot(),members:[],ack:{}},state=snapshot.cars[0];state.p={x:0,y:1,z:0};state.q={x:0,y:0,z:0,w:1};state.surface='asphalt';state.speed=0;state.slip=12;
  state.wheels.forEach((w,i)=>{w.contact=true;w.slip=i===2?12:0;});view.apply(snapshot,.1);
  assert.equal(emitted.length,1);assert.equal(emitted[0].type,5);assert.ok(emitted[0].x<0&&emitted[0].z<0);assert.equal(marks.length,1);
  emitted.length=0;marks.length=0;state.wheels.forEach(w=>w.contact=false);view.apply(snapshot,.1);assert.equal(emitted.length,0);assert.equal(marks.length,0);
 }finally{car.dispose();world.free();authority.dispose();}
});

import {PuddleSplashes} from '../src/puddle-splashes';
import {getRaceCourse} from '../src/race-course';
test('online contact planes drive water spray and suppress dry smoke even without local raycasts',()=>{
 const authority=new Simulation(R,'playground',[],8,[],undefined,0,'angular-v1'),world=new R.World({x:0,y:0,z:0}),scene=new T.Scene();
 let dry=0,marks=0;const fx={emit(){dry++;},mark(){marks++;},detach(){}}as any;
 const car=new Vehicle(0,'coupe',0xffffff,scene,world,fx),view=new OnlineView(scene,world,fx,{}as any,()=>[car],()=>{}),splashes=new PuddleSplashes(scene,()=>.5);
 const waters=[{id:1,x:0,z:0,level:0,radius:20,aspect:1,phases:[0,0,0,0]}];view.setWorld(world,getRaceCourse(),waters);
 try{
  const snapshot:Snapshot={...authority.snapshot(),members:[],ack:{}},state=snapshot.cars[0];state.p={x:0,y:1,z:0};state.q={x:0,y:0,z:0,w:1};state.v={x:0,y:0,z:10};state.speed=10;state.surface='asphalt';state.slip=12;
  state.wheels.forEach(w=>{w.contact=true;w.slip=12;w.patch={plane:[0,1,0,0],load:1};});
  view.apply(snapshot,.1);assert.equal(dry,0);assert.equal(marks,0);assert.ok(car.remoteContactPoints?.every(p=>p&&Math.abs(p.y)<1e-8));
  assert.equal(car.controller.wheelIsInContact(0),false,'online rendering world has no ground');
  splashes.update([car],waters,.05,true);assert.ok(splashes.stats.emitted>0);assert.equal(splashes.stats.wetWheels,4);assert.ok(car.surfaceFinish.water.some(v=>v>0));
  const emitted=splashes.stats.emitted;state.wheels.forEach(w=>w.contact=false);view.apply(snapshot,.1);splashes.update([car],waters,.05,true);assert.equal(splashes.stats.emitted,emitted);assert.equal(splashes.stats.wetWheels,0);
  state.wheels.forEach(w=>w.contact=true);view.setWorld(world,getRaceCourse(),[]);view.apply(snapshot,.1);assert.ok(dry>0);assert.ok(marks>0);
 }finally{splashes.spray.geometry.dispose();splashes.spray.material.dispose();splashes.rings.geometry.dispose();splashes.rings.material.dispose();car.dispose();world.free();authority.dispose();}
});
