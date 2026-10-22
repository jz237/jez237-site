import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ELECTRICAL,electricalFault,electricalCut,electricalWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a crushed engine bay cuts the ignition in short irregular bursts, more often the worse it is',()=>{
 assert.equal(electricalFault(ELECTRICAL.onset),0);assert.ok(electricalFault(.7)>0&&electricalFault(1)===1&&electricalFault(NaN)===0);
 const share=(s:number,seed=1)=>Array.from({length:6000},(_,i)=>electricalCut(s,i/100,seed)).filter(Boolean).length/6000;
 assert.equal(share(0),0);assert.ok(share(.3)>.02&&share(1)>share(.3)&&share(1)<.6,`cut share ${share(.3)} / ${share(1)}`);
 const runs:number[]=[];let run=0;for(let i=0;i<6000;i++){if(electricalCut(1,i/100,2))run++;else if(run){runs.push(run);run=0;}}
 assert.ok(runs.length>20&&Math.max(...runs)<=Math.ceil(ELECTRICAL.maxCut*100)+1&&new Set(runs).size>4,'bursts of varying length, never long');
 assert.notDeepEqual(Array.from({length:300},(_,i)=>electricalCut(.6,i/50,1)),Array.from({length:300},(_,i)=>electricalCut(.6,i/50,2)),'each car its own pattern');
 assert.equal(electricalWarning(0),'');assert.equal(electricalWarning(.2),'ELECTRICAL FAULT');
});
test('the cuts cost a wired-up car speed and kill its brake lights for a moment; online-style cars are untouched',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,front:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   if(c.structuralDamage)c.structuralDamage[0]=front;c.input.throttle=1;let dark=0;
   for(let k=0;k<60*6;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);c.render(1);if(c.brakeLights.size&&[...c.brakeLights].every(m=>m.emissiveIntensity===0))dark++;}
   return{speed:c.speed,cuts:c.electricalCuts,dark,stall:c.engineStall??0,lights:c.brakeLights.size};
  }finally{c.dispose();world.free();}
 };
 const sound=await run(true,0),bad=await run(true,.85),off=await run(false,.85);console.log(JSON.stringify({sound,bad,off}));
 assert.ok(sound.cuts===0&&sound.dark===0);
 assert.ok(bad.cuts>=4&&bad.speed<sound.speed-.5&&!(bad.stall>0),'cuts out repeatedly, loses speed, keeps running ('+bad.speed+' vs '+sound.speed+')');
 assert.ok(bad.lights>0&&bad.dark>=5,'the brake lights flicker off');
 assert.ok(off.cuts===0&&Math.abs(off.speed-sound.speed)<.3,'online-style cars ignore it');
});
