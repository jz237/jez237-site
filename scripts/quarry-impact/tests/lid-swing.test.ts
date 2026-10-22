import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {LID,lidKind,lidBase,lidTorque,stepLid,lidRest,DOOR_SWING} from '../src/door-swing';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('barn doors and tailgates open under acceleration and shut under braking; gravity shuts a tailgate and drops a drop-tailgate',()=>{
 assert.equal(lidKind('cargo-left'),'cargo');assert.equal(lidKind('tailgate'),'tailgate');assert.equal(lidKind('drop-tailgate'),'drop');assert.equal(lidKind('door-left'),null);
 assert.ok(lidTorque('cargo',.1,-1,6,0,9.81)>0&&lidTorque('cargo',.1,-1,-6,0,9.81)<0,'barn doors');
 assert.ok(lidTorque('cargo',.3,-1,0,8,9.81)>0&&lidTorque('cargo',.3,1,0,8,9.81)<0,'the outside barn door swings out in a corner');
 assert.ok(lidTorque('tailgate',.2,0,0,0,9.81)<0&&lidTorque('tailgate',.05,0,8,0,9.81)>0&&lidTorque('tailgate',.2,0,0,0,0)===0,'tailgate: gravity shuts, acceleration opens, a drop floats it');
 assert.ok(lidTorque('drop',.2,0,0,0,9.81)>0,'a drop-tailgate falls open');
 assert.equal(lidRest('tailgate',lidBase('tailgate',0),0,0,0,9.81),0);assert.ok(lidRest('tailgate',lidBase('tailgate',0),0,6,0,9.81)>.3);
 assert.ok(lidRest('drop',lidBase('drop',.5),0,0,0,9.81)>=LID.drop.max-lidBase('drop',.5)-.05,'hangs right down');
 const l={swing:0,rate:0};for(let i=0;i<240;i++)stepLid('tailgate',l,lidBase('tailgate',.2),0,0,0,9.81,1/60);assert.ok(l.swing<.01,'parked, it stays shut');
 const m={swing:0,rate:0};let hit=0;for(let i=0;i<120;i++)hit=Math.max(hit,stepLid('cargo',m,lidBase('cargo',.6),1,30,0,9.81,1/60));assert.ok(hit>DOOR_SWING.slam&&m.swing<=LID.cargo.max,'a violent launch slams the barn doors into their stops');
});
test('a van launched hard throws its unlatched barn doors open, a wagon lifts its tailgate, a pickup drops its tailgate; online-style lids stay put',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(kind:'van'|'wagon'|'hollins',extended:boolean)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const c=new Vehicle(0,kind,stockSetup(kind).paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup(kind),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   const lids=c.wreckParts.assemblies.filter(a=>lidKind(a.name));for(const a of lids)a.loose=.55;
   let parked=0;for(let k=0;k<60;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);parked=Math.max(parked,...lids.map(a=>a.swing??0));}
   c.input.throttle=1;let launch=0;for(let k=0;k<60;k++){c.preStep(1/60);world.step();c.postStep(1/60,1.5+k/60);launch=Math.max(launch,...lids.map(a=>a.swing??0));}
   return{names:lids.map(a=>a.name),parked,launch};
  }finally{c.dispose();world.free();}
 };
 const van=await run('van',true),wagon=await run('wagon',true),pickup=await run('hollins',true),offVan=await run('van',false),offPickup=await run('hollins',false);
 console.log(JSON.stringify({van,wagon,pickup,offVan,offPickup}));
 assert.ok(van.names.length===2&&van.parked<.05&&van.launch>.2,'barn doors fly open on the launch');
 assert.ok(wagon.names.join()==='tailgate'&&wagon.parked<.01&&wagon.launch>.02,'the tailgate lifts a little on the launch (gravity fights it), shut when parked');
 assert.ok(pickup.names.join()==='drop-tailgate'&&pickup.parked>.3,'the drop-tailgate falls open');
 assert.ok(offVan.launch===0&&offPickup.parked===0,'online-style lids do not swing');
});
