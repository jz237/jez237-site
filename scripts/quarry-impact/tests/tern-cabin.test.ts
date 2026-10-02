import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildTernAsset} from '../src/tern-asset';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {ReplayRecorder,replayFile,readReplayFile} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
import {verifyTernFrontRevision} from './tern-front-invariants';

await R.init();const original=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|wheel-machining)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
const root=buildTernAsset(),mesh=(name:string)=>root.getObjectByName(name) as T.Mesh;
const bounds=(name:string)=>new T.Box3().setFromObject(mesh(name));
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);

test('Tern padding and dashboard have closed, outward shells rather than intersecting bevels',()=>{
 for(const name of ['Interior Tern seat cushion -1','Interior Tern seat back -1','Interior Tern headrest -1','Interior Tern rear bench','Interior Tern rear backrest','Interior Tern dashboard','Interior Tern instrument hood','Interior Tern centre console','Interior Tern gear knob','Interior Tern steering hub']){
  const p=mesh(name).geometry.attributes.position,edges=new Map<string,number>();let volume=0;
  const key=(p:T.Vector3)=>p.toArray().map(x=>x.toFixed(6)).join(',');
  for(let i=0;i<p.count;i+=3){const tri=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,i+j));volume+=tri[0].dot(tri[1].clone().cross(tri[2]))/6;
   for(let j=0;j<3;j++){const edge=[key(tri[j]),key(tri[(j+1)%3])].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}
  }
  assert.ok([...edges.values()].every(n=>n===2),name+' closed edges');assert.ok(volume>1e-7,name+' outward winding');
 }
 assert.ok(bounds('Interior Tern gear knob').getSize(new T.Vector3()).x<.043,'Small radii must fit the moulding');
 assert.ok(bounds('Interior Tern steering hub').getSize(new T.Vector3()).y<.072);
});

test('seats meet their runners, stay below the roof and leave the console and doors clear',()=>{
 const console=bounds('Interior Tern centre console'),floor=bounds('Interior Tern carpet');
 for(const side of [-1,1]){
  const cushion=bounds('Interior Tern seat cushion '+side),back=bounds('Interior Tern seat back '+side),head=bounds('Interior Tern headrest '+side);
  assert.ok(cushion.min.x>-.70&&cushion.max.x<.70&&head.max.y<1.25);
  assert.ok(!cushion.intersectsBox(console),'Console does not intersect the seat');
  assert.ok(cushion.intersectsBox(back),'Backrest meets its cushion');
  for(const rail of [-.15,.15]){const runner=bounds('Structure Tern seat runner '+side+' '+rail);assert.ok(cushion.intersectsBox(runner),'Seat has physical support');assert.ok(runner.intersectsBox(floor),'Runner meets the floor');}
 }
 for(const [i,x]of [-.423,-.261].entries()){
  const ray=new T.Raycaster(v(x,1.047,.18),v(0,0,1));
  const hit=ray.intersectObjects([mesh('Interior Tern dashboard'),mesh('Interior Tern instrument hood'),mesh('Interior Tern dial '+i)])[0];
  assert.equal(hit.object.name,'Interior Tern dial '+i,'Dial faces remain visible from the driver side');
 }
});

const cabin=(car:Vehicle)=>car.panels.filter(p=>/Interior Tern/.test((p.material as T.Material).name)).map(p=>({name:p.name,position:Array.from(p.geometry.attributes.position.array)}));
test('the new production cabin deforms independently and survives compressed replay, backward seeks and repair',async()=>{
 const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0}),setup=stockSetup('tern'),fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}} as any;
 const car=new Vehicle(0,'tern',setup.paint,scene,world,fx,setup),other=new Vehicle(1,'tern',setup.paint,scene,world,fx,setup);car.place(2,4,.2);car.render(1);car.root.updateMatrixWorld(true);
 const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'tern',setup}],props:0,created:'2026-10-02T12:00:00Z'});car.onVisualEvent=e=>recorder.event(0,.5,e);
 try{
  const intact=cabin(car),untouched=cabin(other);assert.ok(intact.length>=2);recorder.capture(0,()=>captureReplayFrame([car],[],[0]),true);
  car.hit(v(-.8,.85,-.15).applyMatrix4(car.model.matrixWorld),v(1,0,0).applyQuaternion(car.root.quaternion),38,.5,true);recorder.capture(1,()=>captureReplayFrame([car],[],[0]),true);
  const damaged=cabin(car);assert.notDeepEqual(damaged,intact);assert.deepEqual(cabin(other),untouched);assert.ok(damaged.every(p=>p.position.every(Number.isFinite)));
  const doc=await readReplayFile(new File([await replayFile(recorder.document())],'tern-cabin.qir')),replay=new ReplayScene(doc,scene,world,[]);
  try{replay.seek(1);assert.deepEqual(cabin(replay.cars[0]),damaged);replay.seek(0);assert.deepEqual(cabin(replay.cars[0]),intact);replay.seek(1);assert.deepEqual(cabin(replay.cars[0]),damaged);}finally{replay.dispose();}
  car.repair();assert.deepEqual(cabin(car),intact);
 }finally{car.dispose();other.dispose();world.free();}
});

test('the cabin release preserves the published front refinement and all preceding snapshots',verifyTernFrontRevision);
