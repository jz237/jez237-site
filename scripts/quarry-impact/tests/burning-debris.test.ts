import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('parts torn off a car burning hard keep burning where they land; a cool or online-style car sheds cold parts',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,heat:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});let debris=0;const burns:number[]=[];
  const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;debris++;},igniteLastDebris(s:number){burns.push(s);}} as never;
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,fx,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.root.updateMatrixWorld(true);c.fireHeat=heat;
   c.ripAssembly('front-bumper',false);c.ripAssembly('hood',false);
   return{debris,fires:burns.length,seconds:burns};
  }finally{c.dispose();world.free();}
 };
 const hot=await run(true,.8),cool=await run(true,.1),online=await run(false,.8);console.log(JSON.stringify({hot,cool,online}));
 assert.ok(hot.debris>0&&hot.fires===hot.debris&&hot.seconds.every(s=>s>=14&&s<=24),'every torn part burns for 14–24 s');
 assert.ok(cool.debris>0&&cool.fires===0);assert.ok(online.fires===0);
});
