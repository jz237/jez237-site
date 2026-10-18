import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {CAR_KINDS,DEFINITIONS} from '../src/rules';
import {classicWheelAnchors} from '../src/classic-vehicle-specs';
import {stockSetup,exportSetup,importSetup} from '../src/garage';
import {clubRoster,createClubCup,readClubCup} from '../src/club-cup';
import {buildStarfinAsset} from '../src/starfin-asset';
import {encodeVehicleGlb} from '../tools/vehicle-glb';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
import {vehicleDrivetrain,gridPool} from '../src/grid-rules';
import {validOnlineCar,onlineCarChoices} from '../src/online-roster';
import {CHALLENGES} from '../src/challenges';import {CAREER_GROUPS} from '../src/career';import {COURSE_NAMES} from '../src/course-id';
await R.init();
const loader=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=loader;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const shape=(c:Vehicle)=>c.panels.map(p=>({name:p.name,visible:p.visible,hash:createHash('sha256').update(new Uint8Array(p.geometry.attributes.position.array.buffer)).digest('hex')}));

test('hardtop shell has bounded finite geometry, door and quarter glass, wraparound glass, fins and wheel clearance',()=>{
 const root=buildStarfinAsset(),bounds=new T.Box3().setFromObject(root);let vertices=0;
 root.traverse(o=>{if(!(o instanceof T.Mesh))return;const p=o.geometry.attributes.position;vertices+=p.count;for(const x of p.array)assert.ok(Number.isFinite(x));});
 assert.ok(vertices<120000);assert.ok(bounds.min.y>=0&&bounds.max.y<1.5);assert.ok(bounds.min.z>-2.8&&bounds.max.z<2.95);assert.ok(bounds.min.x>-1.15&&bounds.max.x<1.15);
 for(const side of ['L','R'])for(const name of ['BodyDoor','Quarter'])assert.ok(root.getObjectByName('glass_'+name+side+'Starfin'),name+side);
 for(const name of ['glass_FrontStarfin','glass_RearStarfin','panel_BootStarfin','panel_StarfinFinCap-1','panel_StarfinFinCap1','Structure Starfin V8 block','panel_RearQuarterLStarfinPillar','Tyre Starfin whitewall FL'])assert.ok(root.getObjectByName(name),name);
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){const wheel=root.getObjectByName('wheel_'+name)!;assert.equal(wheel.position.x,(i%2?1:-1)*.80);assert.equal(wheel.position.z,(i<2?1:-1)*1.5);const b=new T.Box3().setFromObject(wheel);assert.ok(b.min.y>=0);assert.ok(b.max.y<.82);}
});
test('liftback exports a self-contained repeatable GLB matching the published model',()=>{
 const encode=()=>encodeVehicleGlb(buildStarfinAsset(),()=>{throw Error('Unexpected external texture')},{generator:'Quarry Impact original Starfin 58',copyright:'Original Quarry Impact vehicle artwork, 2026'});
 const a=encode(),b=encode();assert.deepEqual(a,b);const data=new DataView(a.buffer,a.byteOffset,a.byteLength);assert.equal(data.getUint32(0,true),0x46546c67);
 const json=JSON.parse(new TextDecoder().decode(a.subarray(20,20+data.getUint32(12,true))));assert.equal(json.buffers[0].uri,undefined);assert.ok(json.nodes.some((n:any)=>n.name==='Starfin58'));assert.ok(a.length<4_000_000);
});
test('starfin has a distinct chassis, two detachable doors, aligned wheels, and damage that fully repairs',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),c=new Vehicle(0,'starfin',DEFINITIONS.starfin.color,scene,world,fx);
 try{
  assert.ok(CAR_KINDS.length>=19&&CAR_KINDS.includes('starfin'));assert.ok(Math.abs(c.body.mass()-1720)<1);assert.ok(c.glass.length>=6);assert.ok(c.panels.length>25);
  assert.deepEqual(c.wreckParts.assemblies.filter(a=>a.name.startsWith('door-')).map(a=>a.name).sort(),['door-left','door-right']);
  const anchors=classicWheelAnchors('starfin');for(let i=0;i<4;i++){assert.equal(c.wheels[i].position.x,anchors.wheels[i].x);assert.equal(c.wheels[i].position.z,anchors.wheels[i].z);assert.ok(Math.abs(c.controller.wheelRadius(i)!-.38)<1e-6);}
  c.root.updateMatrixWorld(true);const clean=shape(c),mass=c.body.mass();
  assert.ok(c.scar(new T.Vector3(.95,.1,0),new T.Vector3(-1,0,0),.5,1));assert.notDeepEqual(shape(c),clean,'Light contact changes actual geometry');c.repair();assert.deepEqual(shape(c),clean);
  c.hit(new T.Vector3(.2,0,2.6),new T.Vector3(0,0,-1),35,2,true);assert.ok(c.health<100);assert.notDeepEqual(shape(c),clean);assert.ok(Math.abs(c.body.mass()-mass)<1);c.repair();assert.deepEqual(shape(c),clean);assert.equal(c.health,100);
 }finally{c.dispose();world.free();}
});
test('starfin drives the rear wheels, stays offline-only, and garage/cup saves round-trip',()=>{
 const w=new R.World({x:0,y:-9.81,z:0});w.timestep=1/60;w.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));
 const spec=vehicleSpecification('starfin'),{body,controller}=createVehiclePhysics(R,w,'starfin',spec.mass),s:PhysicsState={health:100,damageLeft:0,damageRight:0,speed:0,slip:0,steering:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false}};
 try{body.setTranslation({x:0,y:1,z:0},true);for(let i=0;i<120;i++){stepVehiclePhysics(body,controller,'starfin',spec,s,1/60);w.step();}s.input.throttle=1;stepVehiclePhysics(body,controller,'starfin',spec,s,1/60);w.step();
  assert.ok(controller.wheelEngineForce(2)!>0&&controller.wheelEngineForce(3)!>0);assert.equal(controller.wheelEngineForce(0),0);
 }finally{w.free();}
 assert.equal(vehicleDrivetrain('starfin'),'RWD');assert.ok(gridPool('starfin','american').includes('starfin'));
 assert.equal(validOnlineCar('starfin'),false);assert.ok(!onlineCarChoices({rosterSupport:true,kiteSupport:true,morrowSupport:true,alderSupport:true}).includes('starfin'));assert.ok(validOnlineCar('alder'));
 for(const kind of CAR_KINDS.filter(k=>k!=='starfin'))for(const field of [2,11,24]){const roster=clubRoster(kind,'mixed',field);assert.ok(roster.every(c=>c.kind!=='starfin'),'Existing saved rosters stay stable');}
 const cup=createClubCup('starfin','12345678-1234-4234-8234-123456789abc',1000);assert.equal(readClubCup(JSON.stringify(cup))?.roster[0].kind,'starfin');
 const setup=stockSetup('starfin');setup.engine=2;setup.armor=2;assert.deepEqual(importSetup(exportSetup('starfin',setup),'starfin'),setup);
});
test('chrome-and-fins career offers three valid venues including a reverse race',()=>{
 const group=CAREER_GROUPS.find(g=>g.id==='chrome-and-fins')!;assert.equal(group.events.length,3);
 const events=group.events.map(id=>CHALLENGES.find(c=>c.id===id)!);assert.ok(events.every(c=>c&&c.car==='starfin'&&c.mode==='race'&&c.course&&Object.hasOwn(COURSE_NAMES,c.course)));assert.equal(new Set(events.map(c=>c.course)).size,3);assert.ok(events.some(c=>c.direction==='reverse'));
});
