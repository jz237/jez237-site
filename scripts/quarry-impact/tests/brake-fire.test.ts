import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {BRAKE_FIRE,brakeFireClock} from '../src/damage-handling';
import {FluidSlicks} from '../src/fluid-leaks';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a white-hot disc counts toward a brake fire and cools back off it',()=>{
 let c=0;for(let i=0;i<60*BRAKE_FIRE.after;i++)c=brakeFireClock(c,1,1/60);assert.ok(c>=BRAKE_FIRE.after-1e-6);
 const cooled=brakeFireClock(c,.5,1);assert.ok(Math.abs(cooled-(c-BRAKE_FIRE.cool))<1e-9);
 assert.equal(brakeFireClock(3,BRAKE_FIRE.heat-.01,0),3);assert.equal(brakeFireClock(NaN,1,0),0);
});
test('a binding brake held white-hot sets its tyre alight: the car catches, burning rubber drops and lights on the ground; online-style never',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,damage:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0}),slicks=new FluidSlicks(scene);world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'wagon',stockSetup('wagon').paint,scene,world,{emit(){},mark(){},detach(){},slicks} as never,stockSetup('wagon'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  let alight=0;c.onSetAlight=()=>{alight++;};
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   c.input.throttle=1;let requested=false;
   for(let k=0;k<60*25;k++){c.wreckParts.wheelDamage[3]=damage;c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);if(c.igniteRequest){requested=true;c.igniteRequest=false;}}
   return{fires:c.brakeFires,alight,requested,heat:c.discHeat[3],tyre:c.tyreDamage?.[3]??0,burning:slicks.stats.burning,drips:c.drips[0]};
  }finally{c.dispose();world.free();slicks.mesh.geometry.dispose();}
 };
 const bound=await run(true,.4),free=await run(true,.1),off=await run(false,.4);console.log(JSON.stringify({bound,free,off}));
 assert.ok(bound.fires===1&&bound.alight===1&&bound.requested,'the tyre catches and the car with it, once');
 assert.ok(bound.drips>0&&bound.burning>0,'burning rubber drops and burns on the ground');
 assert.ok(bound.tyre>.3,'the tyre burns down');
 assert.ok(free.fires===0&&!free.requested,'a free brake never catches');
 assert.ok(off.fires===0&&!off.requested,'online-style brakes never catch');
});
