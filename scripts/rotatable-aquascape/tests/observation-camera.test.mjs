import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {ObservationCamera} from '../lib/ObservationCamera.ts';
test('observation cycles through all inhabitants without abrupt camera jumps or entering the tank',()=>{
 const director=new ObservationCamera(),camera=new T.PerspectiveCamera(45,1.7),target=new T.Vector3(0,2.75,0);camera.position.set(0,4,21.5);
 const subjects=['angels','school','shrimp','cory'].map((kind,i)=>({id:kind,kind,point:new T.Vector3(i-2,i<2?3:1,1),radius:kind==='school'?2.5:.8})),seen=new Set();director.start();
 for(let i=0;i<90*30;i++){const old=camera.position.clone(),aim=target.clone();director.update(1/30,camera,target,subjects,()=>true,45);seen.add(director.label);assert.ok(camera.position.distanceTo(old)<=1.6/30+1e-9);assert.ok(target.distanceTo(aim)<=.6/30+1e-9);assert.ok(camera.position.z>=3.5);}
 assert.equal(seen.size,5);director.stop();const held=camera.position.clone();director.update(1,camera,target,subjects,()=>true,45);assert.deepEqual(camera.position,held);
});
test('occluded subjects fall back to overview, pause freezes camera, and reduced motion stays on overview',()=>{
 const director=new ObservationCamera(),camera=new T.PerspectiveCamera(),target=new T.Vector3();camera.position.set(0,4,21.5);director.start();
 const subjects=[{id:'angel',kind:'angels',point:new T.Vector3(0,3,0),radius:1}];
 for(let i=0;i<1200;i++)director.update(.05,camera,target,subjects,()=>false,45);assert.equal(director.label,'A small world');
 const held=camera.position.clone();director.update(0,camera,target,subjects,()=>true,45);assert.deepEqual(camera.position,held);
 director.start();for(let i=0;i<2000;i++)director.update(.05,camera,target,subjects,()=>true,45,true);assert.equal(director.label,'A small world');
});
