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
import {classicWheelAnchors,isRearEngineKind,vehicleWheelRadius} from '../src/classic-vehicle-specs';
import {isArenaId} from '../src/arena-id';
import {stockSetup,exportSetup,importSetup} from '../src/garage';
import {clubRoster,createClubCup,readClubCup} from '../src/club-cup';
import {buildRavenhillAsset} from '../src/ravenhill-asset';
import {encodeVehicleGlb} from '../tools/vehicle-glb';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
import {vehicleDrivetrain,gridPool} from '../src/grid-rules';
import {validOnlineCar,onlineCarChoices,ONLINE_CARS,KITE_ONLINE_CARS,MORROW_ONLINE_CARS,ALDER_ONLINE_CARS} from '../src/online-roster';
import {CHALLENGES,challengeCourse,challengeVenueName} from '../src/challenges';import {CAREER_GROUPS} from '../src/career';
await R.init();
const loader=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=loader;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const shape=(c:Vehicle)=>c.panels.map(p=>({name:p.name,visible:p.visible,hash:createHash('sha256').update(new Uint8Array(p.geometry.attributes.position.array.buffer)).digest('hex')}));
const encode=()=>encodeVehicleGlb(buildRavenhillAsset(),()=>{throw Error('Unexpected external texture')},{generator:'Quarry Impact original Ravenhill Hearse',copyright:'Original Quarry Impact vehicle artwork, 2026'});

test('funeral coach shell has bounded finite geometry, door and coach glass with drapes, landau bars, fins, a tailgate and wheel clearance',()=>{
 const root=buildRavenhillAsset(),bounds=new T.Box3().setFromObject(root);let vertices=0;
 root.traverse(o=>{if(!(o instanceof T.Mesh))return;assert.equal(o.geometry.index,null,o.name+' is exported non-indexed');const p=o.geometry.attributes.position;vertices+=p.count;for(const x of p.array)assert.ok(Number.isFinite(x));});
 assert.ok(vertices<118000);assert.ok(bounds.min.y>=0&&bounds.max.y<1.6&&bounds.max.y>1.5,'about 1.55 m tall');assert.ok(bounds.min.z>-3.05&&bounds.max.z<3.05&&bounds.max.z-bounds.min.z>5.9,'about 6 m long');assert.ok(bounds.min.x>-1.12&&bounds.max.x<1.12);
 for(const side of ['L','R'])for(const name of ['glass_BodyDoor'+side+'Ravenhill','glass_Coach'+side+'Ravenhill','Interior Ravenhill Curtain'+side+'0','Interior Ravenhill Curtain'+side+'1','Interior Ravenhill Valance'+side,'panel_RearQuarter'+side+'RavenhillLandau','panel_RavenhillLandauBar'+side,'panel_RavenhillFin'+side,'panel_RavenhillRearLamp'+side])assert.ok(root.getObjectByName(name),name);
 for(const name of ['glass_FrontRavenhill','glass_TailgateRavenhill','panel_TailgateRavenhill','panel_TailgateRavenhillHandle','panel_hoodRavenhill','panel_RoofRavenhill','panel_RavenhillGrilleBars','panel_bumper_frontRavenhill','panel_bumper_rearRavenhill','Structure Ravenhill V8 block','Interior Ravenhill CasketDeck','Tyre Ravenhill whitewall FL','Tyre Ravenhill whitewall RR'])assert.ok(root.getObjectByName(name),name);
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){const wheel=root.getObjectByName('wheel_'+name)!;assert.equal(wheel.position.x,(i%2?1:-1)*.80);assert.equal(wheel.position.y,.39);assert.equal(wheel.position.z,(i<2?1:-1)*1.8);assert.equal(wheel.scale.x,.38/.32);const b=new T.Box3().setFromObject(wheel);assert.ok(b.min.y>=0);assert.ok(b.max.y<.82);assert.ok(Math.abs((b.max.y-b.min.y)/2-vehicleWheelRadius('ravenhill'))<.002);}
});
test('funeral coach exports a self-contained repeatable GLB matching the published model',()=>{
 const a=encode(),b=encode();assert.deepEqual(a,b);const data=new DataView(a.buffer,a.byteOffset,a.byteLength);assert.equal(data.getUint32(0,true),0x46546c67);
 const json=JSON.parse(new TextDecoder().decode(a.subarray(20,20+data.getUint32(12,true))));assert.equal(json.buffers[0].uri,undefined);assert.ok(json.nodes.some((n:any)=>n.name==='RavenhillHearse'));assert.ok(a.length<4_000_000);
 assert.equal(createHash('sha256').update(a).digest('hex'),createHash('sha256').update(readFileSync(new URL('../public/models/ravenhill.glb',import.meta.url))).digest('hex'));
});
test('ravenhill has a distinct chassis, two detachable doors, a hinged tailgate, aligned wheels, and damage that fully repairs',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),c=new Vehicle(0,'ravenhill',DEFINITIONS.ravenhill.color,scene,world,fx);
 try{
  assert.ok(CAR_KINDS.length>=23&&CAR_KINDS.includes('ravenhill'));assert.ok(Math.abs(c.body.mass()-2150)<1);assert.ok(c.glass.length>=6);assert.ok(c.panels.length>25);
  assert.deepEqual(c.wreckParts.assemblies.filter(a=>a.name.startsWith('door-')).map(a=>a.name).sort(),['door-left','door-right']);
  const gate=c.wreckParts.assemblies.find(a=>a.name==='tailgate');assert.ok(gate);for(const name of ['panel_TailgateRavenhill','glass_TailgateRavenhill','panel_TailgateRavenhillHandle','panel_TailgateRavenhillPlate'])assert.ok(gate.members.some(m=>m.mesh.name===name),name);assert.ok(gate.members.every(m=>!m.mesh.name.includes('RearLamp')&&!m.mesh.name.includes('Landau')));
  const anchors=classicWheelAnchors('ravenhill');assert.equal(-c.model.position.y,anchors.modelOffset);for(let i=0;i<4;i++){assert.equal(c.wheels[i].position.x,anchors.wheels[i].x);assert.equal(c.wheels[i].position.z,anchors.wheels[i].z);assert.ok(Math.abs(c.controller.wheelRadius(i)!-.38)<1e-6);}
  c.root.updateMatrixWorld(true);const clean=shape(c),mass=c.body.mass();
  assert.ok(c.scar(new T.Vector3(.98,.1,0),new T.Vector3(-1,0,0),.5,1));assert.notDeepEqual(shape(c),clean,'Light contact changes actual geometry');c.repair();assert.deepEqual(shape(c),clean);
  c.hit(new T.Vector3(.2,0,2.9),new T.Vector3(0,0,-1),35,2,true);assert.ok(c.health<100);assert.notDeepEqual(shape(c),clean);assert.ok(Math.abs(c.body.mass()-mass)<1);c.repair();assert.deepEqual(shape(c),clean);assert.equal(c.health,100);
 }finally{c.dispose();world.free();}
});
test('ravenhill drives the rear wheels from a front V8, is heavy but slow, stays offline-only, and garage/cup saves round-trip',()=>{
 const w=new R.World({x:0,y:-9.81,z:0});w.timestep=1/60;w.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));
 const spec=vehicleSpecification('ravenhill'),{body,controller}=createVehiclePhysics(R,w,'ravenhill',spec.mass),s:PhysicsState={health:100,damageLeft:0,damageRight:0,speed:0,slip:0,steering:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false}};
 try{body.setTranslation({x:0,y:1,z:0},true);for(let i=0;i<120;i++){stepVehiclePhysics(body,controller,'ravenhill',spec,s,1/60);w.step();}s.input.throttle=1;stepVehiclePhysics(body,controller,'ravenhill',spec,s,1/60);w.step();
  assert.ok(controller.wheelEngineForce(2)!>0&&controller.wheelEngineForce(3)!>0);assert.equal(controller.wheelEngineForce(0),0);assert.ok(body.localCom().z>=0,'front-engine mass is not behind the axle midpoint');
 }finally{w.free();}
 assert.equal(vehicleDrivetrain('ravenhill'),'RWD');assert.ok(!isRearEngineKind('ravenhill'));assert.ok(gridPool('ravenhill','american').includes('ravenhill'));
 const d=DEFINITIONS;assert.ok(d.ravenhill.mass>d.starfin.mass&&d.ravenhill.mass>2000);assert.ok(d.ravenhill.force>=d.morrow.force&&d.ravenhill.force<d.regent.force);assert.ok(d.ravenhill.force/d.ravenhill.mass<Math.min(d.regent.force/d.regent.mass,d.starfin.force/d.starfin.mass,d.morrow.force/d.morrow.mass),'strong but slow');
 assert.ok(vehicleSpecification('ravenhill').speedLimit<vehicleSpecification('starfin').speedLimit);
 assert.equal(validOnlineCar('ravenhill'),false);for(const list of [ONLINE_CARS,KITE_ONLINE_CARS,MORROW_ONLINE_CARS,ALDER_ONLINE_CARS])assert.ok(!list.includes('ravenhill'));
 assert.ok(!onlineCarChoices({rosterSupport:true,kiteSupport:true,morrowSupport:true,alderSupport:true}).includes('ravenhill'));assert.ok(validOnlineCar('alder'));
 for(const kind of CAR_KINDS.filter(k=>k!=='ravenhill'))for(const field of [2,11,24]){const roster=clubRoster(kind,'mixed',field);assert.ok(roster.every(c=>c.kind!=='ravenhill'),'Existing saved rosters stay stable');}
 const cup=createClubCup('ravenhill','12345678-1234-4234-8234-123456789abc',1000);assert.equal(readClubCup(JSON.stringify(cup))?.roster[0].kind,'ravenhill');
 const setup=stockSetup('ravenhill');setup.engine=2;setup.armor=2;assert.deepEqual(importSetup(exportSetup('ravenhill',setup),'ravenhill'),setup);
});
test('last-rites career is an appended impact group of three derbies in three named arenas with heavy-car medal tiers',()=>{
 const group=CAREER_GROUPS.find(g=>g.id==='last-rites')!;assert.equal(group.discipline,'impact');assert.equal(group.events.length,3);assert.equal(CAREER_GROUPS.at(-1),group,'appended after every existing group');
 assert.deepEqual(CHALLENGES.slice(-3).map(c=>c.id),[...group.events],'challenges appended after every existing challenge');
 const events=group.events.map(id=>CHALLENGES.find(c=>c.id===id)!);assert.ok(events.every(c=>c&&c.car==='ravenhill'&&c.mode==='derby'&&c.discipline==='impact'&&isArenaId(c.arena)&&challengeCourse(c)==='quarry-v1'));
 assert.equal(new Set(events.map(c=>c.arena)).size,3);assert.ok(events.every(c=>c.arena!=='quarry-arena-v1'&&challengeVenueName(c)!=='Blackridge Quarry'));
 assert.deepEqual(events.map(c=>c.metric),['damage','knockouts','condition']);for(const c of events)assert.ok(c.medals[0]<c.medals[1]&&c.medals[1]<c.medals[2]);
 // Same targets as the existing two-minute heavy damage derby, the four-knockout wrecker and the 75 s survivors.
 const tiers=(id:string)=>{const c=CHALLENGES.find(c=>c.id===id)!;return [c.limit,...c.medals];};
 assert.deepEqual(tiers('ravenhill-harrow'),tiers('heavy-impact'));assert.deepEqual(tiers('ravenhill-foundry'),tiers('wreck-coupe'));assert.deepEqual(tiers('ravenhill-wrenford'),tiers('kestrel-survivor'));assert.equal(events[2].minDamage,15);
});
