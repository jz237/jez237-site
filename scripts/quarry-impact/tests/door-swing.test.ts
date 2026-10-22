import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DOOR_SWING,doorTorque,stepDoor,doorRest,doorDrag,doorUnlatched,doorBase} from '../src/door-swing';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('braking and the outside of a corner swing an unlatched door open; accelerating and the airflow shut it',()=>{
 assert.ok(doorTorque(.1,-1,-8,0,5)>0,'braking opens a door that is ajar');
 assert.ok(doorTorque(.1,-1,6,0,5)<0,'accelerating shuts it');
 assert.ok(doorTorque(0,-1,0,8,5)>0&&doorTorque(0,1,0,8,5)<0,'turning right throws the left door open and holds the right one shut');
 assert.ok(doorTorque(.8,-1,0,0,25)<0,'airflow pushes it shut');
 assert.equal(doorRest(.05,-1,0,0,20),0);assert.ok(doorRest(.05,-1,0,8,10)>.5,'held open through a corner');
 assert.ok(doorRest(.05,-1,0,8,30)<doorRest(.05,-1,0,8,10),'less at speed');
 const d={swing:0,rate:0};let hit=0;for(let i=0;i<120;i++)hit=Math.max(hit,stepDoor(d,.05,-1,0,25,10,1/60));
 assert.ok(hit>DOOR_SWING.tear,'a violent swerve slams it into the stop ('+hit+')');
 assert.ok(d.swing<=DOOR_SWING.max-.05+1e-9&&d.swing>=0);
 const e={swing:.6,rate:0};for(let i=0;i<600;i++)stepDoor(e,.05,-1,0,0,25,1/60);assert.ok(e.swing<.02,'cruising, it blows shut');
 assert.equal(doorDrag(0,30),0);assert.ok(doorDrag(1,30)>doorDrag(.3,30)&&doorDrag(1,30)<700);
 assert.ok(!doorUnlatched(.2,2)&&doorUnlatched(.5,0)&&doorUnlatched(0,DOOR_SWING.latchDamage)&&doorBase(0)===DOOR_SWING.ajar,'a side knock springs the latch');
 const n={swing:.2,rate:0};assert.equal(stepDoor(n,.05,-1,NaN,NaN,NaN,1/60),0);assert.ok(Number.isFinite(n.swing));
});
test('a car with unlatched doors swings them open through a hard turn and under braking; online-style doors stay put',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   const doors=c.wreckParts.assemblies.filter(a=>a.name==='door-left'||a.name==='door-right');for(const d of doors)d.loose=.6;
   let t=0;const step=(n:number)=>{for(let k=0;k<n;k++){c.preStep(1/60);world.step();c.postStep(1/60,t);t+=1/60;}};
   c.input.throttle=1;step(60*3);const cruising=doors.map(d=>d.swing??0);
   c.input.throttle=.4;c.input.steer=1;let left=0,right=0;for(let k=0;k<90;k++){step(1);left=Math.max(left,doors.find(d=>d.name==='door-left')?.swing??0);right=Math.max(right,doors.find(d=>d.name==='door-right')?.swing??0);}
   c.input.steer=0;c.input.throttle=1;step(60*3);c.input.throttle=0;c.input.brake=1;let braking=0;for(let k=0;k<60;k++){step(1);braking=Math.max(braking,...doors.map(d=>d.swing??0));}
   return{names:doors.map(d=>d.name),cruising,left,right,braking,open:c.doorOpenTime};
  }finally{c.dispose();world.free();}
 };
 const on=await run(true),off=await run(false);console.log(JSON.stringify({on,off}));
 assert.ok(on.names.length===2,'the sedan has two front doors');
 assert.ok(on.cruising.every(s=>s<.05),'shut while accelerating in a straight line');
 assert.ok(on.left>.3&&on.left>on.right*2,'steering right throws the left door open ('+on.left+' vs '+on.right+')');
 assert.ok(on.braking>.1,'braking hard swings them open');
 assert.ok(off.left===0&&off.right===0&&off.braking===0&&off.open===0,'online-style doors do not swing');
});
