import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {PUNCTURE,punctures,LEAK} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a roll over debris punctures about PUNCTURE.odds of the time',()=>{
 const n=Array.from({length:400},(_,i)=>punctures(3,i)).filter(Boolean).length;assert.ok(n>400*PUNCTURE.odds*.75&&n<400*PUNCTURE.odds*1.25,`${n}/400`);
});
test('driving over debris at speed punctures tyres into a slow leak; standing still or clear ground does not; online-style tyres never',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,debris:boolean,throttle:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){},sharpDebrisNear:()=>debris} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.input.throttle=throttle;
   for(let k=0;k<60*12;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   return{punctures:c.debrisPunctures,rolls:c.debrisRolls,tyres:Array.from(c.tyreDamage??[]).map(v=>+v.toFixed(2))};
  }finally{c.dispose();world.free();}
 };
 const over=await run(true,true,.6),clear=await run(true,false,.6),parked=await run(true,true,0),off=await run(false,true,.6);console.log(JSON.stringify({over,clear,parked,off}));
 assert.ok(over.punctures>=1&&over.tyres.filter(t=>t>=LEAK.onset).length>=over.punctures-0,'debris punctures tyres into a slow leak');
 assert.ok(clear.punctures===0&&parked.punctures===0&&parked.rolls===0,'clear ground or standing still: none');
 assert.ok(off.punctures===0,'online-style tyres never puncture');
});
