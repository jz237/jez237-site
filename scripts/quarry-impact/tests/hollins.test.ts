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
import {buildHollinsAsset} from '../src/hollins-asset';
import {encodeVehicleGlb} from '../tools/vehicle-glb';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,rotateVehicleVector,type PhysicsState} from '../src/vehicle-physics';
import {vehicleDrivetrain,vehicleWeightClass,gridPool} from '../src/grid-rules';
import {validOnlineCar,onlineCarChoices,ONLINE_CARS,KITE_ONLINE_CARS,MORROW_ONLINE_CARS,ALDER_ONLINE_CARS} from '../src/online-roster';
import {CHALLENGES,challengeCourse,challengeVenueName} from '../src/challenges';import {CAREER_GROUPS} from '../src/career';
import {isArenaId} from '../src/arena-id';
import {attachCarLights} from '../src/car-lights';
await R.init();
const loader=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=loader;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const shape=(c:Vehicle)=>c.panels.map(p=>({name:p.name,visible:p.visible,hash:createHash('sha256').update(new Uint8Array(p.geometry.attributes.position.array.buffer)).digest('hex')}));
const encode=()=>encodeVehicleGlb(buildHollinsAsset(),()=>{throw Error('Unexpected external texture')},{generator:'Quarry Impact original Hollins Pickup',copyright:'Original Quarry Impact vehicle artwork, 2026'});

test('pickup shell has bounded finite geometry, a regular cab, quad rectangular headlamps, an open load bed with wheel tubs and a drop tailgate, a roll bar, flares and mud flaps',()=>{
 const root=buildHollinsAsset(),bounds=new T.Box3().setFromObject(root);let vertices=0;
 root.traverse(o=>{if(!(o instanceof T.Mesh))return;assert.equal(o.geometry.index,null,o.name+' is exported non-indexed');const p=o.geometry.attributes.position;vertices+=p.count;for(const x of p.array)assert.ok(Number.isFinite(x));});
 assert.ok(vertices<110000,`${vertices} vertices`);assert.ok(bounds.min.y>=0&&bounds.max.y>1.90&&bounds.max.y<1.95,'about 1.9 m tall over the roll bar');
 assert.ok(bounds.min.z>-2.7&&bounds.max.z<2.7&&bounds.max.z-bounds.min.z>5.25,'about 5.3 m long');assert.ok(bounds.max.x<1.16&&bounds.min.x>-1.16,'mirrors on both sides');
 const roof=new T.Box3().setFromObject(root.getObjectByName('panel_RoofHollins')!);assert.ok(Math.abs(roof.max.y-1.80)<.01,'cab roof at 1.80 m');
 const body=new T.Box3();for(const name of ['panel_HollinsBedSideL','panel_HollinsBedSideR','panel_BodyDoorLHollins','panel_BodyDoorRHollins'])body.union(new T.Box3().setFromObject(root.getObjectByName(name)!));
 assert.ok(Math.abs(body.max.x-1.0)<.01&&Math.abs(body.min.x+1.0)<.01,'slab sides at 1.0 m half width');
 for(const side of ['L','R'])for(const name of ['panel_BodyDoor'+side+'Hollins','glass_BodyDoor'+side+'Hollins','glass_BodyDoor'+side+'HollinsVent','panel_BodyDoor'+side+'HollinsMirror','panel_FrontWing'+side+'Hollins','panel_HollinsBedSide'+side,'panel_HollinsBedRail'+side,'panel_HollinsBedInner'+side,'panel_HollinsBedWheelhouse'+side,'panel_HollinsRearLamp'+side+'Tail','panel_HollinsMudFlap'+side+'Front','panel_HollinsMudFlap'+side+'Rear','panel_HollinsRollBarBrace'+side])assert.ok(root.getObjectByName(name),name);
 for(const name of ['glass_FrontHollins','glass_RearHollins','panel_hoodHollins','panel_RoofHollins','panel_HollinsGrille','panel_HollinsGrilleBars','panel_bumper_frontHollins','panel_bumper_rearHollins','panel_bumper_rearHollinsStep','panel_HollinsBedFloor','panel_HollinsBedHeadboard','panel_TailgateHollins','panel_TailgateHollinsHandle','panel_TailgateHollinsInner','panel_HollinsRollBar','Structure Hollins V8 block','Structure Hollins rear axle','Interior Hollins Bench','Interior SteeringWheel Hollins'])assert.ok(root.getObjectByName(name),name);
 let flares=0;root.traverse(o=>{if(o.name.startsWith('panel_HollinsArchFlare'))flares++;});assert.equal(flares,4);
 // The bed is open: nothing but air between the floor and the rails across the load space.
 const air=new T.Box3(new T.Vector3(-.80,1.0,-2.45),new T.Vector3(.80,1.26,-.60)),q=new T.Vector3();
 root.traverse(o=>{if(!(o instanceof T.Mesh))return;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)assert.ok(!air.containsPoint(q.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld)),o.name+' intrudes into the open bed');});
 const floor=new T.Box3().setFromObject(root.getObjectByName('panel_HollinsBedFloor')!);assert.ok(Math.abs(floor.max.y-.86)<.005,'bed floor at .86 m');
 const bar=new T.Box3().setFromObject(root.getObjectByName('panel_HollinsRollBar')!);assert.ok(bar.max.y>roof.max.y+.08&&bar.max.z<-.40,'roll bar stands above the roof, behind the cab');
 // Quad rectangular headlamps and corner tail lenses use the shared lamp material names the dusk lights look for.
 const lamp=(re:RegExp)=>{let n=0;root.traverse(o=>{if(o instanceof T.Mesh&&re.test((o.material as T.Material).name))n++;});return n;};assert.equal(lamp(/^Hollins Lens$/),4);assert.ok(lamp(/^Hollins Tail Lens$/)>=2);
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){
  const wheel=root.getObjectByName('wheel_'+name)!;assert.equal(wheel.position.x,(i%2?1:-1)*.84);assert.equal(wheel.position.y,.41);assert.equal(wheel.position.z,(i<2?1:-1)*1.65);assert.equal(wheel.scale.x,.40/.32);
  const b=new T.Box3().setFromObject(wheel);assert.ok(b.min.y>=0);assert.ok(b.max.y<.82);assert.ok(Math.abs((b.max.y-b.min.y)/2-vehicleWheelRadius('hollins'))<.002);
  const trim=root.getObjectByName('Wheel Hollins trim '+name) as T.Mesh;assert.ok(trim&&trim.parent===wheel);const p=trim.geometry.attributes.position,t=new T.Vector3();let r=0,out=0;for(let k=0;k<p.count;k++){t.fromBufferAttribute(p,k).applyMatrix4(trim.matrix);r=Math.max(r,Math.hypot(t.y,t.z));out=Math.max(out,t.x*(i%2?1:-1));}assert.ok(r<.19&&out>.08&&out<.11,`${name} trim ${r} ${out}`);
 }
});
test('pickup exports a self-contained repeatable GLB matching the published model',()=>{
 const a=encode(),b=encode();assert.deepEqual(a,b);const data=new DataView(a.buffer,a.byteOffset,a.byteLength);assert.equal(data.getUint32(0,true),0x46546c67);
 const json=JSON.parse(new TextDecoder().decode(a.subarray(20,20+data.getUint32(12,true))));assert.equal(json.buffers[0].uri,undefined);assert.ok(json.nodes.some((n:any)=>n.name==='HollinsPickup'));assert.ok(a.length<4_000_000);
 assert.equal(createHash('sha256').update(a).digest('hex'),createHash('sha256').update(readFileSync(new URL('../public/models/hollins.glb',import.meta.url))).digest('hex'));
});
test('hollins has two hinged doors, a drop tailgate that falls open from its lower hinge and comes off when wrecked, aligned wheels, quad lamps, and damage that fully repairs',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),c=new Vehicle(0,'hollins',DEFINITIONS.hollins.color,scene,world,fx);
 try{
  assert.ok(CAR_KINDS.length>=26&&CAR_KINDS.includes('hollins'));assert.ok(Math.abs(c.body.mass()-1900)<1);assert.ok(c.glass.length>=6);assert.ok(c.panels.length>40);
  assert.deepEqual(c.wreckParts.assemblies.filter(a=>a.name.startsWith('door-')).map(a=>a.name).sort(),['door-left','door-right']);
  const gate=c.wreckParts.assemblies.find(a=>a.name==='drop-tailgate');assert.ok(gate);for(const name of ['panel_TailgateHollins','panel_TailgateHollinsStamp','panel_TailgateHollinsCap','panel_TailgateHollinsInner','panel_TailgateHollinsHandle'])assert.ok(gate.members.some(m=>m.mesh.name===name),name);
  assert.ok(gate.members.every(m=>!m.mesh.name.includes('RearLamp')&&!m.mesh.name.includes('RearPost')&&!m.mesh.name.includes('bumper')),'lamps, posts and the step bumper stay on the body');
  // Hits at the tailgate let it fall open rearwards from its lower hinge; reset restores it.
  const skin=gate.members.find(m=>m.mesh.name==='panel_TailgateHollins')!.mesh;c.root.updateMatrixWorld(true);const before=new T.Box3().setFromObject(skin);
  for(let i=0;i<3;i++)c.wreckParts.hit(new T.Vector3(0,1.0,-2.6),new T.Vector3(0,0,1),30);c.root.updateMatrixWorld(true);const after=new T.Box3().setFromObject(skin);
  assert.ok(after.max.y<before.max.y-.08,'the top drops');assert.ok(after.min.z<before.min.z-.08,'it swings out behind the bed');assert.ok(Math.abs(after.min.y-before.min.y)<.06,'hinged at its lower edge');c.wreckParts.reset();
  const anchors=classicWheelAnchors('hollins');assert.equal(-c.model.position.y,anchors.modelOffset);for(let i=0;i<4;i++){assert.equal(c.wheels[i].position.x,anchors.wheels[i].x);assert.equal(c.wheels[i].position.z,anchors.wheels[i].z);assert.ok(Math.abs(c.controller.wheelRadius(i)!-.40)<1e-6);}
  const lights=attachCarLights(c.root,DEFINITIONS.hollins.halfLength);assert.equal(lights.head,4);assert.ok(lights.tail>=2,`${lights.head}/${lights.tail}`);lights.dispose();
  c.root.updateMatrixWorld(true);const clean=shape(c),mass=c.body.mass();
  assert.ok(c.scar(new T.Vector3(1.0,.1,-1.2),new T.Vector3(-1,0,0),.5,1));assert.notDeepEqual(shape(c),clean,'Light contact changes actual geometry');c.repair();assert.deepEqual(shape(c),clean);
  c.hit(new T.Vector3(.2,0,2.65),new T.Vector3(0,0,-1),35,2,true);assert.ok(c.health<100);assert.notDeepEqual(shape(c),clean);assert.ok(Math.abs(c.body.mass()-mass)<1);c.repair();assert.deepEqual(shape(c),clean);assert.equal(c.health,100);
  // Repeated heavy rear hits wreck the tailgate off the truck; repair puts it back.
  for(let i=0;i<6&&gate.members.some(m=>m.mesh.visible);i++)c.hit(new T.Vector3(0,.31,-2.62),new T.Vector3(0,0,1),40,2,true);
  assert.ok(gate.members.filter(m=>m.mesh.name.startsWith('panel_TailgateHollins')).every(m=>!m.mesh.visible),'the tailgate detaches');c.repair();assert.deepEqual(shape(c),clean);
 }finally{c.dispose();world.free();}
});
test('hollins drives the rear wheels from a front V8, is heavy and torquey, has an open bed over its floor, rests on its roll bar upside down, stays offline-only, and garage/cup saves round-trip',()=>{
 const w=new R.World({x:0,y:-9.81,z:0});w.timestep=1/60;w.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));
 const spec=vehicleSpecification('hollins'),{body,controller,roof}=createVehiclePhysics(R,w,'hollins',spec.mass),s:PhysicsState={health:100,damageLeft:0,damageRight:0,speed:0,slip:0,steering:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false}};
 try{body.setTranslation({x:0,y:1,z:0},true);for(let i=0;i<120;i++){stepVehiclePhysics(body,controller,'hollins',spec,s,1/60);w.step();}
  const q=body.rotation();assert.ok(1-2*(q.x*q.x+q.z*q.z)>.99,'settles level on its wheels');
  // Rays from above meet the bed floor at .86 m (model space) inside the bed and the 1.80 m roof over the cab.
  const datum=body.translation().y-.89,down=(x:number,z:number)=>{const hit=w.castRay(new R.Ray({x,y:6,z},{x:0,y:-1,z:0}),10,true);assert.ok(hit);return 6-hit.timeOfImpact-datum;};
  assert.ok(Math.abs(down(0,-1.5)-.86)<.02,'open bed down to its floor');assert.ok(Math.abs(down(.45,-2.2)-.86)<.02);assert.ok(Math.abs(down(0,.3)-1.80)<.02,'cab roof');
  s.input.throttle=1;stepVehiclePhysics(body,controller,'hollins',spec,s,1/60);w.step();
  assert.equal(controller.wheelEngineForce(0),0);assert.equal(controller.wheelEngineForce(1),0);assert.ok(controller.wheelEngineForce(2)!>0&&controller.wheelEngineForce(3)!>0);
  assert.ok(body.localCom().z>.1,'the V8 puts the weight over the front of an empty bed');
  const b=roof.shape as R.ConvexPolyhedron,v=b.vertices;let top=-Infinity;for(let i=1;i<v.length;i+=3)top=Math.max(top,v[i]);assert.ok(Math.abs(top-(1.80-.89))<1e-4);
 }finally{w.free();}
 {const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
  try{world.createCollider(R.ColliderDesc.cuboid(40,.5,40).setTranslation(0,-.5,0));const rig=createVehiclePhysics(R,world,'hollins',spec.mass);
   rig.body.setTranslation({x:0,y:2.6,z:0},true);rig.body.setRotation({x:0,y:0,z:1,w:0},true);let lowest=Infinity;
   for(let i=0;i<240;i++){world.step();const p=rig.body.translation(),tip=rotateVehicleVector({x:0,y:1.925-.89,z:-.52},rig.body.rotation());lowest=Math.min(lowest,p.y+tip.y);}
   assert.ok(lowest>-.06,`roll bar top reached ${lowest.toFixed(3)} m`);
  }finally{world.free();}}
 assert.equal(vehicleDrivetrain('hollins'),'RWD');assert.ok(!isFrontDriveKind('hollins')&&!isRearEngineKind('hollins'));assert.equal(vehicleWeightClass('hollins'),'Heavy');
 assert.ok(gridPool('hollins','rwd').includes('hollins')&&gridPool('hollins','american').includes('hollins'));
 const d=DEFINITIONS;assert.ok(d.hollins.force/d.hollins.mass>d.utility.force/d.utility.mass&&d.hollins.force/d.hollins.mass<d.muscle.force/d.muscle.mass,'between the Utility and the Bramble V8 for pull');
 assert.ok(vehicleSpecification('hollins').speedLimit<vehicleSpecification('utility').speedLimit&&vehicleSpecification('hollins').gearStep<vehicleSpecification('utility').gearStep,'shorter-geared than the Utility');
 assert.equal(validOnlineCar('hollins'),false);for(const list of [ONLINE_CARS,KITE_ONLINE_CARS,MORROW_ONLINE_CARS,ALDER_ONLINE_CARS])assert.ok(!list.includes('hollins'));
 assert.ok(!onlineCarChoices({rosterSupport:true,kiteSupport:true,morrowSupport:true,alderSupport:true}).includes('hollins'));assert.ok(validOnlineCar('alder'));
 for(const kind of CAR_KINDS.filter(k=>k!=='hollins'))for(const field of [2,11,24]){const roster=clubRoster(kind,'mixed',field);assert.ok(roster.every(c=>c.kind!=='hollins'),'Existing saved rosters stay stable');}
 const cup=createClubCup('hollins','12345678-1234-4234-8234-123456789abc',1000);assert.equal(readClubCup(JSON.stringify(cup))?.roster[0].kind,'hollins');
 const setup=stockSetup('hollins');setup.engine=2;setup.armor=2;assert.deepEqual(importSetup(exportSetup('hollins',setup),'hollins'),setup);
});
test('tailgate-party career is an appended impact group of three derbies in three named arenas with heavy-car medal tiers',()=>{
 const group=CAREER_GROUPS.find(g=>g.id==='tailgate-party')!;assert.equal(group.discipline,'impact');assert.equal(group.events.length,3);
 // Appended after every group and challenge that existed when it shipped (later cars append after it).
 const g=CAREER_GROUPS.indexOf(group),c0=CHALLENGES.findIndex(c=>c.id===group.events[0]);assert.equal(CAREER_GROUPS[g-1].id,'speedbowl-saturday','appended after every existing group');
 assert.deepEqual(CHALLENGES.slice(c0-1,c0+3).map(c=>c.id),['moorfield-survivor',...group.events],'challenges appended after every existing challenge');
 const events=group.events.map(id=>CHALLENGES.find(c=>c.id===id)!);assert.ok(events.every(c=>c&&c.car==='hollins'&&c.mode==='derby'&&c.discipline==='impact'&&isArenaId(c.arena)&&challengeCourse(c)==='quarry-v1'));
 assert.deepEqual(events.map(c=>c.arena),['wrenford-pit-v1','harrow-bowl-v1','foundry-yard-v1']);assert.ok(events.every(c=>c.arena!=='quarry-arena-v1'&&challengeVenueName(c)!=='Blackridge Quarry'));
 assert.deepEqual(events.map(c=>c.metric),['damage','knockouts','condition']);for(const c of events)assert.ok(c.medals[0]<c.medals[1]&&c.medals[1]<c.medals[2]);
 // Same tiers as the other heavy derby cars.
 for(const [mine,theirs]of [['hollins-wrenford','ravenhill-harrow'],['hollins-harrow','ravenhill-foundry'],['hollins-foundry','ravenhill-wrenford']]){const a=CHALLENGES.find(c=>c.id===mine)!,b=CHALLENGES.find(c=>c.id===theirs)!;assert.deepEqual(a.medals,b.medals);assert.equal(a.limit,b.limit);}
});
