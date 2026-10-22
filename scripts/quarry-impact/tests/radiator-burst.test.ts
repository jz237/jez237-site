import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RADIATOR_BURST} from '../src/vehicle';
import {RADIATOR} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('the hit that ruptures the radiator bursts steam and splashes coolant once; online-style cars never',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(80,.5,80).setTranslation(0,-.5,0));
  let steam=0,drips=0;const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(_p:T.Vector3,n:number,type:number){if(type===5)steam+=n;},mark(){},detach(){},slicks:{drip(){drips++;},gripAt:()=>1,heatAt:()=>0,ownerAt:()=>-1,igniteAt(){},fires:()=>[]}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  const breaks:string[]=[];c.onBreak=w=>breaks.push(w);
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.root.updateMatrixWorld(true);
   for(let i=0;i<12;i++){c.health=100;c.hit(new T.Vector3(0,.7,2.4).applyMatrix4(c.root.matrixWorld),new T.Vector3(0,0,-1).applyQuaternion(c.root.quaternion),14,i*.5);}
   return{front:c.structuralDamage?.[0]??0,bursts:c.radiatorBursts,steam,coolant:c.drips[1],breaks:breaks.filter(b=>b==='radiator').length};
  }finally{c.dispose();world.free();}
 };
 const on=await run(true),off=await run(false);console.log(JSON.stringify({on,off}));
 assert.ok(on.front>=RADIATOR.onset&&on.bursts===1&&on.steam>=RADIATOR_BURST.steam&&on.coolant>=RADIATOR_BURST.splash,'one burst, steam and a splash');
 assert.ok(on.breaks===1,'reported once as a breakage (toast, highlight, crowd)');
 assert.ok(off.bursts===0,'online-style cars never burst');
});
