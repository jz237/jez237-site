import test from 'node:test';
import assert from 'node:assert/strict';
import {avoidFires} from '../src/fire-avoidance';
const car=(id=0,speed=15)=>({id,current:{x:0,z:0},forward:{x:0,z:1},right:{x:1,z:0},speed});
const input={throttle:.8,steer:0,brake:0,handbrake:false};
const fire=(x:number,z:number,radius=.5)=>({x,y:0,z,radius,start:0,end:20,kind:2,seed:.3});
test('AI drivers steer round fires ahead, to the far side, and ignore fires behind or well clear',()=>{
 assert.ok(avoidFires(car(),input,[fire(1,10)],5).steer<-.1,'fire ahead-right: steer left');
 assert.ok(avoidFires(car(),input,[fire(-1,10)],5).steer>.1,'fire ahead-left: steer right');
 assert.equal(avoidFires(car(),input,[fire(0,-8)],5),input,'behind');
 assert.equal(avoidFires(car(),input,[fire(6,10)],5),input,'well clear to the side');
 assert.equal(avoidFires(car(),input,[fire(1,10)],25),input,'burnt out');
 assert.notEqual(Math.sign(avoidFires(car(0),input,[fire(0,10)],5).steer),Math.sign(avoidFires(car(1),input,[fire(0,10)],5).steer),'dead centre: drivers split');
});
test('a fire dead ahead and close slows the car; standing in flames floors it straight out',()=>{
 const close=avoidFires(car(),input,[fire(.2,3,.8)],5);assert.ok(close.throttle<input.throttle&&close.brake>0);
 const out=avoidFires(car(),{throttle:.2,steer:.8,brake:1,handbrake:false},[fire(0,0,1)],5,.7);
 assert.deepEqual(out,{throttle:1,steer:.32000000000000006,brake:0,handbrake:false});
});
test('a burning car sets cars pressed against it alight, side by side or nose to tail, not a car length away',async()=>{
 const {contactHeat,CAR_FIRE}=await import('../src/fire-avoidance');
 const body=(x:number,z:number)=>({current:{x,z},forward:{x:0,z:1},right:{x:1,z:0},halfWidth:1,halfLength:2.3});
 assert.ok(contactHeat(body(0,0),body(2.1,0),.9)>.3,'door to door');
 assert.ok(contactHeat(body(0,0),body(0,4.7),.9)>0,'nose to tail');
 assert.equal(contactHeat(body(0,0),body(3.4,0),.9),0,'a gap at the side');
 assert.equal(contactHeat(body(0,0),body(0,6),.9),0,'a car length behind');
 assert.equal(contactHeat(body(0,0),body(2.1,0),CAR_FIRE.min-.01),0,'a smouldering car does not spread');
});
test('heat from a burning car alongside hurts, sets the car alight and credits the burning car',async()=>{
 const T=await import('three');const R=(await import('@dimforge/rapier3d-compat')).default;await R.init();
 const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');const {loadCarWithoutImages}=await import('../tools/car-asset-audit');const {loadCars}=await import('../src/assets');
 const {Vehicle}=await import('../src/vehicle');const {stockSetup}=await import('../src/garage');
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const scene=new T.Scene(),w=new R.World({x:0,y:-9.81,z:0});w.createCollider(R.ColliderDesc.cuboid(80,.5,80).setTranslation(0,-.5,0));
 const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,w,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
 try{
  c.extendedDamage=true;c.place(0,0,0);c.render(1);c.input.brake=1;let by=-2;c.onSetAlight=b=>{by=b;};
  for(let k=0;k<60*3;k++){c.contactHeat=.7;c.contactBy=5;c.preStep(1/60);w.step();c.postStep(1/60,k/60);}
  assert.ok(c.igniteRequest&&by===5&&c.health<95,`set alight by car 5 (health ${c.health.toFixed(1)})`);
 }finally{c.dispose();w.free();}
});
