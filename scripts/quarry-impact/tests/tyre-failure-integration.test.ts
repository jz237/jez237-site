import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {vehicleWheelRadius} from '../src/classic-vehicle-specs';
import {ReplayRecorder,replayFile,readReplayFile,replayCarStride} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
import {OnlineView} from '../src/online-view';
import {Simulation} from '../multiplayer/simulation';
import {ImpactAdjudicator,type ImpactContact} from '../src/impact-adjudication';
import {vehicleContact,vehicleContactManifold} from '../src/vehicle-contact';
import {STEP,NEUTRAL,type Snapshot} from '../multiplayer/protocol';
import type {CarKind} from '../src/rules';

await R.init();
const load=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}
finally{GLTFLoader.prototype.loadAsync=load;}
const zero={x:0,y:0,z:0},fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}}as any;
const near=(a:number,b:number,tol=1e-6)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
function pose(car:Vehicle,y=.89,yaw=0){
 const p=new T.Vector3(0,y,0),q=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),yaw);
 car.body.setTranslation(p,true);car.body.setRotation(q,true);car.body.setLinvel(zero,true);car.body.setAngvel(zero,true);
 car.current.copy(p);car.previous.copy(p);car.currentQ.copy(q);car.previousQ.copy(q);car.root.position.copy(p);car.root.quaternion.copy(q);car.root.updateMatrixWorld(true);
}
function cornerPoint(car:Vehicle,index=0){return car.wheels[index].position.clone().add(car.model.position);}
function hit(car:Vehicle,local:T.Vector3,damage=23,time=.5){
 car.root.updateMatrixWorld(true);
 car.hit(local.clone().applyMatrix4(car.root.matrixWorld),new T.Vector3(1,0,0).applyQuaternion(car.root.quaternion),damage,time,true);
}
function wheelBuffers(car:Vehicle){
 const hash=createHash('sha256');
 for(const w of car.wheels)w.traverse(o=>{if(o instanceof T.Mesh){hash.update(o.name);for(const a of Object.values(o.geometry.attributes))hash.update(Buffer.from(a.array.buffer,a.array.byteOffset,a.array.byteLength));if(o.geometry.index)hash.update(Buffer.from(o.geometry.index.array.buffer));}});
 return hash.digest('hex');
}
function step(car:Vehicle,world:R.World,count:number,start=0){
 for(let i=0;i<count;i++){car.preStep(STEP);world.step();car.postStep(STEP,start+(i+1)*STEP);car.render(1);}
}
function visual(car:Vehicle){return car.tireContacts.map((c,i)=>({failure:c.failure.value,radius:c.radius.value,baseRadius:c.baseRadius.value,plane:c.plane.value.toArray(),load:c.load.value,active:c.active.value,position:car.wheels[i].position.toArray()}));}

test('actual vehicle impacts localize tyre failure independently of broad corner deformation and armor',()=>{
 for(const kind of ['tern','marten','buggy']as const){
  const world=new R.World(zero),scene=new T.Scene(),armored=stockSetup(kind);armored.armor=3;
  const cars=[new Vehicle(0,kind,0xffffff,scene,world,fx),new Vehicle(1,kind,0xffffff,scene,world,fx),new Vehicle(2,kind,armored.paint,scene,world,fx,armored)];
  try{
   cars.forEach(c=>pose(c,3,.61));
   const target=cornerPoint(cars[0]),upper=target.clone().add(new T.Vector3(0,.8,0));
   for(let i=0;i<3;i++){hit(cars[0],target,23,i+.1);hit(cars[1],upper,23,i+.1);hit(cars[2],target,23,i+.1);}
   assert.ok(cars[0].health>0);assert.equal(cars[0].tyreDamage![0],1);assert.deepEqual(cars[0].tyreDamage!.slice(1),[0,0,0]);
   assert.deepEqual(cars[1].tyreDamage,[0,0,0,0],kind+' a hard hit above the corner is not a tyre strike');
   assert.ok(cars[1].wreckParts.wheelDamage[0]>.1,kind+' control still damages the broad suspension corner');
   assert.ok(cars[2].tyreDamage![0]<cars[0].tyreDamage![0],kind+' armor scales trauma before accumulation');
   for(const c of cars){c.preStep(STEP);c.render(1);c.tireContacts.forEach((contact,i)=>near(contact.radius.value,c.controller.wheelRadius(i)!,1e-7));}
   assert.equal(cars[0].tireContacts[0].failure.value,1);assert.equal(cars[1].tireContacts[0].failure.value,0);
  }finally{cars.forEach(c=>c.dispose());world.free();}
 }
});

test('real flat-tyre rendering and repair keep wheel geometry and another vehicle instance intact',()=>{
 for(const kind of ['coupe','tern','buggy']as const){
  const world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene();world.timestep=STEP;
  world.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));
  const car=new Vehicle(0,kind,0xffffff,scene,world,fx),other=new Vehicle(1,kind,0xffffff,scene,world,fx);pose(car);pose(other,10);
  try{
   const original=wheelBuffers(car),otherOriginal=wheelBuffers(other),point=cornerPoint(car);step(car,world,180);
   for(let i=0;i<3;i++)hit(car,point,23,3+i*.1);step(car,world,60,3.3);
   assert.equal(car.tireContacts[0].failure.value,1);assert.equal(car.tireContacts[0].active.value,1);assert.ok(car.tireContacts[0].load.value>0);
   near(car.tireContacts[0].radius.value,car.controller.wheelRadius(0)!,1e-7);
   assert.equal(wheelBuffers(car),original,'rubber shaders and mechanical wheel movement never rewrite rim/tread buffers');
   assert.equal(wheelBuffers(other),otherOriginal);assert.deepEqual(other.tyreDamage,[0,0,0,0]);
   car.tireContacts.forEach((c,i)=>{assert.notEqual(c.failure,other.tireContacts[i].failure);assert.notEqual(c.radius,other.tireContacts[i].radius);assert.equal(other.tireContacts[i].failure.value,0);});
   car.repair();assert.deepEqual(car.tyreDamage,[0,0,0,0]);car.tireContacts.forEach(c=>{assert.equal(c.failure.value,0);assert.equal(c.active.value,0);assert.equal(c.load.value,0);});
   car.preStep(STEP);car.render(1);car.tireContacts.forEach((c,i)=>{near(c.radius.value,vehicleWheelRadius(kind));near(car.controller.wheelRadius(i)!,vehicleWheelRadius(kind),1e-7);});
   assert.equal(wheelBuffers(car),original);
  }finally{car.dispose();other.dispose();world.free();}
 }
});

test('compressed replay restores grounded tyre patches, repair and props across repeated backwards seeks',async()=>{
 const world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene(),setup=stockSetup('buggy');world.timestep=STEP;
 world.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));
 const car=new Vehicle(0,'buggy',setup.paint,scene,world,fx,setup);pose(car);
 const mesh=new T.Mesh(new T.BoxGeometry(),new T.MeshBasicMaterial()),body=world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(8,2,3)),props=[{mesh,body}];scene.add(mesh);
 const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'buggy',setup}],props:1,created:'2026-10-02',tyreModel:1});
 const captures:ReturnType<typeof visual>[]=[],conditions:(number[]|undefined)[]=[];let time=0;
 car.onVisualEvent=e=>recorder.event(0,time,e);
 const capture=(at:number)=>{body.setTranslation({x:8+at*2,y:2,z:3-at},true);car.render(1);captures[at]=visual(car);conditions[at]=car.tyreDamage?.slice();recorder.capture(at,()=>captureReplayFrame([car],props,[0],1),true);};
 let replay:ReplayScene|undefined;
 try{
  const point=cornerPoint(car);step(car,world,180);capture(0);
  time=.25;hit(car,point,23,time);time=.5;hit(car,point,23,time);step(car,world,60,.5);capture(1);
  time=1.25;hit(car,point,23,time);step(car,world,60,1.25);capture(2);
  time=2.25;car.repair();step(car,world,60,2.25);capture(3);
  assert.ok(captures[1][0].failure>0&&captures[1][0].failure<1);assert.equal(captures[2][0].failure,1);assert.equal(captures[2][0].active,1);assert.ok(captures[2][0].load>0);
  const doc=await readReplayFile(new File([await replayFile(recorder.document())],'tyres.qir'));assert.equal(replayCarStride(doc.meta),80);assert.equal(doc.frames[0].values.length,87);
  replay=new ReplayScene(doc,scene,world,props);const paused=visual(car),pausedBuffers=wheelBuffers(car);
  for(const at of [0,1,2,3,1,0,2,3,0]){
   replay.seek(at);const c=replay.cars[0];assert.deepEqual(c.tyreDamage,conditions[at]);
   for(const [i,actual]of visual(c).entries()){
    const expected=captures[at][i];near(actual.failure,expected.failure);near(actual.radius,expected.radius);near(actual.baseRadius,expected.baseRadius);
    near(actual.load,expected.load);assert.equal(actual.active,expected.active);actual.plane.forEach((n,j)=>near(n,expected.plane[j],1e-5));actual.position.forEach((n,j)=>near(n,expected.position[j]));
   }
   assert.deepEqual(replay.props[0].position.toArray(),[8+at*2,2,3-at]);assert.equal(c.body.isEnabled(),false,'seeks never simulate the playback car');
  }
  replay.seek(.75);near(replay.props[0].position.x,9.5);near(replay.props[0].position.z,2.25);
  replay.cars[0].tireContacts.forEach((contact,i)=>{
   near(contact.load.value,captures[0][i].load*.25+captures[1][i].load*.75);
   const expected=new T.Vector4().fromArray(captures[0][i].plane).lerp(new T.Vector4().fromArray(captures[1][i].plane),.75);expected.multiplyScalar(1/Math.hypot(expected.x,expected.y,expected.z));
   contact.plane.value.toArray().forEach((n,j)=>near(n,expected.getComponent(j),1e-5));
  });
  assert.deepEqual(visual(car),paused);assert.equal(wheelBuffers(car),pausedBuffers,'backwards replay must leave the parked live vehicle untouched');
 }finally{replay?.dispose();car.dispose();world.removeRigidBody(body);mesh.geometry.dispose();(mesh.material as T.Material).dispose();world.free();}
});

test('unmarked legacy replays never infer punctures from complete wheel-hit histories',async()=>{
 const world=new R.World(zero),scene=new T.Scene(),setup=stockSetup('tern'),car=new Vehicle(0,'tern',setup.paint,scene,world,fx,setup);pose(car,3);car.tyreDamage=undefined;
 const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'tern',setup}],props:0,created:'2026-10-02'});let time=0;car.onVisualEvent=e=>recorder.event(0,time,e);
 let replay:ReplayScene|undefined;
 try{
  car.render(1);recorder.capture(0,()=>captureReplayFrame([car],[],[0]),true);const point=cornerPoint(car);
  for(let i=0;i<3;i++){time=.2+i*.2;hit(car,point,23,time);}car.render(1);recorder.capture(1,()=>captureReplayFrame([car],[],[0]),true);
  time=1.5;car.repair();car.tyreDamage=undefined;car.render(1);recorder.capture(2,()=>captureReplayFrame([car],[],[0]),true);
  const doc=await readReplayFile(new File([await replayFile(recorder.document())],'legacy.qir'));assert.equal(doc.frames[0].values.length,56);
  replay=new ReplayScene(doc,scene,world,[]);
  for(const at of [0,1,2,1,0,2]){replay.seek(at);assert.equal(replay.cars[0].tyreDamage,undefined);replay.cars[0].tireContacts.forEach(c=>assert.equal(c.failure.value,0));}
 }finally{replay?.dispose();car.dispose();world.free();}
});

test('online tyre presentation takes authoritative contact state and clears it for legacy snapshots without hit packets',()=>{
 const authority=new Simulation(R,'playground',Array(8).fill('coupe')),world=new R.World(zero),scene=new T.Scene();let cars:Vehicle[]=[];
 const view=new OnlineView(scene,world,fx,{clearCars(){},attach(){},shot(){}}as any,()=>cars,v=>cars=v);
 try{
  const s:Snapshot={...authority.snapshot(false),members:[],ack:{}};s.tick=1;s.cars=s.cars.slice(0,1);const state=s.cars[0];
  state.components!.wheelDamage=[1,0,0,0];state.components!.tyreDamage=[1,0,0,0];state.wheels[0]={suspension:.3,rotation:1.4,contact:true,patch:{plane:[0,1,0,-.001],load:1.3}};
  view.receive(s);const car=cars[0];assert.equal(car.tireContacts[0].failure.value,1);assert.equal(car.tireContacts[0].active.value,1);assert.equal(car.tireContacts[0].load.value,1.3);assert.deepEqual(car.tireContacts[0].plane.value.toArray(),[0,1,0,-.001]);
  state.components!.tyreDamage![0]=0;assert.equal(car.tyreDamage![0],1,'online copied state does not alias its input');
  const legacy=structuredClone(s);legacy.tick++;delete legacy.cars[0].components!.tyreDamage;delete legacy.cars[0].wheels[0].patch;view.receive(legacy);
  assert.equal(cars[0],car);assert.equal(car.tyreDamage,undefined);assert.equal(car.tireContacts[0].failure.value,0);assert.equal(car.tireContacts[0].active.value,0);assert.equal(car.tireContacts[0].load.value,0);
  const older=structuredClone(legacy);older.tick++;delete older.cars[0].components;view.receive(older);assert.equal(car.tyreDamage,undefined);assert.equal(car.tireContacts[0].failure.value,0);
 }finally{cars.forEach(c=>c.dispose());authority.dispose();world.free();}
});

test('real sill strikes and subsequent tyre-damaged driving agree between rendered vehicles and authority',()=>{
 const humans=new Set([0,1,2,3,4,5,6,7]);
 for(const kind of ['coupe','tern','marten']as CarKind[]){
  const authority=new Simulation(R,'playground',Array(8).fill(kind)),terrain=new Simulation(R,'playground'),world=terrain.world,queue=new R.EventQueue(true),scene=new T.Scene(),car=new Vehicle(0,kind,0xffffff,scene,world,fx),judge=new ImpactAdjudicator();
  authority.phase='playing';authority.world.gravity=world.gravity=zero;authority.cars.slice(1).forEach(c=>c.body.setEnabled(false));terrain.cars.forEach(c=>c.body.setEnabled(false));
  const wheel=cornerPoint(car),a=authority.cars[0];
  for(const w of [world,authority.world])w.createCollider(R.ColliderDesc.cuboid(.12,.10,.12).setTranslation(-2,10-.33,wheel.z).setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(15000));
  let hits=0;
  const check=()=>{
   near(car.health,a.state.health,.0001);assert.ok(car.current.distanceTo(new T.Vector3().copy(a.state.p))<.0002,kind+' physical trajectories agree');
   car.tyreDamage!.forEach((n,i)=>near(n,a.state.components!.tyreDamage![i],1e-6));car.wreckParts.wheelDamage.forEach((n,i)=>near(n,a.state.components!.wheelDamage[i],1e-6));
   car.wreckParts.wheelShift.forEach((v,i)=>{near(v.x,a.state.components!.wheelShift[i].x,1e-6);near(v.z,a.state.components!.wheelShift[i].z,1e-6);});
   near(car.engineDamage!,a.state.components!.engineDamage!,1e-6);
  };
  const frame=()=>{
   const time=authority.elapsed+STEP;car.preStep(STEP);world.step(queue);car.postStep(STEP,time);
   const contacts:(ImpactContact&{point:T.Vector3;direction:T.Vector3})[]=[];
   queue.drainContactForceEvents(e=>{
    const h1=e.collider1(),h2=e.collider2(),resolved=vehicleContact(world,[car],h1,h2);if(!resolved.a&&!resolved.b||!judge.needsContact(resolved.key,time))return;
    const manifold=vehicleContactManifold(world,h1,h2);if(!manifold)return;
    const relative=car.velocity.clone().negate(),normal=new T.Vector3().copy(manifold.normal);
    contacts.push({key:resolved.key,point:new T.Vector3().copy(resolved.a?manifold.point1:manifold.point2),direction:relative.clone().normalize(),closing:Math.abs(relative.dot(normal)),impulse:e.totalForceMagnitude()*STEP,damageScale:car.specification.damageScale});
   });
   for(const {contact,damage}of judge.adjudicate(contacts,time))if(damage>0){car.hit(contact.point,contact.direction,damage,time,true);hits++;}
   authority.setInput(0,car.input);authority.step(humans);check();
  };
  try{
   for(let episode=0;episode<12&&car.health>0&&car.tyreDamage![0]<.92;episode++){
    pose(car,10);car.body.setLinvel({x:-40,y:0,z:0},true);a.body.setTranslation(car.body.translation(),true);a.body.setRotation(car.body.rotation(),true);a.body.setLinvel(car.body.linvel(),true);a.body.setAngvel(zero,true);Object.assign(a.state,{p:{...car.body.translation()},q:{...car.body.rotation()},v:{...car.body.linvel()},av:{...zero}});
    car.input={...NEUTRAL};for(let tick=0;tick<40;tick++)frame();
   }
   assert.ok(hits>2,kind+' fixture applies repeated real manifold strikes');assert.ok(car.health>0,kind+' flat is reached before destruction');assert.ok(car.tyreDamage![0]>=.92,kind+' real lower-sill contacts must reach failure');assert.deepEqual(car.tyreDamage!.slice(1),[0,0,0]);
   // Continue with the actual damaged state on an identical flat apron; no
   // synthetic tyre assignment or test-only authority damage handler is used.
   for(const w of [world,authority.world]){w.gravity={x:0,y:-9.81,z:0};w.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,8.5,0));}
   pose(car,10.1);a.body.setTranslation(car.body.translation(),true);a.body.setRotation(car.body.rotation(),true);a.body.setLinvel(zero,true);a.body.setAngvel(zero,true);Object.assign(a.state,{p:{...car.body.translation()},q:{...car.body.rotation()},v:{...zero},av:{...zero}});
   car.input={throttle:.6,steer:.12,brake:0,handbrake:false};for(let tick=0;tick<120;tick++)frame();
   assert.ok(car.current.z>2,kind+' damaged-state parity fixture actually drives');near(car.controller.wheelRadius(0)!,a.controller.wheelRadius(0)!,1e-7);
  }finally{car.dispose();queue.free();authority.dispose();terrain.dispose();}
 }
});
