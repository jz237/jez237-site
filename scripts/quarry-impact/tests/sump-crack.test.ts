import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {SUMP,crackSump,sumpLeak} from '../src/oil-starvation';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('bottoming out past SUMP.fall cracks the sump, wider with each landing; gentle landings do not',()=>{
 assert.equal(crackSump(0,SUMP.fall),0);assert.ok(crackSump(0,SUMP.fall+3)>0&&crackSump(crackSump(0,SUMP.fall+3),SUMP.fall+3)>crackSump(0,SUMP.fall+3));
 assert.equal(crackSump(.9,40),1);assert.equal(crackSump(NaN,NaN),0);
 assert.equal(sumpLeak(0),0);assert.ok(Math.abs(sumpLeak(1)-SUMP.leak)<1e-12);
});
test('a big drop cracks the sump and the oil pours out; a small one does not; online-style cars are untouched',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,height:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(80,.5,80).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   const p=c.body.translation();c.body.setTranslation({x:p.x,y:p.y+height,z:p.z},true);c.body.setLinvel({x:0,y:0,z:0},true);
   c.input.throttle=.4;for(let k=0;k<60*8;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);}
   return{crack:c.sumpCrack,oil:c.oilLevel,drips:c.drips[0]};
  }finally{c.dispose();world.free();}
 };
 const hop=await run(true,1),drop=await run(true,7),off=await run(false,7);console.log(JSON.stringify({hop,drop,off}));
 assert.ok(hop.crack===0&&hop.oil===1,'a hop does nothing');
 assert.ok(drop.crack>0&&drop.oil<.9&&drop.drips>=SUMP.splash,'the big drop cracks it and oil pours out');
 assert.ok(off.crack===0&&off.oil===1&&off.drips===0,'online-style cars never crack the sump');
});
