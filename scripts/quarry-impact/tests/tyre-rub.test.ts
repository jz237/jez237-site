import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RUB,tyreRub,rubWear,rubWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a crushed arch rubs the tyre on its own corner; mild crush does not',()=>{
 assert.equal(tyreRub([0,0,0,0,0],0),0);assert.equal(tyreRub([.4,0,0,0,0],0),0,'mild');assert.equal(tyreRub(undefined,1),0);
 const s=[.7,0,.3,0,0];assert.ok(tyreRub(s,0)>.5&&tyreRub(s,1)<tyreRub(s,0)&&tyreRub(s,2)===0&&tyreRub(s,3)===0,'front-left only');
 assert.equal(tyreRub([1,1,1,1,0],3),1);
 assert.equal(rubWear(0,20,1),0);assert.ok(rubWear(1,20,1)>rubWear(1,4,1)&&Math.abs(rubWear(1,20,1)-RUB.wear)<1e-12);assert.equal(rubWear(1,20,0),0);
 assert.equal(rubWarning([0,.1,0,0]),'');assert.equal(rubWarning([0,.4,0,0]),'TYRE RUBBING');
});
test('a rubbing corner drags the car back and toward that side, scrubs the tyre and smokes; online-style cars are untouched',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,structure:number[]|null,model:'angular-v1'|undefined)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  let puffs=0;const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){puffs++;},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,model as never);
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   if(structure&&c.structuralDamage)structure.forEach((v,j)=>c.structuralDamage![j]=v);
   const start=c.current.clone(),dir=c.forward.clone();c.input.throttle=.7;
   for(let k=0;k<60*6;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);}
   const d=c.current.clone().sub(start),along=d.dot(dir),side=d.x*c.right.x+d.z*c.right.z;
   return{speed:c.speed,along,side,rub:Array.from(c.rubDrag),tyre:Array.from(c.tyreDamage??[]),smoke:c.rubSmoke};
  }finally{c.dispose();world.free();}
 };
 const crush=[0,0,0,0,0],rubbing=[.25,0,.55,0,0];
 for(const model of ['angular-v1',undefined] as const){
  const base=await run(true,crush,model),rub=await run(true,rubbing,model),off=await run(false,rubbing,model);console.log(model,JSON.stringify({base,rub,off}));
  assert.ok(rub.rub[0]>rub.rub[2]&&rub.rub[2]>0&&rub.rub[1]===0&&rub.rub[3]===0,'the crushed left flank rubs, the front arch worst');
  assert.ok(rub.speed<base.speed-.3,'it drags ('+rub.speed+' vs '+base.speed+')');
  assert.ok(rub.tyre[0]>base.tyre[0]+.01&&rub.smoke>=10,'scrubs the tyre and smokes');
  assert.ok(off.rub.every(r=>r===0)&&Math.abs(off.speed-base.speed)<.3,'online-style cars ignore it');
 }
});
