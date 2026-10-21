import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {SPRING,springBias,sagBias,driveBias} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a corner hit past the snap point breaks its spring, harder still its driveshaft',()=>{
 assert.equal(springBias(SPRING.snap-.01),1);assert.equal(springBias(SPRING.snap),SPRING.stiffness);assert.equal(sagBias(SPRING.snap),SPRING.sag);
 assert.equal(driveBias(SPRING.shaft-.01),1);assert.equal(driveBias(SPRING.shaft),0);
});
test('a broken front-left spring drops that corner and the car leans onto it; a snapped rear driveshaft stops driving; online-style cars ride level',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,wheel:number,damage:number,drive=false)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));const breaks:string[]=[];
  const c=new Vehicle(0,'coupe',stockSetup('coupe').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('coupe'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.onBreak=(w,i)=>breaks.push(w+i);c.wreckParts.wheelDamage[wheel]=damage;
   c.input.throttle=drive?1:0;c.input.brake=drive?0:1;
   for(let k=0;k<60*(drive?6:3);k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   const q=c.body.rotation(),up=new T.Vector3(0,1,0).applyQuaternion(new T.Quaternion(q.x,q.y,q.z,q.w)),right=new T.Vector3(1,0,0).applyQuaternion(new T.Quaternion(q.x,q.y,q.z,q.w));
   return{breaks,roll:right.y+up.x*0,speed:c.speed,suspension:c.controller.wheelSuspensionLength(wheel)??0};
  }finally{c.dispose();world.free();}
 };
 const level=await run(true,0,0),sag=await run(true,0,.17),online=await run(false,0,.17);
 const rear=await run(true,2,.2,true),rearOk=await run(true,2,0,true),both=await run(true,2,.2,true);
 console.log(JSON.stringify({level,sag,online,rear,rearOk}));
 assert.deepEqual(sag.breaks,['spring0']);assert.ok(sag.suspension<level.suspension-.05,'the corner sags');
 assert.ok(Math.abs(sag.roll-level.roll)>.01,'the car leans');assert.ok(Math.abs(online.roll-level.roll)<.005&&online.breaks.length===0,'online-style: level');
 assert.ok(rear.breaks.includes('shaft2')&&rear.speed<rearOk.speed,'one driven rear wheel lost: slower');
 assert.ok(both.breaks.length>0);
});
test('a corner down on its bump stops drags along the ground at speed: sparks, grooves and drag',async()=>{
 const run=async(extended:boolean,damage:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  let sparks=0,grooves=0;const fx={emit(_p:T.Vector3,_n:number,type:number){if(type===1)sparks++;},mark(){},detach(){},evidence:{add(_p:T.Vector3,_y:number,_l:number,_s:number,k:number){if(k===2)grooves++;}}} as never;
  const c=new Vehicle(0,'coupe',stockSetup('coupe').paint,scene,world,fx,stockSetup('coupe'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.wreckParts.wheelDamage[0]=damage;
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   const f=new T.Vector3(0,0,1).applyQuaternion(c.body.rotation() as T.Quaternion);c.body.setLinvel({x:f.x*18,y:0,z:f.z*18},true);c.input.throttle=.5;
   for(let k=0;k<120;k++){c.preStep(1/60);world.step();c.postStep(1/60,1+k/60);}
   return{sparks,grooves,speed:c.speed};
  }finally{c.dispose();world.free();}
 };
 const drag=await run(true,.17),clean=await run(true,0),online=await run(false,.17);console.log(JSON.stringify({drag,clean,online}));
 assert.ok(drag.sparks>3&&drag.grooves>3,'sparks and grooves');assert.ok(clean.grooves===0&&online.grooves===0);
});
