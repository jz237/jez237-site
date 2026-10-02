import {restoreGarageBytes} from './garage-invariants';
import test from 'node:test';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {restoreWreckBytes} from './wreck-invariants';
import {restoreFireBytes} from './fire-invariants';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {wreckTopology} from '../src/wreck-topology';
import {prepareWreckGeometry,dentGeometry} from '../src/wreck-geometry';
import {fractureBankGeometry,bankVergePlacements} from '../src/scenery-bank-relief';
import {quarryCliffs} from '../src/scenery-surfaces';
import {trackPoint} from '../src/rules';

test('previous release sources are recoverable and all 23 shared simulation inputs are unchanged',()=>{
 const read=(p:string)=>fs.readFileSync(new URL('../'+p,import.meta.url)),hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
 const revision=JSON.parse(read('source/wreck-revision.json').toString());
 for(const [p,e]of Object.entries<any>(revision.files)){assert.equal(hash(restoreFireBytes(p,read(p))),e.after,p);assert.equal(hash(restoreWreckBytes(p,read(p))),e.before,p);}
 const physics=JSON.parse(read('source/coupe-realism-physics.json').toString());assert.equal(Object.keys(physics.sourceHashes).length,23);for(const [p,h]of Object.entries(physics.sourceHashes))assert.equal(hash(restoreGarageBytes(p,read(p))),h,p);
});

test('adaptive panel edges are short, conforming and preserve the intact surface',()=>{
 const original=new T.PlaneGeometry(2,1),refined=wreckTopology(original,.14),p=refined.attributes.position,idx=refined.index!;
 let area=0;const edges=new Map<string,number>();
 for(let i=0;i<idx.count;i+=3){const ids=[idx.getX(i),idx.getX(i+1),idx.getX(i+2)],a=new T.Vector3().fromBufferAttribute(p,ids[0]),b=new T.Vector3().fromBufferAttribute(p,ids[1]),c=new T.Vector3().fromBufferAttribute(p,ids[2]);area+=b.clone().sub(a).cross(c.clone().sub(a)).length()/2;
  for(let k=0;k<3;k++){const u=ids[k],v=ids[(k+1)%3],key=[u,v].sort((a,b)=>a-b).join(':');edges.set(key,(edges.get(key)??0)+1);assert.ok(new T.Vector3().fromBufferAttribute(p,u).distanceTo(new T.Vector3().fromBufferAttribute(p,v))<=.140001);}
 }
 assert.ok(Math.abs(area-2)<1e-6);for(const [key,count]of edges){if(count===2)continue;assert.equal(count,1);const [a,b]=key.split(':').map(Number);assert.ok(Math.abs(p.getX(a))===1&&p.getX(a)===p.getX(b)||Math.abs(p.getY(a))===.5&&p.getY(a)===p.getY(b),'single edges only on real perimeter');}
});

test('skin and window use the same metre-scale deformation across different mesh transforms',()=>{
 const root=new T.Group(),a=new T.Mesh(new T.PlaneGeometry(1,1,12,12),new T.MeshStandardMaterial()),b=a.clone();a.name='panel_door';b.name='glass_window';
 a.geometry.translate(.5,.7,0);b.geometry=a.geometry.clone();b.geometry.translate(-3,-2,-1);b.position.set(3,2,1);root.add(a,b);prepareWreckGeometry(root);
 dentGeometry(a,new T.Vector3(.5,.7,0),new T.Vector3(0,0,-1),18);dentGeometry(b,new T.Vector3(.5,.7,0),new T.Vector3(0,0,-1),18);
 for(let i=0;i<a.geometry.attributes.position.count;i++){const pa=new T.Vector3().fromBufferAttribute(a.geometry.attributes.position,i),pb=new T.Vector3().fromBufferAttribute(b.geometry.attributes.position,i).add(b.position);assert.ok(pa.distanceTo(pb)<1e-6);}
});

test('actual three-car wrecks bend skin, structure and screens, repair exactly and replay identically',async()=>{
 await R.init();const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|wheel-machining)\.glb$/.exec(String(url))![1]);
 try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 for(const kind of ['coupe','sedan','hatch']as const){const world=new R.World({x:0,y:-9.81,z:0}),car=new Vehicle(0,kind,0xffffff,new T.Scene(),world,{emit(){},mark(){},detach(p:T.Mesh){p.visible=false;}}as any);car.place(0,0,0);
  const meshes=[...car.panels,...car.glass],capture=()=>meshes.map(p=>({p:new Float32Array(p.geometry.attributes.position.array),n:new Float32Array(p.geometry.attributes.normal.array),visible:p.visible}));const intact=capture();
  const hits:[T.Vector3,T.Vector3,number][]=[
   [new T.Vector3(.1,.95,2),new T.Vector3(0,0,-1),16],
   [new T.Vector3(-1,1.1,.1),new T.Vector3(1,-.07,.1).normalize(),20],
   [new T.Vector3(0,1.45,0),new T.Vector3(0,-1,0),14],
   [new T.Vector3(.65,.7,-1.9),new T.Vector3(-.3,0,1).normalize(),16],
   [new T.Vector3(0,.8,2),new T.Vector3(0,0,-1),18]];
  const strike=(quiet=false)=>{for(const [p,d,amount]of hits)car.hit(car.model.localToWorld(p.clone()),d,amount,1,quiet);};strike();
  const damaged=capture();assert.ok(car.glass.some((p,i)=>Array.from(p.geometry.attributes.position.array).some((v,j)=>v!==intact[car.panels.length+i].p[j])),kind+' glass follows frame');
  assert.ok(car.panels.some((p,i)=>p.name.startsWith('panel_inner_')&&Array.from(p.geometry.attributes.position.array).some((v,j)=>v!==intact[i].p[j])),kind+' inner structure follows skin');
  for(const mesh of meshes){const p=mesh.geometry.attributes.position,rest=mesh.userData.wreckRest as T.BufferAttribute;for(let i=0;i<p.count;i++){const current=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(mesh.userData.wreckToModel),before=new T.Vector3().fromBufferAttribute(rest,i);assert.ok(Number.isFinite(current.length()));assert.ok(current.distanceTo(before)<=.900002);}}
  for(const group of ['front-bumper','hood','mirror-left','mirror-right']){const members=car.panels.filter(p=>p.userData.detachAssembly===group);assert.ok(members.every(p=>p.visible===members[0].visible),'no floating attachment inserts');}
  car.repair();assert.deepEqual(capture(),intact,kind+' complete repair');strike(true);assert.deepEqual(capture(),damaged,kind+' deterministic quiet replay');car.dispose();world.free();
 }
});

test('bank relief stays shallow and verge plants leave the driving lane clear',()=>{
 const source=quarryCliffs(),refined=fractureBankGeometry(source),p=refined.attributes.position,rest=refined.attributes.bankReference;
 let displaced=0;for(let i=0;i<p.count;i++){const d=new T.Vector3().fromBufferAttribute(p,i).distanceTo(new T.Vector3().fromBufferAttribute(rest,i));assert.ok(d<.281);if(d>.02)displaced++;}assert.ok(displaced>500);
 const plants=bankVergePlacements();assert.ok(plants.grass.length>450);assert.ok(plants.chips.length>100);const path=Array.from({length:721},(_,i)=>trackPoint(i/720));for(const plant of [...plants.grass,...plants.chips,...plants.shrubs])assert.ok(path.every(p=>Math.hypot(p.x-plant.x,p.z-plant.z)>=7.1));
});
