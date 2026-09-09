import test from 'node:test';
import assert from 'node:assert/strict';
import {PerspectiveCamera} from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {configureFrontOrbit,updateFrontOrbit,frontOrbitStats} from './front-orbit.js';

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
test('manual controls allow the rear but block views below level height',()=>{
 const c=setup();c.autoRotate=false;
 for(const x of [-20,0,20]){
  c.object.position.set(x,-10,-24);c.update(0);
  assert.ok(c.object.position.z<0);
  assert.ok(c.object.position.y>=c.target.y-1e-9);
  assert.ok(c.getPolarAngle()<=Math.PI/2+1e-9);
 }
});
test('ordered 45° left, 45° up, 90° right, 45° down, 90° left loop',()=>{
 const c=setup();
 updateFrontOrbit(c,4,true);angle(c,0,90);
 updateFrontOrbit(c,5,true);angle(c,-45,90);
 for(let loop=0;loop<4;loop++){
  updateFrontOrbit(c,5,true);angle(c,-45,45);
  updateFrontOrbit(c,10,true);angle(c,45,45);
  updateFrontOrbit(c,5,true);angle(c,45,90);
  updateFrontOrbit(c,5,true);angle(c,0,90);
  assert.equal(frontOrbitStats(c).orbitHolding,true);
  updateFrontOrbit(c,3.9,true);angle(c,0,90);
  assert.ok(Math.abs(frontOrbitStats(c).orbitHoldRemaining-.1)<1e-8);
  updateFrontOrbit(c,.1,true);angle(c,0,90);
  updateFrontOrbit(c,5,true);angle(c,-45,90);
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
 const c=setup();updateFrontOrbit(c,7,true);const before=c.object.position.clone();
 for(let i=0;i<60;i++)updateFrontOrbit(c,1/60,false);
 assert.ok(c.object.position.distanceTo(before)<1e-9);
 assert.equal(c.autoRotate,true);
 updateFrontOrbit(c,2,true);angle(c,-45,90);
});
test('animation pause freezes the four-second center hold timer',()=>{
 const c=setup();updateFrontOrbit(c,1.5,true);
 const remaining=frontOrbitStats(c).orbitHoldRemaining;
 updateFrontOrbit(c,20,false);angle(c,0,90);
 assert.equal(frontOrbitStats(c).orbitHoldRemaining,remaining);
 updateFrontOrbit(c,2.5,true);angle(c,0,90);
 updateFrontOrbit(c,1,true);assert.ok(c.getAzimuthalAngle()<0);
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
