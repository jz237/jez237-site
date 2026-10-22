import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {EXHAUST_OFF} from '../src/vehicle';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a dragging exhaust tears off after a while, is left behind as debris, and the car runs open-pipe; online-style never',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,seconds:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const pieces:string[]=[];let car:Vehicle|undefined;
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(m:T.Mesh){pieces.push(m.name);},evidence:{add(){}}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');car=c;
  const breaks:string[]=[];c.onBreak=w=>breaks.push(w);void car;
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   if(c.structuralDamage)c.structuralDamage[1]=.4;c.input.throttle=.5;
   for(let k=0;k<60*seconds;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);}
   return{gone:c.exhaustGone,dragged:c.exhaustDragTime,pieces,breaks:breaks.filter(b=>b==='exhaust').length,blow:c.exhaustBlow};
  }finally{c.dispose();world.free();}
 };
 const short=await run(true,EXHAUST_OFF.after-3),long=await run(true,EXHAUST_OFF.after+6),off=await run(false,EXHAUST_OFF.after+6);console.log(JSON.stringify({short,long,off}));
 assert.ok(!short.gone&&short.dragged>0,'still dragging after a few seconds');
 assert.ok(long.gone&&long.pieces.filter(n=>n==='exhaust_pipe').length===1&&long.breaks===1,'it tears off once and is left as debris');
 assert.ok(long.blow===1,'open-pipe from then on');
 assert.ok(!off.gone&&off.pieces.length===0,'online-style exhausts stay on');
});
