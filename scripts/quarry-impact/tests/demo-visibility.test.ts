import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import R from '@dimforge/rapier3d-compat';
import {cameraObstruction,clearCameraView,unobstructedDemoPosition} from '../src/demo-camera-visibility';
import {DemoDirector} from '../src/demo-director';import {verifyDemoVisibilityRevision} from './demo-visibility-invariants';
await R.init();
const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
function fixture(){const world=new R.World({x:0,y:0,z:0}),body=world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(0,.85,0));world.createCollider(R.ColliderDesc.cuboid(.9,.5,2.4),body);const focus=V(0,1.2,0),desired=V(0,4.5,-10),probe=(a:T.Vector3,b:T.Vector3)=>cameraObstruction(world,a,b,body);return{world,body,focus,desired,probe};}
test('camera queries exclude the subject and sensors but include enabled static and dynamic obstructions',()=>{
 const {world,body,focus,desired,probe}=fixture();try{
  world.createCollider(R.ColliderDesc.cuboid(4,4,.2).setTranslation(0,3,-2).setSensor(true));world.step();assert.equal(probe(focus,desired),null);
  const wall=world.createCollider(R.ColliderDesc.cuboid(4,4,.3).setTranslation(0,3,-5));world.step();assert.ok(probe(focus,desired)!>0);wall.setEnabled(false);world.step();assert.equal(probe(focus,desired),null);
  const other=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(0,3,-5));world.createCollider(R.ColliderDesc.cuboid(2,2,1),other);world.step();assert.ok(probe(focus,desired)!>0);
  assert.equal(cameraObstruction(world,focus,focus,body),null);
 }finally{world.free();}
});
test('obstructed shots find a clear alternative outside the real collider and preserve clear shots exactly',()=>{
 const {world,focus,desired,probe}=fixture();try{
  world.step();assert.deepEqual(unobstructedDemoPosition(focus,desired,probe,()=>0).toArray(),desired.toArray());
  world.createCollider(R.ColliderDesc.cuboid(5,3,.5).setTranslation(0,3,-5));world.step();assert.equal(clearCameraView(focus,desired,probe),false);
  const result=unobstructedDemoPosition(focus,desired,probe,()=>0);assert.ok(clearCameraView(focus,result,probe));assert.ok(result.distanceTo(desired)>1);assert.ok(result.distanceTo(focus)<30);assert.ok(result.y>.7);
 }finally{world.free();}
});
test('the camera aperture catches a narrow post that a centre ray misses',()=>{
 const {world,focus,desired,probe}=fixture();try{
  const t=.9,centre=focus.clone().lerp(desired,t);world.createCollider(R.ColliderDesc.cuboid(.035,.4,.04).setTranslation(centre.x+.198,centre.y,centre.z));world.step();
  assert.equal(probe(focus,desired),null);assert.equal(clearCameraView(focus,desired,probe),false);
  assert.ok(clearCameraView(focus,unobstructedDemoPosition(focus,desired,probe,()=>0),probe));
 }finally{world.free();}
});
test('director holds a clear shot beside a wall and returns smoothly after the obstruction is removed',()=>{
 const {world,body,probe}=fixture();try{
  const wall=world.createCollider(R.ColliderDesc.cuboid(5,3,.5).setTranslation(0,3,-5));world.step();
  const root=new T.Group();root.position.set(0,.85,0);const c={id:0,kind:'wagon',root,current:root.position,speed:0,health:100,finished:false,body}as any;
  const director=new DemoDirector(undefined,(a,b)=>probe(a,b)),camera=new T.PerspectiveCamera(52,16/9,.1,850),orbit={target:V(0,0,0),update(){}}as any;
  director.select('chase');director.follow(0);let previous:T.Vector3|undefined,maxStep=0;
  for(let i=0;i<120;i++){director.update([c],camera,orbit,1/60,false);assert.ok(clearCameraView(V(0,1.2,0),camera.position,probe));if(previous)maxStep=Math.max(maxStep,camera.position.distanceTo(previous));previous=camera.position.clone();}
  assert.ok(maxStep<.15,'A stationary obstructed shot must not flicker between alternate angles');const elevated=camera.position.clone();wall.setEnabled(false);world.step();
  for(let i=0;i<180;i++)director.update([c],camera,orbit,1/60,false);assert.ok(camera.position.y<elevated.y-1);assert.ok(clearCameraView(V(0,1.2,0),camera.position,probe));
 }finally{world.free();}
});
test('fully enclosed subjects keep finite camera positions rather than teleporting through invalid math',()=>{
 const {world,focus,desired,probe}=fixture();try{world.createCollider(R.ColliderDesc.cuboid(40,40,40));world.step();const result=unobstructedDemoPosition(focus,desired,probe,()=>0);assert.ok(result.toArray().every(Number.isFinite));assert.deepEqual(result.toArray(),desired.toArray());}finally{world.free();}
});
test('preceding camera and main-loop source remains recoverable',()=>verifyDemoVisibilityRevision());

test('a wall clearing the subject centre must also clear the whole body outline',()=>{
 const {world,focus,desired,probe}=fixture();try{
  world.createCollider(R.ColliderDesc.cuboid(5,3,.5).setTranslation(0,3,-5));world.step();
  const points:T.Vector3[]=[];for(const x of [-.914,.914])for(const y of [.45,1.55])for(const z of [-2.44,2.44])points.push(V(x,y,z));
  const centreOnly=unobstructedDemoPosition(focus,desired,probe,()=>0);assert.ok(clearCameraView(focus,centreOnly,probe));assert.ok(points.some(p=>probe(p,centreOnly)!==null),'Fixture must reproduce the partially hidden car');
  const fullBody=unobstructedDemoPosition(focus,desired,probe,()=>0,points);assert.ok(points.every(p=>probe(p,fullBody)===null),'Every body corner needs an unobstructed sightline');
 }finally{world.free();}
});
