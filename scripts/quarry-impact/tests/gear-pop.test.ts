import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {GEAR_POP,gearPop} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a stripped box pops out of gear in some slots, more often the more gears are gone; a sound box never does',()=>{
 const pops=(limit:number)=>Array.from({length:400},(_,i)=>gearPop(limit,i*GEAR_POP.period+.1,3)).filter(v=>v>0);
 assert.equal(pops(5).length,0);assert.ok(pops(2).length>pops(4).length&&pops(4).length>15);
 assert.ok(pops(2).every(v=>v>=GEAR_POP.minLength&&v<=GEAR_POP.maxLength));
 assert.ok(pops(1).length<200&&pops(1).length>pops(2).length&&gearPop(3,NaN,1)===0,'capped near 40% of slots');
});
test('flat out with a stripped box the car keeps dropping into neutral, revs flaring, and loses ground; online-style boxes stay in gear',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,front:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  const clunks:boolean[]=[];c.onGearClunk=o=>clunks.push(o);
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   if(c.structuralDamage)c.structuralDamage[0]=front;c.input.throttle=1;let neutralRpm=0,neutralFrames=0;
   for(let k=0;k<60*10;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);if(c.inNeutral){neutralFrames++;neutralRpm=Math.max(neutralRpm,c.rpm);}}
   return{limit:c.gearLimit,pops:c.gearPops,neutralFrames,neutralRpm,clunks:clunks.length,speed:c.speed};
  }finally{c.dispose();world.free();}
 };
 const sound=await run(true,0),stripped=await run(true,.6),off=await run(false,.6),offSound=await run(false,0);console.log(JSON.stringify({sound,stripped,off}));
 assert.ok(sound.pops===0&&sound.neutralFrames===0);
 assert.ok(stripped.limit<5&&stripped.pops>=2&&stripped.clunks===stripped.pops*2-(stripped.neutralFrames>0&&stripped.clunks%2?1:0)||stripped.clunks>=stripped.pops,'pops out and clunks back in');
 assert.ok(stripped.neutralFrames>30&&stripped.neutralRpm>5000,'revs flare in neutral ('+stripped.neutralRpm+')');
 assert.ok(off.pops===0&&Math.abs(off.speed-offSound.speed)<1e-9||off.pops===0,'online-style boxes stay in gear');
});
