import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {CAR_KINDS} from '../src/rules';
import {ReplayRecorder} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
import {captureReplayCheckpoint,ReplayCheckpointCache,replayCheckpointBytes} from '../src/replay-checkpoint';
await R.init();
const load=GLTFLoader.prototype.loadAsync;
GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);
try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=load;}
const fx={emit(){},mark(){},detach(){}} as any;
function damage(car:Vehicle,i:number){
 const side=i%2?-1:1,point=car.model.localToWorld(new T.Vector3(side*.7,.75,i%3===0?1.5:-1.5)),dir=new T.Vector3(-side,-.05,i%3===0?-1:1).normalize().applyQuaternion(car.root.quaternion);
 if(i%3===0)car.hit(point,dir,25,i,true,new T.Color(0x2266aa));else car.scar(point,dir,new T.Color(0xaa4422));
}
function shape(car:Vehicle){
 const hash=createHash('sha256');
 for(const mesh of [...car.panels,...car.glass]){
  hash.update(JSON.stringify([mesh.visible,mesh.userData.damage,mesh.userData.engineShift?.toArray()]));
  for(const name of ['position','normal','impactWear','impactAxis','transferPaint']){const a=mesh.geometry.getAttribute(name)?.array;if(a)hash.update(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));}
  const glass=(mesh.material as T.Material).userData.glassState;if(glass)hash.update(JSON.stringify([glass.damage.value,glass.damage.value>0?glass.impact.value.toArray():null]));
 }
 return {hash:hash.digest('hex'),health:car.health,engine:car.engineDamage,stall:car.engineStall,tyres:car.tyreDamage,structure:car.structuralDamage,
  zones:{...car.damageZones},partZones:{...car.wreckParts.zones},damage:Array.from(car.wreckParts.wheelDamage),shift:car.wreckParts.wheelShift.map(v=>v.toArray()),
  assemblies:car.wreckParts.assemblies.map(a=>[a.damage,a.loose,a.damage>0?a.side:0])};
}
test('checkpoint restores damage and allows further impacts and repairs on every production vehicle',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene();
 try{for(const kind of CAR_KINDS){
  const car=new Vehicle(0,kind,0x446688,scene,world,fx),control=new Vehicle(0,kind,0x446688,scene,world,fx);
  try{
   car.place(0,0,.4);control.place(0,0,.4);
   for(let i=0;i<8;i++){damage(car,i);damage(control,i);}
   const expected=shape(control),checkpoint=captureReplayCheckpoint([car],128*1024*1024)!;assert.ok(checkpoint,kind);
   car.syncDrawBatch();car.repair();damage(car,12);checkpoint.restore();assert.deepEqual(shape(car),expected,kind+' restored');
   damage(car,9);damage(control,9);assert.deepEqual(shape(car),shape(control),kind+' next impact');
   car.repair();control.repair();assert.deepEqual(shape(car),shape(control),kind+' repair');
  }finally{car.dispose();control.dispose();}
 }}finally{world.free();}
});
test('revisited seeks skip deformation and changed partial seeks remain cancellable',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),car=new Vehicle(0,'compact',0x667788,scene,world,fx);car.place(0,0,0);
 const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,tyreModel:1,engineModel:1,cars:[{id:0,kind:car.kind,setup:car.setup}],props:0,created:'2026-10-08'});let time=0;
 car.onVisualEvent=e=>recorder.event(0,time,e);
 const capture=()=>recorder.capture(time,()=>captureReplayFrame([car],[],[0],1,1),true);capture();
 for(let i=0;i<80;i++){time=i+1;if(i===40)car.repair();else damage(car,i);capture();}
 const doc=recorder.document();car.dispose();
 const view=new ReplayScene(doc,scene,world,[]),reference=new ReplayScene(doc,scene,world,[],undefined,0);
 const compare=(at:number)=>{view.seek(at);reference.seek(at);assert.deepEqual(shape(view.cars[0]),shape(reference.cars[0]));assert.deepEqual(captureReplayFrame(view.cars,[],[0],1,1),captureReplayFrame(reference.cars,[],[0],1,1));};
 try{
  compare(80);assert.equal(view.checkpointStats.count,1);
  compare(0);let events=0;view.cars[0].onVisualEvent=e=>{if(e.kind==='hit')events++;};
  compare(80);assert.equal(events,0,'exact revisit restores a checkpoint without reapplying contacts');
  compare(25);compare(50);compare(42);compare(80);
  assert.equal(view.seekChunk(15,0),false);compare(0);compare(80);
  view.dispose();assert.deepEqual(view.checkpointStats,{count:0,bytes:0,limit:128*1024*1024});
 }finally{if(view.cars[0].root.parent)view.dispose();reference.dispose();world.free();}
});
test('cache allocation is bounded, nearby playback frames do not churn, and oversized fields fall back',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),car=new Vehicle(0,'compact',0x667788,scene,world,fx);
 try{
  const bytes=replayCheckpointBytes([car]),cache=new ReplayCheckpointCache(bytes*2);
  cache.save([car],10,40);cache.save([car],10.05,41);assert.equal(cache.size,1);
  cache.save([car],20,80);cache.save([car],30,120);assert.equal(cache.size,2);assert.equal(cache.bytes,bytes*2);assert.equal(cache.restore(10,-1),undefined);
  assert.equal(captureReplayCheckpoint([car],bytes-1),undefined);
  const small=new ReplayCheckpointCache(bytes-1);small.save([car],40,160);assert.equal(small.size,0);assert.equal(small.bytes,0);
  cache.clear();assert.equal(cache.bytes,0);
 }finally{car.dispose();world.free();}
});
