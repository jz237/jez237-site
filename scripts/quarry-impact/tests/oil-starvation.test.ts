import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OIL,drainOil,starvationWear,seizes,knockRate,oilWarning} from '../src/oil-starvation';
import {MAX_ENGINE_RESTART} from '../src/engine-stall';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a leak drains the oil; short of oil the engine wears and knocks; dry and finished, it seizes',()=>{
 assert.equal(drainOil(1,0,10),1);assert.ok(drainOil(1,1,10)<drainOil(1,.5,10));assert.equal(drainOil(.01,1,10),0);
 assert.equal(starvationWear(.5,1,1),0);assert.ok(starvationWear(.1,1,1)>starvationWear(.2,1,1)&&starvationWear(.1,1,1)>starvationWear(.1,0,1));
 assert.ok(seizes(0,OIL.seize)&&!seizes(.3,1)&&!seizes(0,.5));
 assert.equal(knockRate(.5,4000),0);assert.ok(knockRate(.05,4000)>knockRate(.2,4000)&&knockRate(.05,4000)<=OIL.knockRate);assert.equal(knockRate(.05,0),0);
 assert.equal(oilWarning(.1,false),'OIL PRESSURE LOW');assert.equal(oilWarning(0,true),'ENGINE SEIZED');assert.equal(oilWarning(.9,false),'');
});
test('a dry engine wears to a seizure under load, lurches the car and never restarts; online-style engines are untouched',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));let seizedAt=-1;
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.onSeize=()=>{seizedAt=c.speed;};
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   c.oilLevel=.01;c.engineDamage=.85;c.input.throttle=1;
   for(let k=0;k<60*12;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);}
   const speed=c.speed;for(let k=0;k<60*4;k++){c.preStep(1/60);world.step();c.postStep(1/60,13+k/60);}
   return{seized:c.seized,engine:c.engineDamage,stall:c.engineStall,seizedAt,speed,later:c.speed};
  }finally{c.dispose();world.free();}
 };
 const on=await run(true),off=await run(false);console.log(JSON.stringify({on,off}));
 assert.ok(on.seized&&on.engine>=OIL.seize&&(on.stall??0)>MAX_ENGINE_RESTART-.05,'seized and stuck stalled while cranking');
 assert.ok(on.later<on.speed&&on.later<3,'the car rolls to a stop');
 assert.ok(!off.seized&&(off.engine??0)<=.85+1e-9,'online-style engines do not starve');
});
test('a leaking radiator drains the coolant; low on coolant the engine overheats and wears under load',async()=>{
 const {COOLANT,drainCoolant,overheatWear,coolantWarning}=await import('../src/oil-starvation');
 assert.equal(drainCoolant(1,0,10),1);assert.ok(drainCoolant(1,1,10)<drainCoolant(1,.4,10));
 assert.equal(overheatWear(.5,1,1),0);assert.ok(overheatWear(.05,1,1)>overheatWear(.2,1,1)&&overheatWear(.05,1,1)>overheatWear(.05,0,1));
 assert.equal(coolantWarning(.1),'ENGINE OVERHEATING');assert.equal(coolantWarning(COOLANT.low),'');
});
