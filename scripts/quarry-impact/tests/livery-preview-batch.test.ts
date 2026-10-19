import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {newLayer} from '../src/livery';
// The garage preview adds the first livery layer to a car that is already rendering through its
// merged draw batch; the batch must be rebuilt so the merged copy carries the livery attributes.
test('a livery added after draw batching reaches the merged render copies',async()=>{
 await R.init();const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 for(const kind of (process.env.KINDS?.split(',')??['coupe','hollins']) as ('coupe')[]){
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0}),fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}} as never;
  const car=new Vehicle(0,kind,stockSetup(kind).paint,scene,world,fx,stockSetup(kind));car.place(0,0,0);car.render(1);
  const batched=()=>{const list:T.Mesh[]=[];scene.traverse(o=>{if(o instanceof T.Mesh&&o.name.startsWith('batched_paint'))list.push(o);});return list;};
  // Only boolean assertions here: a failing assert that prints a Three.js mesh tries to format the
  // whole object graph and its buffers.
  const inScene=(m:T.Mesh)=>{let found=false;scene.traverse(o=>{if(o===m)found=true;});return found;};
  car.syncDrawBatch();const before=batched();assert.ok(before.length>0,kind+' batches paint');assert.ok(before.every(m=>!m.geometry.getAttribute('liveryNormal')),kind+' no livery attributes before');
  car.livery.set([newLayer('stripe','left')]);car.syncDrawBatch();
  const after=batched();assert.ok(after.length>0,kind+' rebuilt');
  assert.ok(after.some(m=>m.geometry.getAttribute('liveryNormal')),kind+' merged copies carry liveryNormal');
  assert.ok(before.every(m=>!inScene(m)),kind+' old batch removed');
  car.livery.set([newLayer('star','right')]);car.syncDrawBatch();const kept=batched();
  assert.ok(kept.length===after.length&&kept.every((m,i)=>m===after[i]),kind+' later edits keep the batch');
  car.dispose?.();world.free();
 }
});
