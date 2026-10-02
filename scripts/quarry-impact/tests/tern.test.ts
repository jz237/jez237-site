import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildTernAsset} from '../src/tern-asset';
import {encodeVehicleGlb} from '../tools/vehicle-glb';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars,templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {CAR_KINDS,DEFINITIONS,isCarKind} from '../src/rules';
import {classicWheelAnchors,classicEngineVoice} from '../src/classic-vehicle-specs';
import {stockSetup,readGarage,exportSetup,importSetup} from '../src/garage';
import {demoCarKind} from '../src/demo-session';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification} from '../src/vehicle-physics';
import {ReplayRecorder,replayFile,readReplayFile} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
import {verifyVanFinishRevision} from './van-finish-invariants';

await R.init();const original=GLTFLoader.prototype.loadAsync;
GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|wheel-machining)\.glb$/.exec(String(url))![1]);
try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}}as any;
const key=(p:T.Vector3)=>p.toArray().map(x=>x.toFixed(6)).join(',');
const shape=(c:Vehicle)=>({health:c.health,wheels:[...c.wreckParts.wheelDamage],panels:c.panels.map(p=>({name:p.name,visible:p.visible,positions:[...p.geometry.attributes.position.array]})),hinges:c.wreckParts.assemblies.flatMap(a=>a.members.map(m=>m.mesh.matrix.toArray()))});

test('the original hatchback export has closed skins, finite normals and clear wheel arches within the fleet budget',()=>{
 const root=buildTernAsset(),bytes=encodeVehicleGlb(root,()=>{throw Error('No external textures');},{generator:'Quarry Impact original Tern 1400 pressings',copyright:'Original Quarry Impact vehicle artwork, 2026'});
 assert.deepEqual(bytes,readFileSync(new URL('../public/models/tern.glb',import.meta.url)));assert.deepEqual(bytes,readFileSync(new URL('../public/models/tern-candidate.glb',import.meta.url)));
 let vertices=0;root.traverse(o=>{if(!(o instanceof T.Mesh))return;const p=o.geometry.attributes.position;vertices+=p.count;
  for(const a of Object.values(o.geometry.attributes))assert.ok([...a.array].every(Number.isFinite),o.name);
  for(let i=0;i<p.count;i+=3){const a=new T.Vector3().fromBufferAttribute(p,i),b=new T.Vector3().fromBufferAttribute(p,i+1),c=new T.Vector3().fromBufferAttribute(p,i+2);assert.ok(b.sub(a).cross(c.sub(a)).lengthSq()>1e-18,o.name+' nondegenerate');}
 });assert.ok(vertices<65000,`Vertices ${vertices}`);
 for(const name of ['panel_hoodTern','panel_RoofTern','panel_TailgateTernSkin','panel_BodyDoorLTern','panel_FrontValanceTern','panel_RearCornerTern1']){
  const p=(root.getObjectByName(name)as T.Mesh).geometry.attributes.position,edges=new Map<string,number>();
  for(let i=0;i<p.count;i+=3)for(let j=0;j<3;j++){const edge=[key(new T.Vector3().fromBufferAttribute(p,i+j)),key(new T.Vector3().fromBufferAttribute(p,i+(j+1)%3))].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}
  assert.ok([...edges.values()].every(n=>n===2),name+' has a closed inner skin and perimeter');
 }
 for(const side of [-1,1])for(const z of [-1.18,1.18]){const hits=new T.Raycaster(new T.Vector3(side*1.3,.57,z),new T.Vector3(-side,0,0)).intersectObject(root,true);assert.ok(hits.length);assert.ok(hits[0].object.name.startsWith('Tire_'),'Wheel arch exposes its tyre');}
 assert.ok(root.getObjectByName('Structure Tern transaxle'));assert.ok(root.getObjectByName('Structure Tern front halfshaft -1'));
});

test('the ninth vehicle preserves saved cars and participates in tuning and mixed/selected demos',()=>{
 assert.equal(CAR_KINDS.length,9);assert.ok(isCarKind('tern'));assert.ok(templates.has('tern'));
 const old=stockSetup('van');old.engine=2;const saved=readGarage(JSON.stringify({version:1,cars:{van:{setup:old}}}));assert.deepEqual(saved.cars.van.setup,old);assert.deepEqual(saved.cars.tern.setup,stockSetup('tern'));
 const setup=stockSetup('tern');setup.tune.differential=.7;setup.armor=1;assert.deepEqual(importSetup(exportSetup('tern',setup),'tern'),setup);assert.throws(()=>importSetup(exportSetup('tern',setup),'compact'));
 assert.equal(demoCarKind(23,'tern','selected'),'tern');assert.deepEqual(new Set(Array.from({length:24},(_,i)=>demoCarKind(i,'tern','mixed'))),new Set(CAR_KINDS));assert.deepEqual(classicEngineVoice('tern'),{bank:'hatch',pitch:1.04});
});


test('mixed demos keep the selected car first and avoid duplicates until the roster is exhausted',()=>{
 for(const selected of CAR_KINDS){const field=Array.from({length:CAR_KINDS.length},(_,i)=>demoCarKind(i,selected,'mixed'));assert.equal(field[0],selected);assert.equal(new Set(field.slice(0,8)).size,8);assert.deepEqual(new Set(field),new Set(CAR_KINDS));assert.equal(demoCarKind(CAR_KINDS.length,selected,'mixed'),selected);}
});

test('FWD suspension and collision geometry match the short wheelbase, raked hatch and forward mass distribution',()=>{
 const w=new R.World({x:0,y:0,z:0}),car=new Vehicle(0,'tern',DEFINITIONS.tern.color,new T.Scene(),w,fx);
 try{const anchors=classicWheelAnchors('tern');assert.equal(-car.model.position.y,anchors.modelOffset);assert.equal(car.glass.length,6);assert.ok(car.brakeLights.size>0);assert.ok(car.body.localCom().z>.15);
  for(let i=0;i<4;i++){assert.deepEqual({...car.wheels[i].position},anchors.wheels[i]);const p=car.controller.wheelChassisConnectionPointCs(i)!;assert.ok(Math.abs(p.x-anchors.wheels[i].x)<1e-6&&Math.abs(p.z-anchors.wheels[i].z)<1e-6);assert.ok(Math.abs(car.controller.wheelRadius(i)!-.32)<1e-6);}
  car.body.setTranslation({x:0,y:0,z:0},true);w.step();const top=(z:number)=>car.roof.castRay(new R.Ray({x:0,y:3,z},{x:0,y:-1,z:0}),5,true);
  assert.ok(Math.abs(top(0)-(3-(1.478-.8200195)))<.01);assert.ok(top(-1.55)>top(-1)+.25,'hatch slope');assert.ok(top(.50)>top(.10)+.25,'windscreen slope');assert.ok(top(1.2)<0,'no cabin collider over engine');
 }finally{car.dispose();w.free();}
});

test('the front axle drives forward and reverse while the rear handbrake remains independent',()=>{
 const w=new R.World({x:0,y:-9.81,z:0});w.timestep=1/60;w.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));const spec=vehicleSpecification('tern'),rig=createVehiclePhysics(R,w,'tern',spec.mass),s={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt'as const,gear:1,rpm:850,input:{throttle:1,steer:0,brake:0,handbrake:false}};rig.body.setTranslation({x:0,y:.9,z:0},true);
 try{for(let i=0;i<600;i++){stepVehiclePhysics(rig.body,rig.controller,'tern',spec,s,1/60);w.step();}assert.ok(s.speed>23&&s.speed<43,`FWD speed ${s.speed}`);assert.ok(rig.controller.wheelEngineForce(0)!>0);assert.equal(Math.abs(rig.controller.wheelEngineForce(2)!),0);
  s.input.steer=.13;for(let i=0;i<60;i++){stepVehiclePhysics(rig.body,rig.controller,'tern',spec,s,1/60);w.step();}assert.ok(Math.abs(rig.body.rotation().y)>.05);
  s.input.steer=0;s.input.throttle=0;s.input.brake=1;for(let i=0;i<600;i++){stepVehiclePhysics(rig.body,rig.controller,'tern',spec,s,1/60);w.step();}assert.ok(Math.abs(s.speed)<1);
  s.input.throttle=-.7;s.input.brake=0;for(let i=0;i<120;i++){stepVehiclePhysics(rig.body,rig.controller,'tern',spec,s,1/60);w.step();}assert.ok(s.speed< -3);assert.equal(s.gear,0);assert.ok(rig.controller.wheelEngineForce(0)!<0);assert.equal(Math.abs(rig.controller.wheelEngineForce(2)!),0);
  s.input.handbrake=true;stepVehiclePhysics(rig.body,rig.controller,'tern',spec,s,1/60);assert.equal(rig.controller.wheelBrake(0),0);assert.ok(rig.controller.wheelBrake(2)!>=100);
 }finally{w.removeVehicleController(rig.controller);w.free();}
});

test('hatch skin, rear glass, plate and wiper hinge together while rear lamps stay fixed',()=>{
 const w=new R.World({x:0,y:0,z:0}),car=new Vehicle(0,'tern',DEFINITIONS.tern.color,new T.Scene(),w,fx);
 try{const hatch=car.wreckParts.assemblies.find(a=>a.name==='tailgate')!;assert.ok(hatch);for(const name of ['panel_TailgateTernSkin','glass_TailgateTernRear','panel_TailgateTernPlate','panel_TailgateTernWiper'])assert.ok(hatch.members.some(m=>m.mesh.name===name),name);
  const fixed=car.model.getObjectByName('panel_TailLampTernBrake1')!,rest=fixed.matrix.toArray();car.wreckParts.hit(new T.Vector3(0,.85,-1.84),new T.Vector3(0,0,1),38);car.wreckParts.poseAt(1,0);assert.ok(hatch.loose>0);
  const delta=hatch.members[0].mesh.matrix.clone().multiply(hatch.members[0].matrix.clone().invert());for(const m of hatch.members){const d=m.mesh.matrix.clone().multiply(m.matrix.clone().invert());assert.ok(d.elements.every((x,i)=>Math.abs(x-delta.elements[i])<1e-6),m.mesh.name);}
  const latch=new T.Vector3(0,.60,-1.84);assert.ok(latch.clone().applyMatrix4(delta).z<latch.z-.04);assert.deepEqual(fixed.matrix.toArray(),rest);car.repair();assert.equal(hatch.loose,0);assert.deepEqual(hatch.members.map(m=>m.mesh.matrix.toArray()),hatch.members.map(m=>m.matrix.toArray()));
 }finally{car.dispose();w.free();}
});

test('front-drive hatchback damage, hinges and repair survive compressed replay and backwards seeks',async()=>{
 const scene=new T.Scene(),w=new R.World({x:0,y:-9.81,z:0}),setup=stockSetup('tern'),car=new Vehicle(0,'tern',setup.paint,scene,w,fx,setup);car.place(2,4,.2);car.render(1);car.root.updateMatrixWorld(true);
 const r=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'tern',setup}],props:0,created:'2026-10-02T05:00:00Z'});car.onVisualEvent=e=>r.event(0,.5,e);
 try{r.capture(0,()=>captureReplayFrame([car],[],[0]),true);const intact=shape(car);car.hit(new T.Vector3(0,.88,-1.84).applyMatrix4(car.model.matrixWorld),new T.Vector3(0,0,1).applyQuaternion(car.root.quaternion),36,.5,true);car.wreckParts.poseAt(1,0);r.capture(1,()=>captureReplayFrame([car],[],[0]),true);const damaged=shape(car);assert.notDeepEqual(damaged,intact);
  const doc=await readReplayFile(new File([await replayFile(r.document())],'tern.qir')),replay=new ReplayScene(doc,scene,w,[]);try{replay.seek(1);assert.deepEqual(shape(replay.cars[0]),damaged);replay.seek(0);assert.deepEqual(shape(replay.cars[0]),intact);replay.seek(1);assert.deepEqual(shape(replay.cars[0]),damaged);}finally{replay.dispose();}car.repair();assert.deepEqual(shape(car),intact);
 }finally{car.dispose();w.free();}
});

test('the Tern integration preserves the preceding van finish and historical revision layers',verifyVanFinishRevision);
