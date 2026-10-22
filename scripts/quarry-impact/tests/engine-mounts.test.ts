import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MOUNTS,mountsBroken,shuntThrottle,mountsWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('broken mounts lag the throttle behind the pedal; sound mounts pass it straight through',()=>{
 assert.ok(!mountsBroken(MOUNTS.onset-.01)&&mountsBroken(MOUNTS.onset)&&!mountsBroken(NaN));
 let e=0;const seen:number[]=[];for(let i=0;i<60;i++){e=shuntThrottle(e,1,1/60);seen.push(e);}
 assert.ok(seen[0]<.15&&seen[29]>.85&&seen.every((v,i)=>!i||v>=seen[i-1]),'takes up over a fraction of a second');
 assert.equal(shuntThrottle(.4,1,0),.4);assert.equal(shuntThrottle(NaN,.7,1/60),.7);
 assert.equal(mountsWarning(false),'');assert.equal(mountsWarning(true),'ENGINE MOUNTS BROKEN');
});
test('stabbing the throttle on broken mounts jolts the body over and clunks, and the pull-away lags; online-style cars are untouched',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,front:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'coupe',stockSetup('coupe').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('coupe'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  let clunks=0;c.onMountClunk=()=>{clunks++;};
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   if(c.structuralDamage)c.structuralDamage[0]=front;
   const pedal={throttle:1,steer:0,brake:0,handbrake:false};let roll=0,after=0;
   for(let k=0;k<20;k++){c.input=pedal;c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);roll=Math.max(roll,Math.abs(c.body.angvel().x*c.forward.x+c.body.angvel().y*c.forward.y+c.body.angvel().z*c.forward.z));if(k===5)after=c.speed;}
   return{roll,after,clunks,pedalKept:pedal.throttle,broken:c.mountsBroken};
  }finally{c.dispose();world.free();}
 };
 const sound=await run(true,0),broken=await run(true,.6),off=await run(false,.6);console.log(JSON.stringify({sound,broken,off}));
 assert.ok(broken.broken&&!sound.broken&&!off.broken);
 assert.ok(broken.clunks===1&&sound.clunks===0,'one clunk on the stab');
 assert.ok(broken.roll>sound.roll*1.5&&broken.roll>.1,'the body rocks over ('+broken.roll+' vs '+sound.roll+')');
 assert.ok(broken.after<sound.after,'the pull-away lags');
 assert.equal(broken.pedalKept,1,'the driver input object is never rewritten');
 assert.ok(off.clunks===0,'online-style cars ignore it');
});
test('an input set once (several physics steps per frame) still takes up fully on broken mounts',async()=>{
 const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
 const c=new Vehicle(0,'coupe',stockSetup('coupe').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('coupe'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
 try{
  c.extendedDamage=true;c.place(0,0,0);c.render(1);for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
  if(c.structuralDamage)c.structuralDamage[0]=.6;c.input={throttle:1,steer:0,brake:0,handbrake:false};
  for(let k=0;k<60;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);}
  assert.ok(c.mountsBroken&&c.input.throttle>.99,'the lag catches up with a held pedal ('+c.input.throttle+')');
 }finally{c.dispose();world.free();}
});
