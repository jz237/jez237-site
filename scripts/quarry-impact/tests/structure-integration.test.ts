import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {CAR_KINDS,DEFINITIONS} from '../src/rules';
import {stockSetup} from '../src/garage';
import {createVehiclePhysics} from '../src/vehicle-physics';
import {freshComponents,applyComponentImpact} from '../src/component-damage';
await R.init();
const original=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`);
function equalGeometry(a:R.RigidBody,b:R.RigidBody){
 assert.equal(a.numColliders(),b.numColliders());
 for(let i=0;i<a.numColliders();i++){
  const ca=a.collider(i),cb=b.collider(i);assert.equal(ca.shapeType(),cb.shapeType());
  for(const method of ['translationWrtParent','rotationWrtParent']as const){const va=ca[method]()!,vb=cb[method]()!;for(const key of ['x','y','z']as const)close(va[key],vb[key]);}
  close(ca.volume(),cb.volume());
 }
}
test('rendered cars and the shared authority retain identical contact geometry through rotated hits, scars and repairs',()=>{
 for(const kind of CAR_KINDS)for(const armor of [0,3]){
  const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),setup=stockSetup(kind);setup.armor=armor;
  const car=new Vehicle(0,kind,setup.paint,scene,world,{emit(){},mark(){},detach(){}}as any,setup),physical=createVehiclePhysics(R,world,kind,car.specification.mass,armor),state=freshComponents();
  try{
   car.place(3,4,.8);car.root.updateMatrixWorld(true);const d=DEFINITIONS[kind];
   for(const [point,direction]of [[new T.Vector3(0,0,d.halfLength),new T.Vector3(0,0,-1)],[new T.Vector3(-d.halfWidth,0,0),new T.Vector3(1,0,0)],[new T.Vector3(0,1,0),new T.Vector3(0,-1,0)]]){
    car.hit(point.clone().applyMatrix4(car.root.matrixWorld),direction.clone().applyQuaternion(car.root.quaternion),25,1,true);
    applyComponentImpact(state,kind,point,direction,25*car.specification.damageScale);physical.structure.update(state.structure,car.health);equalGeometry(car.body,physical.body);
   }
   const before=car.structuralDamage!.slice();car.scar(new T.Vector3(0,0,d.halfLength).applyMatrix4(car.root.matrixWorld),new T.Vector3(0,0,-1).applyQuaternion(car.root.quaternion));assert.deepEqual(car.structuralDamage,before);equalGeometry(car.body,physical.body);
   car.repair();physical.structure.update([0,0,0,0,0]);equalGeometry(car.body,physical.body);
  }finally{car.dispose();world.removeVehicleController(physical.controller);world.free();}
 }
});
