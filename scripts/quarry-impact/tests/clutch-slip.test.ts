import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {CLUTCH,clutchGrip,clutchSlips,clutchForce,clutchWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a crushed engine end costs clutch grip; it slips only under heavy throttle and burns further while it slips',()=>{
 assert.equal(clutchGrip(0),1);assert.equal(clutchGrip(CLUTCH.onset),1);
 assert.ok(Math.abs(clutchGrip(1)-CLUTCH.min)<1e-9&&clutchGrip(.6)<1&&clutchGrip(.6)>CLUTCH.min);
 assert.ok(clutchGrip(1,.3)<clutchGrip(1)&&clutchGrip(1,1)===CLUTCH.floor,'burnt, down to the floor');
 assert.equal(clutchGrip(NaN,NaN),1);
 assert.ok(!clutchSlips(1,1)&&!clutchSlips(.6,.5)&&clutchSlips(.6,1),'gentle throttle still grips');
 assert.equal(clutchForce(1,1),1);assert.equal(clutchForce(.6,.5),1);assert.ok(Math.abs(clutchForce(.6,1)-.75)<1e-9);
 assert.equal(clutchWarning(.9),'');assert.equal(clutchWarning(.6),'CLUTCH SLIPPING');
});
test('a slipping clutch flares the revs and slows the car at full throttle, burns, smokes; online-style cars are untouched',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,front:number,model:'angular-v1'|undefined)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  let puffs=0;const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){puffs++;},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,model as never);
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   if(c.structuralDamage)c.structuralDamage[0]=front;c.input.throttle=1;let rpm=0;
   for(let k=0;k<60*5;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);if(k>=60&&k<120)rpm=Math.max(rpm,c.rpm);}
   return{speed:c.speed,rpm,grip:c.clutchGrip,smoke:c.clutchSmoke,structure:!!c.structuralDamage};
  }finally{c.dispose();world.free();}
 };
 for(const model of ['angular-v1',undefined] as const){
  const sound=await run(true,0,model),bad=await run(true,.9,model),off=await run(false,.9,model);console.log(model,JSON.stringify({sound,bad,off}));
  assert.ok(sound.structure&&sound.grip===1&&sound.smoke===0,'a sound clutch never slips');
  assert.ok(bad.grip<CLUTCH.min&&bad.smoke>=10,'a crushed one slips, burns and smokes at full throttle');
  assert.ok(bad.speed<sound.speed*.92,'and the car pulls noticeably less ('+bad.speed+' vs '+sound.speed+')');
  assert.ok(bad.rpm>sound.rpm,'while the engine revs higher');
  assert.ok(off.grip===1&&Math.abs(off.speed-sound.speed)<.3,'online-style cars ignore the clutch');
 }
});
