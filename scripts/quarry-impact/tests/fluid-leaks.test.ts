import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {FluidSlicks,leakRates,dripInterval,slickGrip,SLICK,LEAK} from '../src/fluid-leaks';
import {RADIATOR} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a crushed radiator leaks coolant and a wrecked engine leaks oil, faster the worse they are',()=>{
 assert.deepEqual(leakRates(RADIATOR.onset,LEAK.oilOnset),{coolant:0,oil:0});
 const bad=leakRates(.9,.95);assert.ok(bad.coolant>.8&&bad.oil>.8);
 assert.equal(dripInterval(0),Infinity);assert.ok(dripInterval(1)<dripInterval(.3)&&dripInterval(1)>=LEAK.fastest-1e-9);
 assert.ok(Number.isFinite(dripInterval(NaN))===false,'invalid severity never drips');
});
test('oil costs much more grip than coolant, only under the spot, and less as it fades',()=>{
 assert.equal(slickGrip(0,.5,.4,1),1,'outside the spot');
 const oil=slickGrip(0,0,.4,1),coolant=slickGrip(1,0,.4,1);
 assert.ok(Math.abs(oil-SLICK.oil.grip)<1e-9&&Math.abs(coolant-SLICK.coolant.grip)<1e-9&&oil<coolant);
 assert.ok(slickGrip(0,0,.4,.5)>oil,'a faded spot is less slippery');
});
test('drips pool into one growing spot when the car sits still, and spread into a trail when it moves; spots fade and reset',()=>{
 const scene=new T.Scene(),s=new FluidSlicks(scene);
 try{
  for(let i=0;i<12;i++)s.drip(0,0,0,0,i*.37);
  assert.equal(s.stats.count,1,'one pool');const r=s.spots[2];assert.ok(r>SLICK.oil.radius*1.5&&r<=LEAK.maxRadius);
  for(let i=0;i<10;i++)s.drip(3+i*1.5,0,0,0,i*.11);
  assert.equal(s.stats.count,11,'a trail of separate drops');
  assert.ok(s.gripAt(0,0)<.6&&s.gripAt(-5,-5)===1);
  s.drip(0,0,8,1,.5);for(let k=0;k<60;k++)s.advance(1);
  assert.equal(s.stats.coolant,0,'coolant evaporates within a minute');assert.ok(s.stats.oil===11&&s.gripAt(0,0)>.5,'oil lingers but fades');
  for(let k=0;k<400;k++)s.drip(k*3,0,50,0,k*.01);
  assert.equal(s.stats.count,s.capacity,'bounded');
  s.reset();assert.ok(s.stats.count===0&&s.gripAt(0,0)===1);
 }finally{s.mesh.geometry.dispose();(s.mesh.material as T.Material).dispose();}
});
test('a car with a crushed front drips coolant offline only, and tyres on a slick lose grip and turn oily',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0}),slicks=new FluidSlicks(scene);
  world.createCollider(R.ColliderDesc.cuboid(80,.5,80).setTranslation(0,-.5,0));
  const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},slicks} as never;
  const car=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,fx,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   car.extendedDamage=extended;car.place(0,0,0);car.render(1);car.root.updateMatrixWorld(true);
   const at=new T.Vector3(0,.7,2.4).applyMatrix4(car.root.matrixWorld);
   for(let i=0;i<10;i++){car.health=100;car.hit(at,new T.Vector3(0,0,-1).applyQuaternion(car.root.quaternion),14,0,true);}
   const front=car.structuralDamage?.[0]??0;
   car.body.setLinvel({x:0,y:0,z:0},true);car.body.setAngvel({x:0,y:0,z:0},true);car.input.brake=1;car.input.throttle=0;
   for(let k=0;k<600;k++){car.preStep(1/60);world.step();car.postStep(1/60,k/60);}
   const drips=car.drips.slice(),stats=slicks.stats;
   // Pour oil under every tyre and read the grip back.
   for(let i=0;i<4;i++){const p=car.controller.wheelContactPoint(i);if(p)for(let k=0;k<6;k++)slicks.drip(p.x,0,p.z,0,.3);}
   car.preStep(1/60);world.step();car.postStep(1/60,10);
   return{front,drips,stats,grip:car.slickGrip.slice(),oily:car.oily.slice()};
  }finally{car.dispose();world.free();slicks.mesh.geometry.dispose();}
 };
 const on=await run(true),off=await run(false);console.log(JSON.stringify({on,off}));
 assert.ok(on.front>RADIATOR.onset,'the front is crushed past the radiator');
 assert.ok(on.drips[1]>=3&&on.stats.coolant>=1,'coolant drips out');
 assert.ok(on.stats.coolant<=on.drips[1]/3,'a parked car pools its drips');
 assert.ok(on.grip.every(g=>g<.75)&&on.oily.every(o=>o>.5),'oil under the tyres');
 assert.ok(off.drips[0]===0&&off.drips[1]===0&&off.stats.count===0,'online-style cars never leak');
 assert.ok(off.grip.every(g=>g===1),'and never read slicks');
});
test('the HUD names each leak and warns about oil under or on the tyres; the diagram drips under radiator and engine',async()=>{
 const {fluidWarning}=await import('../src/fluid-leaks');const {damageDiagramSvg}=await import('../src/damage-diagram');
 assert.equal(fluidWarning({oil:0,coolant:0},[1,1,1,1],[0,0,0,0]),'');
 assert.equal(fluidWarning({oil:.4,coolant:.2},[1,1,1,1],[0,0,0,0]),'OIL LEAK · COOLANT LEAK');
 assert.equal(fluidWarning({oil:0,coolant:0},[1,.6,1,1],[0,1,0,0]),'ON OIL');
 assert.equal(fluidWarning({oil:0,coolant:0},[1,1,1,1],[0,.5,0,0]),'OILY TYRES');
 const base={zones:{front:0,rear:0,left:0,right:0,roof:0},wheelDamage:[0,0,0,0],wheelLost:[0,0,0,0],tyreFailure:[0,0,0,0],engine:0,misfiring:false,rearEngine:false,wrecked:false};
 assert.ok(!damageDiagramSvg(base).includes('dd-leak'));
 const svg=damageDiagramSvg({...base,leaks:{oil:.5,coolant:.5}});
 assert.ok(svg.includes('dd-leak-oil')&&svg.includes('dd-leak-coolant')&&!/NaN|undefined/.test(svg));
 assert.ok(damageDiagramSvg({...base,leaks:{oil:0,coolant:.3}}).includes('dd-leak-coolant')&&!damageDiagramSvg({...base,leaks:{oil:0,coolant:.3}}).includes('dd-leak-oil'));
});
test('replays carry the drips and rebuild the same slicks forwards and after seeking back',async()=>{
 const {ReplayRecorder,encodeReplay,decodeReplay}=await import('../src/replay-data');const {ReplaySlicks}=await import('../src/replay-slicks');
 const {stockSetup}=await import('../src/garage');
 const rec=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'sedan',setup:stockSetup('sedan')}],props:0,created:'t'});
 const stride=rec.stride;rec.capture(0,()=>{const v=new Float32Array(stride);v[6]=1;for(let j=0;j<4;j++)v[18+j*8+3]=1;return v;},true);rec.capture(30,()=>{const v=new Float32Array(stride);v[6]=1;for(let j=0;j<4;j++)v[18+j*8+3]=1;return v;},true);
 for(let i=0;i<40;i++)rec.drip({time:i*.5,position:[i%2?0:6,0,0],kind:(i%3===0?1:0) as 0|1,seed:(i*.37)%1});
 rec.drip({time:1,position:[NaN,0,0],kind:0,seed:.5});rec.drip({time:2,position:[0,0,0],kind:2 as never,seed:.5});
 const doc=rec.document();assert.equal(doc.drips?.length,40,'invalid drips are dropped');
 const back=decodeReplay(encodeReplay(doc));assert.deepEqual(back.drips,doc.drips);
 const noDrips=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'sedan',setup:stockSetup('sedan')}],props:0,created:'t'}).document();
 assert.ok(!('drips' in noDrips),'recordings without leaks are unchanged');
 const scene=new (await import('three')).Scene(),play=new ReplaySlicks(back.drips!,scene);
 try{
  for(let t=0;t<=25;t+=1/30)play.update(t);
  const forward=Array.from(play.slicks.spots);
  play.update(3);play.update(25);
  const reseek=Array.from(play.slicks.spots);
  assert.ok(play.slicks.stats.count>0&&play.slicks.stats.count<40,'drips at the same spot pool');
  const worst=forward.reduce((m,v,i)=>Math.max(m,Math.abs(v-reseek[i])),0);assert.ok(worst<.03,'seeking back and forth rebuilds the same slicks (worst '+worst+')');
 }finally{play.dispose();}
});
