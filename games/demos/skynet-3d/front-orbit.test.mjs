import test from 'node:test';
import assert from 'node:assert/strict';
import {PerspectiveCamera} from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {configureFrontOrbit,updateFrontOrbit} from './front-orbit.js';

function setup(){
 const camera=new PerspectiveCamera();camera.position.set(0,0,24);
 const controls=new OrbitControls(camera,null);configureFrontOrbit(controls);
 controls.enableDamping=true;controls.dampingFactor=.07;controls.autoRotate=true;
 return controls;
}
function angle(controls,theta,phi){
 assert.ok(Math.abs(controls.getAzimuthalAngle()-theta*Math.PI/180)<1e-8);
 assert.ok(Math.abs(controls.getPolarAngle()-phi*Math.PI/180)<1e-8);
}
test('ordered 45° left, 45° up, 90° right, 45° down, 90° left loop',()=>{
 const c=setup();
 updateFrontOrbit(c,5,true);angle(c,-45,90);
 for(let loop=0;loop<4;loop++){
  updateFrontOrbit(c,5,true);angle(c,-45,45);
  updateFrontOrbit(c,10,true);angle(c,45,45);
  updateFrontOrbit(c,5,true);angle(c,45,90);
  updateFrontOrbit(c,10,true);angle(c,-45,90);
 }
});
test('path stays in front, preserves zoom, and is independent of frame rate',()=>{
 const a=setup(),b=setup();
 for(let i=0;i<3600;i++){
  updateFrontOrbit(a,1/60,true);
  assert.ok(a.object.position.z>0);
  assert.ok(Math.abs(a.object.position.length()-24)<1e-8);
 }
 updateFrontOrbit(b,60,true);
 assert.ok(a.object.position.distanceTo(b.object.position)<1e-8);
});
test('pause freezes the route and resumes it without a jump',()=>{
 const c=setup();updateFrontOrbit(c,3,true);const before=c.object.position.clone();
 for(let i=0;i<60;i++)updateFrontOrbit(c,1/60,false);
 assert.ok(c.object.position.distanceTo(before)<1e-9);
 assert.equal(c.autoRotate,true);
 updateFrontOrbit(c,2,true);angle(c,-45,90);
});
test('manual interaction takes priority; disabling orbit prevents movement',()=>{
 const c=setup();updateFrontOrbit(c,3,true);c.dispatchEvent({type:'start'});
 const before=c.object.position.clone();updateFrontOrbit(c,10,true);
 assert.ok(c.object.position.distanceTo(before)<1e-9);
 c.dispatchEvent({type:'end'});updateFrontOrbit(c,0,true);
 assert.ok(c.object.position.distanceTo(before)<1e-9);
 c.autoRotate=false;updateFrontOrbit(c,10,true);
 assert.ok(c.object.position.distanceTo(before)<1e-9);
});
