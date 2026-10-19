import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {CAR_KINDS,DEFINITIONS} from '../src/rules';
import {classicWheelAnchors,isRearEngineKind,isFrontDriveKind,vehicleWheelRadius} from '../src/classic-vehicle-specs';
import {stockSetup,exportSetup,importSetup} from '../src/garage';
import {clubRoster,createClubCup,readClubCup} from '../src/club-cup';
import {buildFernleighAsset} from '../src/fernleigh-asset';
import {encodeVehicleGlb} from '../tools/vehicle-glb';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
import {vehicleDrivetrain,vehicleWeightClass,gridPool} from '../src/grid-rules';
import {validOnlineCar,onlineCarChoices,ONLINE_CARS,KITE_ONLINE_CARS,MORROW_ONLINE_CARS,ALDER_ONLINE_CARS} from '../src/online-roster';
import {CHALLENGES,challengeCourse} from '../src/challenges';import {CAREER_GROUPS} from '../src/career';
await R.init();
const loader=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=loader;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const shape=(c:Vehicle)=>c.panels.map(p=>({name:p.name,visible:p.visible,hash:createHash('sha256').update(new Uint8Array(p.geometry.attributes.position.array.buffer)).digest('hex')}));
const encode=()=>encodeVehicleGlb(buildFernleighAsset(),()=>{throw Error('Unexpected external texture')},{generator:'Quarry Impact original Fernleigh MPV',copyright:'Original Quarry Impact vehicle artwork, 2026'});

test('people-carrier shell has bounded finite geometry, a large glasshouse, a sliding left door on its rail, roof rails, wraparound lamps and wheel trims',()=>{
 const root=buildFernleighAsset(),bounds=new T.Box3().setFromObject(root);let vertices=0;
 root.traverse(o=>{if(!(o instanceof T.Mesh))return;assert.equal(o.geometry.index,null,o.name+' is exported non-indexed');const p=o.geometry.attributes.position;vertices+=p.count;for(const x of p.array)assert.ok(Number.isFinite(x));});
 assert.ok(vertices<118000);assert.ok(bounds.min.y>=0&&bounds.max.y<1.74&&bounds.max.y>1.66,'about 1.70 m tall over the roof rails');assert.ok(bounds.min.z>-2.42&&bounds.max.z<2.42&&bounds.max.z-bounds.min.z>4.65,'about 4.7 m long');assert.ok(bounds.min.x>-1.06&&bounds.max.x<1.06);
 for(const side of ['L','R'])for(const name of ['glass_BodyDoor'+side+'Fernleigh','glass_Quarter'+side+'FernleighFront','glass_Rear'+side+'Fernleigh','panel_BodyDoor'+side+'Fernleigh','panel_FernleighRoofRail'+side,'panel_FernleighRearLamp'+side+'Tail','panel_FernleighDPillar'+side,'panel_FernleighBPillar'+side])assert.ok(root.getObjectByName(name),name);
 for(const name of ['glass_BodyDoorRearLFernleigh','panel_BodyDoorRearLFernleigh','panel_BodyDoorRearLFernleighRunner','panel_FernleighSlideRailL','glass_MidRFernleigh'])assert.ok(root.getObjectByName(name),name);
 assert.equal(root.getObjectByName('panel_BodyDoorRearRFernleigh'),undefined,'only the left side has a sliding door');
 for(const name of ['glass_FrontFernleigh','glass_TailgateFernleigh','panel_TailgateFernleigh','panel_TailgateFernleighHandle','panel_hoodFernleigh','panel_RoofFernleigh','panel_bumper_frontFernleigh','panel_bumper_frontFernleighStrip','panel_bumper_rearFernleigh','Structure Fernleigh transverse four','Interior Fernleigh RearBench'])assert.ok(root.getObjectByName(name),name);
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){
  const wheel=root.getObjectByName('wheel_'+name)!;assert.equal(wheel.position.x,(i%2?1:-1)*.78);assert.equal(wheel.position.y,.36);assert.equal(wheel.position.z,(i<2?1:-1)*1.425);assert.equal(wheel.scale.x,.34/.32);
  const b=new T.Box3().setFromObject(wheel);assert.ok(b.min.y>=0);assert.ok(b.max.y<.76);assert.ok(Math.abs((b.max.y-b.min.y)/2-vehicleWheelRadius('fernleigh'))<.002);
  // The plastic trim sits on the outer face, inside the rim's metal radius.
  const trim=root.getObjectByName('Wheel Fernleigh trim '+name) as T.Mesh;assert.ok(trim&&trim.parent===wheel);const p=trim.geometry.attributes.position,q=new T.Vector3();let r=0,out=0;for(let k=0;k<p.count;k++){q.fromBufferAttribute(p,k).applyMatrix4(trim.matrix);r=Math.max(r,Math.hypot(q.y,q.z));out=Math.max(out,q.x*(i%2?1:-1));}assert.ok(r<.19&&out>.08&&out<.105,`${name} trim ${r} ${out}`);
 }
});
test('people carrier exports a self-contained repeatable GLB matching the published model',()=>{
 const a=encode(),b=encode();assert.deepEqual(a,b);const data=new DataView(a.buffer,a.byteOffset,a.byteLength);assert.equal(data.getUint32(0,true),0x46546c67);
 const json=JSON.parse(new TextDecoder().decode(a.subarray(20,20+data.getUint32(12,true))));assert.equal(json.buffers[0].uri,undefined);assert.ok(json.nodes.some((n:any)=>n.name==='FernleighMPV'));assert.ok(a.length<4_000_000);
 assert.equal(createHash('sha256').update(a).digest('hex'),createHash('sha256').update(readFileSync(new URL('../public/models/fernleigh.glb',import.meta.url))).digest('hex'));
});
test('fernleigh has a distinct chassis, two front doors and a detachable sliding door, a hinged tailgate, aligned wheels, and damage that fully repairs',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),c=new Vehicle(0,'fernleigh',DEFINITIONS.fernleigh.color,scene,world,fx);
 try{
  assert.ok(CAR_KINDS.length>=24&&CAR_KINDS.includes('fernleigh'));assert.ok(Math.abs(c.body.mass()-1550)<1);assert.ok(c.glass.length>=10);assert.ok(c.panels.length>25);
  assert.deepEqual(c.wreckParts.assemblies.filter(a=>a.name.startsWith('door-')).map(a=>a.name).sort(),['door-left','door-rear-left','door-right']);
  const slider=c.wreckParts.assemblies.find(a=>a.name==='door-rear-left')!;for(const name of ['panel_BodyDoorRearLFernleigh','glass_BodyDoorRearLFernleigh','panel_BodyDoorRearLFernleighHandle','panel_BodyDoorRearLFernleighRunner'])assert.ok(slider.members.some(m=>m.mesh.name===name),name);assert.ok(slider.members.every(m=>!m.mesh.name.includes('SlideRail')),'the rail stays on the body');
  const gate=c.wreckParts.assemblies.find(a=>a.name==='tailgate');assert.ok(gate);for(const name of ['panel_TailgateFernleigh','glass_TailgateFernleigh','panel_TailgateFernleighHandle','panel_TailgateFernleighPlate','panel_TailgateFernleighSpoiler'])assert.ok(gate.members.some(m=>m.mesh.name===name),name);assert.ok(gate.members.every(m=>!m.mesh.name.includes('RearLamp')&&!m.mesh.name.includes('DPillar')));
  const anchors=classicWheelAnchors('fernleigh');assert.equal(-c.model.position.y,anchors.modelOffset);for(let i=0;i<4;i++){assert.equal(c.wheels[i].position.x,anchors.wheels[i].x);assert.equal(c.wheels[i].position.z,anchors.wheels[i].z);assert.ok(Math.abs(c.controller.wheelRadius(i)!-.34)<1e-6);}
  c.root.updateMatrixWorld(true);const clean=shape(c),mass=c.body.mass();
  assert.ok(c.scar(new T.Vector3(.92,.1,0),new T.Vector3(-1,0,0),.5,1));assert.notDeepEqual(shape(c),clean,'Light contact changes actual geometry');c.repair();assert.deepEqual(shape(c),clean);
  c.hit(new T.Vector3(.2,0,2.35),new T.Vector3(0,0,-1),35,2,true);assert.ok(c.health<100);assert.notDeepEqual(shape(c),clean);assert.ok(Math.abs(c.body.mass()-mass)<1);c.repair();assert.deepEqual(shape(c),clean);assert.equal(c.health,100);
 }finally{c.dispose();world.free();}
});
test('fernleigh drives the front wheels from a transverse four, is a modest middleweight, stays offline-only, and garage/cup saves round-trip',()=>{
 const w=new R.World({x:0,y:-9.81,z:0});w.timestep=1/60;w.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));
 const spec=vehicleSpecification('fernleigh'),{body,controller}=createVehiclePhysics(R,w,'fernleigh',spec.mass),s:PhysicsState={health:100,damageLeft:0,damageRight:0,speed:0,slip:0,steering:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false}};
 try{body.setTranslation({x:0,y:1,z:0},true);for(let i=0;i<120;i++){stepVehiclePhysics(body,controller,'fernleigh',spec,s,1/60);w.step();}s.input.throttle=1;stepVehiclePhysics(body,controller,'fernleigh',spec,s,1/60);w.step();
  assert.ok(controller.wheelEngineForce(0)!>0&&controller.wheelEngineForce(1)!>0);assert.equal(controller.wheelEngineForce(2),0);assert.equal(controller.wheelEngineForce(3),0);assert.ok(body.localCom().z>0,'front-drive mass sits ahead of the axle midpoint');
 }finally{w.free();}
 assert.equal(vehicleDrivetrain('fernleigh'),'FWD');assert.ok(isFrontDriveKind('fernleigh')&&!isRearEngineKind('fernleigh'));assert.equal(vehicleWeightClass('fernleigh'),'Middle');
 for(const kind of ['fernleigh','tern','kite']as const)assert.ok(gridPool('fernleigh','fwd').includes(kind));assert.ok(gridPool('fernleigh','european').includes('fernleigh'));
 const d=DEFINITIONS;assert.ok(d.fernleigh.mass>d.alder.mass&&d.fernleigh.mass<d.ravenhill.mass);assert.ok(d.fernleigh.force/d.fernleigh.mass<Math.min(d.tern.force/d.tern.mass,d.kite.force/d.kite.mass),'modest power for its weight');
 assert.ok(vehicleSpecification('fernleigh').speedLimit<=vehicleSpecification('tern').speedLimit);
 assert.equal(validOnlineCar('fernleigh'),false);for(const list of [ONLINE_CARS,KITE_ONLINE_CARS,MORROW_ONLINE_CARS,ALDER_ONLINE_CARS])assert.ok(!list.includes('fernleigh'));
 assert.ok(!onlineCarChoices({rosterSupport:true,kiteSupport:true,morrowSupport:true,alderSupport:true}).includes('fernleigh'));assert.ok(validOnlineCar('alder'));
 for(const kind of CAR_KINDS.filter(k=>k!=='fernleigh'))for(const field of [2,11,24]){const roster=clubRoster(kind,'mixed',field);assert.ok(roster.every(c=>c.kind!=='fernleigh'),'Existing saved rosters stay stable');}
 const cup=createClubCup('fernleigh','12345678-1234-4234-8234-123456789abc',1000);assert.equal(readClubCup(JSON.stringify(cup))?.roster[0].kind,'fernleigh');
 const setup=stockSetup('fernleigh');setup.engine=2;setup.armor=2;assert.deepEqual(importSetup(exportSetup('fernleigh',setup),'fernleigh'),setup);
});
test('school-run career is an appended racing group of three fernleigh races on fresh circuits with AI-lap medal tiers',()=>{
 const group=CAREER_GROUPS.find(g=>g.id==='school-run')!;assert.equal(group.discipline,'racing');assert.equal(group.events.length,3);// Appended after every group and challenge that existed when it shipped (later cars append after it).
 const g=CAREER_GROUPS.indexOf(group),c0=CHALLENGES.findIndex(c=>c.id===group.events[0]);assert.equal(CAREER_GROUPS[g-1].id,'last-rites','appended after every existing group');
 assert.deepEqual(CHALLENGES.slice(c0-1,c0+3).map(c=>c.id),['ravenhill-wrenford',...group.events],'challenges appended after every existing challenge');
 const events=group.events.map(id=>CHALLENGES.find(c=>c.id===id)!);assert.ok(events.every(c=>c&&c.car==='fernleigh'&&c.mode==='race'&&c.metric==='time'));
 const courses=events.map(challengeCourse);assert.deepEqual(courses,['holloway-stadium-v1','bramblebrook-reservoir-v1','saltmarsh-port-v1']);
 assert.ok(CHALLENGES.slice(0,c0).every(c=>c.mode==='derby'||!courses.includes(challengeCourse(c))),'circuits not used by any earlier challenge');
 assert.deepEqual(events.map(c=>c.direction??'forward'),['forward','reverse','forward']);assert.deepEqual(events.map(c=>c.laps),[1,1,2]);
 // Bronze/silver/gold = 2.934/2.121/1.616 x the solo AI time, the Linnet's ratios.
 for(const c of events){assert.equal(c.limit,c.medals[0]);assert.ok(c.medals[0]>c.medals[1]&&c.medals[1]>c.medals[2]);assert.ok(Math.abs(c.medals[0]/c.medals[2]-2.934/1.616)<.03&&Math.abs(c.medals[1]/c.medals[2]-2.121/1.616)<.03,c.id);}
});
