import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {WHEEL_NUTS,loosenNuts,nutShimmy,nutWarning} from '../src/damage-handling';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a knocked wheel works its nuts loose with distance, faster the harder it was hit; a sound wheel never does',()=>{
 assert.equal(loosenNuts(0,WHEEL_NUTS.onset,1000),0);assert.equal(loosenNuts(.2,.1,1000),.2);assert.equal(loosenNuts(.3,.5,0),.3);
 assert.ok(loosenNuts(0,.6,100)>loosenNuts(0,.4,100)&&loosenNuts(0,.4,100)>0);assert.equal(loosenNuts(.9,1,1e6),1);
 assert.ok(Number.isFinite(loosenNuts(NaN,NaN,NaN)));
 assert.equal(nutShimmy(0,1),0);assert.ok(Math.abs(nutShimmy(1,Math.PI/2)-WHEEL_NUTS.shimmy)<1e-12&&nutShimmy(1,-Math.PI/2)<0);
 assert.equal(nutWarning([0,.2,0,0]),'');assert.equal(nutWarning([0,.5,0,0]),'WHEEL LOOSE');
});
test('driving on a loose wheel shimmies, then the wheel comes off on the move and the replay hears about it; online-style wheels stay on',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  const events:string[]=[];c.onVisualEvent=e=>{if(e.kind==='rip')events.push(e.part!);};
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   c.input.throttle=.6;let shimmy=0,lostAt=-1;
   for(let k=0;k<60*30;k++){c.wreckParts.wheelDamage[1]=.7;c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);shimmy=Math.max(shimmy,Math.abs(c.wheelShimmy[1]));if(lostAt<0&&c.wreckParts.wheelLost[1])lostAt=k/60;}
   return{loose:Array.from(c.nutLoose),shimmy,lostAt,lost:Array.from(c.wreckParts.wheelLost),events,shed:c.wheelsShed};
  }finally{c.dispose();world.free();}
 };
 const on=await run(true),off=await run(false);console.log(JSON.stringify({on,off}));
 assert.ok(on.shimmy>.02,'it shimmies as it loosens');
 assert.ok(on.lostAt>3&&on.lost[1]===1&&on.lost[0]===0&&on.shed===1,'and comes off after a while, front right only ('+on.lostAt+' s)');
 assert.deepEqual(on.events,['wheel-1'],'recorded for replays');
 assert.ok(off.lostAt<0&&off.shimmy===0&&off.loose.every(v=>v===0)&&off.events.length===0,'online-style wheels never work loose');
});
test('replays shed the wheel quietly from the recorded rip, and old part names still rip assemblies',async()=>{
 const src=(await import('node:fs')).readFileSync(new URL('../src/replay-scene.ts',import.meta.url),'utf8');
 assert.ok(/wheel-\(\[0-3\]\)/.test(src)&&src.includes('c.shedWheel(+wheel[1],true)')&&src.includes('c.ripAssembly(e.part!,true)'));
});
