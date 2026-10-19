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
import {buildCornetAsset} from '../src/cornet-asset';
import {encodeVehicleGlb} from '../tools/vehicle-glb';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
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
const encode=()=>encodeVehicleGlb(buildCornetAsset(),()=>{throw Error('Unexpected external texture')},{generator:'Quarry Impact original Cornet Ice Cream Van',copyright:'Original Quarry Impact vehicle artwork, 2026'});

test('ice-cream van shell has bounded finite geometry, a left serving hatch with counter and awning, a roof cone sign and chime horns, round lamps, livery bands and decals',()=>{
 const root=buildCornetAsset(),bounds=new T.Box3().setFromObject(root);let vertices=0;
 root.traverse(o=>{if(!(o instanceof T.Mesh))return;assert.equal(o.geometry.index,null,o.name+' is exported non-indexed');const p=o.geometry.attributes.position;vertices+=p.count;for(const x of p.array)assert.ok(Number.isFinite(x));});
 assert.ok(vertices<118000,`${vertices} vertices`);assert.ok(bounds.min.y>=0&&bounds.max.y>2.95&&bounds.max.y<3.06,'about 3.0 m tall over the cone sign');
 assert.ok(bounds.min.z>-2.6&&bounds.max.z<2.6&&bounds.max.z-bounds.min.z>4.95,'about 5.0 m long');assert.ok(bounds.max.x<1.08&&bounds.min.x>-1.25,'mirrors on both sides; the counter and awning only on the left');
 const body=new T.Box3();for(const name of ['panel_RoofCornet','panel_CornetBoxSideL','panel_CornetBoxSideR','panel_CornetLutonNose'])body.union(new T.Box3().setFromObject(root.getObjectByName(name)!));
 assert.ok(Math.abs(body.max.y-2.42)<.01,'box roof at 2.42 m');assert.ok(Math.abs(body.max.x-.98)<.01&&Math.abs(body.min.x+.98)<.01,'box half width .98');
 for(const side of ['L','R'])for(const name of ['panel_BodyDoor'+side+'Cornet','glass_BodyDoor'+side+'Cornet','glass_Quarter'+side+'CornetFront','panel_BodyDoor'+side+'CornetMirror','panel_FrontWing'+side+'Cornet','panel_CornetBandPink'+side,'panel_CornetBandBlue'+side,'panel_CornetRearLamp'+side+'Tail','panel_CornetChimeHorn'+side,'panel_CornetRearCorner'+side])assert.ok(root.getObjectByName(name),name);
 for(const name of ['panel_CornetHatchFrame','glass_CornetHatchFront','glass_CornetHatchSlider','panel_CornetHatchCounter','panel_ServingHatchCornetFlap','panel_ServingHatchCornetFlapStripes','panel_ServingHatchCornetFlapValance','panel_CornetBoxOverHatchL','Interior Cornet ServeMachine'])assert.ok(root.getObjectByName(name),name);
 assert.equal(root.getObjectByName('panel_CornetBoxUpperL'),undefined,'the left side is open at the hatch');assert.ok(root.getObjectByName('panel_CornetBoxUpperR'),'the right side is closed');
 for(const name of ['panel_CornetHatchCounter','panel_ServingHatchCornetFlap'])assert.ok(new T.Box3().setFromObject(root.getObjectByName(name)!).min.x<-1.0,name+' stands out from the left side');
 for(const name of ['panel_CornetConeSign','panel_CornetConeSignSwirl','panel_CornetConeSignRidges','panel_CornetConeSignBase'])assert.ok(new T.Box3().setFromObject(root.getObjectByName(name)!).min.y>=2.40,name+' on the roof');
 for(const name of ['glass_FrontCornet','glass_TailgateCornet','panel_TailgateCornet','panel_TailgateCornetMenuBoard','panel_TailgateCornetHandle','panel_hoodCornet','panel_RoofCornet','panel_bumper_frontCornet','panel_bumper_rearCornet','panel_bumper_rearCornetStep','panel_CornetGrille','panel_CornetLutonSign','Structure Cornet inline four','Structure Cornet rear axle','Interior SteeringWheel Cornet'])assert.ok(root.getObjectByName(name),name);
 const decals:string[]=[];root.traverse(o=>{if(o.name.startsWith('panel_CornetDecal'))decals.push(o.name);});assert.ok(decals.some(n=>n.startsWith('panel_CornetDecalL'))&&decals.some(n=>n.startsWith('panel_CornetDecalR'))&&decals.some(n=>n.startsWith('panel_CornetDecalRear')));
 // Round headlamps and tail lenses use the shared lamp material names the dusk lights look for.
 const lamp=(re:RegExp)=>{let n=0;root.traverse(o=>{if(o instanceof T.Mesh&&re.test((o.material as T.Material).name))n++;});return n;};assert.equal(lamp(/^Cornet Lens$/),2);assert.ok(lamp(/^Cornet Tail Lens$/)>=2);
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){
  const wheel=root.getObjectByName('wheel_'+name)!;assert.equal(wheel.position.x,(i%2?1:-1)*.80);assert.equal(wheel.position.y,.38);assert.equal(wheel.position.z,(i<2?1:-1)*1.45);assert.equal(wheel.scale.x,.36/.32);
  const b=new T.Box3().setFromObject(wheel);assert.ok(b.min.y>=0);assert.ok(b.max.y<.80);assert.ok(Math.abs((b.max.y-b.min.y)/2-vehicleWheelRadius('cornet'))<.002);
  const trim=root.getObjectByName('Wheel Cornet trim '+name) as T.Mesh;assert.ok(trim&&trim.parent===wheel);const p=trim.geometry.attributes.position,q=new T.Vector3();let r=0,out=0;for(let k=0;k<p.count;k++){q.fromBufferAttribute(p,k).applyMatrix4(trim.matrix);r=Math.max(r,Math.hypot(q.y,q.z));out=Math.max(out,q.x*(i%2?1:-1));}assert.ok(r<.19&&out>.08&&out<.105,`${name} trim ${r} ${out}`);
 }
});
test('ice-cream van exports a self-contained repeatable GLB matching the published model',()=>{
 const a=encode(),b=encode();assert.deepEqual(a,b);const data=new DataView(a.buffer,a.byteOffset,a.byteLength);assert.equal(data.getUint32(0,true),0x46546c67);
 const json=JSON.parse(new TextDecoder().decode(a.subarray(20,20+data.getUint32(12,true))));assert.equal(json.buffers[0].uri,undefined);assert.ok(json.nodes.some((n:any)=>n.name==='CornetIceCreamVan'));assert.ok(a.length<4_000_000);
 assert.equal(createHash('sha256').update(a).digest('hex'),createHash('sha256').update(readFileSync(new URL('../public/models/cornet.glb',import.meta.url))).digest('hex'));
});
test('cornet has a distinct tall chassis, two sliding cab doors, a hinged rear door and hatch flap, aligned wheels, working lamps, and damage that fully repairs',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),c=new Vehicle(0,'cornet',DEFINITIONS.cornet.color,scene,world,fx);
 try{
  assert.ok(CAR_KINDS.length>=25&&CAR_KINDS.includes('cornet'));assert.ok(Math.abs(c.body.mass()-2050)<1);assert.ok(c.glass.length>=6);assert.ok(c.panels.length>40);
  assert.deepEqual(c.wreckParts.assemblies.filter(a=>a.name.startsWith('door-')).map(a=>a.name).sort(),['door-left','door-right']);
  const gate=c.wreckParts.assemblies.find(a=>a.name==='tailgate');assert.ok(gate);for(const name of ['panel_TailgateCornet','glass_TailgateCornet','panel_TailgateCornetHandle','panel_TailgateCornetMenuBoard','panel_TailgateCornetPlate'])assert.ok(gate.members.some(m=>m.mesh.name===name),name);assert.ok(gate.members.every(m=>!m.mesh.name.includes('RearLamp')&&!m.mesh.name.includes('RearPost')));
  const hatch=c.wreckParts.assemblies.find(a=>a.name==='hatch');assert.ok(hatch);for(const name of ['panel_ServingHatchCornetFlap','panel_ServingHatchCornetFlapStripes','panel_ServingHatchCornetFlapValance'])assert.ok(hatch.members.some(m=>m.mesh.name===name),name);assert.ok(hatch.members.every(m=>!m.mesh.name.includes('Counter')),'the counter stays on the body');
  // A heavy hit by the hatch swings the flap down from its top edge, and repair restores it.
  const flap=hatch.members.find(m=>m.mesh.name==='panel_ServingHatchCornetFlap')!.mesh;c.root.updateMatrixWorld(true);const before=new T.Box3().setFromObject(flap);
  for(let i=0;i<3;i++)c.wreckParts.hit(new T.Vector3(-1.0,1.9,-.25),new T.Vector3(1,0,0),30);c.root.updateMatrixWorld(true);const after=new T.Box3().setFromObject(flap);assert.ok(after.min.y<before.min.y-.03,'flap droops');assert.ok(Math.abs(after.max.y-before.max.y)<.04,'hinged at its top edge');c.wreckParts.reset();
  const anchors=classicWheelAnchors('cornet');assert.equal(-c.model.position.y,anchors.modelOffset);for(let i=0;i<4;i++){assert.equal(c.wheels[i].position.x,anchors.wheels[i].x);assert.equal(c.wheels[i].position.z,anchors.wheels[i].z);assert.ok(Math.abs(c.controller.wheelRadius(i)!-.36)<1e-6);}
  const lights=attachCarLights(c.root,DEFINITIONS.cornet.halfLength);assert.ok(lights.head>=2&&lights.tail>=2,`${lights.head}/${lights.tail}`);lights.dispose();
  c.root.updateMatrixWorld(true);const clean=shape(c),mass=c.body.mass();
  assert.ok(c.scar(new T.Vector3(.98,.1,-1),new T.Vector3(-1,0,0),.5,1));assert.notDeepEqual(shape(c),clean,'Light contact changes actual geometry');c.repair();assert.deepEqual(shape(c),clean);
  c.hit(new T.Vector3(.2,0,2.5),new T.Vector3(0,0,-1),35,2,true);assert.ok(c.health<100);assert.notDeepEqual(shape(c),clean);assert.ok(Math.abs(c.body.mass()-mass)<1);c.repair();assert.deepEqual(shape(c),clean);assert.equal(c.health,100);
 }finally{c.dispose();world.free();}
});
test('cornet drives the rear wheels from a front four, is heavy, tall and slow, rights itself on its wheels, stays offline-only, and garage/cup saves round-trip',()=>{
 const w=new R.World({x:0,y:-9.81,z:0});w.timestep=1/60;w.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));
 const spec=vehicleSpecification('cornet'),{body,controller,roof}=createVehiclePhysics(R,w,'cornet',spec.mass),s:PhysicsState={health:100,damageLeft:0,damageRight:0,speed:0,slip:0,steering:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false}};
 try{body.setTranslation({x:0,y:1,z:0},true);for(let i=0;i<120;i++){stepVehiclePhysics(body,controller,'cornet',spec,s,1/60);w.step();}
  const q=body.rotation();assert.ok(1-2*(q.x*q.x+q.z*q.z)>.99,'settles level on its wheels');
  s.input.throttle=1;stepVehiclePhysics(body,controller,'cornet',spec,s,1/60);w.step();
  assert.equal(controller.wheelEngineForce(0),0);assert.equal(controller.wheelEngineForce(1),0);assert.ok(controller.wheelEngineForce(2)!>0&&controller.wheelEngineForce(3)!>0);
  assert.ok(body.localCom().y>0,'tall-body mass sits above the chassis datum like the Carrier and Shuttle');
  // The upper hull reaches the 2.42 m box roof (model space) above the .86 m chassis datum.
  const b=roof.shape as R.ConvexPolyhedron,v=b.vertices;let top=-Infinity;for(let i=1;i<v.length;i+=3)top=Math.max(top,v[i]);assert.ok(Math.abs(top-(2.42-.86))<1e-4);
 }finally{w.free();}
 assert.equal(vehicleDrivetrain('cornet'),'RWD');assert.ok(!isFrontDriveKind('cornet')&&!isRearEngineKind('cornet'));assert.equal(vehicleWeightClass('cornet'),'Heavy');
 assert.ok(gridPool('cornet','rwd').includes('cornet')&&gridPool('cornet','european').includes('cornet'));
 const d=DEFINITIONS;assert.ok(d.cornet.force<d.van.force,'weaker than the Carrier');assert.ok(d.cornet.force/d.cornet.mass<Math.min(d.van.force/d.van.mass,d.shuttle.force/d.shuttle.mass),'the weakest power for its weight of the vans');
 assert.ok(vehicleSpecification('cornet').speedLimit<vehicleSpecification('van').speedLimit);
 assert.equal(validOnlineCar('cornet'),false);for(const list of [ONLINE_CARS,KITE_ONLINE_CARS,MORROW_ONLINE_CARS,ALDER_ONLINE_CARS])assert.ok(!list.includes('cornet'));
 assert.ok(!onlineCarChoices({rosterSupport:true,kiteSupport:true,morrowSupport:true,alderSupport:true}).includes('cornet'));assert.ok(validOnlineCar('alder'));
 for(const kind of CAR_KINDS.filter(k=>k!=='cornet'))for(const field of [2,11,24]){const roster=clubRoster(kind,'mixed',field);assert.ok(roster.every(c=>c.kind!=='cornet'),'Existing saved rosters stay stable');}
 const cup=createClubCup('cornet','12345678-1234-4234-8234-123456789abc',1000);assert.equal(readClubCup(JSON.stringify(cup))?.roster[0].kind,'cornet');
 const setup=stockSetup('cornet');setup.engine=2;setup.armor=2;assert.deepEqual(importSetup(exportSetup('cornet',setup),'cornet'),setup);
});
test('sprinkles-and-scrap career is an appended impact group of three derbies in three named arenas with heavy-car medal tiers',()=>{
 const group=CAREER_GROUPS.find(g=>g.id==='sprinkles-and-scrap')!;assert.equal(group.discipline,'impact');assert.equal(group.events.length,3);
 // Appended after every group and challenge that existed when it shipped (later cars append after it).
 const g=CAREER_GROUPS.indexOf(group),c0=CHALLENGES.findIndex(c=>c.id===group.events[0]);assert.equal(CAREER_GROUPS[g-1].id,'school-run','appended after every existing group');
 assert.deepEqual(CHALLENGES.slice(c0-1,c0+3).map(c=>c.id),['fernleigh-saltmarsh',...group.events],'challenges appended after every existing challenge');
 const events=group.events.map(id=>CHALLENGES.find(c=>c.id===id)!);assert.ok(events.every(c=>c&&c.car==='cornet'&&c.mode==='derby'&&c.discipline==='impact'&&isArenaId(c.arena)&&challengeCourse(c)==='quarry-v1'));
 assert.deepEqual(events.map(c=>c.arena),['gullhaven-yard-v1','briarhill-bowl-v1','kestrel-ring-v1']);assert.ok(events.every(c=>c.arena!=='quarry-arena-v1'&&challengeVenueName(c)!=='Blackridge Quarry'));
 assert.deepEqual(events.map(c=>c.metric),['damage','knockouts','condition']);for(const c of events)assert.ok(c.medals[0]<c.medals[1]&&c.medals[1]<c.medals[2]);
 // Same tiers as the other two-tonne derby car.
 for(const [mine,theirs]of [['cornet-gullhaven','ravenhill-harrow'],['cornet-briarhill','ravenhill-foundry'],['cornet-kestrel','ravenhill-wrenford']]){const a=CHALLENGES.find(c=>c.id===mine)!,b=CHALLENGES.find(c=>c.id===theirs)!;assert.deepEqual(a.medals,b.medals);assert.equal(a.limit,b.limit);}
});
