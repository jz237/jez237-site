import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {gearLimit,gearboxWarning,GEARBOX} from '../src/damage-handling';
import {stepTransmission,type TransmissionVehicle} from '../src/transmission';
import {stepAutoGear,freshAutoGear} from '../src/drivetrain/gearing';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('crushing the driven end strips gears from the top, never below two',()=>{
 assert.equal(gearLimit(undefined,'rear'),5);assert.equal(gearLimit([0,GEARBOX.onset-.01,0,0,0],'rear'),5);
 assert.equal(gearLimit([0,GEARBOX.onset+.01,0,0,0],'rear'),4);
 assert.equal(gearLimit([1,0,0,0,0],'rear'),5,'a front crush leaves a rear-drive gearbox alone');
 assert.equal(gearLimit([1,0,0,0,0],'front'),GEARBOX.min);
 assert.ok(gearLimit([.8,.2,0,0,0],'all')<5&&gearLimit([.8,.2,0,0,0],'all')>gearLimit([.8,.2,0,0,0],'front'));
 for(let c=0;c<=1;c+=.01)assert.ok(gearLimit([c,c,0,0,0],'all')>=GEARBOX.min);
 assert.equal(gearboxWarning(5),'');assert.equal(gearboxWarning(3),'GEARBOX DAMAGED · 3 GEARS');
});
const car=(over:Partial<TransmissionVehicle>={}):TransmissionVehicle=>({gear:1,rpm:850,speed:0,input:{throttle:1},...over});
const spec={gearStep:8,speedLimit:45};
test('the automatic box stops at the highest gear left and the limiter caps speed there',()=>{
 const fast=car({speed:40});stepTransmission(fast,spec,1/60,true);assert.equal(fast.gear,5);
 const hurt=car({speed:40,gearLimit:3});const drive=stepTransmission(hurt,spec,1/60,true);assert.equal(hurt.gear,3);assert.equal(drive,0,'no drive beyond third gear speed');
 const below=car({speed:12,gearLimit:3});assert.ok(stepTransmission(below,spec,1/60,true)>0);
});
test('a manual shift into a stripped gear grinds, and a gear stripped while engaged pops out',()=>{
 const c=car({gear:3,speed:20,gearLimit:3,input:{throttle:1,transmission:{mode:'manual',up:true,down:false,clutch:0}}});
 stepTransmission(c,spec,1/60,true);assert.equal(c.gear,3);assert.ok((c.transmission?.grind??0)>0&&(c.transmission?.notice??0)>0);
 const d=car({gear:5,speed:30,gearLimit:2,input:{throttle:1,transmission:{mode:'manual',up:false,down:false,clutch:0}}});
 for(let i=0;i<30;i++)stepTransmission(d,spec,1/60,true);assert.equal(d.gear,2);
});
test('the angular automatic box shifts down out of a stripped gear and no higher than the limit',()=>{
 const s=freshAutoGear();s.gear=5;for(let i=0;i<120;i++)stepAutoGear(s,30,6000,.37,1,1/60,1,3);assert.equal(s.gear,3);
 const t=freshAutoGear();for(let i=0;i<600;i++)stepAutoGear(t,40,6000,.37,1,1/60,1,3);assert.ok(t.gear<=3);
 const u=freshAutoGear();for(let i=0;i<600;i++)stepAutoGear(u,50,6000,.37,1,1/60);assert.equal(u.gear,5,'intact boxes reach fifth');
});
test('a coupe with a crushed rear tops out lower offline; the same crush online keeps every gear',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,crush:boolean)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}} as never;
  const c=new Vehicle(0,'coupe',stockSetup('coupe').paint,scene,world,fx,stockSetup('coupe'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.root.updateMatrixWorld(true);
   if(crush)c.structuralDamage=[0,.95,0,0,0];
   c.input.throttle=1;let top=0;
   for(let k=0;k<60*40;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);top=Math.max(top,c.speed);}
   return{top,limit:c.gearLimit,gear:c.gear};
  }finally{c.dispose();world.free();}
 };
 const intact=await run(true,false),hurt=await run(true,true),online=await run(false,true);console.log(JSON.stringify({intact,hurt,online}));
 assert.equal(intact.limit,5);assert.equal(hurt.limit,GEARBOX.min);assert.equal(online.limit,5);
 assert.ok(hurt.top<intact.top*.8,'a two-gear car is clearly slower flat out');
 assert.ok(Math.abs(online.top-intact.top)<.5,'online-style damage does not touch the gearbox');
});
