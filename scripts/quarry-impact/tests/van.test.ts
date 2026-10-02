import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildVanAsset} from '../src/van-asset';
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
import {verifyCompactRevision} from './compact-invariants';

await R.init();
const original=GLTFLoader.prototype.loadAsync;
GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|wheel-machining)\.glb$/.exec(String(url))![1]);
try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}}as any;
const key=(p:T.Vector3)=>p.toArray().map(x=>x.toFixed(6)).join(',');
const shape=(c:Vehicle)=>({health:c.health,wheels:[...c.wreckParts.wheelDamage],panels:c.panels.map(p=>({name:p.name,visible:p.visible,positions:[...p.geometry.attributes.position.array]})),hinges:c.wreckParts.assemblies.flatMap(a=>a.members.map(m=>m.mesh.matrix.toArray()))});

test('the original van export is deterministic, closed and finite within the shared fleet geometry budget',()=>{
 const root=buildVanAsset(),bytes=encodeVehicleGlb(root,()=>{throw Error('No external textures');},{generator:'Quarry Impact original Rillford Carrier pressings',copyright:'Original Quarry Impact vehicle artwork, 2026'});
 assert.deepEqual(bytes,readFileSync(new URL('../public/models/van.glb',import.meta.url)));
 assert.deepEqual(bytes,readFileSync(new URL('../public/models/van-candidate.glb',import.meta.url)));
 let vertices=0;
 root.traverse(o=>{if(!(o instanceof T.Mesh))return;const p=o.geometry.attributes.position;vertices+=p.count;
  for(const a of Object.values(o.geometry.attributes))assert.ok([...a.array].every(Number.isFinite),o.name);
  for(let i=0;i<p.count;i+=3){const a=new T.Vector3().fromBufferAttribute(p,i),b=new T.Vector3().fromBufferAttribute(p,i+1),c=new T.Vector3().fromBufferAttribute(p,i+2);assert.ok(b.sub(a).cross(c.sub(a)).lengthSq()>1e-18,o.name+' degenerate triangle');}
 });
 assert.ok(vertices<65000,`Vertices ${vertices}`);
 for(const name of ['panel_hoodVan','panel_RoofVan','panel_CargoSideVanL','panel_CargoSideVanR','panel_CargoDoorVanLStamping','panel_CargoDoorVanRStamping','panel_BodyDoorLVanSkin','panel_FrontValanceVan']){
  const p=(root.getObjectByName(name)as T.Mesh).geometry.attributes.position,edges=new Map<string,number>();
  for(let i=0;i<p.count;i+=3)for(let j=0;j<3;j++){const edge=[key(new T.Vector3().fromBufferAttribute(p,i+j)),key(new T.Vector3().fromBufferAttribute(p,i+(j+1)%3))].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}
  assert.ok([...edges.values()].every(n=>n===2),name+' closed inner skin and perimeter');
 }
 for(const side of [-1,1])for(const z of [-1.35,1.35]){const hits=new T.Raycaster(new T.Vector3(side*1.3,.60,z),new T.Vector3(-side,0,0)).intersectObject(root,true);assert.ok(hits.length);assert.ok(hits[0].object.name.startsWith('Tire_'),'Wheel arch must expose the tyre');}
 assert.ok(root.getObjectByName('Interior Carrier cargo floor plank 4'));
});

test('the eighth vehicle preserves old garage saves and participates in tuning and mixed demos',()=>{
 assert.equal(CAR_KINDS.length,8);assert.ok(isCarKind('van'));assert.ok(templates.has('van'));
 const old=stockSetup('compact');old.engine=2;const saved=readGarage(JSON.stringify({version:1,cars:{compact:{setup:old}}}));
 assert.deepEqual(saved.cars.compact.setup,old);assert.deepEqual(saved.cars.van.setup,stockSetup('van'));
 const setup=stockSetup('van');setup.armor=2;setup.tune.differential=.5;
 assert.deepEqual(importSetup(exportSetup('van',setup),'van'),setup);assert.throws(()=>importSetup(exportSetup('van',setup),'utility'));
 assert.equal(demoCarKind(23,'van','selected'),'van');assert.deepEqual(new Set(Array.from({length:16},(_,i)=>demoCarKind(i,'van','mixed'))),new Set(CAR_KINDS));
 assert.deepEqual(classicEngineVoice('van'),{bank:'hatch',pitch:.86});
});

test('van suspension anchors match its wheels and the tall collision hull follows the sloped windscreen',()=>{
 const world=new R.World({x:0,y:0,z:0}),car=new Vehicle(0,'van',DEFINITIONS.van.color,new T.Scene(),world,fx);
 try{const a=classicWheelAnchors('van');assert.equal(-car.model.position.y,a.modelOffset);
  for(let i=0;i<4;i++){assert.deepEqual({...car.wheels[i].position},a.wheels[i]);const p=car.controller.wheelChassisConnectionPointCs(i)!;assert.ok(Math.abs(p.x-a.wheels[i].x)<1e-6&&Math.abs(p.z-a.wheels[i].z)<1e-6);assert.ok(Math.abs(car.controller.wheelRadius(i)!-.375)<1e-6);}
  assert.equal(car.glass.length,3);assert.ok(car.brakeLights.size>0);assert.ok(car.body.localCom().y>.14);
  car.body.setTranslation({x:0,y:0,z:0},true);world.step();
  const top=(z:number)=>car.roof.castRay(new R.Ray({x:0,y:3,z},{x:0,y:-1,z:0}),5,true);
  assert.ok(Math.abs(top(-1)-(3-(1.915-.8200195)))<.01,'Cargo shell has its actual tall roof');
  assert.ok(top(.90)>top(.60)+.4,'Windscreen collision slopes towards the hood');
  assert.ok(top(1.5)<0,'There is no phantom tall roof above the engine bay');
  car.repair();assert.equal(car.roof.isEnabled(),true);
 }finally{car.dispose();world.free();}
});

test('cargo door skins, handles and plate hinge together while the fixed rear lights and cargo floor stay in place',()=>{
 const world=new R.World({x:0,y:0,z:0}),car=new Vehicle(0,'van',DEFINITIONS.van.color,new T.Scene(),world,fx);
 try{const left=car.wreckParts.assemblies.find(a=>a.name==='cargo-left')!,right=car.wreckParts.assemblies.find(a=>a.name==='cargo-right')!;
  assert.ok(left&&right);assert.ok(right.members.some(m=>m.mesh.name==='panel_CargoDoorVanRPlate'));assert.ok(left.members.some(m=>m.mesh.name.endsWith('InnerSkin')));
  const fixedNames=['panel_RearQuarterVanBrake1','panel_RearCornerVan1','panel_inner_Interior Carrier Cargo Floor'];const fixed=fixedNames.map(n=>car.model.getObjectByName(n)!);assert.ok(fixed.every(Boolean));
  const fixedMatrices=fixed.map(o=>o.matrix.toArray()),rightRest=right.members.map(m=>m.mesh.matrix.toArray());
  car.wreckParts.hit(new T.Vector3(-.78,1.08,-2.24),new T.Vector3(0,0,1),30);car.wreckParts.poseAt(1,0);
  assert.ok(left.loose>0);assert.equal(right.loose,0);assert.deepEqual(right.members.map(m=>m.mesh.matrix.toArray()),rightRest);
  const delta=left.members[0].mesh.matrix.clone().multiply(left.members[0].matrix.clone().invert());
  const latch=new T.Vector3(-.02,1.08,-2.23);assert.ok(latch.clone().applyMatrix4(delta).z<latch.z-.05,'Left door opens out through the rear');
  for(const m of left.members){const d=m.mesh.matrix.clone().multiply(m.matrix.clone().invert());assert.ok(d.elements.every((x,i)=>Math.abs(x-delta.elements[i])<1e-6),m.mesh.name+' follows one hinge');}
  assert.deepEqual(fixed.map(o=>o.matrix.toArray()),fixedMatrices);car.repair();assert.equal(left.loose,0);assert.deepEqual(left.members.map(m=>m.mesh.matrix.toArray()),left.members.map(m=>m.matrix.toArray()));
 }finally{car.dispose();world.free();}
});

test('the heavier RWD van accelerates, turns, brakes and reverses with its own gearing',()=>{
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
 const spec=vehicleSpecification('van'),rig=createVehiclePhysics(R,world,'van',spec.mass),s={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt'as const,gear:1,rpm:850,input:{throttle:1,steer:0,brake:0,handbrake:false}};
 rig.body.setTranslation({x:0,y:.9,z:0},true);
 try{for(let i=0;i<600;i++){stepVehiclePhysics(rig.body,rig.controller,'van',spec,s,1/60);world.step();}assert.ok(s.speed>18&&s.speed<36);assert.equal(rig.controller.wheelEngineForce(0),0);assert.ok(rig.controller.wheelEngineForce(2)!>0);assert.ok(spec.mass>vehicleSpecification('compact').mass);assert.ok(spec.speedLimit<vehicleSpecification('compact').speedLimit);assert.ok(rig.body.translation().y>.5&&rig.body.translation().y<1);
  s.input.steer=.13;for(let i=0;i<60;i++){stepVehiclePhysics(rig.body,rig.controller,'van',spec,s,1/60);world.step();}assert.ok(Math.abs(rig.body.rotation().y)>.05);
  s.input.steer=0;s.input.throttle=0;s.input.brake=1;for(let i=0;i<600;i++){stepVehiclePhysics(rig.body,rig.controller,'van',spec,s,1/60);world.step();}assert.ok(Math.abs(s.speed)<1);
  s.input.throttle=-.7;s.input.brake=0;for(let i=0;i<120;i++){stepVehiclePhysics(rig.body,rig.controller,'van',spec,s,1/60);world.step();}assert.ok(s.speed< -3);assert.equal(s.gear,0);
 }finally{world.removeVehicleController(rig.controller);world.free();}
});

test('van dents and cargo hinges survive compressed replay, backwards seeks and repair',async()=>{
 const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0}),setup=stockSetup('van'),car=new Vehicle(0,'van',setup.paint,scene,world,fx,setup);car.place(2,4,.2);car.render(1);car.root.updateMatrixWorld(true);
 const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'van',setup}],props:0,created:'2026-10-01T21:00:00Z'});car.onVisualEvent=e=>recorder.event(0,.5,e);
 try{recorder.capture(0,()=>captureReplayFrame([car],[],[0]),true);const intact=shape(car);car.hit(new T.Vector3(0,1.05,-2.24).applyMatrix4(car.model.matrixWorld),new T.Vector3(0,0,1).applyQuaternion(car.root.quaternion),36,.5,true);car.wreckParts.poseAt(1,0);recorder.capture(1,()=>captureReplayFrame([car],[],[0]),true);const damaged=shape(car);assert.notDeepEqual(damaged,intact);assert.ok(car.wreckParts.assemblies.some(a=>a.name.startsWith('cargo-')&&a.loose>0));
  const doc=await readReplayFile(new File([await replayFile(recorder.document())],'carrier.qir')),replay=new ReplayScene(doc,scene,world,[]);
  try{replay.seek(1);assert.deepEqual(shape(replay.cars[0]),damaged);replay.seek(0);assert.deepEqual(shape(replay.cars[0]),intact);replay.seek(1);assert.deepEqual(shape(replay.cars[0]),damaged);}finally{replay.dispose();}
  car.repair();assert.deepEqual(shape(car),intact);
 }finally{car.dispose();world.free();}
});

test('the van integration preserves the preceding compact and historic revision layers',verifyCompactRevision);
