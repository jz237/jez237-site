import test from 'node:test';
import assert from 'node:assert/strict';
import {PerspectiveCamera} from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {configureFrontOrbit,updateFrontOrbit} from './front-orbit.js';

test('auto orbit repeatedly reverses at both side profiles without entering the rear hemisphere',()=>{
 const camera=new PerspectiveCamera();camera.position.set(0,0,24);
 const controls=new OrbitControls(camera,null);
 configureFrontOrbit(controls);controls.enableDamping=true;controls.dampingFactor=.07;
 controls.autoRotate=true;controls.autoRotateSpeed=.24;
 let reversals=0,previousSpeed=controls.autoRotateSpeed;
 for(let i=0;i<40000;i++){
  updateFrontOrbit(controls,1/30,true);
  assert.ok(camera.position.z>=-1e-10);
  assert.ok(Math.abs(controls.getAzimuthalAngle())<=Math.PI/2+1e-10);
  if(controls.autoRotateSpeed!==previousSpeed){
   assert.ok(Math.abs(Math.abs(controls.getAzimuthalAngle())-Math.PI/2)<1e-6);
   previousSpeed=controls.autoRotateSpeed;reversals++;
  }
 }
 assert.ok(reversals>=10);
});

test('manual camera positions are clamped and paused auto orbit remains still',()=>{
 const camera=new PerspectiveCamera();camera.position.set(0,0,24);
 const controls=new OrbitControls(camera,null);configureFrontOrbit(controls);
 for(const x of [-1,1]){
  camera.position.set(x,2,-24);controls.update(0);
  assert.ok(camera.position.z>=-1e-10);
 }
 controls.autoRotate=true;const before=camera.position.clone();
 for(let i=0;i<60;i++)updateFrontOrbit(controls,1/60,false);
 assert.ok(camera.position.distanceTo(before)<1e-9);
 assert.equal(controls.autoRotate,true);
});
