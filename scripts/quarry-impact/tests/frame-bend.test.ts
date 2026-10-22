import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {FRAME_BEND,frameBend,frameWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a big side hit bends the frame toward the dented flank; a light one does not',()=>{
 assert.equal(frameBend([0,0,FRAME_BEND.onset,0,0]),0);assert.equal(frameBend(undefined),0);
 assert.ok(frameBend([0,0,0,.7,0])>0&&frameBend([0,0,.7,0,0])<0&&Math.abs(frameBend([0,0,.7,0,0]))===frameBend([0,0,0,.7,0]));
 assert.equal(frameBend([0,0,1,1,0]),FRAME_BEND.max*((1-FRAME_BEND.onset)*FRAME_BEND.gain>FRAME_BEND.max?1:(1-FRAME_BEND.onset)*FRAME_BEND.gain/FRAME_BEND.max));
 assert.equal(frameWarning(0),'');assert.equal(frameWarning(.02),'FRAME BENT');
});
test('a bent frame keeps turning the car toward the dent with the wheel straight; the other flank turns it the other way; online-style unchanged',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,left:number,right:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'coupe',stockSetup('coupe').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('coupe'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   if(c.structuralDamage){c.structuralDamage[2]=left;c.structuralDamage[3]=right;}c.input.throttle=.6;const yaw0=Math.atan2(c.forward.x,c.forward.z);let turned=0,last=yaw0;
   for(let k=0;k<60*4;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);const y=Math.atan2(c.forward.x,c.forward.z);let d=y-last;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;turned+=d;last=y;}
   return{turned,bend:c.frameBend};
  }finally{c.dispose();world.free();}
 };
 const straight=await run(true,0,0),right=await run(true,0,.8),left=await run(true,.8,0),off=await run(false,0,.8);console.log(JSON.stringify({straight,right,left,off}));
 assert.ok(Math.abs(straight.turned)<.02,'a straight frame runs straight');
 assert.ok(Math.abs(right.turned)>.15&&Math.sign(right.turned)===-Math.sign(left.turned),'it keeps turning, toward the dented side ('+right.turned+' / '+left.turned+')');
 assert.ok(off.bend===0&&Math.abs(off.turned)<.02,'online-style frames stay straight');
});
