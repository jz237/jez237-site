import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeHull} from '../native-hull.js';
import {createAuthoredNativeRider} from '../authored-native-rider.js';
import {stepNativeArticulatedRider} from '../native-articulated-rider.js';
import {createNativeRiderControlState,prepareNativeRiderControls,finishNativeRiderControls} from '../native-rider-controls.js';

const F=Math.fround,v=(x=0,y=0,z=0)=>({x,y,z});
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);

test('B gravity and control state stay latched through all five hull ticks',()=>{
 const observed=[],a=createNativeRaceAdapter({position:v(0,5,0),contacts:{shore:(h,c)=>observed.push({g:c.water.lastGravityNative,f:a.frame.physicalControls.crouchFactor})&&undefined}});
 stepNativeRaceAdapter(a,.05,{heldButtons:0x4000});
 assert.deepEqual(observed,Array.from({length:5},()=>({g:-0.3360000550746918,f:F(.9)})));
 assert.equal(a.riderControlState.phase,'ready');assert.equal(a.riderControlState.crouchFactor,0.9099999666213989);
 assert.equal(a.lastFrame.physicalControls.crouchFactor,F(.9));assert.equal(a.lastFrame.physicalControls.enteredCrouch,true);
});

test('B target compression and manipulation reach the actual nineteen-point solve',()=>{
 const bundle=createAuthoredNativeRider({initialHull:createNativeHull()}),provider=bundle.riderPose;
 const manual=structuredClone(bundle.articulatedRider);let pose;
 const a=createNativeRaceAdapter({...bundle,riderPose:(h,c)=>{pose=provider(h,c);return pose;}});
 stepNativeRaceAdapter(a,.05,{heldButtons:0x4000});
 const p=a.water.profile,state=createNativeRiderControlState({baseLateralRetention:p.waterLateralRetention,baseRollBalance:p.rollBalance});
 const prepared=prepareNativeRiderControls(state,{heldButtons:0x4000,pressedButtons:0x4000});
 const post=finishNativeRiderControls(prepared.state,{targets:pose.targets,center:a.hull.center,up:a.hull.frame.up,scale:a.hull.scale});
 stepNativeArticulatedRider(manual,{...pose,targets:post.targets,manipulationDeltas:post.manipulationDeltas,center:a.hull.center,up:a.hull.frame.up});
 assert.deepEqual(a.articulatedRider.points,manual.points);assert.deepEqual(a.lastFrame.jointWorld,manual.jointWorld);
 assert.ok(post.manipulationDeltas.some(p=>p.y<-.02));assert.notDeepEqual(post.targets,pose.targets);
 stepNativeRaceAdapter(a,.01,{});assert.deepEqual(a.frame.prepared.jointWorld,manual.jointWorld);
});

test('B release affects its current complete frame then resets for the following one',()=>{
 const a=createNativeRaceAdapter({position:v(0,5,0)});stepNativeRaceAdapter(a,.05,{heldButtons:0x4000});
 stepNativeRaceAdapter(a,.01,{});assert.equal(a.frame.physicalControls.crouchFactor,0.9099999666213989);
 assert.ok(a.water.lastGravityNative<F(-.192));stepNativeRaceAdapter(a,.04,{});
 assert.equal(a.riderControlState.crouchFactor,1);assert.equal(a.lastFrame.physicalControls.nextCrouchFactor,1);
 stepNativeRaceAdapter(a,.01,{});assert.equal(a.water.lastGravityNative,F(-.192));
});

test('R retains lateral motion without adding reverse or changing forward drag',()=>{
 const capture=heldButtons=>{
  let velocity;
  const a=createNativeRaceAdapter({position:v(0,-1,0),velocity:v(8,0,5),contacts:{shore:h=>{velocity={...h.points[3].velocity};}}});
  stepNativeRaceAdapter(a,.01,{heldButtons});return {a,velocity};
 };
 const base=capture(0),slide=capture(0x10);
 assert.ok(slide.velocity.x>base.velocity.x);near(slide.velocity.z,base.velocity.z);
 assert.equal(slide.a.frame.physicalControls.lateralRetention,F(F(F(.92)*F(.2))+F(.8)));
 assert.equal(slide.a.water.lastJet.magnitudeNative,0);
});

test('R release slews once per frame and preserves source contact-mode roll selection while held',()=>{
 const a=createNativeRaceAdapter({sourceState:{contactMode:1}});
 stepNativeRaceAdapter(a,.05,{});const reduced=a.lastFrame.physicalControls.rollBalance;
 assert.equal(reduced,F(F(.023)*F(.01)));
 stepNativeRaceAdapter(a,.05,{heldButtons:0x10},{sourceState:{contactMode:0}});
 assert.equal(a.lastFrame.physicalControls.rollBalance,reduced);const retained=a.lastFrame.physicalControls.lateralRetention;
 stepNativeRaceAdapter(a,.05,{},{sourceState:{contactMode:0}});
 assert.equal(a.lastFrame.physicalControls.lateralRetention,F(retained-F(.01)));
 assert.equal(a.lastFrame.physicalControls.rollBalance,F(.023));
});

test('actor23 clears an existing engine immediately but raw R preparation still runs',()=>{
 const a=createNativeRaceAdapter();stepNativeRaceAdapter(a,.1,{throttle:1});assert.ok(a.water.forceNative>0);
 stepNativeRaceAdapter(a,.01,{heldButtons:0xc010},{sourceState:{actorState:23}});
 assert.equal(a.lastControls.muted,true);assert.equal(a.lastControls.heldButtons,0xc010);
 assert.equal(a.water.forceNative,0);assert.equal(a.frame.physicalControls.enteredCrouch,false);
 assert.equal(a.water.lastGravityNative,F(F(-.192)*F(.7)));
 assert.ok(a.frame.physicalControls.lateralRetention>F(.92));
});

test('dry rider multiplier is selected before B and never applied twice in water',()=>{
 const a=createNativeRaceAdapter({riderIndex:1,position:v(0,10,0)});stepNativeRaceAdapter(a,.05,{});
 assert.equal(a.water.anyWet,false);stepNativeRaceAdapter(a,.01,{heldButtons:0x4000});
 const multiplier=F(F(F(1-F(.9))*F(7.5))+1),gravity=F(F(F(-.192)*F(1.2))*multiplier);
 assert.equal(a.water.lastGravityNative,gravity);assert.notEqual(gravity,F(gravity*F(1.2)));
});

test('physical-control snapshot fields are detached display values',()=>{
 const a=createNativeRaceAdapter();stepNativeRaceAdapter(a,.05,{heldButtons:0x4000});
 const view=nativeRaceSnapshot(a);view.source.physicalControls.crouchFactor=0;
 assert.equal(a.lastFrame.physicalControls.crouchFactor,F(.9));assert.equal(a.riderControlState.crouchFactor,0.9099999666213989);
});
