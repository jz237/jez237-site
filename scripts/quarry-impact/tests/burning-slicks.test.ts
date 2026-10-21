import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {FluidSlicks,BURN,FLAME,FUEL,burnDuration,burnLevel,leakRates,fluidWarning} from '../src/fluid-leaks';
import {VehicleThermalState} from '../src/vehicle-thermal-state';
import {VehicleFire} from '../src/vehicle-fire';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
const world=()=>{const scene=new T.Scene();return{scene,s:new FluidSlicks(scene)};};
test('a crushed tank end leaks fuel; the HUD names fuel leaks and flames',()=>{
 assert.equal(leakRates(0,0,FUEL.onset).fuel,0);assert.ok(leakRates(0,0,.5).fuel>.5);
 assert.equal(fluidWarning({oil:0,coolant:0,fuel:.3},[1,1,1,1],[0,0,0,0],.5),'IN FLAMES · FUEL LEAK');
 assert.ok(burnDuration(2,.2)<burnDuration(0,.2),'fuel flares and is gone sooner than oil');
 assert.equal(burnLevel({start:1,end:5},.9),0);assert.ok(burnLevel({start:1,end:5},3)===1&&burnLevel({start:1,end:5},4.9)<.1);
});
test('sparks light fuel but not oil or coolant; flames light oil; a fuel trail burns like a fuse and leaves scorch marks',()=>{
 const {s}=world();const lit:number[]=[];s.onIgnite=(_x,_y,_z,k)=>lit.push(k);
 try{
  for(let i=0;i<8;i++)s.drip(i*.32,0,0,2,i*.13);   // a touching fuel trail
  s.drip(0,0,3,0,.5);s.drip(0,0,-3,1,.5);           // oil and coolant puddles away from it
  assert.equal(s.igniteAt(0,3,.25,true),0,'a spark does not light oil');
  assert.equal(s.igniteAt(0,-3,.25,false),0,'coolant never burns');
  assert.equal(s.igniteAt(0,0,.02,true),1,'a spark lights fuel');
  let burning=s.stats.burning;
  for(let k=0;k<12;k++){s.advance(.25);burning=Math.max(burning,s.stats.burning);}
  assert.ok(burning>=6&&lit.filter(k=>k===2).length===8,'the fire ran down the whole trail');
  assert.ok(s.heatAt(.32*4,0)>0&&s.fires().length>0,'there is heat on the trail');
  assert.equal(s.igniteAt(0,3,.25,false),1,'flames light oil');
  for(let k=0;k<200;k++)s.advance(.25);
  const st=s.stats;assert.ok(st.burning===0&&st.burnt===9&&s.gripAt(0,0)===1&&s.heatAt(0,0)===0,'burnt out: scorched, dry, cold');
  s.drip(0,0,0,2,.9);assert.equal(s.stats.count,11,'new fuel does not pool into a scorch mark');
 }finally{s.dispose();}
});
test('replays apply the recorded ignitions with spread off and get the same burn',async()=>{
 const {ReplaySlicks}=await import('../src/replay-slicks');
 const {s}=world();const events:{time:number;position:number[];kind:0|1|2|3;seed:number}[]=[];
 s.onIgnite=(x,y,z)=>events.push({time:s.clock,position:[x,y,z],kind:3,seed:0});
 const scene=new T.Scene();
 try{
  for(let i=0;i<6;i++){s.drip(i*.3,0,0,2,i*.21);events.push({time:s.clock,position:[i*.3,0,0],kind:2,seed:i*.21});s.advance(.1);}
  s.igniteAt(0,0,.2,true);for(let k=0;k<40;k++)s.advance(.1);
  const play=new ReplaySlicks(events,scene);
  try{
   play.update(s.clock);
   const a=s.fires().map(f=>[f.x,+f.start.toFixed(3)]),b=play.slicks.fires().map(f=>[f.x,+f.start.toFixed(3)]);
   assert.deepEqual(b,a,'same fires, same start times');
   assert.ok(play.slicks.spread===false);
  }finally{play.dispose();}
 }finally{s.dispose();}
});
test('an outside ignition sets a car burning like an engine fire',()=>{
 const st=new VehicleThermalState(80,.3);st.ignite();for(let i=0;i<120;i++)st.advance(80,1/30);
 assert.ok(st.burning&&st.heat>.4);
});
test('ground fires draw volumetric flames and smoke and borrow the free fire lights',()=>{
 const scene=new T.Scene(),fire=new VehicleFire(scene,()=>{},()=>.5),camera=new T.PerspectiveCamera(60,1.6,.1,500);camera.position.set(0,3,8);camera.lookAt(0,0,0);
 try{
  fire.setGround([{x:0,y:0,z:0,radius:.6,start:0,end:10,kind:2,seed:.4}],3);fire.renderRecorded(3,camera);
  const st=fire.stats;assert.ok(st.visible>12&&fire.ground.some(p=>p.life>0&&p.kind===1)&&fire.ground.some(p=>p.life>0&&p.kind===0));
  assert.ok(fire.lights.some(l=>l.intensity>0));
  fire.setGround([],3);fire.renderRecorded(3,camera);assert.equal(fire.stats.visible,0);
 }finally{fire.dispose();}
});
test('a car parked in burning fuel loses health and catches fire offline; online-style cars are untouched',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean)=>{
  const scene=new T.Scene(),w=new R.World({x:0,y:-9.81,z:0}),slicks=new FluidSlicks(scene);w.createCollider(R.ColliderDesc.cuboid(80,.5,80).setTranslation(0,-.5,0));
  const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},slicks} as never;
  const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,w,fx,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.input.brake=1;c.input.throttle=0;
   for(let k=0;k<30;k++){c.preStep(1/60);w.step();c.postStep(1/60,k/60);}
   const p=c.body.translation();for(let i=0;i<10;i++)slicks.drip(p.x+(i%3-1)*.5,0,p.z+(Math.floor(i/3)-1)*.8,2,i*.1);
   c.scraping=.6;c.preStep(1/60);w.step();c.postStep(1/60,1);    // sparks under the car
   const lit=slicks.stats.burning;let ignite=false;
   for(let k=0;k<60*3;k++){c.preStep(1/60);w.step();slicks.advance(1/60);c.postStep(1/60,1+k/60);ignite||=c.igniteRequest;}
   return{lit,health:c.health,ignite,heat:c.flameHeat};
  }finally{c.dispose();w.free();slicks.dispose();}
 };
 const on=await run(true),off=await run(false);console.log(JSON.stringify({on,off}));
 assert.ok(on.lit>0&&on.health<100-FLAME.damage*.5&&on.ignite,'lit by the sparks, scorched, set alight');
 assert.ok(off.lit===0&&off.health===100&&!off.ignite,'no leaks, sparks or flames online');
});
test('fire credit: puddles lit carry the lighter through the spread; setting a rival alight is a highlight, an award and a badge',async()=>{
 const {EventAwards}=await import('../src/event-awards');const {bankAchievements,ACHIEVEMENTS}=await import('../src/achievements');const {BADGE_DECALS}=await import('../src/badge-decals');
 const {s}=world();const owners:number[]=[];s.onIgnite=(_x,_y,_z,_k,o)=>owners.push(o);
 try{
  for(let i=0;i<5;i++)s.drip(i*.32,0,0,2,i*.17);
  s.igniteAt(0,0,.02,true,3);for(let k=0;k<10;k++)s.advance(.25);
  assert.ok(owners.length===5&&owners.every(o=>o===3),'every puddle in the trail is credited to car 3');
  assert.equal(s.ownerAt(.64,0),3);assert.equal(s.ownerAt(20,20),-1);
 }finally{s.dispose();}
 const a=new EventAwards();for(let i=0;i<5;i++)a.ignited(3);a.ignited(-1);a.setAlight(3,7,12);a.setAlight(4,4,1);
 assert.deepEqual(a.firesBy(3),{puddles:5,cars:1});
 const award=a.awards('derby',[{id:3,inflicted:0,health:50},{id:7,inflicted:0,health:20}]).find(x=>x.key==='firestarter');
 assert.ok(award&&award.id===3&&/set 1 car alight/.test(award.detail));
 assert.ok(a.highlights().some(m=>m.kind==='fire'&&m.attacker===3&&m.victim===7));
 const quiet=new EventAwards();quiet.ignited(2);quiet.ignited(2);assert.ok(!quiet.awards('derby',[]).some(x=>x.key==='firestarter'),'two puddles are not an award');
 const p={events:1,wins:0,distance:0,knockouts:0,challenges:{}} as never;
 const run={finished:false,completed:true,won:false,rank:3,distance:900,health:40,knockouts:0} as never;
 const fresh=bankAchievements(p,{run,kind:'sedan',mode:'derby',setAlight:1,puddlesLit:12},{kinds:99,courses:99,arenas:99}).map(x=>x.id);
 assert.ok(fresh.includes('firestarter')&&fresh.includes('inferno'));
 for(const id of ['firestarter','inferno'])assert.ok(ACHIEVEMENTS.some(x=>x.id===id)&&BADGE_DECALS.some(d=>d.badge===id));
});
