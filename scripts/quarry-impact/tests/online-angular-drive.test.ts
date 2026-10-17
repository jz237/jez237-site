import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {Simulation} from '../multiplayer/simulation';import {Room} from '../multiplayer/room';
import {NEUTRAL,type Snapshot} from '../multiplayer/protocol';import {validOnlineSnapshot} from '../src/network-validation';
import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
await R.init();
const snapshot=(s:Simulation):Snapshot=>({...s.snapshot(true),members:[],ack:{}});
function sim(angular=true){return new Simulation(R,'playground',[],8,[],undefined,0,angular?'angular-v1':'legacy');}
test('angular state and wheel poses survive JSON/binary transport and cold authority restore',()=>{
 const live=sim(),cold=sim(false);
 try{
  live.phase='playing';live.world.gravity={x:0,y:0,z:0};live.cars.forEach((c,i)=>{c.body.setTranslation({x:i*20,y:20,z:0},true);live.setInput(i,{...NEUTRAL,brake:0,throttle:1});});
  const humans=new Set(live.cars.map(c=>c.state.id));for(let i=0;i<120;i++)live.step(humans);
  Object.assign(live.cars[0].drivetrain!.gearbox,{gear:1,pending:2,delay:.1,cooldown:0});
  const original=snapshot(live),json=JSON.parse(JSON.stringify(original)),binary=decodeSnapshotWire(encodeSnapshotWire(original))as Snapshot;
  assert.ok(validOnlineSnapshot(json));assert.ok(validOnlineSnapshot(binary));assert.deepEqual(binary,json);
  assert.ok(Math.abs(original.cars[0].drivetrain!.wheels[2].angle)>1);
  assert.equal(original.cars[0].wheels[2].rotation,original.cars[0].drivetrain!.wheels[2].angle);
  cold.restore(binary);assert.equal(cold.driveModel,'angular-v1');
  assert.deepEqual(cold.cars.map(c=>c.drivetrain!.snapshot()),original.cars.map(c=>c.drivetrain));
  // Reconnect releases controls, while preserving physical drivetrain state.
  assert.equal(cold.cars[0].state.input.throttle,0);assert.equal(cold.cars[0].drivetrain!.gearbox.pending,2);
  binary.cars[0].drivetrain!.wheels[2].omega=999;assert.notEqual(cold.cars[0].drivetrain!.wheels[2].omega,999);
  cold.world.gravity={x:0,y:0,z:0};for(let i=0;i<120;i++)cold.step(humans);
  assert.ok(cold.cars.every(c=>Number.isFinite(c.state.rpm)&&Number.isFinite(c.drivetrain!.wheels[2].omega)));
  cold.cars[0].state.health=40;assert.equal(cold.recover(0),true);assert.equal(cold.cars[0].state.health,100);assert.ok(cold.cars[0].drivetrain!.wheels.every(w=>w.omega===0&&w.angle===0));
 }finally{live.dispose();cold.dispose();}
});
test('legacy saves restore legacy physics; malformed or mixed model state is rejected before mutation',()=>{
 const legacy=sim(false),angular=sim();
 try{
  const saved=snapshot(angular),before=angular.cars[0].drivetrain!.snapshot(),tick=angular.tick;
  const variants=[{...saved,driveModel:'future'}, {...saved,driveModel:undefined}, {...saved,cars:saved.cars.map((c,i)=>i?c:{...c,drivetrain:undefined})}, {...saved,cars:saved.cars.map((c,i)=>i?c:{...c,drivetrain:{...c.drivetrain,version:99}})}];
  for(const invalid of variants){assert.equal(validOnlineSnapshot(invalid as Snapshot),false);assert.throws(()=>angular.restore(invalid as Snapshot));assert.equal(angular.tick,tick);assert.deepEqual(angular.cars[0].drivetrain!.snapshot(),before);}
  angular.restore(snapshot(legacy));assert.equal(angular.driveModel,'legacy');assert.ok(angular.cars.every(c=>!c.drivetrain));assert.equal(snapshot(angular).driveModel,undefined);
 }finally{legacy.dispose();angular.dispose();}
});
test('fresh rooms use angular authority and persist its versioned state',()=>{
 const room=new Room('ANGULAR',R);
 try{assert.equal(room.sim.driveModel,'angular-v1');assert.ok(room.sim.snapshot().cars.every(c=>c.drivetrain?.version===1));
  room.sim.cars[0].drivetrain!.wheels[2].angle=42;const saved=room.save(),copy=new Room('ANGULAR',R);
  try{copy.restore(saved);assert.equal(copy.sim.driveModel,'angular-v1');assert.equal(copy.sim.cars[0].drivetrain!.wheels[2].angle,42);}finally{copy.dispose();}
 }finally{room.dispose();}
});

import {DEFAULT_ONLINE_EVENT} from '../src/online-events';
test('angular authority completes a real eight-car Rookvale race',()=>{
 const s=new Simulation(R,'race',Array(8).fill('coupe'),8,[],{...DEFAULT_ONLINE_EVENT,course:'rookvale-yard-v1',laps:1},123,'angular-v1');
 try{s.phase='playing';for(let tick=0;tick<180*60&&s.phase==='playing';tick++)s.step(new Set());
  console.log(JSON.stringify({seconds:s.elapsed,finished:s.cars.filter(c=>c.state.finished).length,health:s.cars.map(c=>c.state.health)}));
  assert.ok(s.cars.every(c=>c.state.finished));assert.equal(s.phase,'result');
 }finally{s.dispose();}
});

test('online rendering and replay capture use transmitted angular wheel poses',async()=>{
 const T=await import('three'),{GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js'),{loadCarWithoutImages}=await import('../tools/car-asset-audit'),{loadCars}=await import('../src/assets');
 const original=GLTFLoader.prototype.loadAsync;try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const {Vehicle}=await import('../src/vehicle'),{OnlineView}=await import('../src/online-view'),{captureReplayFrame}=await import('../src/replay-scene');
 const authority=sim(),world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),fx={emit(){},mark(){},detach(){}}as any,car=new Vehicle(0,'coupe',0xffffff,scene,world,fx);
 try{
  authority.cars[0].drivetrain!.wheels[2].angle=123;authority.phase='playing';authority.step(new Set(authority.cars.map(c=>c.state.id)));
  const packet=snapshot(authority),view=new OnlineView(scene,world,fx,{}as any,()=>[car],()=>{});view.apply(packet,0);
  const angle=packet.cars[0].wheels[2].rotation;assert.ok(angle>100);assert.equal(car.wheelAngle(2),angle);
  assert.ok(Math.abs(captureReplayFrame([car],[],[0])[15+2*8+7]-angle)<1e-5);
  packet.cars[0].wheels[2].rotation=0;assert.equal(car.wheelAngle(2),angle,'render pose owns its copied wheel angles');
 }finally{car.dispose();world.free();authority.dispose();}
});
