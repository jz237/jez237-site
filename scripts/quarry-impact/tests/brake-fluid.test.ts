import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {BRAKE_LINE,leakBrakeFluid,brakeFluidFactor,brakeWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a front crushed past the onset bleeds brake fluid, faster the worse; the brakes fade to a floor',()=>{
 assert.equal(leakBrakeFluid(1,BRAKE_LINE.onset,10),1);
 assert.ok(leakBrakeFluid(1,.9,10)<leakBrakeFluid(1,.6,10)&&leakBrakeFluid(.01,1,10)===0);
 assert.equal(brakeFluidFactor(1),1);assert.equal(brakeFluidFactor(0),BRAKE_LINE.floor);
 assert.equal(brakeWarning(.9),'');assert.equal(brakeWarning(.5),'BRAKES FADING');
});
test('with the reservoir dry a car takes much further to stop; online-style cars brake as normal',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const stop=async(extended:boolean,fluid:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.brakeFluid=fluid;
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   const f=new T.Vector3(0,0,1).applyQuaternion(c.body.rotation() as T.Quaternion),a=c.body.translation();c.body.setLinvel({x:f.x*20,y:0,z:f.z*20},true);
   c.input.throttle=0;c.input.brake=1;let k=0;for(;k<60*12&&c.speed>.5;k++){c.preStep(1/60);world.step();c.postStep(1/60,1+k/60);}
   const b=c.body.translation();return Math.hypot(b.x-a.x,b.z-a.z);
  }finally{c.dispose();world.free();}
 };
 const good=await stop(true,1),dry=await stop(true,0),online=await stop(false,0);console.log(JSON.stringify({good,dry,online}));
 assert.ok(dry>good*1.6,'much longer stopping distance');assert.ok(Math.abs(online-good)<1,'online-style unaffected');
});
