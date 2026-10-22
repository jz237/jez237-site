import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {STEER_PLAY,steerPlay,slackSteer,steerWander,playWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a battered front wheel gives the steering a dead band and a wander; sound wheels have none',()=>{
 assert.equal(steerPlay([0,0,0,0]),0);assert.equal(steerPlay([STEER_PLAY.onset,0,.9,.9]),0,'rear wheels do not count');
 assert.ok(steerPlay([0,.3,0,0])>.15&&steerPlay([1,1,0,0])===STEER_PLAY.max&&steerPlay(undefined)===0);
 assert.equal(slackSteer(.5,0),.5);assert.equal(slackSteer(.15,.2),0);assert.equal(slackSteer(-1,.2),-1);
 assert.ok(Math.abs(slackSteer(.6,.2)-.5)<1e-9&&slackSteer(NaN,.2)===0);
 assert.equal(steerWander(0,30,5,1),0);assert.equal(steerWander(.3,0,5,1),0,'no wander standing still');
 const w=Array.from({length:300},(_,i)=>steerWander(STEER_PLAY.max,30,i*.1,3));
 assert.ok(Math.max(...w)>.02&&Math.min(...w)<-.02&&w.every(v=>Math.abs(v)<=STEER_PLAY.wander+1e-9),'swings both ways, bounded');
 assert.equal(playWarning(.05),'');assert.equal(playWarning(.2),'STEERING LOOSE');
});
test('with slack in the steering a light input barely turns the car and it weaves at speed; online-style cars are untouched',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,steer:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(3,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   c.wreckParts.wheelDamage[0]=.4;c.input.throttle=1;
   for(let k=0;k<60*3;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);}
   c.input.throttle=.5;c.input.steer=steer;const yaw0=Math.atan2(c.forward.x,c.forward.z);let maxSteer=0,minSteer=0;
   for(let k=0;k<60*3;k++){c.preStep(1/60);world.step();c.postStep(1/60,3.5+k/60);maxSteer=Math.max(maxSteer,c.steering);minSteer=Math.min(minSteer,c.steering);}
   return{play:c.steerPlay,turn:Math.abs(Math.atan2(c.forward.x,c.forward.z)-yaw0),speed:c.speed,swing:maxSteer-minSteer};
  }finally{c.dispose();world.free();}
 };
 const on=await run(true,.2),off=await run(false,.2),onStraight=await run(true,0),offStraight=await run(false,0);console.log(JSON.stringify({on,off,onStraight,offStraight}));
 assert.ok(on.play>.25&&off.play===0);
 assert.ok(on.turn<off.turn*.5,'a light input is lost in the slack ('+on.turn+' vs '+off.turn+')');
 assert.ok(onStraight.swing>.02&&offStraight.swing<1e-6,'hands off, the slack wanders the front wheels');
});
