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
import {stockSetup,readGarage,GARAGE_KEY,exportSetup,importSetup} from '../src/garage';
import {SAVE_KEYS,readSave,exportSave} from '../src/save-backup';
import {clubRoster,createClubCup,readClubCup} from '../src/club-cup';
import {COURSE_NAMES} from '../src/course-id';
import {readTimeTrialRecords} from '../src/time-trial';
import {ReplayRecorder,replayFile,readReplayFile} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
await R.init();
const loader=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=loader;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const shape=(c:Vehicle)=>c.panels.map(p=>({name:p.name,visible:p.visible,hash:createHash('sha256').update(new Uint8Array(p.geometry.attributes.position.array.buffer)).digest('hex')}));
const canonical=(v:any)=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
test('trail has a distinct loaded chassis, four aligned wheels and visible light/heavy damage that fully repairs',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),c=new Vehicle(0,'trail',DEFINITIONS.trail.color,scene,world,fx);
 try{
  assert.equal(CAR_KINDS.length,14);assert.ok(Math.abs(c.body.mass()-2010)<1);assert.ok(c.glass.length>=6);assert.ok(c.panels.length>25);assert.deepEqual(c.wreckParts.assemblies.filter(a=>a.name.startsWith('door-')).map(a=>a.name).sort(),['door-left','door-right']);
  const anchors=classicWheelAnchors('trail');for(let i=0;i<4;i++){assert.equal(c.wheels[i].position.x,anchors.wheels[i].x);assert.equal(c.wheels[i].position.z,anchors.wheels[i].z);assert.ok(Math.abs(c.controller.wheelRadius(i)!-.42)<1e-6);}
  c.root.updateMatrixWorld(true);const clean=shape(c),mass=c.body.mass();
  assert.ok(c.scar(new T.Vector3(1.00,.1,0),new T.Vector3(-1,0,0),.5,1));assert.notDeepEqual(shape(c),clean,'Light contact changes actual geometry');c.repair();assert.deepEqual(shape(c),clean);
  c.hit(new T.Vector3(.2,0,2.2),new T.Vector3(0,0,-1),35,2,true);assert.ok(c.health<100);assert.notDeepEqual(shape(c),clean);assert.ok(Math.abs(c.body.mass()-mass)<1);c.repair();assert.deepEqual(shape(c),clean);assert.equal(c.health,100);
 }finally{c.dispose();world.free();}
});
test('trail garage and cup saves work while thirteen-car signed backups and existing rosters remain valid',async()=>{
 const oldKinds=CAR_KINDS.filter(k=>k!=='trail');for(const kind of oldKinds)for(const field of [2,11,24]){const roster=clubRoster(kind,'mixed',field);assert.ok(roster.every(c=>c.kind!=='trail'),'Existing saved roster stays stable');assert.equal(roster[0].kind,kind);}
 for(const field of [2,11,24])for(const lineup of ['mixed','selected','drivetrain','weight']as const){const c=createClubCup('trail','12345678-1234-4234-8234-123456789abc',1000,undefined,undefined,lineup,field);assert.ok(readClubCup(JSON.stringify(c)));assert.equal(c.roster[0].kind,'trail');}
 const cup=createClubCup('trail','12345678-1234-4234-8234-123456789abc',1000);assert.equal(cup.roster.length,11);assert.equal(readClubCup(JSON.stringify(cup))?.roster[0].kind,'trail');assert.ok(clubRoster('trail','selected').every(c=>c.kind==='trail'));
 const setup=stockSetup('trail');setup.engine=2;setup.armor=2;setup.tune.suspension=.4;assert.deepEqual(importSetup(exportSetup('trail',setup),'trail'),setup);
 const g=readGarage();g.cars.shuttle.setup.engine=2;delete(g.cars as any).trail;
 const entries=Object.fromEntries(SAVE_KEYS.map(k=>[k,k===GARAGE_KEY?canonical(g):null]));const body={format:'quarry-impact-save',version:1,created:'2026-10-01T00:00:00Z',entries};
 const checksum=createHash('sha256').update(canonical(body)).digest('hex');const old=await readSave(JSON.stringify({...body,checksum}));assert.equal(old.checksum,checksum);const migrated=readGarage(old.entries[GARAGE_KEY]);assert.equal(migrated.cars.shuttle.setup.engine,2);assert.deepEqual(migrated.cars.trail.setup,stockSetup('trail'));
 const current=await readSave(await exportSave({getItem:k=>k===GARAGE_KEY?JSON.stringify(migrated):null}));assert.ok(JSON.parse(current.entries[GARAGE_KEY]!).cars.trail);
 const bests=Object.fromEntries(CAR_KINDS.flatMap(kind=>Object.keys(COURSE_NAMES).flatMap(course=>['forward','reverse'].map(direction=>[`${course}:${kind}:${direction}`,100]))));assert.equal(Object.keys(readTimeTrialRecords(JSON.stringify({version:1,bests})).bests).length,728);
});
test('trail damage and repair reconstruct through compressed replay and backwards seeking',async()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),setup=stockSetup('trail'),c=new Vehicle(0,'trail',setup.paint,scene,world,fx,setup);
 const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'trail',setup}],props:0,created:'2026-10-08T00:00:00Z'});let time=0;c.onVisualEvent=e=>recorder.event(0,time,e);const states:ReturnType<typeof shape>[]=[];
 const capture=(at:number)=>{c.render(1);c.wreckParts.poseAt(at,0);recorder.capture(at,()=>captureReplayFrame([c],[],[0]),true);states.push(shape(c));};
 try{capture(0);time=.5;c.hit(new T.Vector3(0,0,2.2),new T.Vector3(0,0,-1),28,time,true);capture(1);time=1.5;c.repair();capture(2);
 const doc=await readReplayFile(new File([await replayFile(recorder.document())],'trail.qir')),replay=new ReplayScene(doc,scene,world,[]);
 try{for(const at of [0,1,2,0,2,1,0]){replay.seek(at);assert.deepEqual(shape(replay.cars[0]),states[at]);}}finally{replay.dispose();}
 }finally{c.dispose();world.free();}
});

test('Trail rear hatch skin, glass and handle loosen together while lamps remain fixed',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),c=new Vehicle(0,'trail',DEFINITIONS.trail.color,scene,world,fx);
 try{
  const hatch=c.wreckParts.assemblies.find(a=>a.name==='tailgate');assert.ok(hatch);assert.ok(hatch.members.some(m=>m.mesh.name.includes('Skin')));assert.ok(hatch.members.some(m=>m.mesh.name.startsWith('glass_')));assert.ok(hatch.members.some(m=>m.mesh.name.includes('Handle')));assert.ok(hatch.members.every(m=>!m.mesh.name.includes('RearLamp')));
  c.root.updateMatrixWorld(true);const lamps=c.panels.filter(m=>m.name.includes('RearLamp')),rest=lamps.map(m=>m.matrix.clone());assert.ok(lamps.length);
  c.hit(new T.Vector3(0,.2,-2.20),new T.Vector3(0,0,1),70,1,true);c.wreckParts.poseAt(2,5);assert.ok(hatch.loose>0);for(let i=0;i<lamps.length;i++)assert.deepEqual(lamps[i].matrix,rest[i]);c.repair();assert.equal(hatch.loose,0);
 }finally{c.dispose();world.free();}
});
