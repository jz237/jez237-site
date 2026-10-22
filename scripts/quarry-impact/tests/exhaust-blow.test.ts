import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {EXHAUST_BLOW,exhaustBlow,exhaustLoudness,liftPops,exhaustWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a crushed rear splits the exhaust: louder, and a crackle of pops on each lift, more the worse it is',()=>{
 assert.equal(exhaustBlow(EXHAUST_BLOW.onset),0);assert.ok(exhaustBlow(.4)>0&&exhaustBlow(1)===1&&exhaustBlow(NaN)===0);
 assert.equal(exhaustLoudness(0),1);assert.ok(Math.abs(exhaustLoudness(1)-1-EXHAUST_BLOW.loud)<1e-12);
 assert.deepEqual(liftPops(0,3),[]);
 const counts=Array.from({length:40},(_,i)=>liftPops(1,i).length),mild=Array.from({length:40},(_,i)=>liftPops(.2,i).length);
 assert.ok(counts.every(n=>n>=EXHAUST_BLOW.minPops&&n<=EXHAUST_BLOW.maxPops)&&new Set(counts).size>2,'varied crackles');
 assert.ok(counts.reduce((a,b)=>a+b)>mild.reduce((a,b)=>a+b),'more pops the worse the split');
 const t=liftPops(1,5);assert.ok(t.every((v,i)=>v>(i?t[i-1]:0)+EXHAUST_BLOW.gap-1e-9)&&t[t.length-1]<1,'spaced, all within a second');
 assert.equal(exhaustWarning(0),'');assert.equal(exhaustWarning(.3),'EXHAUST BLOWING');
});
test('lifting off at speed with a split exhaust pops and spits flame; online-style cars stay quiet',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,rear:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  let pops=0;c.onBackfire=()=>{pops++;};
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   if(c.structuralDamage)c.structuralDamage[1]=rear;
   for(let lift=0;lift<3;lift++){c.input.throttle=1;for(let k=0;k<120;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}c.input.throttle=0;for(let k=0;k<60;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}}
   return{pops,counted:c.exhaustPops,blow:c.exhaustBlow};
  }finally{c.dispose();world.free();}
 };
 const sound=await run(true,0),split=await run(true,.65),off=await run(false,.65);console.log(JSON.stringify({sound,split,off}));
 assert.equal(sound.pops,0);
 assert.ok(split.blow>.9&&split.pops>=3*EXHAUST_BLOW.minPops&&split.counted===split.pops,'every lift crackles');
 assert.ok(off.pops===0&&off.blow===0,'online-style cars never pop');
});
