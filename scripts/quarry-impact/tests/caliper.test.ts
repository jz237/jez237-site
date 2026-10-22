import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {CALIPER,caliperDrag,discHeat,discGlow,discFade,caliperWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a bent caliper binds, heats its disc with speed, glows when hot, fades its brake and cools when stopped',()=>{
 assert.equal(caliperDrag(CALIPER.bend-.01),0);assert.ok(Math.abs(caliperDrag(CALIPER.bend)-CALIPER.min)<1e-12&&caliperDrag(1)===1&&caliperDrag(NaN)===0);
 let h=0;for(let i=0;i<600;i++)h=discHeat(h,.6,20,1/60);assert.ok(h>.8,'hot after 10 s at speed ('+h+')');
 let c=h;for(let i=0;i<1800;i++)c=discHeat(c,.6,0,1/60);assert.ok(c<h*.25,'cools when stopped');
 assert.equal(discHeat(.3,0,0,0),.3);
 assert.equal(discGlow(CALIPER.glow),0);assert.ok(discGlow(.8)>0&&discGlow(1)===1);
 assert.equal(discFade(.6),1);assert.ok(discFade(1)===1-CALIPER.fade&&discFade(.8)<1);
 assert.equal(caliperWarning([0,0,0,0]),'');assert.equal(caliperWarning([0,.4,0,0]),'BRAKE BINDING');
});
test('a binding brake drags the car, heats and glows its disc; online-style brakes stay free',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,damage:number,model:'angular-v1'|undefined)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'wagon',stockSetup('wagon').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('wagon'),{height:()=>0,surface:()=>'asphalt'} as never,model as never);
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   c.input.throttle=.8;
   for(let k=0;k<60*12;k++){c.wreckParts.wheelDamage[3]=damage;c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);}
   c.render(1);let glowing=false;c.root.traverse(o=>{if(o instanceof T.Sprite&&o.visible)glowing=true;});
   return{speed:c.speed,heat:Array.from(c.discHeat),drag:Array.from(c.brakeDrag),glowing};
  }finally{c.dispose();world.free();}
 };
 for(const model of ['angular-v1',undefined] as const){
  const free=await run(true,.1,model),bound=await run(true,.4,model),off=await run(false,.4,model);console.log(model,JSON.stringify({free,bound,off}));
  assert.ok(free.drag.every(v=>v===0)&&!free.glowing);
  assert.ok(bound.drag[3]>.5&&bound.speed<off.speed-.3,'it drags (same knock, '+bound.speed+' vs '+off.speed+' without the caliper)');
  assert.ok(bound.heat[3]>CALIPER.glow&&bound.glowing,'the disc heats and glows');
  assert.ok(off.drag.every(v=>v===0)&&!off.glowing&&off.heat.every(v=>v===0),'online-style brakes stay free');
 }
});
