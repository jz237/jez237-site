import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import R from '@dimforge/rapier3d-compat';
import {clearChasePosition} from '../src/chase-camera-clearance';import {cameraObstruction,clearCameraView} from '../src/demo-camera-visibility';import {buildFoundryPhysics} from '../src/foundry-arena';
await R.init();
test('clear view keeps the chase pose exact and a blocked boom never flips sides',()=>{
 const a=new T.Vector3(0,1.5,0),d=new T.Vector3(0,3,-8);assert.deepEqual(clearChasePosition(a,d,()=>null),d);
 const p=clearChasePosition(a,d,()=>4);assert.ok(p.distanceTo(a)<4);assert.ok(p.z<0);assert.ok(p.clone().sub(a).cross(d.clone().sub(a)).length()<1e-9);
 assert.deepEqual(clearChasePosition(a,a,()=>0),a);
});
test('Foundry walls obstruct the old chase view and the shortened boom clears them',()=>{
 const world=new R.World({x:0,y:-9.81,z:0});buildFoundryPhysics(R,world);world.step();try{
 for(const sign of [-1,1]){const a=new T.Vector3(0,1.7,sign*48),desired=new T.Vector3(0,3,sign*57),query=(from:T.Vector3,to:T.Vector3)=>cameraObstruction(world,from,to,undefined,true);
 assert.notEqual(query(a,desired),null);const p=clearChasePosition(a,desired,query);assert.ok(clearCameraView(a,p,query));assert.ok(p.distanceTo(a)<desired.distanceTo(a));assert.equal(Math.sign(p.z-a.z),sign);}
 }finally{world.free();}
});
test('aperture catches an off-centre post that the centre ray misses; sensors are ignored',()=>{
 const w=new R.World({x:0,y:0,z:0});try{w.createCollider(R.ColliderDesc.cuboid(.07,2,.1).setTranslation(.25,1,-4));w.createCollider(R.ColliderDesc.cuboid(4,4,.1).setTranslation(0,1,-2).setSensor(true));w.step();const a=new T.Vector3(0,1,0),d=new T.Vector3(0,1,-8),query=(from:T.Vector3,to:T.Vector3)=>cameraObstruction(w,from,to,undefined,true);assert.equal(query(a,d),null);const p=clearChasePosition(a,d,query);assert.ok(p.z>-4&&p.z< -2);assert.ok(clearCameraView(a,p,query));}finally{w.free();}
});
