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
import {WreckFinish} from '../src/wreck-finish';
import {restoreWreckFinishBytes} from './wreck-finish-invariants';
import {restoreDemoBytes} from './demo-invariants';

test('the preceding public release is recoverable without relaxing any frozen hash',()=>{
 const read=(p:string)=>fs.readFileSync(new URL('../'+p,import.meta.url)),hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
 const revision=JSON.parse(read('source/wreck-finish-revision.json').toString());
 for(const [p,e]of Object.entries<any>(revision.files)){assert.equal(hash(restoreDemoBytes(p,read(p))),e.after,p);assert.equal(hash(restoreWreckFinishBytes(p,read(p))),e.before,p);}
});

test('soot persists after cooling, pauses exactly, is per-car and agrees across frame rates',()=>{
 const run=(hz:number)=>{const f=new WreckFinish(new T.Group(),2);for(let i=0;i<hz*7;i++)f.advance(.65,1/hz);return f;};
 const a=run(60);for(const hz of [30,144])assert.ok(Math.abs(run(hz).soot.value-a.soot.value)<1e-12);
 const old=a.soot.value;a.advance(0,6);a.advance(1,0);a.advance(1,NaN);assert.equal(a.soot.value,old);
 const b=run(60);a.reset();assert.equal(a.soot.value,0);assert.equal(b.soot.value,old);
 a.advance(1,100);assert.equal(a.soot.value,1);
});

test('real car assemblies bend locally, hold their trim, restore completely and replay quietly',async()=>{
 await R.init();const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|wheel-machining)\.glb$/.exec(String(url))![1]);
 try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 for(const kind of ['coupe','sedan','hatch']as const){
  const world=new R.World({x:0,y:-9.81,z:0}),car=new Vehicle(0,kind,0xffffff,new T.Scene(),world,{emit(){},mark(){},detach(p:T.Mesh){p.visible=false;}}as any);car.place(0,0,0);
  const parts=car.wreckParts;
  for(const a of parts.assemblies.filter(a=>a.name.startsWith('door'))){
   const side=a.name==='door-left'?-1:1;
   assert.ok(a.bounds.getCenter(new T.Vector3()).x*side>0,'authored L/R names do not invert physical hinge side');
   assert.ok(a.members.some(p=>p.mesh.name.startsWith('glass_')),'door glazing stays with door');
   assert.ok(a.members.some(p=>p.mesh.name.includes('Gasket')),'window seal follows its door');
  }
  const snapshot=()=>parts.assemblies.flatMap(a=>a.members.map(p=>({name:p.mesh.name,m:p.mesh.matrix.toArray(),auto:p.mesh.matrixAutoUpdate,visible:p.mesh.visible})));
  const intact=snapshot(),wheelRest=car.wheels.map(w=>({p:w.position.clone(),q:w.quaternion.clone()}));
  const hit=(quiet=false)=>{const point=new T.Vector3(-.96,.96,1.35),dir=new T.Vector3(.9,-.03,-.4).normalize();for(let i=0;i<2;i++)car.hit(car.model.localToWorld(point.clone()),dir,26,1+i,quiet);parts.pose(0,0);parts.wheelsPose();};
  hit();const damaged=snapshot(),damagedWheels=car.wheels.map(w=>w.quaternion.toArray());
  assert.ok(parts.assemblies.some(a=>a.loose>0));assert.ok(parts.wheelDamage[0]>.15);assert.equal(parts.wheelDamage[3],0);
  for(let i=0;i<120;i++)parts.wheelsPose();assert.deepEqual(car.wheels.map(w=>w.quaternion.toArray()),damagedWheels,'pause cannot accumulate wheel camber');
  assert.ok(car.wheels[3].quaternion.equals(wheelRest[3].q),'remote corner unaffected');
  car.wreckFinish.advance(1,8);car.repair();assert.deepEqual(snapshot(),intact);assert.equal(car.wreckFinish.soot.value,0);
  car.wheels.forEach((w,i)=>{assert.ok(w.position.equals(wheelRest[i].p));assert.ok(w.quaternion.equals(wheelRest[i].q));});
  hit(true);assert.deepEqual(snapshot(),damaged);assert.deepEqual(car.wheels.map(w=>w.quaternion.toArray()),damagedWheels);
  for(const zone of ['front','rear','left','right','roof']as const){
   car.repair();parts.zones[zone]=100;const offset=parts.inspectionOffset();
   if(zone==='left')assert.ok(offset.x<0);if(zone==='right')assert.ok(offset.x>0);if(zone==='rear')assert.ok(offset.z<0);if(zone==='roof')assert.ok(offset.y>3);
   for(const roll of [Math.PI/2,Math.PI,Math.PI*1.5]){const rolled=parts.inspectionOffset(new T.Quaternion().setFromEuler(new T.Euler(.5,1,roll)));assert.ok(rolled.y>=2);assert.ok(Math.hypot(rolled.x,rolled.z)>=3);}
  }
  car.dispose();world.free();
 }
});
