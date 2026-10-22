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
test('a burning car crazes its glass until the side windows burst, the screens hang crazed, and the tyres over the fire cook',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,heat:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});let pops=0;
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.onGlassBreak=()=>pops++;
   const panes=c.glass.length;for(let t=0;t<15;t+=1/30)c.cook(heat,1/30,false);
   const screens=c.glass.filter(g=>/Windshield|Rearwindow/.test(g.name));
   return{panes,hidden:c.glass.filter(g=>!g.visible).length,pops,screensUp:screens.every(g=>g.visible),crazed:screens.every(g=>(g.userData.damage??0)>20),tyres:c.tyreDamage?.map(v=>+v.toFixed(2))};
  }finally{c.dispose();world.free();}
 };
 const hot=await run(true,.9),cool=await run(true,.2),online=await run(false,.9);console.log(JSON.stringify({hot,cool,online}));
 assert.ok(hot.hidden>0&&hot.pops===hot.hidden&&hot.screensUp&&hot.crazed,'side glass burst, screens crazed in place');
 assert.ok((hot.tyres?.[0]??0)>.2&&(hot.tyres?.[2]??0)===0,'front tyres cooked over a front engine fire');
 assert.ok(cool.hidden===0&&online.hidden===0&&(online.tyres?.[0]??0)===0,'no cooking below the heat threshold or online');
});
test('a crushed roof crazes the glass and, crushed further, bursts the side windows; screens stay in',async()=>{
 const {ROOF_GLASS}=await import('../src/vehicle');
 const run=async(extended:boolean,roof:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});let pops=0;
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.onGlassBreak=()=>pops++;c.structuralDamage=[0,0,0,0,roof];c.preStep(1/60);c.preStep(1/60);
   return{hidden:c.glass.filter(g=>!g.visible).length,pops,crazed:c.glass.some(g=>(g.userData.damage??0)>0),screens:c.glass.filter(g=>/Windshield|Rearwindow/.test(g.name)).every(g=>g.visible)};}finally{c.dispose();world.free();}
 };
 const light=await run(true,ROOF_GLASS.craze-.05),mid=await run(true,.5),flat=await run(true,.8),online=await run(false,.8);console.log(JSON.stringify({light,mid,flat,online}));
 assert.ok(!light.crazed&&mid.crazed&&mid.hidden===0,'crazes before it bursts');
 assert.ok(flat.hidden>0&&flat.pops===flat.hidden&&flat.screens,'side windows burst, screens stay');
 assert.ok(!online.crazed);
});
