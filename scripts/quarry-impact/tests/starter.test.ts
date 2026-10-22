import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {STARTER,starterDamage,starterFails,starterWarning} from '../src/damage-handling';
import {MAX_ENGINE_RESTART} from '../src/engine-stall';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a crushed engine bay damages the starter; worse damage fails to catch more often',()=>{
 assert.equal(starterDamage(STARTER.onset),0);assert.ok(starterDamage(1)===1&&starterDamage(NaN)===0);
 const fails=(s:number)=>Array.from({length:400},(_,i)=>starterFails(s,i,3)).filter(Boolean).length;
 assert.equal(fails(0),0);assert.ok(fails(1)>fails(.3)&&fails(1)<400*.55);
 assert.equal(starterWarning(0),'');assert.equal(starterWarning(.2),'STARTER DAMAGED');
});
test('after a stall a damaged starter takes longer to bring the engine back and coughs on failed cranks; online-style restarts are unchanged',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,front:number,id:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(id,'coupe',stockSetup('coupe').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('coupe'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  let coughs=0;c.onBackfire=()=>{coughs++;};
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   if(c.structuralDamage)c.structuralDamage[0]=front;c.engineStall=MAX_ENGINE_RESTART;c.input={throttle:1,steer:0,brake:0,handbrake:false};let restartAt=-1,maxStall=0;
   for(let k=0;k<60*20&&restartAt<0;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);maxStall=Math.max(maxStall,c.engineStall??0);if(!(c.engineStall!>0))restartAt=k/60;}
   return{restartAt,fails:c.starterFails,coughs,maxStall,damage:c.starterDamage};
  }finally{c.dispose();world.free();}
 };
 const sound=await run(true,0,0),worn=await run(true,.95,0),worn2=await run(true,.95,5),off=await run(false,.95,0);console.log(JSON.stringify({sound,worn,worn2,off}));
 assert.ok(sound.restartAt>2.5&&sound.restartAt<3.2,'a sound starter restarts in the usual time');
 assert.ok(worn.damage===1&&worn.restartAt>sound.restartAt*1.4,'a damaged one takes much longer ('+worn.restartAt+' s)');
 assert.ok(worn.fails+worn2.fails>=1&&worn.coughs===worn.fails,'and sometimes fails to catch, with a cough');
 assert.ok(Math.max(worn.maxStall,worn2.maxStall)<=MAX_ENGINE_RESTART+1e-6,'never past the replay-safe restart cap');
 assert.ok(Math.abs(off.restartAt-sound.restartAt)<.05&&off.fails===0,'online-style restarts are unchanged');
});
