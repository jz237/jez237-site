import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import R from '@dimforge/rapier3d-compat';
import {DemoDirector} from '../src/demo-director';import {cameraObstruction} from '../src/demo-camera-visibility';import {verifyDemoComfortRevision} from './demo-comfort-invariants';
const car=(id:number,x=0,z=0)=>{const root=new T.Group();root.position.set(x,.85,z);return{id,kind:'wagon',root,current:root.position,speed:8,health:100,finished:false}as any;};
const rig=()=>({camera:new T.PerspectiveCamera(52,16/9,.1,850),orbit:{target:new T.Vector3(),update(){}}as any});
test('two-minute automatic derby viewing holds one angle during spins and repeated impacts',()=>{
 const cars=Array.from({length:24},(_,id)=>car(id,Math.cos(id)*8,Math.sin(id)*8)),d=new DemoDirector(),{camera,orbit}=rig();let maxAngle=0,maxStep=0,changes=0,followed=-1,held=0;
 for(let i=0;i<7200;i++){
  for(const c of cars){c.root.rotation.y=i/60*(c.id%2?4:-4);c.root.position.x=Math.cos(i/180+c.id)*8;c.root.position.z=Math.sin(i/180+c.id)*8;c.health=Math.max(1,100-(i/30+c.id)%99);c.speed=8+(i/60+c.id)%12;}
  const oldPosition=camera.position.clone(),oldRotation=camera.quaternion.clone();d.update(cars,camera,orbit,1/60,false);
  if(i){maxAngle=Math.max(maxAngle,oldRotation.angleTo(camera.quaternion));maxStep=Math.max(maxStep,oldPosition.distanceTo(camera.position));}
  if(d.followed!==followed){if(followed>=0){assert.ok(held>=1198,'Automatic subjects need twenty seconds on screen');changes++;}followed=d.followed;held=0;}held++;
  assert.equal(d.activeView,'drone');assert.ok(camera.position.toArray().every(Number.isFinite));
 }
 assert.ok(changes<=5);assert.ok(maxAngle<Math.PI/180,`Unexpected angular step ${maxAngle*180/Math.PI} degrees`);assert.ok(maxStep<.75,`Unexpected position step ${maxStep}m`);
});
test('automatic subject changes blend across the arena without a one-frame translation',()=>{
 const a=car(0,-25),b=car(1,25),d=new DemoDirector(),{camera,orbit}=rig();a.speed=20;b.speed=0;
 for(let i=0;i<1210;i++)d.update([a,b],camera,orbit,1/60,false);
 a.speed=0;b.speed=25;const before=camera.position.clone();let maxStep=0;
 for(let i=0;i<1600;i++){const old=camera.position.clone();d.update([a,b],camera,orbit,1/60,false);maxStep=Math.max(maxStep,old.distanceTo(camera.position));}
 assert.equal(d.followed,1);assert.ok(camera.position.x>15);assert.ok(before.x<0);assert.ok(maxStep<1,'A fifty-metre handoff must not teleport the camera');
});
test('a manual trackside view holds its anchor as the car passes close by',()=>{
 const a=car(0),d=new DemoDirector(),{camera,orbit}=rig();d.select('trackside');d.follow(0);d.update([a],camera,orbit,1/60,false);const anchor=camera.position.clone();
 a.root.position.copy(anchor).add(new T.Vector3(2,-2.5,1));
 for(let i=0;i<120;i++)d.update([a],camera,orbit,1/60,false);
 assert.ok(camera.position.distanceTo(anchor)<.001,'Passing close to trackside must not relocate its camera');
});
test('passing dynamic cars do not relocate the demo camera; fixed scenery remains solid',async()=>{
 await R.init();const world=new R.World({x:0,y:0,z:0});try{
 const from=new T.Vector3(0,1,0),to=new T.Vector3(0,4,-10),body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(0,2,-5));world.createCollider(R.ColliderDesc.cuboid(2,2,1),body);world.step();
 assert.notEqual(cameraObstruction(world,from,to),null);assert.equal(cameraObstruction(world,from,to,undefined,true),null);
 world.createCollider(R.ColliderDesc.cuboid(2,2,1).setTranslation(0,2,-5));world.step();assert.notEqual(cameraObstruction(world,from,to,undefined,true),null);
 }finally{world.free();}
});
test('preceding releases remain recoverable after the camera comfort change',()=>verifyDemoComfortRevision());
