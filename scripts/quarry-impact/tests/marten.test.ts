import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildMartenAsset} from '../src/marten-asset';
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
import {verifyMartenRevision} from './marten-invariants';
import {fireProfile,unitNoise} from '../src/vehicle-fire-profile';
import {VehicleThermalState} from '../src/vehicle-thermal-state';
import {VehicleFire} from '../src/vehicle-fire';

await R.init();const original=GLTFLoader.prototype.loadAsync;
GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|buggy|wheel-machining)\.glb$/.exec(String(url))![1]);
try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}}as any;
const key=(p:T.Vector3)=>p.toArray().map(x=>x.toFixed(6)).join(',');
const shape=(c:Vehicle)=>({health:c.health,wheels:[...c.wreckParts.wheelDamage],panels:c.panels.map(p=>({name:p.name,visible:p.visible,positions:[...p.geometry.attributes.position.array]})),hinges:c.wreckParts.assemblies.flatMap(a=>a.members.map(m=>m.mesh.matrix.toArray()))});

test('the original rear-engine coupe export has closed skins, finite normals and clear wheel arches within the fleet budget',()=>{
 const root=buildMartenAsset(),bytes=encodeVehicleGlb(root,()=>{throw Error('No external textures');},{generator:'Quarry Impact original Marten 1600 rear-engine coupe',copyright:'Original Quarry Impact vehicle artwork, 2026'});
 assert.deepEqual(bytes,readFileSync(new URL('../public/models/marten.glb',import.meta.url)));assert.deepEqual(bytes,readFileSync(new URL('../public/models/marten-candidate.glb',import.meta.url)));
 let vertices=0;root.traverse(o=>{if(!(o instanceof T.Mesh))return;const p=o.geometry.attributes.position;vertices+=p.count;
  for(const a of Object.values(o.geometry.attributes))assert.ok([...a.array].every(Number.isFinite),o.name);
  for(let i=0;i<p.count;i+=3){const a=new T.Vector3().fromBufferAttribute(p,i),b=new T.Vector3().fromBufferAttribute(p,i+1),c=new T.Vector3().fromBufferAttribute(p,i+2);assert.ok(b.sub(a).cross(c.sub(a)).lengthSq()>1e-18,o.name+' nondegenerate');}
 });// Reviewed wheel pressings and sill clearance use a 89,000 vertex cap;
 // the prior 65k cap remains frozen in the classic-wheel layer.
 assert.ok(vertices<89000,`Vertices ${vertices}`);
 for(const name of ['panel_hoodMarten','panel_RoofMarten','panel_EngineLidMarten','panel_BodyDoorLMarten','panel_FrontValanceMarten','panel_RearValanceMarten']){
  const p=(root.getObjectByName(name)as T.Mesh).geometry.attributes.position,edges=new Map<string,number>();
  for(let i=0;i<p.count;i+=3)for(let j=0;j<3;j++){const edge=[key(new T.Vector3().fromBufferAttribute(p,i+j)),key(new T.Vector3().fromBufferAttribute(p,i+(j+1)%3))].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}
  assert.ok([...edges.values()].every(n=>n===2),name+' has a closed inner skin and perimeter');
 }
 for(const side of [-1,1])for(const z of [-1.14,1.14]){const hits=new T.Raycaster(new T.Vector3(side*1.3,.57,z),new T.Vector3(-side,0,0)).intersectObject(root,true);assert.ok(hits.length);assert.ok(hits[0].object.name.startsWith('Tire_'),'Wheel arch exposes its tyre');}
 assert.ok(root.getObjectByName('Structure Marten transaxle'));assert.ok(root.getObjectByName('Structure Marten rear halfshaft -1'));
});

test('the tenth vehicle preserves saved cars and participates in tuning and mixed/selected demos',()=>{
 assert.equal(CAR_KINDS.length,11);assert.ok(isCarKind('marten'));assert.ok(templates.has('marten'));
 const old=stockSetup('van');old.engine=2;const saved=readGarage(JSON.stringify({version:1,cars:{van:{setup:old}}}));assert.deepEqual(saved.cars.van.setup,old);assert.deepEqual(saved.cars.marten.setup,stockSetup('marten'));
 const setup=stockSetup('marten');setup.tune.differential=.7;setup.armor=1;assert.deepEqual(importSetup(exportSetup('marten',setup),'marten'),setup);assert.throws(()=>importSetup(exportSetup('marten',setup),'compact'));
 assert.equal(demoCarKind(23,'marten','selected'),'marten');assert.deepEqual(new Set(Array.from({length:24},(_,i)=>demoCarKind(i,'marten','mixed'))),new Set(CAR_KINDS));assert.deepEqual(classicEngineVoice('marten'),{bank:'hatch',pitch:.94});
});


test('mixed demos keep the selected car first and avoid duplicates until the roster is exhausted',()=>{
 for(const selected of CAR_KINDS){const field=Array.from({length:CAR_KINDS.length},(_,i)=>demoCarKind(i,selected,'mixed'));assert.equal(field[0],selected);assert.equal(new Set(field.slice(0,8)).size,8);assert.deepEqual(new Set(field),new Set(CAR_KINDS));assert.equal(demoCarKind(CAR_KINDS.length,selected,'mixed'),selected);}
});

test('rear-engine mass and collision geometry match the short wheelbase and sloped cabin',()=>{
 const w=new R.World({x:0,y:0,z:0}),car=new Vehicle(0,'marten',DEFINITIONS.marten.color,new T.Scene(),w,fx);
 try{const anchors=classicWheelAnchors('marten');assert.equal(-car.model.position.y,anchors.modelOffset);assert.equal(car.glass.length,6);assert.ok(car.brakeLights.size>0);assert.ok(car.body.localCom().z<-.21);
  for(let i=0;i<4;i++){assert.deepEqual({...car.wheels[i].position},anchors.wheels[i]);const p=car.controller.wheelChassisConnectionPointCs(i)!;assert.ok(Math.abs(p.x-anchors.wheels[i].x)<1e-6&&Math.abs(p.z-anchors.wheels[i].z)<1e-6);assert.ok(Math.abs(car.controller.wheelRadius(i)!-.32)<1e-6);}
  car.body.setTranslation({x:0,y:0,z:0},true);w.step();const top=(z:number)=>car.roof.castRay(new R.Ray({x:0,y:3,z},{x:0,y:-1,z:0}),5,true);
  assert.ok(Math.abs(top(0)-(3-(1.478-.8200195)))<.01);assert.ok(top(-1.2)>top(-.70)+.25,'rear window slope');assert.ok(top(.50)>top(.10)+.25,'windscreen slope');assert.ok(top(1.2)<0,'no cabin collider over front luggage bay');
 }finally{car.dispose();w.free();}
});

test('the rear axle drives forward and reverse with independent front braking',()=>{
 const w=new R.World({x:0,y:-9.81,z:0});w.timestep=1/60;w.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));const spec=vehicleSpecification('marten'),rig=createVehiclePhysics(R,w,'marten',spec.mass),s={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt'as const,gear:1,rpm:850,input:{throttle:1,steer:0,brake:0,handbrake:false}};rig.body.setTranslation({x:0,y:.9,z:0},true);
 try{for(let i=0;i<600;i++){stepVehiclePhysics(rig.body,rig.controller,'marten',spec,s,1/60);w.step();}assert.ok(s.speed>23&&s.speed<43,`RWD speed ${s.speed}`);assert.ok(rig.controller.wheelEngineForce(2)!>0);assert.equal(Math.abs(rig.controller.wheelEngineForce(0)!),0);
  s.input.steer=.13;for(let i=0;i<60;i++){stepVehiclePhysics(rig.body,rig.controller,'marten',spec,s,1/60);w.step();}assert.ok(Math.abs(rig.body.rotation().y)>.05);
  s.input.steer=0;s.input.throttle=0;s.input.brake=1;for(let i=0;i<600;i++){stepVehiclePhysics(rig.body,rig.controller,'marten',spec,s,1/60);w.step();}assert.ok(Math.abs(s.speed)<1);
  s.input.throttle=-.7;s.input.brake=0;for(let i=0;i<120;i++){stepVehiclePhysics(rig.body,rig.controller,'marten',spec,s,1/60);w.step();}assert.ok(s.speed< -3);assert.equal(s.gear,0);assert.ok(rig.controller.wheelEngineForce(2)!<0);assert.equal(Math.abs(rig.controller.wheelEngineForce(0)!),0);
  s.input.handbrake=true;stepVehiclePhysics(rig.body,rig.controller,'marten',spec,s,1/60);assert.equal(rig.controller.wheelBrake(0),0);assert.ok(rig.controller.wheelBrake(2)!>=100);
 }finally{w.removeVehicleController(rig.controller);w.free();}
});

test('rear engine lid and front luggage bonnet hinge independently, leaving glass and lamps fixed',()=>{
 const w=new R.World({x:0,y:0,z:0}),car=new Vehicle(0,'marten',DEFINITIONS.marten.color,new T.Scene(),w,fx);
 try{const lid=car.wreckParts.assemblies.find(a=>a.name==='engine-lid')!,bonnet=car.wreckParts.assemblies.find(a=>a.name==='hood')!;assert.ok(lid&&bonnet);assert.equal(lid.members.length,16);assert.ok(lid.members.every(m=>m.mesh.name.startsWith('panel_EngineLidMarten')));
  const fixed=['glass_RearMarten','panel_RearLampMartenBrake1'].map(n=>car.model.getObjectByName(n)!);const rest=fixed.map(m=>m.matrix.toArray());
  car.wreckParts.hit(new T.Vector3(0,.85,-1.84),new T.Vector3(0,0,1),38);car.wreckParts.poseAt(1,0);assert.ok(lid.loose>0);assert.equal(bonnet.loose,0);
  const delta=lid.members[0].mesh.matrix.clone().multiply(lid.members[0].matrix.clone().invert());for(const m of lid.members){const d=m.mesh.matrix.clone().multiply(m.matrix.clone().invert());assert.ok(d.elements.every((x,i)=>Math.abs(x-delta.elements[i])<1e-6),m.mesh.name);}
  const latch=new T.Vector3(0,.88,-1.84);assert.ok(latch.clone().applyMatrix4(delta).y>latch.y+.05);assert.deepEqual(fixed.map(m=>m.matrix.toArray()),rest);
  car.repair();assert.equal(lid.loose,0);assert.deepEqual(lid.members.map(m=>m.mesh.matrix.toArray()),lid.members.map(m=>m.matrix.toArray()));
  car.wreckParts.hit(new T.Vector3(0,.90,1.84),new T.Vector3(0,0,-1),38);assert.ok(bonnet.loose>0);assert.equal(lid.loose,0);assert.deepEqual(fixed.map(m=>m.matrix.toArray()),rest);
 }finally{car.dispose();w.free();}
});

test('rear-engine coupe damage, hinges and repair survive compressed replay and backwards seeks',async()=>{
 const scene=new T.Scene(),w=new R.World({x:0,y:-9.81,z:0}),setup=stockSetup('marten'),car=new Vehicle(0,'marten',setup.paint,scene,w,fx,setup);car.place(2,4,.2);car.render(1);car.root.updateMatrixWorld(true);
 const r=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'marten',setup}],props:0,created:'2026-10-02T05:00:00Z'});car.onVisualEvent=e=>r.event(0,.5,e);
 try{r.capture(0,()=>captureReplayFrame([car],[],[0]),true);const intact=shape(car);car.hit(new T.Vector3(0,.88,-1.84).applyMatrix4(car.model.matrixWorld),new T.Vector3(0,0,1).applyQuaternion(car.root.quaternion),36,.5,true);car.wreckParts.poseAt(1,0);r.capture(1,()=>captureReplayFrame([car],[],[0]),true);const damaged=shape(car);assert.notDeepEqual(damaged,intact);
  const doc=await readReplayFile(new File([await replayFile(r.document())],'marten.qir')),replay=new ReplayScene(doc,scene,w,[]);try{replay.seek(1);assert.deepEqual(shape(replay.cars[0]),damaged);replay.seek(0);assert.deepEqual(shape(replay.cars[0]),intact);replay.seek(1);assert.deepEqual(shape(replay.cars[0]),damaged);}finally{replay.dispose();}car.repair();assert.deepEqual(shape(car),intact);
 }finally{car.dispose();w.free();}
});

test('the Marten integration preserves all nine earlier cars and historical revision layers',verifyMartenRevision);


test('engine components fit below the rear lid, with a spare and fuel tank in the front luggage bay',()=>{
 const root=buildMartenAsset(),lid=root.getObjectByName('panel_EngineLidMarten')!,parts:T.Mesh[]=[];root.traverse(o=>{if(o instanceof T.Mesh&&o.name.startsWith('Structure engine'))parts.push(o);});assert.ok(parts.length>15);
 for(const part of parts){const box=new T.Box3().setFromObject(part);assert.ok(box.max.z< -1.2,part.name+' remains behind the cabin');const centre=box.getCenter(new T.Vector3()),hits=new T.Raycaster(new T.Vector3(centre.x,2,centre.z),new T.Vector3(0,-1,0)).intersectObject(lid);assert.ok(hits.length,part.name+' below engine lid');assert.ok(box.max.y<hits[0].point.y-.008,part.name+' clearance');}
 for(const name of ['Structure Marten luggage tray','Structure Marten spare tyre','Structure Marten front fuel tank'])assert.ok(new T.Box3().setFromObject(root.getObjectByName(name)!).min.z>.65);
 const valance=root.getObjectByName('panel_FrontValanceMarten')!;for(const x of [-.51,.51])assert.equal(new T.Raycaster(new T.Vector3(x,.704,2.5),new T.Vector3(0,0,-1)).intersectObject(valance).length,0,'headlight aperture is genuinely open');
});

test('rear-engine damage ignites at the rear and the air-cooled engine emits no radiator steam',()=>{
 const profile=fireProfile('marten',.2);assert.equal(profile.engineZone,'rear');assert.equal(profile.fuelZone,'front');assert.equal(profile.waterCooled,false);
 for(const site of profile.sites.filter(s=>s.name.startsWith('engine-'))){assert.equal(site.zone,'rear');assert.ok(site.z< -1.3&&site.z> -1.85);}
 assert.ok(profile.sites.find(s=>s.name==='front-leak')!.z>1);
 const seed=Array.from({length:512},(_,i)=>i/512).find(s=>unitNoise(s)<.24)!;
 const rearOnly={front:0,rear:32,left:0,right:0,roof:0},marten=new VehicleThermalState(100,seed),old=new VehicleThermalState(100,seed);
 for(let i=0;i<1200;i++){marten.advance(12,1/60,0,rearOnly,'rear',false);old.advance(12,1/60,0,rearOnly);}
 assert.ok(marten.burning);assert.equal(old.burning,false);
 const moderate={...rearOnly,rear:15,front:15},air=new VehicleThermalState(),water=new VehicleThermalState();for(let i=0;i<600;i++){air.advance(40,1/60,0,moderate,'rear',false);water.advance(40,1/60,0,moderate);}
 assert.equal(air.smoke,0);assert.ok(water.smoke>.15);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(),fire=new VehicleFire(scene,()=>{}),c={id:0,kind:'marten',health:100,root:new T.Group(),velocity:new T.Vector3(),damageZones:rearOnly}as unknown as Vehicle;c.root.position.set(4,1,3);c.root.rotation.set(.4,.6,Math.PI);
 try{fire.update([c],1/60,camera);const e=fire.emitters.get(0)!,site=e.profile.sites.reduce((a,b)=>a.base>b.base?a:b);assert.ok(site.name.startsWith('engine-'));const expected=new T.Vector3(site.x,site.y,site.z).applyQuaternion(c.root.quaternion).add(c.root.position);assert.ok(e.origin.distanceTo(expected)<1e-8,'plume stays on the rear engine when overturned');}finally{fire.dispose();}
 const w=new R.World({x:0,y:0,z:0}),car=new Vehicle(0,'marten',DEFINITIONS.marten.color,new T.Scene(),w,fx);try{assert.deepEqual(car.wreckFinish.bay.value.toArray(),[0,.84,-1.56]);}finally{car.dispose();w.free();}
});
