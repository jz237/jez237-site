import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {DemoDirector,type DemoCamera} from '../src/demo-director';import {DEFINITIONS,type CarKind} from '../src/rules';
import {landscapeHeight} from '../src/quarry-layout';import {verifyDemoPresentationRevision} from './demo-presentation-invariants';
const car=(id:number,x=0,z=0,kind:CarKind='wagon')=>{const root=new T.Group();root.position.set(x,landscapeHeight(x,z)+.85,z);return{id,kind,root,current:root.position,speed:18,health:100,finished:false}as any;};
const rig=(aspect=16/9)=>({camera:new T.PerspectiveCamera(52,aspect,.1,850),orbit:{target:new T.Vector3(),enabled:false,update(){}}as any});
const bounds=(c:ReturnType<typeof car>)=>{const d=DEFINITIONS[c.kind as CarKind],out:T.Vector3[]=[];for(const x of [-d.halfWidth,d.halfWidth])for(const y of [-.55,.9])for(const z of [-d.halfLength,d.halfLength])out.push(new T.Vector3(x,y,z).applyQuaternion(c.root.quaternion).add(c.root.position));return out;};
const framed=(c:ReturnType<typeof car>,camera:T.PerspectiveCamera)=>{for(const p of bounds(c)){const v=p.project(camera);assert.ok(Math.abs(v.x)<.865&&v.y>-.825&&v.y<.525,`Body clipped at ${v.toArray()}`);assert.ok(v.z>-1&&v.z<1);}};
test('close demo shots frame the whole car and adjacent rival in wide and narrow windows',()=>{
 for(const aspect of [16/9,1,9/16])for(const view of ['chase','drone']as DemoCamera[]){const a=car(0),b=car(1,7,4),d=new DemoDirector(),{camera,orbit}=rig(aspect);d.select(view);d.follow(0);d.update([a,b],camera,orbit,1/60,false);framed(a,camera);if(view==='drone')framed(b,camera);
  assert.ok(camera.position.distanceTo(a.root.position)<45,'Framing must not retreat to a distant overview');
  if(view==='drone'&&aspect===16/9)assert.ok(camera.position.y-a.root.position.y<20,'Drone must show vehicle detail');
 }
});
test('chase framing remains stable at speed and through heading changes without nine-second reset snaps',()=>{
 const a=car(0),d=new DemoDirector(),{camera,orbit}=rig();d.select('chase');d.follow(0);let maxStep=0;
 for(let i=0;i<900;i++){
  const yaw=Math.sin(i/300)*.6;a.root.quaternion.setFromAxisAngle(new T.Vector3(0,1,0),yaw);a.root.position.add(new T.Vector3(Math.sin(yaw)*.3,0,Math.cos(yaw)*.3));a.root.position.y=landscapeHeight(a.root.position.x,a.root.position.z)+.85;
  const before=camera.position.clone();d.update([a],camera,orbit,1/60,true);framed(a,camera);if(i>0)maxStep=Math.max(maxStep,before.distanceTo(camera.position));
 }
 assert.ok(maxStep<3,'Following should not snap when its periodic selection timer expires');
});
test('automatic direction shows recent impacts after a minimum hold and respects manual follow',()=>{
 const a=car(0),b=car(1,20),d=new DemoDirector(),{camera,orbit}=rig();d.update([a,b],camera,orbit,1/60,false);assert.equal(d.followed,0);
 for(let i=0;i<60;i++)d.update([a,b],camera,orbit,1/60,false);b.health=70;d.update([a,b],camera,orbit,1/60,false);assert.equal(d.followed,0,'No rapid impact cut');
 for(let i=0;i<150;i++)d.update([a,b],camera,orbit,1/60,false);assert.equal(d.followed,1,'Fresh impact should draw attention');
 d.follow(0);b.health=30;for(let i=0;i<700;i++)d.update([a,b],camera,orbit,1/60,false);assert.equal(d.followed,0);
});
test('automatic shots stay close, skip finished cars and never choose an overhead shot on a fixed cycle',()=>{
 const a=car(0),b=car(1,5),d=new DemoDirector(),{camera,orbit}=rig(),shots=new Set<string>();
 for(let i=0;i<2000;i++){if(i===100)a.finished=true;d.update([a,b],camera,orbit,1/60,true);shots.add(d.activeView);if(i>100)assert.equal(d.followed,1);}
 assert.deepEqual([...shots].sort(),['chase','drone','trackside']);
});
test('cameras stay finite and above actual quarry terrain with rolled and vertical targets',()=>{
 for(const [x,z]of [[0,0],[80,0],[105,40],[-115,-20]])for(const rotation of [Math.PI/2,Math.PI])for(const view of ['drone','chase','trackside','hood']as DemoCamera[]){
  const a=car(0,x,z),d=new DemoDirector(),{camera,orbit}=rig();a.root.rotation.x=rotation;d.select(view);d.update([a],camera,orbit,1/60,false);
  assert.ok(camera.position.toArray().every(Number.isFinite));assert.ok(camera.quaternion.toArray().every(Number.isFinite));assert.ok(camera.position.y>=landscapeHeight(camera.position.x,camera.position.z)+.64);
 }
});
test('empty fields, invalid time and inherited property names leave the director safe',()=>{
 const d=new DemoDirector(),{camera,orbit}=rig(),a=car(0);d.cycleCar([]);d.select('toString' as DemoCamera);assert.equal(d.view,'director');d.update([a],camera,orbit,1/60,false);const before=camera.matrixWorld.clone();d.update([a],camera,orbit,NaN,false);assert.ok(before.equals(camera.matrixWorld));d.update([],camera,orbit,1/60,false);d.reset();
});
test('demo camera source retains the preceding release in the revision chain',()=>verifyDemoPresentationRevision());

test('a newly wrecked car gets a short impact shot before attention returns to running cars',()=>{
 const a=car(0),b=car(1,20),d=new DemoDirector(),{camera,orbit}=rig();
 for(let i=0;i<200;i++)d.update([a,b],camera,orbit,1/60,false);
 b.health=0;d.update([a,b],camera,orbit,1/60,false);assert.equal(d.followed,1,'Do not cut away from a car at the instant it wrecks');
 for(let i=0;i<300;i++)d.update([a,b],camera,orbit,1/60,false);assert.equal(d.followed,0,'A static wreck must not monopolize the demo');
});
