import {captureReplayFrame,ReplayScene} from '../src/replay-scene';
import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import R from '@dimforge/rapier3d-compat';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';import {loadCars,templates} from '../src/assets';import {Vehicle} from '../src/vehicle';
import {CAR_KINDS,DEFINITIONS,isCarKind} from '../src/rules';import {CLASSIC_VEHICLES,classicWheelAnchors,classicEngineVoice} from '../src/classic-vehicle-specs';import {readGarage,stockSetup,exportSetup,importSetup} from '../src/garage';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification} from '../src/vehicle-physics';import {freshComponents,applyComponentImpact} from '../src/component-damage';import {ReplayRecorder,replayFile,readReplayFile,REPLAY_STRIDE} from '../src/replay-data';import {demoCarKind} from '../src/demo-session';import {verifyClassicRosterRevision} from './classic-roster-invariants';
await R.init();const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|wheel-machining)\.glb$/.exec(String(url))![1]);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}}as any;
const hashes=(car:Vehicle)=>car.panels.map(p=>Array.from(p.geometry.attributes.position.array));
test('the ten-car roster is validated and existing garage saves retain upgrades while new cars receive factory defaults',()=>{
 assert.deepEqual(CAR_KINDS,['coupe','sedan','hatch','muscle','wagon','utility','compact','van','tern','marten']);for(const kind of CAR_KINDS){assert.ok(isCarKind(kind));assert.ok(templates.has(kind));}for(const v of ['__proto__','toString','pickup',null,{}])assert.equal(isCarKind(v),false);
 const old=stockSetup('coupe');old.engine=3;old.paint=0xff8811;const garage=readGarage(JSON.stringify({version:1,cars:{coupe:{setup:old}}}));assert.deepEqual(garage.cars.coupe.setup,old);
 for(const kind of ['muscle','wagon']as const){assert.deepEqual(garage.cars[kind].setup,stockSetup(kind));const setup=stockSetup(kind);setup.armor=2;setup.tune.gearing=.7;assert.deepEqual(importSetup(exportSetup(kind,setup),kind),setup);assert.throws(()=>importSetup(exportSetup(kind,setup),kind==='muscle'?'wagon':'muscle'));assert.equal(demoCarKind(23,kind,'selected'),kind);}
});
test('production classic models align visible wheels, raycast suspension, damage anchors, roofs and detachable bodywork',()=>{
 for(const kind of ['muscle','wagon']as const){const world=new R.World({x:0,y:-9.81,z:0}),car=new Vehicle(0,kind,DEFINITIONS[kind].color,new T.Scene(),world,fx);try{
  const anchors=classicWheelAnchors(kind);assert.equal(-car.model.position.y,anchors.modelOffset);for(let i=0;i<4;i++){assert.deepEqual({...car.wheels[i].position},anchors.wheels[i]);const p=car.controller.wheelChassisConnectionPointCs(i)!;assert.ok(Math.abs(p.x-anchors.wheels[i].x)<1e-6);assert.ok(Math.abs(p.z-anchors.wheels[i].z)<1e-6);}
  for(const group of ['hood','front-bumper','rear-bumper','door-left','door-right'])assert.ok(car.wreckParts.assemblies.some(a=>a.name===group),kind+' missing '+group);
  assert.ok(car.roof.halfExtents().z>(kind==='wagon'?1:.5));assert.ok(car.model.getObjectByName('panel_inner_engine_'+(kind==='wagon'?'Estate Chassis Steel':'Classic Chassis Steel')));assert.ok(car.wheels.every(w=>w.children.length>0),'Wheel batches must not disappear');assert.ok(car.panels.length>20);assert.ok(car.glass.length>=6);for(const pane of car.glass.filter(p=>/BodyDoor|Cargo|Quarter/.test(p.name))){const pos=pane.geometry.attributes.position,normal=pane.geometry.attributes.normal;assert.ok(pos.getX(0)*normal.getX(0)>0,'Side glazing must face outside');}
 }finally{car.dispose();world.free();}}
});
test('the estate has separate rear-door hinges and a roof collider covering its longer cabin',()=>{
 const world=new R.World({x:0,y:-9.81,z:0}),car=new Vehicle(0,'wagon',0xffffff,new T.Scene(),world,fx);
 try{for(const side of ['left','right']){const front=car.wreckParts.assemblies.find(a=>a.name==='door-'+side)!,rear=car.wreckParts.assemblies.find(a=>a.name==='door-rear-'+side)!;assert.ok(front&&rear);assert.ok(rear.members.some(p=>p.mesh.name.startsWith('glass_')));assert.ok(rear.members.every(p=>!front.members.includes(p)));assert.ok(rear.bounds.max.z<=front.bounds.min.z+.00001);}
 const roof=car.model.getObjectByName('panel_BodyRoof') as T.Mesh,b=new T.Box3().setFromBufferAttribute(roof.userData.wreckRest),half=car.roof.halfExtents(),center=car.roof.translation();assert.ok(b.min.z>=center.z-half.z-.04&&b.max.z<=center.z+half.z+.04,'Roof collision must cover the cargo cabin');
 const rear=car.wreckParts.assemblies.find(a=>a.name==='door-rear-left')!,front=car.wreckParts.assemblies.find(a=>a.name==='door-left')!;
 car.wreckParts.hit(new T.Vector3(-1,1,-1.43),new T.Vector3(1,0,0),55);car.wreckParts.poseAt(1,20);assert.ok(rear.loose>front.loose);assert.ok(rear.members.every(p=>p.mesh.matrix.elements.every(Number.isFinite)));assert.ok(rear.members.some(p=>!p.mesh.matrix.equals(p.matrix)));car.wreckParts.reset();assert.ok(rear.members.every(p=>p.mesh.matrix.equals(p.matrix)));
 }finally{car.dispose();world.free();}
});
test('classic impacts visibly deform, damage wheels, restore exactly and reproduce on quiet replay hits',()=>{
 for(const kind of ['muscle','wagon']as const){const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0}),a=new Vehicle(0,kind,0xffffff,scene,world,fx),b=new Vehicle(1,kind,0xffffff,scene,world,fx);try{
  a.place(0,0,0);b.place(0,0,0);const intact=hashes(a),anchor=classicWheelAnchors(kind),mechanics=freshComponents();
  for(const [local,direction,damage]of [[new T.Vector3(-.96,-.25,DEFINITIONS[kind].wheelbase/2),new T.Vector3(.8,0,-.4).normalize(),12],[new T.Vector3(0,.13,DEFINITIONS[kind].halfLength),new T.Vector3(0,0,-1),17]]as const){
   const point=local.clone().add(a.current);a.hit(point,direction,damage,1,true);b.hit(point,direction,damage,1,true);applyComponentImpact(mechanics,kind,{...local},{...direction},damage);
  }
  assert.notDeepEqual(hashes(a),intact);assert.deepEqual(hashes(a),hashes(b));assert.ok(a.wreckParts.wheelDamage[0]>0);assert.ok(Math.abs(a.wreckParts.wheelDamage[0]-mechanics.wheelDamage[0])<1e-6);assert.ok(a.health<100);
  a.repair();assert.deepEqual(hashes(a),intact);assert.deepEqual(Array.from(a.wreckParts.wheelDamage),[0,0,0,0]);assert.ok(a.panels.every(p=>p.visible));assert.equal(a.wheels[0].position.x,anchor.wheels[0].x);assert.ok(a.glass.every(g=>(g.material as T.MeshPhysicalMaterial).opacity===.55),'Repairs must restore the original glazing opacity');
 }finally{a.dispose();b.dispose();world.free();}}
});
test('both classics accelerate through real rear-wheel drive, remain grounded and brake to a stop',()=>{
 const speeds:number[]=[];
 for(const kind of ['muscle','wagon']as const){const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(300,.5,600).setTranslation(0,-.5,0));const spec=vehicleSpecification(kind),c=createVehiclePhysics(R,world,kind,spec.mass);c.body.setTranslation({x:0,y:.89,z:0},true);const s={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt' as const,gear:1,rpm:850,input:{throttle:1,steer:0,brake:0,handbrake:false}};
 try{for(let i=0;i<600;i++){stepVehiclePhysics(c.body,c.controller,kind,spec,s,1/60);world.step();}assert.ok(s.speed>20,kind+' should accelerate');speeds.push(s.speed);assert.ok(c.body.translation().y>.5&&c.body.translation().y<1);assert.equal(c.controller.wheelEngineForce(0),0);assert.equal(c.controller.wheelEngineForce(1),0);assert.ok(c.controller.wheelEngineForce(2)!>0);
 s.input.throttle=0;s.input.brake=1;for(let i=0;i<600;i++){stepVehiclePhysics(c.body,c.controller,kind,spec,s,1/60);world.step();}assert.ok(Math.abs(s.speed)<1,kind+' should stop');assert.ok(Number.isFinite(c.body.rotation().w));
 }finally{world.free();}}
 assert.ok(speeds[0]>speeds[1]+2,'The lighter muscle car must accelerate differently from the estate');assert.ok(vehicleSpecification('wagon').spring<vehicleSpecification('muscle').spring);assert.ok(classicEngineVoice('wagon').pitch<classicEngineVoice('muscle').pitch);assert.equal(classicEngineVoice('coupe').pitch,1);
});
test('compressed replay exchange preserves both new identities and tuned setups',async()=>{
 const cars=(['muscle','wagon']as const).map((kind,id)=>({id,kind,setup:stockSetup(kind)}));cars[1].setup.engine=2;
 const world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene(),live=cars.map(c=>new Vehicle(c.id,c.kind,c.setup.paint,scene,world,fx,c.setup)),rec=new ReplayRecorder({version:1,mode:'race',reverse:false,cars,props:0,created:'2026-10-01T12:00:00Z'});
 try{live.forEach((c,i)=>{c.place(i*6,0,0);c.onVisualEvent=e=>rec.event(i,.5,e);});const intact=live.map(hashes);rec.capture(0,()=>captureReplayFrame(live,[],[0,0]),true);
 live[0].hit(live[0].current.clone().add(new T.Vector3(0,0,2.45)),new T.Vector3(0,0,-1),15,.5,true);live[1].hit(live[1].current.clone().add(new T.Vector3(-.88,-.05,-1.16)),new T.Vector3(1,0,0),35,.5,true);rec.capture(1,()=>captureReplayFrame(live,[],[0,0]),true);
 const blob=await replayFile(rec.document()),read=await readReplayFile(new File([blob],'classics.qir'));assert.deepEqual(read.meta.cars,cars);assert.equal(read.events.length,2);
 const playback=new ReplayScene(read,scene,world,[]);try{playback.seek(1);for(let i=0;i<2;i++)assert.deepEqual(hashes(playback.cars[i]),hashes(live[i]));playback.seek(0);for(let i=0;i<2;i++)assert.deepEqual(hashes(playback.cars[i]),intact[i]);assert.equal(playback.cars[1].setup.engine,2);}finally{playback.dispose();}
 }finally{live.forEach(c=>c.dispose());world.free();}
});
test('preceding production inputs are preserved in the revision chain',()=>verifyClassicRosterRevision());
