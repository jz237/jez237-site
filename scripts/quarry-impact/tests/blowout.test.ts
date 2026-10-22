import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {blowoutImpulse,BLOWOUT} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a blowout tugs harder the heavier and faster the car, and not at all when crawling',()=>{
 assert.deepEqual(blowoutImpulse(1400,BLOWOUT.minSpeed-.1),{drag:0,side:0});
 const a=blowoutImpulse(1400,15),b=blowoutImpulse(1400,25),c=blowoutImpulse(2000,25);
 assert.ok(b.drag>a.drag&&c.drag>b.drag&&b.side>0&&b.side<b.drag);
 assert.deepEqual(blowoutImpulse(1400,80),blowoutImpulse(1400,30),'capped');
 assert.deepEqual(blowoutImpulse(NaN,NaN),{drag:0,side:0});
});
test('a front-left blowout at speed snatches the car toward that corner once, offline only',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,burst:boolean,slow=false)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}} as never;
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,fx,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   const f=new T.Vector3(0,0,1).applyQuaternion(c.body.rotation() as T.Quaternion);c.body.setLinvel({x:f.x*25,y:0,z:f.z*25},true);
   c.input.throttle=.4;const heading=()=>{const q=c.body.rotation();const v=new T.Vector3(0,0,1).applyQuaternion(new T.Quaternion(q.x,q.y,q.z,q.w));return Math.atan2(v.x,v.z);};
   const h0=heading();if(burst&&!slow&&c.tyreDamage)c.tyreDamage[0]=1;
   let yawRate=0;for(let k=0;k<20;k++){if(slow&&c.tyreDamage)c.tyreDamage[0]=Math.min(1,.72+k*.015);c.preStep(1/60);world.step();c.postStep(1/60,k/60);yawRate=Math.max(yawRate,Math.abs(c.body.angvel().y));}
   return{turn:heading()-h0,yawRate,blown:c.blownOut.slice(),tyre:c.tyreDamage?.slice()};
  }finally{c.dispose();world.free();}
 };
 const kick=await run(true,true),online=await run(false,true),none=await run(true,false),leak=await run(true,true,true);console.log(JSON.stringify({kick,online,none,leak}));
 assert.ok(!leak.blown[0]&&leak.yawRate<kick.yawRate/2,'a slow puncture going flat does not snatch');
 assert.ok(kick.blown[0]&&!kick.blown.slice(1).some(Boolean),'only the burst corner');
 assert.ok(!online.blown.some(Boolean),'no snatch without extended damage');
 assert.ok(kick.yawRate>online.yawRate*1.5&&kick.yawRate>.15,'a sharp yaw at the moment of the burst');
 assert.ok(none.yawRate<.05,'straight without a burst');
});
test('a burst tyre throws rubber chunks and flails off strips for a few seconds at speed',async()=>{
 const {SHRED_SECONDS}=await import('../src/vehicle');
 const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));let rubber=0;
 const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(_p:T.Vector3,_n:number,type:number){if(type===4)rubber++;},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
 try{
  c.extendedDamage=true;c.place(0,0,0);c.render(1);for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
  const f=new T.Vector3(0,0,1).applyQuaternion(c.body.rotation() as T.Quaternion);c.body.setLinvel({x:f.x*22,y:0,z:f.z*22},true);c.input.throttle=.7;if(c.tyreDamage)c.tyreDamage[0]=1;
  for(let k=0;k<60*(SHRED_SECONDS+3);k++){c.preStep(1/60);world.step();c.postStep(1/60,1+k/60);}
  assert.ok(rubber>10&&c.shredBits>3&&c.tyreShred[0]===0,`rubber thrown (${rubber}), strips (${c.shredBits}), then done`);
 }finally{c.dispose();world.free();}
});
