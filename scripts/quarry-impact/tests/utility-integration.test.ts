import{vehicleContact}from'../src/vehicle-contact';
import{structuralDamage}from'../src/bodywork-response';
import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import R from '@dimforge/rapier3d-compat';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import{loadCarWithoutImages}from'../tools/car-asset-audit';import{loadCars,templates}from'../src/assets';import{Vehicle}from'../src/vehicle';import{CAR_KINDS,DEFINITIONS}from'../src/rules';import{classicWheelAnchors,classicEngineVoice}from'../src/classic-vehicle-specs';
import{createVehiclePhysics,stepVehiclePhysics,vehicleSpecification}from'../src/vehicle-physics';import{readGarage,stockSetup,exportSetup,importSetup}from'../src/garage';import{demoCarKind}from'../src/demo-session';import{ReplayRecorder,replayFile,readReplayFile}from'../src/replay-data';import{captureReplayFrame,ReplayScene}from'../src/replay-scene';
import{verifyUtilityIntegrationRevision}from'./utility-integration-invariants';
await R.init();const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|wheel-machining)\.glb$/.exec(String(url))![1]);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}}as any;
const state=()=>({health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt' as const,gear:1,rpm:850,input:{throttle:1,steer:0,brake:0,handbrake:false}});
const shape=(car:Vehicle)=>car.panels.map(p=>Array.from(p.geometry.attributes.position.array));

test('utility joins garage exchange and both demo lineups without changing saved cars',()=>{
 assert.ok(templates.has('utility'));const stock=stockSetup('utility'),old=stockSetup('wagon');old.armor=3;const garage=readGarage(JSON.stringify({version:1,cars:{wagon:{setup:old}}}));assert.deepEqual(garage.cars.wagon.setup,old);assert.deepEqual(garage.cars.utility.setup,stock);
 stock.engine=2;stock.tune.suspension=.6;assert.deepEqual(importSetup(exportSetup('utility',stock),'utility'),stock);assert.throws(()=>importSetup(exportSetup('utility',stock),'muscle'));
 assert.equal(demoCarKind(23,'utility','selected'),'utility');assert.equal(demoCarKind(0,'utility','mixed'),'utility');assert.deepEqual(new Set(Array.from({length:12},(_,i)=>demoCarKind(i,'utility','mixed'))),new Set(CAR_KINDS));
 assert.equal(classicEngineVoice('utility').bank,'coupe');assert.ok(classicEngineVoice('utility').pitch>classicEngineVoice('wagon').pitch&&classicEngineVoice('utility').pitch<classicEngineVoice('muscle').pitch);
});

test('production utility wheels match suspension and its short roof does not fill the cargo bed',()=>{
 const world=new R.World({x:0,y:-9.81,z:0}),car=new Vehicle(0,'utility',DEFINITIONS.utility.color,new T.Scene(),world,fx);
 try{const anchors=classicWheelAnchors('utility');assert.equal(-car.model.position.y,anchors.modelOffset);for(let i=0;i<4;i++){
  assert.ok(car.wheels[i].position.distanceTo(new T.Vector3(...Object.values(anchors.wheels[i]) as [number,number,number]))<1e-6);
  const p=car.controller.wheelChassisConnectionPointCs(i)!;assert.ok(Math.abs(p.x-anchors.wheels[i].x)<1e-6&&Math.abs(p.z-anchors.wheels[i].z)<1e-6);
 }
 world.step();const bodyY=car.body.translation().y;
 for(const z of [-1.1,-1.8,-2.5]){const hit=world.castRay(new R.Ray({x:0,y:bodyY+3,z},{x:0,y:-1,z:0}),5,true)!;assert.ok(hit);const y=bodyY+3-hit.timeOfImpact;assert.ok(Math.abs(y-(bodyY-.185))<.005,'Cargo must reach the actual bed floor');}
 const roof=world.castRay(new R.Ray({x:0,y:bodyY+3,z:-.2},{x:0,y:-1,z:0}),5,true)!;assert.equal(roof.collider.handle,car.roof.handle);assert.ok(car.roof.halfExtents().z<.60);
 const center=car.body.localCom();assert.ok(Math.abs(center.z-.12)<1e-5&&Math.abs(center.y+.06)<1e-5);assert.ok(Math.abs(car.body.mass()-1840)<.001);
 for(const name of ['hood','door-left','door-right','front-bumper','rear-bumper'])assert.ok(car.wreckParts.assemblies.some(a=>a.name===name));
 }finally{car.dispose();world.free();}
});

test('a real rigid object falls into the utility bed instead of resting on an invisible solid body',()=>{
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;const c=createVehiclePhysics(R,world,'utility',1840);c.body.setBodyType(R.RigidBodyType.Fixed,true);
 const cargo=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(0,1.5,-1.9));world.createCollider(R.ColliderDesc.cuboid(.12,.12,.12).setMass(25),cargo);
 try{for(let i=0;i<240;i++)world.step();assert.ok(Math.abs(cargo.translation().y-(-.185+.12))<.015);assert.ok(Math.abs(cargo.linvel().y)<.1);assert.ok(Math.abs(cargo.translation().z+1.9)<.05);}finally{world.free();}
});

test('utility accelerates, turns and brakes on its own longer chassis and firmer rear springs',()=>{
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(500,.5,800).setTranslation(0,-.5,0));const spec=vehicleSpecification('utility'),c=createVehiclePhysics(R,world,'utility',spec.mass),s=state();c.body.setTranslation({x:0,y:.89,z:0},true);
 try{for(let i=0;i<600;i++){stepVehiclePhysics(c.body,c.controller,'utility',spec,s,1/60);world.step();}assert.ok(s.speed>20&&s.speed<47);assert.equal(c.controller.wheelEngineForce(0),0);assert.ok(c.controller.wheelEngineForce(2)!>0);assert.ok(c.controller.wheelSuspensionStiffness(2)!>c.controller.wheelSuspensionStiffness(0)!*1.1);
 const initial=c.body.translation();s.input.steer=.3;for(let i=0;i<90;i++){stepVehiclePhysics(c.body,c.controller,'utility',spec,s,1/60);world.step();}assert.ok(Math.abs(c.body.translation().x-initial.x)>1);assert.ok(c.body.translation().y>.5&&c.body.translation().y<1);
 s.input.throttle=0;s.input.steer=0;s.input.brake=1;for(let i=0;i<600;i++){stepVehiclePhysics(c.body,c.controller,'utility',spec,s,1/60);world.step();}assert.ok(Math.abs(s.speed)<1);assert.ok(Number.isFinite(c.body.rotation().w));assert.ok(spec.speedLimit<vehicleSpecification('muscle').speedLimit&&spec.speedLimit>vehicleSpecification('wagon').speedLimit);
 }finally{world.free();}
});

test('utility collision damage and wheel damage survive compressed replay and backwards seeking',async()=>{
 const world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene(),setup=stockSetup('utility');setup.tune.suspension=.4;const live=new Vehicle(0,'utility',setup.paint,scene,world,fx,setup),cars=[{id:0,kind:'utility' as const,setup}],rec=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars,props:0,created:'2026-10-01T12:00:00Z'});
 try{live.place(0,0,0);const intact=shape(live);live.onVisualEvent=e=>rec.event(0,.5,e);rec.capture(0,()=>captureReplayFrame([live],[],[0]),true);
 live.hit(live.current.clone().add(new T.Vector3(-.89,-.24,-1.525)),new T.Vector3(1,0,.3).normalize(),22,.5,true);assert.ok(live.wreckParts.wheelDamage[2]>0);assert.notDeepEqual(shape(live),intact);rec.capture(1,()=>captureReplayFrame([live],[],[0]),true);
 const blob=await replayFile(rec.document()),data=await readReplayFile(new File([blob],'utility.qir'));assert.deepEqual(data.meta.cars,cars);const replay=new ReplayScene(data,scene,world,[]);
 try{replay.seek(1);assert.deepEqual(shape(replay.cars[0]),shape(live));assert.deepEqual(Array.from(replay.cars[0].wreckParts.wheelDamage),Array.from(live.wreckParts.wheelDamage));replay.seek(0);assert.deepEqual(shape(replay.cars[0]),intact);assert.deepEqual(Array.from(replay.cars[0].wreckParts.wheelDamage),[0,0,0,0]);}finally{replay.dispose();}
 live.repair();assert.deepEqual(shape(live),intact);
 }finally{live.dispose();world.free();}
});
test('utility integration preserves the previous production inputs',()=>verifyUtilityIntegrationRevision());

test('real contacts on the utility front shell reach damage adjudication and share one cooldown',()=>{
 const world=new R.World({x:0,y:0,z:0}),queue=new R.EventQueue(true),car=new Vehicle(0,'utility',0xffffff,new T.Scene(),world,fx);world.timestep=1/60;
 const wall=world.createCollider(R.ColliderDesc.cuboid(2,2,.1).setTranslation(0,0,5));car.body.setTranslation({x:0,y:0,z:0},true);car.body.setLinvel({x:0,y:0,z:16},true);
 let shellContacts=0,hits=0;const seen=new Map<string,number>();
 try{for(let tick=0;tick<40;tick++){
  const velocity={...car.body.linvel()};world.step(queue);
  queue.drainContactForceEvents(e=>{const h1=e.collider1(),h2=e.collider2(),contact=vehicleContact(world,[car],h1,h2);if(!contact.a&&!contact.b)return;
   const carHandle=h1===wall.handle?h2:h1;if(carHandle!==car.collider.handle&&carHandle!==car.roof.handle)shellContacts++;
   const now=tick/60;if(now-(seen.get(contact.key)??-100)<.28)return;
   const impulse=e.totalForceMagnitude()/60;if(impulse<1500)return;
   const damage=structuralDamage(impulse,Math.abs(velocity.z));if(damage<.1)return;seen.set(contact.key,now);hits++;
   let point=new T.Vector3(0,0,4.9);world.contactPair(world.getCollider(h1),world.getCollider(h2),m=>{if(m.numSolverContacts())point.copy(m.solverContactPoint(0));});car.hit(point,new T.Vector3(0,0,-1),damage,now,true);
  });
 }
 assert.ok(shellContacts>0,'The collision must actually hit the added front shell');assert.ok(hits>0&&car.health<100,'A shell collision must damage the utility');
 const other=createVehiclePhysics(R,world,'muscle',1710),opponent={...other,kind:'muscle'};const keys=new Set<string>();
 for(let i=0;i<car.body.numColliders();i++)for(const collider of [other.collider,other.roof]){const hit=vehicleContact(world,[car,opponent],car.body.collider(i).handle,collider.handle);assert.equal(hit.a,car);assert.equal(hit.b,opponent);keys.add(hit.key);}
 assert.equal(keys.size,1,'Multiple utility shell pieces must not multiply damage for one car-to-car crash');
 }finally{car.dispose();queue.free();world.free();}
});

test('damage and repair retain the open cargo collider rather than replacing it with a solid car box',()=>{
 const world=new R.World({x:0,y:0,z:0}),car=new Vehicle(0,'utility',0xffffff,new T.Scene(),world,fx);car.place(0,0,0);const expected=car.collider.halfExtents();
 const floor=()=>{world.step();const y=car.body.translation().y;const hit=world.castRay(new R.Ray({x:0,y:y+3,z:-1.9},{x:0,y:-1,z:0}),5,true)!;assert.ok(hit);assert.ok(Math.abs(3-hit.timeOfImpact+.185)<.01,'The bed must remain open after lifecycle changes');};
 try{floor();car.hit(car.current.clone().add(new T.Vector3(-.9,0,-1.5)),new T.Vector3(1,0,0),25,1,true);assert.ok(car.health<100);floor();assert.ok(Math.abs(car.collider.halfExtents().y-.065)<1e-6);car.repair();floor();assert.deepEqual(car.collider.halfExtents(),expected);}finally{car.dispose();world.free();}
});
