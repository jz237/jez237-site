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
import {stockSetup,exportSetup,importSetup} from '../src/garage';
import {clubRoster,createClubCup,readClubCup} from '../src/club-cup';
import {buildPipitAsset} from '../src/pipit-asset';
import {encodeVehicleGlb} from '../tools/vehicle-glb';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
import {vehicleDrivetrain,gridPool} from '../src/grid-rules';
import {validOnlineCar,onlineCarChoices,ONLINE_CARS,KITE_ONLINE_CARS,MORROW_ONLINE_CARS,ALDER_ONLINE_CARS} from '../src/online-roster';
import {CHALLENGES} from '../src/challenges';import {CAREER_GROUPS} from '../src/career';import {COURSE_NAMES} from '../src/course-id';
await R.init();
const loader=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=loader;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const shape=(c:Vehicle)=>c.panels.map(p=>({name:p.name,visible:p.visible,hash:createHash('sha256').update(new Uint8Array(p.geometry.attributes.position.array.buffer)).digest('hex')}));
const encode=()=>encodeVehicleGlb(buildPipitAsset(),()=>{throw Error('Unexpected external texture')},{generator:'Quarry Impact original Pipit 600',copyright:'Original Quarry Impact vehicle artwork, 2026'});

test('microcar shell has bounded finite geometry, a bubble glasshouse with sunroof, a louvred engine lid and small-wheel clearance',()=>{
 const root=buildPipitAsset(),bounds=new T.Box3().setFromObject(root);let vertices=0;
 root.traverse(o=>{if(!(o instanceof T.Mesh))return;assert.equal(o.geometry.index,null,o.name+' is exported non-indexed');const p=o.geometry.attributes.position;vertices+=p.count;for(const x of p.array)assert.ok(Number.isFinite(x));});
 assert.ok(vertices<115000);assert.ok(bounds.min.y>=0&&bounds.max.y<1.42);assert.ok(bounds.min.z>-1.6&&bounds.max.z<1.6);assert.ok(bounds.min.x>-.75&&bounds.max.x<.75);
 for(const name of ['glass_FrontPipit','glass_RearPipit','glass_BodyDoorLPipit','glass_BodyDoorRPipit','glass_QuarterLPipit','glass_QuarterRPipit','panel_PipitSunroof','panel_RoofPipit','panel_hoodPipit','panel_EngineLidPipit','panel_EngineLidPipitLouvre0','panel_bumper_frontPipit','panel_bumper_rearPipit','Structure Pipit rear twin','panel_PipitHeadlight-1','panel_PipitHeadlight1','Interior Pipit Dashboard'])assert.ok(root.getObjectByName(name),name);
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){const wheel=root.getObjectByName('wheel_'+name)!;assert.equal(wheel.position.x,(i%2?1:-1)*.50);assert.equal(wheel.position.y,.28);assert.equal(wheel.position.z,(i<2?1:-1)*.925);assert.equal(wheel.scale.x,.26/.32);const b=new T.Box3().setFromObject(wheel);assert.ok(b.min.y>=0);assert.ok(b.max.y<.56);assert.ok(Math.abs((b.max.y-b.min.y)/2-vehicleWheelRadius('pipit'))<.002);}
});
test('microcar exports a self-contained repeatable GLB matching the published model',()=>{
 const a=encode(),b=encode();assert.deepEqual(a,b);const data=new DataView(a.buffer,a.byteOffset,a.byteLength);assert.equal(data.getUint32(0,true),0x46546c67);
 const json=JSON.parse(new TextDecoder().decode(a.subarray(20,20+data.getUint32(12,true))));assert.equal(json.buffers[0].uri,undefined);assert.ok(json.nodes.some((n:any)=>n.name==='Pipit600'));assert.ok(a.length<4_000_000);
 assert.equal(createHash('sha256').update(a).digest('hex'),createHash('sha256').update(readFileSync(new URL('../public/models/pipit.glb',import.meta.url))).digest('hex'));
});
test('pipit has a distinct chassis, two detachable doors, aligned small wheels, and damage that fully repairs',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),c=new Vehicle(0,'pipit',DEFINITIONS.pipit.color,scene,world,fx);
 try{
  assert.ok(CAR_KINDS.length>=22&&CAR_KINDS.includes('pipit'));assert.ok(Math.abs(c.body.mass()-560)<1);assert.ok(c.glass.length>=6);assert.ok(c.panels.length>25);
  assert.deepEqual(c.wreckParts.assemblies.filter(a=>a.name.startsWith('door-')).map(a=>a.name).sort(),['door-left','door-right']);
  const anchors=classicWheelAnchors('pipit');assert.equal(-c.model.position.y,anchors.modelOffset);for(let i=0;i<4;i++){assert.equal(c.wheels[i].position.x,anchors.wheels[i].x);assert.equal(c.wheels[i].position.z,anchors.wheels[i].z);assert.ok(Math.abs(c.controller.wheelRadius(i)!-.26)<1e-6);}
  c.root.updateMatrixWorld(true);const clean=shape(c),mass=c.body.mass();
  assert.ok(c.scar(new T.Vector3(.64,-.1,0),new T.Vector3(-1,0,0),.5,1));assert.notDeepEqual(shape(c),clean,'Light contact changes actual geometry');c.repair();assert.deepEqual(shape(c),clean);
  c.hit(new T.Vector3(.15,-.2,1.5),new T.Vector3(0,0,-1),35,2,true);assert.ok(c.health<100);assert.notDeepEqual(shape(c),clean);assert.ok(Math.abs(c.body.mass()-mass)<1);c.repair();assert.deepEqual(shape(c),clean);assert.equal(c.health,100);
 }finally{c.dispose();world.free();}
});
test('pipit drives the rear wheels from a rear engine, stays offline-only, and garage/cup saves round-trip',()=>{
 const w=new R.World({x:0,y:-9.81,z:0});w.timestep=1/60;w.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));
 const spec=vehicleSpecification('pipit'),{body,controller}=createVehiclePhysics(R,w,'pipit',spec.mass),s:PhysicsState={health:100,damageLeft:0,damageRight:0,speed:0,slip:0,steering:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false}};
 try{body.setTranslation({x:0,y:1,z:0},true);for(let i=0;i<120;i++){stepVehiclePhysics(body,controller,'pipit',spec,s,1/60);w.step();}s.input.throttle=1;stepVehiclePhysics(body,controller,'pipit',spec,s,1/60);w.step();
  assert.ok(controller.wheelEngineForce(2)!>0&&controller.wheelEngineForce(3)!>0);assert.equal(controller.wheelEngineForce(0),0);assert.ok(body.localCom().z<0,'rear-engine mass sits behind the axle midpoint');
 }finally{w.free();}
 assert.equal(vehicleDrivetrain('pipit'),'RWD');assert.ok(isRearEngineKind('pipit'));assert.ok(gridPool('pipit','european').includes('pipit'));assert.ok(DEFINITIONS.pipit.force<DEFINITIONS.linnet.force&&DEFINITIONS.pipit.mass<DEFINITIONS.linnet.mass);
 assert.equal(validOnlineCar('pipit'),false);for(const list of [ONLINE_CARS,KITE_ONLINE_CARS,MORROW_ONLINE_CARS,ALDER_ONLINE_CARS])assert.ok(!list.includes('pipit'));
 assert.ok(!onlineCarChoices({rosterSupport:true,kiteSupport:true,morrowSupport:true,alderSupport:true}).includes('pipit'));assert.ok(validOnlineCar('alder'));
 for(const kind of CAR_KINDS.filter(k=>k!=='pipit'))for(const field of [2,11,24]){const roster=clubRoster(kind,'mixed',field);assert.ok(roster.every(c=>c.kind!=='pipit'),'Existing saved rosters stay stable');}
 const cup=createClubCup('pipit','12345678-1234-4234-8234-123456789abc',1000);assert.equal(readClubCup(JSON.stringify(cup))?.roster[0].kind,'pipit');
 const setup=stockSetup('pipit');setup.engine=2;setup.armor=2;assert.deepEqual(importSetup(exportSetup('pipit',setup),'pipit'),setup);
});
test('bubble-car-club career offers three valid venues including a reverse race',()=>{
 const group=CAREER_GROUPS.find(g=>g.id==='bubble-car-club')!;assert.equal(group.events.length,3);
 const events=group.events.map(id=>CHALLENGES.find(c=>c.id===id)!);assert.ok(events.every(c=>c&&c.car==='pipit'&&c.mode==='race'&&c.course&&Object.hasOwn(COURSE_NAMES,c.course)));assert.equal(new Set(events.map(c=>c.course)).size,3);assert.ok(events.some(c=>c.direction==='reverse'));
 const linnet=CAREER_GROUPS.find(g=>g.id==='top-down-tour')!.events.map(id=>CHALLENGES.find(c=>c.id===id)!.course);assert.ok(events.every(c=>!linnet.includes(c.course)));
 for(const c of events)assert.ok(c.medals[0]>c.medals[1]&&c.medals[1]>c.medals[2]);
});
