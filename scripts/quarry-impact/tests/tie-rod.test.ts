import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {TIE_ROD,tieRodSnapped,flopToe,tieRodWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a bashed front wheel snaps its tie rod and flops toed out, wandering with speed; rear wheels have none',()=>{
 assert.ok(!tieRodSnapped(0,TIE_ROD.snap-.01)&&tieRodSnapped(0,TIE_ROD.snap)&&tieRodSnapped(1,.9)&&!tieRodSnapped(2,.9)&&!tieRodSnapped(0,NaN));
 assert.ok(Math.abs(flopToe(0,0,3)+TIE_ROD.toe)<1e-12&&Math.abs(flopToe(1,0,3)-TIE_ROD.toe)<1e-12,'toed out, still at a standstill');
 const w=Array.from({length:200},(_,k)=>flopToe(1,20,k*.05));assert.ok(Math.max(...w)-Math.min(...w)>.05&&w.every(v=>Math.abs(v-TIE_ROD.toe)<=TIE_ROD.wobble+1e-9));
 assert.equal(tieRodWarning([1,1,1,1]),'');assert.equal(tieRodWarning([1,0,1,1]),'TIE ROD SNAPPED');
});
test('with a snapped tie rod the car turns on one wheel and the loose one flops; online-style steering is untouched',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,damage:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  const breaks:string[]=[];c.onBreak=(w,i)=>{if(w==='tierod')breaks.push(w+i);};
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   c.input.throttle=.8;for(let k=0;k<120;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);}
   c.wreckParts.wheelDamage[1]=damage;c.input.throttle=.5;c.input.steer=-.6;// toward the sound side, so a short lock (STEER_SKEW) on the knocked side does not mask the rod
  const yaw0=Math.atan2(c.forward.x,c.forward.z);let turned=0,last=yaw0,steer1=0;
   for(let k=0;k<120;k++){c.preStep(1/60);world.step();c.postStep(1/60,2.5+k/60);const y=Math.atan2(c.forward.x,c.forward.z);let d=y-last;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;turned+=d;last=y;
    steer1=Math.max(steer1,Math.abs((c.controller.wheelSteering(1)??0)-(c.controller.wheelSteering(0)??0)));}
   return{turned:Math.abs(turned),link:Array.from(c.steerLink),breaks,split:steer1};
  }finally{c.dispose();world.free();}
 };
 const bent=await run(true,.15),snapped=await run(true,.25),off=await run(false,.25);console.log(JSON.stringify({bent,snapped,off}));
 assert.ok(bent.link.every(v=>v===1)&&bent.breaks.length===0);
 assert.ok(snapped.link[1]===0&&snapped.link[0]===1&&snapped.breaks.join()==='tierod1','the front-right rod snaps once');
 assert.ok(snapped.split>.1,'the two front wheels point different ways ('+snapped.split+')');
 assert.ok(snapped.turned<bent.turned*.92,'it turns less ('+snapped.turned+' vs '+bent.turned+')');
 assert.ok(off.link.every(v=>v===1)&&off.breaks.length===0,'online-style cars never snap a rod');
});
