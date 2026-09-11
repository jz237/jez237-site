import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {aquariumFrame,aquariumTarget,aquariumFieldOfView,framingSpace,orbitToward} from '../lib/CameraFraming.ts';

test('tank, stand and lamp fit front, angled and side presets across screen sizes',()=>{
 for(const [width,height] of [[360,640],[390,844],[320,740],[720,1280],[1116,1238],[1920,1080],[844,390]])for(const angle of [0,.47,1.28]){
  const position=new T.Vector3(Math.sin(angle)*21.5,angle===0?2.45:7.5,Math.cos(angle)*21.5);
  const fov=aquariumFieldOfView(width,height,position),camera=new T.PerspectiveCamera(fov,width/height,.1,100);
  assert.ok(Number.isFinite(fov)&&fov>10&&fov<110);
  camera.position.copy(position);camera.lookAt(aquariumTarget);camera.updateMatrixWorld();
  const space=framingSpace(height);
  for(const x of [aquariumFrame.min.x,aquariumFrame.max.x])for(const y of [aquariumFrame.min.y,aquariumFrame.max.y])for(const z of [aquariumFrame.min.z,aquariumFrame.max.z]){
   const p=new T.Vector3(x,y,z).project(camera);
   assert.ok(Math.abs(p.x)<=space.horizontal+1e-6,`horizontal clipping at ${width}x${height}`);
   assert.ok(Math.abs(p.y)<=space.vertical+1e-6,`vertical clipping at ${width}x${height}`);
  }
 }
});

test('framing changes smoothly through former aspect-ratio thresholds',()=>{
 for(const aspect of [.8,.9,1.1]){
  const position=new T.Vector3(0,2.45,21.5);
  const before=aquariumFieldOfView(aspect*1000-.1,1000,position),after=aquariumFieldOfView(aspect*1000+.1,1000,position);
  assert.ok(Math.abs(before-after)<.03,'resizing must not cause a sudden zoom jump');
 }
});

test('preset transitions travel around the aquarium without cutting inward',()=>{
 const start=new T.Vector3(0,2.45,21.5),end=new T.Vector3(Math.sin(1.28)*21.5,7.5,Math.cos(1.28)*21.5);
 const r0=start.distanceTo(aquariumTarget),r1=end.distanceTo(aquariumTarget);
 for(let t=0;t<=1;t+=.02){
  const position=orbitToward(start,end,t);
  assert.ok(Math.abs(position.distanceTo(aquariumTarget)-T.MathUtils.lerp(r0,r1,t))<1e-8);
  assert.ok(Number.isFinite(aquariumFieldOfView(390,844,position)));
 }
 assert.ok(orbitToward(start,end,1).distanceTo(end)<1e-8);
});
