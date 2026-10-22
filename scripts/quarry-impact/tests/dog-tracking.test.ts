import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {thrustAngle,SUBFRAME} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a crushed rear bends the subframe into a thrust angle, away from the worse flank',()=>{
 assert.equal(thrustAngle([0,SUBFRAME.onset,0,0,0]),0);
 assert.ok(thrustAngle([0,.3,0,.2,0])>0&&thrustAngle([0,.3,.2,0,0])<0);
 assert.ok(Math.abs(thrustAngle([0,1,0,1,0]))<=SUBFRAME.max);assert.equal(thrustAngle(undefined),0);
});
test('a car with a bent rear subframe crabs off a straight line with the wheel held straight; online-style cars run true',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,rear:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.structuralDamage=[0,rear,0,.2,0];
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   const start=c.body.translation(),q=c.body.rotation(),f=new T.Vector3(0,0,1).applyQuaternion(new T.Quaternion(q.x,q.y,q.z,q.w));
   c.input.throttle=.6;for(let k=0;k<60*5;k++){c.preStep(1/60);world.step();c.postStep(1/60,1+k/60);}
   const end=c.body.translation(),dx=end.x-start.x,dz=end.z-start.z,ahead=dx*f.x+dz*f.z,side=dx*f.z-dz*f.x;
   return{ahead,side,angle:c.thrustAngle};
  }finally{c.dispose();world.free();}
 };
 const bent=await run(true,.3),straight=await run(true,0),online=await run(false,.3);console.log(JSON.stringify({bent,straight,online}));
 assert.ok(bent.angle!==0&&Math.abs(bent.side)>Math.abs(straight.side)+1,'drifts metres off line');
 assert.ok(online.angle===0&&Math.abs(online.side-straight.side)<.5);
});
