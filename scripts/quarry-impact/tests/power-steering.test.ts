import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {POWER_STEER,steerRate,steerWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a front crushed past the onset loses the power steering',()=>{
 assert.equal(steerRate(POWER_STEER.onset),1);assert.equal(steerRate(.8),POWER_STEER.rate);
 assert.equal(steerWarning(1),'');assert.equal(steerWarning(.4),'POWER STEERING FAILED');
});
test('without power steering the wheel takes much longer to turn in; online-style cars steer as normal',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const turnIn=async(extended:boolean,front:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.structuralDamage=[front,0,0,0,0];
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   c.input.steer=1;const start=c.steering;for(let k=0;k<6;k++){c.preStep(1/60);world.step();c.postStep(1/60,1+k/60);}
   return c.steering-start;
  }finally{c.dispose();world.free();}
 };
 const ok=await turnIn(true,0),failed=await turnIn(true,.7),online=await turnIn(false,.7);console.log(JSON.stringify({ok,failed,online}));
 assert.ok(Math.abs(failed)<Math.abs(ok)*.6,'much slower turn-in');assert.ok(Math.abs(online)>Math.abs(failed)*1.4,'online-style: normal speed (only bent-steering lock applies offline)');
});
