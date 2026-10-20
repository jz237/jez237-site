import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {bentRimTyre,BENT_RIM,LEAK} from '../src/damage-handling';
import {tyreWarning} from '../src/tyre-feedback';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a rim bent past the onset breaks the bead: at least a slow puncture, more the worse the bend',()=>{
 assert.equal(bentRimTyre(0,BENT_RIM.onset-.01),0);
 assert.equal(bentRimTyre(0,BENT_RIM.onset),LEAK.onset);
 assert.ok(bentRimTyre(0,.8)>bentRimTyre(0,.5)&&bentRimTyre(0,1)<LEAK.flat,'never instantly flat');
 assert.equal(bentRimTyre(.9,.5),.9,'never repairs a worse tyre');
 assert.equal(bentRimTyre(.1,NaN),.1);
});
test('side hits that bend a wheel give it a slow puncture offline, which deflates as the car rolls; online-style tyres hold',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}} as never;
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,fx,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.root.updateMatrixWorld(true);
   const at=new T.Vector3(.95,.4,1.4).applyMatrix4(c.root.matrixWorld);
   for(let i=0;i<8;i++){c.health=100;c.hit(at,new T.Vector3(-1,0,0).applyQuaternion(c.root.quaternion),5,0,true);}
   const bent=c.wreckParts.wheelDamage[1];c.input.throttle=.5;
   for(let k=0;k<60;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   const early=c.tyreDamage?.[1]??0;
   for(let k=0;k<60*20;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   return{bent,early,late:c.tyreDamage?.[1]??0,lost:c.wreckParts.wheelLost[1],warning:tyreWarning(c.tyreDamage,extended)};
  }finally{c.dispose();world.free();}
 };
 const on=await run(true),off=await run(false);console.log(JSON.stringify({on,off}));
 assert.ok(on.bent>=BENT_RIM.onset&&!on.lost,'the wheel is bent, not torn off');
 assert.ok(on.early>=LEAK.onset&&on.late>on.early,'the tyre starts leaking and keeps losing air');
 assert.ok(/SLOW PUNCTURE|TYRE/.test(on.warning),'the HUD says so');
 assert.ok(off.late<LEAK.onset,'online-style tyres are unaffected by the bend');
});
