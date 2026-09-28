import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {describeCar,loadCarWithoutImages,readProject} from '../tools/car-asset-audit';
import {loadCars,templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {westVergePlacements} from '../src/scenery-west-verge';
import {landscapeHeight} from '../src/quarry-layout';
import {trackPoint} from '../src/rules';
import {restoreCoupeBytes} from './coupe-realism-invariants';

const before=JSON.parse(readProject('tests/fixtures/coupe-realism-before.json').toString());
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
test('new coupe keeps every existing glass mesh, wheel pivot and unaffected body panel exact',async()=>{
  const current=await describeCar('coupe');
  assert.deepEqual(current.wheels,before.car.wheels);
  assert.deepEqual(current.images,before.car.images);
  for(const old of before.car.meshes.filter((m:any)=>/^(glass_|panel_)/.test(m.name)&&m.name!=='panel_bumper_front')){
    const mesh=current.meshes.find(m=>m.name===old.name);assert.ok(mesh,old.name);
    assert.deepEqual(mesh.attributes,old.attributes,old.name+' corner/UV/normal data unchanged');
    assert.equal(mesh.indicesSHA256,old.indicesSHA256);assert.deepEqual(mesh.worldMatrix,old.worldMatrix);
  }
  const revision=JSON.parse(readProject('source/coupe-realism-revision.json').toString());
  for(const [file,entry]of Object.entries<any>(revision.files)){
    assert.equal(hash(readProject(file)),entry.after);
    assert.equal(hash(restoreCoupeBytes(file,readProject(file))),entry.before);
  }
  const manifest=JSON.parse(readProject('source/coupe-detail-manifest.json').toString());
  for(const entry of manifest.files){assert.equal(hash(readProject(entry.path)),entry.sha256);assert.equal(readProject(entry.path).length,entry.bytes);}
});

test('front intake is an actual opening; the surrounding fascia still intercepts rays',async()=>{
  const gltf=await loadCarWithoutImages('coupe'),panel=gltf.scene.getObjectByName('panel_bumper_front')!;
  gltf.scene.updateMatrixWorld(true);assert.ok(panel);
  const cast=(x:number)=>new T.Raycaster(new T.Vector3(x,.57,4),new T.Vector3(0,0,-1),0,4).intersectObject(panel,true);
  assert.equal(cast(0).length,0,'ray must pass through the cooling aperture');
  assert.ok(cast(.83).length>0,'outer fascia retains its physical visible sheet');
  assert.ok(gltf.scene.getObjectByName('panel_bumper_grille'),'grille must be independently damageable');
});

async function actualCar(){
  const original=GLTFLoader.prototype.loadAsync;
  GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch)\.glb$/.exec(String(url))![1]);
  try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
  await R.init();const world=new R.World({x:0,y:-9.81,z:0});
  const car=new Vehicle(0,'coupe',0xb32618,new T.Scene(),world,{emit(){},mark(){},detach(p:T.Mesh){p.visible=false;}}as any);
  car.place(0,0,0);car.root.updateMatrixWorld(true);
  return {car,close(){car.dispose();world.free();templates.clear();}};
}
test('one lamp receives local wear, darkens by shader state, and repair/replay restores all optics and contact axes',async()=>{
  const {car,close}=await actualCar();
  try{
    const left=car.panels.find(p=>p.name==='panel_lamp_head_L')!,right=car.panels.find(p=>p.name==='panel_lamp_head_R')!;
    assert.ok(left&&right);
    const point=new T.Box3().setFromObject(left).getCenter(new T.Vector3());
    const capture=()=>car.panels.map(p=>({name:p.name,p:new Float32Array(p.geometry.attributes.position.array),n:new Float32Array(p.geometry.attributes.normal.array),wear:new Float32Array(p.geometry.attributes.impactWear.array),axis:new Float32Array(p.geometry.attributes.impactAxis.array),visible:p.visible}));
    const original=capture();car.hit(point,new T.Vector3(.2,0,-1).normalize(),14,1,true);
    const max=(p:T.Mesh)=>Math.max(...p.geometry.attributes.impactWear.array);
    assert.ok(max(left)>.5);assert.ok(max(right)<max(left)*.4,'opposite lamp is outside the concentrated strike');
    assert.ok((left.material as T.Material).customProgramCacheKey().includes('fractured-lens'));
    const after=capture();assert.ok(after.some(p=>p.axis.some(v=>Math.abs(v)>.1)));
    car.repair();assert.deepEqual(capture(),original,'repair restores every vertex, normal, lens and directional scrape attribute');
    assert.ok(car.glass.every(g=>(g.material as T.MeshStandardMaterial).opacity===.24));
    car.hit(point,new T.Vector3(.2,0,-1).normalize(),14,1,true);assert.deepEqual(capture(),after,'serialized contact reproduces all new appearance deterministically');
  }finally{close();}
});

test('western ground cover is deterministic, grounded and leaves the 12m driving lane clear',()=>{
  const a=westVergePlacements();assert.deepEqual(a,westVergePlacements());
  assert.ok(a.grass.length>400&&a.grass.length<1000);assert.ok(a.shrubs.length>5&&a.shrubs.length<20);assert.ok(a.chips.length>80);
  const track=Array.from({length:1441},(_,i)=>trackPoint(i/1440));
  for(const p of [...a.grass,...a.shrubs,...a.chips]){
    assert.equal(p.y,landscapeHeight(p.x,p.z));assert.ok(p.height>0&&p.height<=1.5);
    assert.ok(Math.min(...track.map(q=>Math.hypot(p.x-q.x,p.z-q.z)))>6.85);
    assert.ok(p.x< -55&&p.x> -110&&p.z>15&&p.z<85,'all dressing is confined to the selected western bend');
  }
});
