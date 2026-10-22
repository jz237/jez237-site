import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DEBEAD,beadStress,LEAK} from '../src/damage-handling';
import {tyreFailure} from '../src/tyre-condition';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a soft tyre builds bead stress in hard corners, the outside one most; firm or failed tyres and gentle corners do not',()=>{
 assert.equal(beadStress(0,.2,12,true,1),0,'firm');assert.equal(beadStress(0,.8,12,true,1),0,'already failed');
 assert.equal(beadStress(0,.6,DEBEAD.lateral,true,1),0,'gentle corner');
 assert.ok(beadStress(0,.65,10,true,.1)>beadStress(0,.45,10,true,.1)&&beadStress(0,.6,10,true,.1)>beadStress(0,.6,10,false,.1)&&beadStress(0,.6,11,true,.1)>beadStress(0,.6,8,true,.1));
 assert.ok(beadStress(.5,.6,0,true,1)<.5,'it relaxes on the straight');assert.equal(beadStress(.99,.7,20,true,5),1);
 assert.ok(Number.isFinite(beadStress(NaN,NaN,NaN,true,NaN)));
});
test('cornering hard on a soft tyre rolls the outside tyre off its rim; online-style tyres hold',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,steer:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  let whumps=0;c.onBlowout=()=>{whumps++;};
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   c.input.throttle=1;for(let k=0;k<60*3;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);}
   if(c.tyreDamage)c.tyreDamage.fill(.6);c.input.throttle=.6;c.input.steer=steer;let lat=0;
   for(let k=0;k<60*4;k++){c.preStep(1/60);world.step();c.postStep(1/60,3.5+k/60);lat=Math.max(lat,Math.abs(c.body.angvel().y*c.speed));}
   return{debeads:c.debeads,whumps,lat,failure:Array.from(c.tyreDamage??[]).map(d=>+tyreFailure(d).toFixed(2))};
  }finally{c.dispose();world.free();}
 };
 const corner=await run(true,1),straight=await run(true,0),off=await run(false,1);console.log(JSON.stringify({corner,straight,off}));
 assert.ok(corner.lat>DEBEAD.lateral,'a hard corner ('+corner.lat+' m/s²)');
 assert.ok(corner.debeads>=1&&corner.whumps===corner.debeads&&corner.failure.filter(f=>f===1).length===corner.debeads,'the outside tyre rolls off and goes flat');
 assert.ok(straight.debeads===0,'not on the straight');
 assert.ok(off.debeads===0,'online-style tyres hold');
});
