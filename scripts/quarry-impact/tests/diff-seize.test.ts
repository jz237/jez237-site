import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DIFF,diffDamage,diffAxle,wearDiff,diffDrive,diffWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a crushed driven end cracks the diff: it grinds away drive under load and breaks; a healthy diff costs nothing',()=>{
 assert.equal(diffDamage([.9,0,0,0,0],'rear'),0,'front crush spares a rear diff');assert.ok(diffDamage([0,.6,0,0,0],'rear')>0&&diffDamage([.6,0,0,0,0],'front')>0);
 assert.equal(diffDamage([DIFF.onset,DIFF.onset,0,0,0],'all'),0);
 assert.equal(diffAxle([.9,.1,0,0,0],'rear'),'rear');assert.equal(diffAxle([.9,.1,0,0,0],'all'),'front');assert.equal(diffAxle([.1,.9,0,0,0],'all'),'rear');
 assert.equal(wearDiff(0,0,1,10),0);assert.ok(wearDiff(0,.5,1,1)>wearDiff(0,.5,0,1)&&wearDiff(.99,1,1,10)===1);
 assert.equal(diffDrive(0),1);assert.ok(Math.abs(diffDrive(.5)-(1-DIFF.loss/2))<1e-12);assert.equal(diffDrive(1),0);
 assert.equal(diffWarning(0),'');assert.equal(diffWarning(.4),'DIFF GRINDING');assert.equal(diffWarning(1),'DIFF BROKEN');
});
test('a grinding diff slows a rear-drive car, a broken one leaves it coasting with a jolt; online-style diffs are untouched',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,wear:number,model:'angular-v1'|undefined)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'coupe',stockSetup('coupe').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('coupe'),{height:()=>0,surface:()=>'asphalt'} as never,model as never);
  const breaks:string[]=[];c.onBreak=(w,i)=>breaks.push(w+i);
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   if(c.structuralDamage)c.structuralDamage[1]=.5;c.input.throttle=1;c.diffWear=wear;
   for(let k=0;k<60*4;k++){if(wear<.9)c.diffWear=wear;c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);}
   return{speed:c.speed,wear:c.diffWear,breaks,bias:Array.from(c.driveBias)};
  }finally{c.dispose();world.free();}
 };
 for(const model of ['angular-v1',undefined] as const){
  const healthy=await run(true,0,model),grinding=await run(true,.8,model),broken=await run(true,.9999,model),off=await run(false,.8,model),offHealthy=await run(false,0,model);
  console.log(model,JSON.stringify({healthy,grinding,broken,off}));
  assert.ok(grinding.speed<healthy.speed-.5,'grinding costs drive ('+grinding.speed+' vs '+healthy.speed+')');
  assert.ok(broken.wear===1&&broken.breaks.join()==='diff2'&&broken.bias[2]===0&&broken.bias[3]===0&&broken.speed<3,'broken: no drive to the rear, it rolls to a halt');
  assert.ok(Math.abs(off.speed-offHealthy.speed)<1e-9&&off.breaks.length===0,'online-style cars ignore it');
 }
});
