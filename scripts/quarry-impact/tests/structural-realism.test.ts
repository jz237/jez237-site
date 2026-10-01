import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {VehicleSurface} from '../src/vehicle-surface';
import {GroundEvidence} from '../src/ground-evidence';
import {prepareWreckGeometry,dentGeometry,repairWreckGeometry} from '../src/wreck-geometry';
import {restoreStructuralBytes} from './structural-realism-invariants';
import {restoreReferenceBytes} from './reference-invariants';
await R.init();
const read=(p:string)=>fs.readFileSync(new URL('../'+p,import.meta.url));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
let loaded=false;
async function car(kind:'coupe'|'sedan'|'hatch'='coupe'){
 if(!loaded){const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|wheel-machining)\.glb$/.exec(String(url))![1]);try{await loadCars(()=>{});loaded=true;}finally{GLTFLoader.prototype.loadAsync=original;}}
 const world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(1000,.1,1000).setTranslation(0,-.1,0));
 const c=new Vehicle(0,kind,0x1247cc,new T.Scene(),world,{emit(){},mark(){},detach(p:T.Mesh){p.visible=false;}}as any);c.place(0,0,0);return{c,world,close(){c.dispose();world.free();}};
}

test('solid engine geometry retains pairwise distances while rails resist more than outer skin',()=>{
 const make=(role:string)=>{const root=new T.Group(),mesh=new T.Mesh(new T.PlaneGeometry(1,1,16,16),new T.MeshPhysicalMaterial());mesh.name='panel_test';mesh.userData.constructionRole=role;root.add(mesh);prepareWreckGeometry(root);return mesh;};
 const skin=make('skin'),rail=make('rail'),engine=make('engine');
 const before=new Float32Array(engine.geometry.attributes.position.array);
 for(const mesh of [skin,rail,engine])dentGeometry(mesh,new T.Vector3(),new T.Vector3(0,0,-1),20);
 const displacement=(m:T.Mesh)=>Math.max(...Array.from(m.geometry.attributes.position.array).map((v,i)=>Math.abs(v-before[i])));
 assert.ok(displacement(skin)>displacement(rail)*1.3);assert.ok(displacement(engine)<=.160001);
 for(let n=0;n<3;n++)dentGeometry(engine,new T.Vector3(),new T.Vector3(0,0,-1),20);
 const shift=new T.Vector3().fromBufferAttribute(engine.geometry.attributes.position,0).sub(new T.Vector3().fromArray(before,0));
 for(let i=0;i<engine.geometry.attributes.position.count;i++){const delta=new T.Vector3().fromBufferAttribute(engine.geometry.attributes.position,i).sub(new T.Vector3().fromArray(before,i*3));assert.ok(delta.distanceTo(shift)<1e-6,'engine is translated as solid hardware');}
 for(const m of [skin,rail,engine]){repairWreckGeometry(m);assert.deepEqual(new Float32Array(m.geometry.attributes.position.array),before);}
});

test('all three real cars retain construction groups; corner damage changes Rapier and repairs exactly',async()=>{
 for(const kind of ['coupe','sedan','hatch']as const){const {c,world,close}=await car(kind);try{
  assert.ok(c.panels.some(p=>p.userData.constructionRole==='engine'),kind+' engine');assert.ok(c.panels.some(p=>p.userData.constructionRole==='rail'),kind+' rails');
  const healthy=c.controller.wheelChassisConnectionPointCs(0)!;
  c.hit(c.model.localToWorld(new T.Vector3(-.95,.86,1.4)),new T.Vector3(.8,0,-.6),23,1,true,new T.Color(0xd83022));c.preStep(1/60);
  assert.ok(c.wreckParts.wheelDamage[0]>.1);assert.equal(c.wreckParts.wheelDamage[3],0);
  assert.ok(c.controller.wheelSuspensionStiffness(0)!<c.controller.wheelSuspensionStiffness(3)!);
  assert.ok(c.controller.wheelSuspensionRestLength(0)!<c.controller.wheelSuspensionRestLength(3)!);
  assert.ok(c.controller.wheelRadius(0)!<c.controller.wheelRadius(3)!);
  assert.ok(c.controller.wheelBrake(0)!>0&&c.controller.wheelBrake(3)===0);
  assert.notDeepEqual(c.controller.wheelChassisConnectionPointCs(0),healthy);
  assert.ok(c.panels.some(p=>Array.from(p.geometry.attributes.transferPaint.array).some((v,i)=>i%4===3&&v>0)),'physical strike transfers paint locally');
  c.repair();assert.equal(c.controller.wheelSuspensionStiffness(0),30);assert.ok(Math.abs(c.controller.wheelSuspensionRestLength(0)!-.36)<1e-6);assert.deepEqual(c.controller.wheelChassisConnectionPointCs(0),healthy);
  assert.equal(c.controller.wheelBrake(0),0);for(const p of c.panels)assert.ok(Array.from(p.geometry.attributes.transferPaint.array).every(v=>v===0));
  // Wobble follows rolling travel, stays still while parked and pauses without accumulation.
  c.wreckParts.wheelDamage[0]=.7;c.wreckParts.pose(1,0);c.wreckParts.wheelsPose();const parked=c.wheels[0].quaternion.toArray();
  c.wreckParts.pose(1,0);c.wreckParts.wheelsPose();assert.deepEqual(c.wheels[0].quaternion.toArray(),parked);
  c.wreckParts.pose(.15,7);c.wreckParts.wheelsPose();const rolling=c.wheels[0].quaternion.toArray();assert.notDeepEqual(rolling,parked);
  for(let i=0;i<100;i++){c.wreckParts.pose(0,0);c.wreckParts.wheelsPose();}assert.deepEqual(c.wheels[0].quaternion.toArray(),rolling);
 }finally{close();}}
});

test('healthy suspension settles and fixed-step driving agrees across 30/60/144 rendering rates',async()=>{
 const run=async(hz:number)=>{const {c,world,close}=await car();try{let accumulator=0,time=0;
  for(let frame=0;frame<hz*8;frame++){accumulator+=1/hz;while(accumulator+1e-9>=1/60){c.input={throttle:time>2?1:0,steer:0,brake:0,handbrake:false};c.preStep(1/60);world.step();c.postStep(1/60,time);time+=1/60;accumulator-=1/60;}c.render(accumulator*60);c.wreckParts.pose(1/hz,c.speed);c.wreckParts.wheelsPose();}
  assert.ok(c.current.y>.4&&c.current.y<.9);assert.ok(Math.abs(c.current.x)<.05);assert.ok(c.speed>8);assert.ok(c.tireContacts.every(t=>t.active.value===1&&t.load.value>.1));return{position:c.current.toArray(),speed:c.speed};
 }finally{close();}};
 const baseline=await run(60);for(const hz of [30,144])assert.deepEqual(await run(hz),baseline);
});

test('wet and gravel coatings depend on traveled distance, are local to each car and pause/reset',()=>{
 const run=(hz:number)=>{const f=new VehicleSurface(new T.Group(),0);for(let i=0;i<hz*5;i++)f.advance(1/hz,12,true,[true,false,true,false]);return f;};
 const a=run(60);assert.ok(a.coating.value.x>.5&&a.coating.value.y===0);assert.ok(a.coating.value.z>a.coating.value.w*4);assert.equal(a.water[0],1);assert.equal(a.water[1],0);
 for(const hz of [30,144]){const b=run(hz);assert.ok(Math.abs(b.coating.value.x-a.coating.value.x)<.005);assert.ok(Math.abs(b.coating.value.z-a.coating.value.z)<1e-7);}
 const paused=JSON.stringify(a.stats);a.advance(0,25,true,[false,false,false,false]);assert.equal(JSON.stringify(a.stats),paused);
 const airborne=new VehicleSurface(new T.Group(),1);airborne.advance(10,20,true,[false,false,false,false],[false,false,false,false]);assert.equal(airborne.coating.value.z,0);assert.equal(airborne.coating.value.w,0);
 a.advance(5,12,false,[false,false,false,false]);assert.ok(a.water[0]<.2&&a.water[0]>0);const b=run(60);a.reset();assert.ok(a.coating.value.equals(new T.Vector4(0,0,0,0)));assert.ok(a.water.every(v=>v===0));assert.ok(b.water[0]===1);
});

test('ground evidence rejects still/invalid contacts, stays bounded, ages and clears on reset',()=>{
 const trace=new GroundEvidence(new T.Scene());trace.add(new T.Vector3(),0,0,1);trace.add(new T.Vector3(NaN,0,0),0,1,1);assert.equal(trace.stats.count,0);
 trace.add(new T.Vector3(),0,.4,1);const before=trace.data.slice();trace.advance(0);assert.deepEqual(trace.data,before);assert.equal(trace.stats.clock,0);
 trace.advance(65);assert.equal(trace.stats.clock,65);
 for(let i=0;i<6000;i++)trace.add(new T.Vector3(i,0,0),0,.4,.5,(i%3)as 0|1|2);
 assert.equal(trace.stats.count,2048);assert.equal(trace.mesh.count,2048);assert.ok(trace.data.every(Number.isFinite));trace.reset();assert.equal(trace.mesh.count,0);assert.equal(trace.stats.clock,0);
});

test('fluid atlases are genuine varied Blender frames with approved local byte hashes',()=>{
 const manifest=JSON.parse(read('source/fx/manifest.json').toString());assert.equal(manifest.resolution,112);assert.match(manifest.method,/Mantaflow/);assert.equal(manifest.assets.length,2);
 assert.equal(manifest.authoringBlendSha256,hash(read('source/fx/vehicle-fluids.blend')));assert.equal(manifest.authoringScriptSha256,hash(read('tools/bake-vehicle-fluids.py')));
 for(const a of manifest.assets){const bytes=read('public/'+a.file);assert.equal(hash(bytes),a.sha256);assert.equal(bytes.length,a.bytes);assert.equal(bytes.readUInt32BE(16),2048);assert.equal(bytes.readUInt32BE(20),2048);assert.equal(a.frameAudit.length,64);assert.equal(new Set(a.frameAudit.map((f:any)=>f.packedPixelSha256)).size,64);assert.ok(a.frameAudit.every((f:any)=>f.coveredPixels>1000));}
 assert.deepEqual(read('source/fx/manifest.json'),read('public/assets/fx/manifest.json'));
});

test('all previous runtime sources are recoverable and original models/server inputs remain unchanged',()=>{
 const revision=JSON.parse(read('source/structural-realism-revision.json').toString());assert.ok(Object.keys(revision.files).length>=8);
 for(const[p,e]of Object.entries<any>(revision.files)){assert.equal(hash(restoreReferenceBytes(p,read(p))),e.after,p);assert.equal(hash(restoreStructuralBytes(p,read(p))),e.before,p);}
 const shared=JSON.parse(read('source/coupe-realism-physics.json').toString());assert.equal(Object.keys(shared.sourceHashes).length,23);for(const[p,h]of Object.entries(shared.sourceHashes))assert.equal(hash(read(p)),h,p);
 const models=JSON.parse(read('source/model-packing.json').toString());for(const m of Object.values<any>(models.models))assert.equal(hash(read('public/'+m.source)),m.sourceSha256);
});
