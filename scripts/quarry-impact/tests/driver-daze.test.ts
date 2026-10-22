import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DAZE,dazeFor,dazedSteer,dazeWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('only a huge hit dazes the driver, longer the harder, capped; dazed steering follows the wheel lazily',()=>{
 assert.equal(dazeFor(DAZE.min-1),0);assert.ok(dazeFor(DAZE.min)===DAZE.base&&dazeFor(60)>dazeFor(30)&&dazeFor(500)===DAZE.max&&dazeFor(NaN)===0);
 let s=0;const seen:number[]=[];for(let i=0;i<30;i++){s=dazedSteer(s,1,1/60);seen.push(s);}assert.ok(seen[5]<.3&&seen[29]>.6&&seen[29]<1);
 assert.equal(dazedSteer(.2,1,0),.2);assert.equal(dazeWarning(0),'');assert.equal(dazeWarning(1),'DAZED');
});
test('after a huge hit the car answers the wheel late, then recovers; a held input object is never rewritten; online-style drivers are never dazed',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,hit:number,front=0)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'coupe',stockSetup('coupe').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('coupe'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   const pedal={throttle:.5,steer:0,brake:0,handbrake:false};c.input=pedal;
   for(let k=0;k<60;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);}
   if(hit>0){c.root.updateMatrixWorld(true);c.hit(new T.Vector3(0,.6,2.2).applyMatrix4(c.root.matrixWorld),new T.Vector3(0,0,-1).applyQuaternion(c.root.quaternion),hit,1.5);c.health=100;}
   if(c.structuralDamage&&front)c.structuralDamage[0]=front;
   const dazedAt=c.dazed;pedal.steer=1;let early=0,late=0;
   for(let k=0;k<60*3;k++){c.preStep(1/60);world.step();c.postStep(1/60,1.6+k/60);if(k===8)early=Math.abs(c.input.steer);if(k===60*3-1)late=Math.abs(c.input.steer);}
   return{dazedAt,early,late,left:c.dazed,pedal:pedal.steer,throttle:pedal.throttle};
  }finally{c.dispose();world.free();}
 };
 const calm=await run(true,0),dazed=await run(true,60),both=await run(true,60,.6),off=await run(false,60);console.log(JSON.stringify({calm,dazed,both,off}));
 assert.ok(calm.dazedAt===0&&calm.early===1);
 assert.ok(dazed.dazedAt>1&&dazed.early<.5&&dazed.late===1&&dazed.left===0,'answers late, then recovers');
 assert.ok(both.pedal===1&&both.throttle===.5&&both.late===1,'with broken mounts too, the driver input is untouched and the wheel comes back');
 assert.ok(off.dazedAt===0&&off.early===1,'online-style drivers are never dazed');
});
