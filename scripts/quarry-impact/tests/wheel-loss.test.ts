import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
import {createVehicleDrive} from '../src/drivetrain/chassis';
import {wheelResponse,wheelTearsOff,WHEEL_TEAR} from '../src/wheel-physics';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle,WIND_RIP,PART_DRAG,HARD_LANDING,HUBCAP_POP} from '../src/vehicle';
import {ReplayRecorder,replayFile,readReplayFile,type VisualEvent} from '../src/replay-data';
import {captureReplayFrame} from '../src/replay-scene';
import {stockSetup} from '../src/garage';
await R.init();
let carsLoaded:Promise<void>|undefined;
const ensureCars=()=>carsLoaded??=(async()=>{const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}})();
// Boolean assertions only: never hand Three.js or Rapier objects to an assertion message.
test('a torn-off wheel leaves a low, slippery, dragging hub and only full-damage wheels tear',()=>{
 const intact=wheelResponse(1,-1,20,.375,0),hub=wheelResponse(1,-1,20,.375,0,.26,true);
 assert.ok(hub.radius<intact.radius*.7&&hub.grip<intact.grip&&hub.sideGrip<intact.sideGrip&&hub.drag>intact.drag&&hub.power<.2);
 assert.ok(wheelTearsOff(1,WHEEL_TEAR.damage,.5));assert.ok(!wheelTearsOff(.1,30,.2),'a fresh wheel survives one big blow');
 assert.ok(!wheelTearsOff(1,WHEEL_TEAR.damage-.1,.2),'a light tap leaves it');assert.ok(!wheelTearsOff(1,40,WHEEL_TEAR.reach+.1),'a blow elsewhere leaves it');
});
test('driving on a bare front-left hub is slower, pulls toward the hub and drops that corner',()=>{
 const run=(lost:boolean)=>{
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(800,.5,800).setTranslation(0,-.5,0));
  const spec=vehicleSpecification('sedan'),{body,controller}=createVehiclePhysics(R,world,'sedan',spec.mass),drive=createVehicleDrive(body,controller,'sedan');
  const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false}};
  const condition={wheelLost:lost?[1,0,0,0]:[0,0,0,0]};
  try{
   body.setTranslation({x:0,y:1.2,z:0},true);for(let i=0;i<90;i++){drive.step(spec,state,1/60,undefined,condition);world.step();}
   const q=body.rotation(),left=new T.Vector3(1,0,0).applyQuaternion(new T.Quaternion(q.x,q.y,q.z,q.w));const roll=left.y;
   state.input.throttle=1;for(let i=0;i<300;i++){drive.step(spec,state,1/60,undefined,condition);world.step();}
   const p=body.translation();return{speed:state.speed,x:p.x,roll};
  }finally{world.free();}
 };
 const a=run(false),b=run(true);console.log(JSON.stringify({intact:a,hub:b}));
 assert.ok(b.speed<a.speed*.92,'the dragging hub costs speed');
 assert.ok(Math.abs(b.x)>Math.abs(a.x)+.3,'the car pulls off line');
 assert.ok(Math.abs(b.roll-a.roll)>.01,'the hub corner sits lower');
});
test('a wrecked wheel tears off a live car as rolling debris, and repair refits it',async()=>{
 await ensureCars();
 const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});let torn=0;
 const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},detachWheel(){torn++;}} as never;
 const car=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,fx,stockSetup('sedan'),undefined,'angular-v1');
 try{
  car.place(0,0,0);car.render(1);car.root.updateMatrixWorld(true);
  const wheel=car.model.getObjectByName('wheel_FL')!,at=wheel.getWorldPosition(new T.Vector3()),inward=new T.Vector3().subVectors(car.root.position,at).setY(0).normalize();
  const hitWheel=()=>car.hit(at.clone().addScaledVector(inward,-.15),inward,14,0);
  car.extendedDamage=false;for(let i=0;i<8;i++){car.health=100;hitWheel();}
  assert.ok(car.wreckParts.wheelDamage[0]>=WHEEL_TEAR.worn,'repeated blows knock the wheel about');assert.ok(car.wreckParts.wheelLost[0]===0&&torn===0,'disabled cars keep their wheels');
  car.extendedDamage=true;car.health=100;hitWheel();
  assert.ok(car.wreckParts.wheelLost[0]===1&&torn===1&&!wheel.visible,'the next solid blow tears it off');
  assert.ok(car.wreckParts.wheelLost[3]===0,'the far wheel stays');
  car.repair();assert.ok(car.wreckParts.wheelLost.every(v=>v===0)&&wheel.visible,'repair refits the wheel');
 }finally{car.dispose();world.free();}
});
test('a loose panel tears away in the wind at speed, is recorded, and replays as a rip',async()=>{
 await ensureCars();const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});let detached=0;const events:VisualEvent[]=[];
 const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;detached++;}} as never;
 const car=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,fx,stockSetup('sedan'),undefined,'angular-v1');car.onVisualEvent=e=>events.push(e);
 try{
  car.place(0,0,0);car.render(1);car.extendedDamage=true;
  const part=car.wreckParts.assemblies.find(a=>a.name==='front-bumper')??car.wreckParts.assemblies[0];assert.ok(!!part,'the sedan has loose-able assemblies');
  const visible=()=>part.members.filter(m=>m.mesh.visible).length,start=visible();assert.ok(start>0);
  part.loose=.9;let t=0;
  car.speed=WIND_RIP.speed-2;for(let i=0;i<600;i++){t+=1/60;car.postStep(1/60,t);}assert.ok(visible()===start,'below the wind speed it only flaps');
  car.speed=30;let ripped=-1;for(let i=0;i<600&&ripped<0;i++){t+=1/60;car.postStep(1/60,t);if(visible()===0)ripped=i/60;}
  assert.ok(ripped>0&&ripped<3,'it tears away within a few seconds at 30 m/s');assert.ok(detached===start,'every member leaves as debris');
  const rip=events.find(e=>e.kind==='rip');assert.ok(!!rip&&rip.part===part.name,'the rip is recorded for replays');
  car.repair();assert.ok(visible()===start,'repair refits it');
  const record=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'sedan',setup:stockSetup('sedan')}],props:0,created:'2026-10-19T12:00:00Z',damageModel:1});
  record.capture(0,()=>captureReplayFrame([car],[],[0]),true);record.capture(1,()=>captureReplayFrame([car],[],[0]),true);
  const doc=await readReplayFile(new File([await replayFile({...record.document(),events:[{...rip!,car:0,time:0}]})],'rip.qir'));
  assert.ok(doc.events.some(e=>e.kind==='rip'&&e.part===part.name),'rip events survive the replay format');
  assert.ok(doc.meta.damageModel===1);
 }finally{car.dispose();world.free();}
});
test('a burst tyre throws rubber once, then runs on the rim with sparks and a scrape',async()=>{
 await ensureCars();const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(50,.5,50).setTranslation(0,-.5,0));
 const emitted:number[]=[];const fx={emit(_p:T.Vector3,count:number,type:number){for(let i=0;i<count;i++)emitted.push(type);},mark(){},detach(){}} as never;
 const car=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,fx,stockSetup('sedan'),undefined,'angular-v1');
 try{
  car.place(0,0,0);for(let i=0;i<60;i++){car.preStep(1/60);world.step();car.postStep(1/60,i/60);}
  car.tyreDamage=[1,0,0,0];car.speed=15;car.surface='asphalt';let t=2;
  for(let i=0;i<30;i++){t+=1/60;car.postStep(1/60,t);}
  const rubber=emitted.filter(v=>v===4).length,sparks=emitted.filter(v=>v===1).length;
  assert.ok(rubber>=10&&rubber<20,'one burst of rubber, not a stream');assert.ok(sparks>0,'rim sparks');assert.ok(car.scraping>0,'rim scrape audio');
  car.repair();emitted.length=0;car.tyreDamage=[1,0,0,0];car.speed=15;car.surface='asphalt';for(let i=0;i<10;i++){t+=1/60;car.postStep(1/60,t);}
  assert.ok(emitted.filter(v=>v===4).length>=10,'repair resets the burst');
 }finally{car.dispose();world.free();}
});
test('a bumper dragging on the ground slows the car and pulls it toward that side',async()=>{
 await ensureCars();assert.ok(PART_DRAG>0);
 const run=async(drag:boolean)=>{const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(800,.5,800).setTranslation(0,-.5,0));
  const fx={emit(){},mark(){},detach(){}} as never,car=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,fx,stockSetup('sedan'),undefined,'angular-v1');
  try{car.extendedDamage=true;car.place(0,0,0);let t=0;const step=()=>{car.preStep(1/60);world.step();car.postStep(1/60,t);t+=1/60;};
   for(let i=0;i<60;i++)step();car.input={throttle:1,steer:0,brake:0,handbrake:false};for(let i=0;i<240;i++)step();
   const bumper=car.wreckParts.assemblies.find(a=>a.name==='front-bumper');assert.ok(!!bumper);
   if(drag){bumper.damage=200;bumper.loose=1;}
   for(let i=0;i<180;i++){if(drag)bumper.loose=1;step();}
   return{speed:car.speed,x:car.current.x};}finally{car.dispose();world.free();}};
 const clean=await run(false),dragging=await run(true);console.log(JSON.stringify({clean,dragging}));
 assert.ok(dragging.speed<clean.speed-1,'dragging costs speed');
});
test('a hard landing bottoms out a corner and hurts; a small drop does not',async()=>{
 await ensureCars();assert.ok(HARD_LANDING.speed>0);
 const drop=async(height:number,extended=true)=>{const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(80,.5,80).setTranslation(0,-.5,0));
  const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}} as never,car=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,fx,stockSetup('sedan'),undefined,'angular-v1');
  try{car.extendedDamage=extended;car.place(0,0,0);let t=0;const step=()=>{car.preStep(1/60);world.step();car.postStep(1/60,t);t+=1/60;};
   for(let i=0;i<90;i++)step();car.body.setTranslation({x:0,y:car.current.y+height,z:0},true);car.body.setLinvel({x:0,y:0,z:0},true);
   for(let i=0;i<180;i++)step();return{health:car.health,wheels:Math.max(...car.wreckParts.wheelDamage)};}finally{car.dispose();world.free();}};
 const small=await drop(1),big=await drop(7),off=await drop(7,false);console.log(JSON.stringify({small,big,off}));
 assert.ok(small.health===100,'a 1 m drop is harmless');assert.ok(big.health<100&&big.wheels>small.wheels,'a 7 m drop hurts the car and a wheel');
 assert.ok(off.health===100,'online/legacy cars are unchanged');
});
test('a knocked wheel loses its centre cap once, and repair refits it',async()=>{
 await ensureCars();const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});let detached=0;
 const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;detached++;}} as never;
 const car=new Vehicle(0,'tern',stockSetup('tern').paint,scene,world,fx,stockSetup('tern'),undefined,'angular-v1');
 try{
  car.extendedDamage=true;car.place(0,0,0);car.render(1);car.root.updateMatrixWorld(true);
  const wheel=car.model.getObjectByName('wheel_FL')!;let cap:T.Mesh|undefined;wheel.traverse(o=>{if(o instanceof T.Mesh&&/brushed chrome/i.test(o.name))cap=o;});assert.ok(!!cap,'the tern has a chrome centre cap');
  const at=wheel.getWorldPosition(new T.Vector3()),inward=new T.Vector3().subVectors(car.root.position,at).setY(0).normalize();
  let hits=0;while(car.wreckParts.wheelDamage[0]<HUBCAP_POP&&hits<20){car.health=100;car.hit(at.clone().addScaledVector(inward,-.15),inward,6,0);hits++;}
  assert.ok(car.wreckParts.wheelDamage[0]>=HUBCAP_POP&&!cap!.visible&&detached>=1,'the cap flew off');
  const after=detached;car.health=100;car.hit(at.clone().addScaledVector(inward,-.15),inward,6,0);assert.ok(detached===after||car.wreckParts.wheelLost[0]===1,'only once');
  car.repair();assert.ok(cap!.visible,'repair refits it');
 }finally{car.dispose();world.free();}
});
