import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeEffectBodyView,nativeEffectEngineMask,captureNativeEffectBody} from '../native-effect-body-view.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';

test('physical views reject missing reached fields rather than fabricating body storage',()=>{
 const input={bodyFieldsBySlot:[{positionNative:{x:1.1,y:2,z:3},engineMaskC66:0x2000}]},view=nativeEffectBodyView(input,0);
 assert.equal(view.float(0x44),Math.fround(1.1));assert.equal(nativeEffectEngineMask(input,0),0x2000);
 assert.throws(()=>view.float(0xbf0),/boundaryDrift/);assert.throws(()=>view.half(0x16cc),/alternate/);
 assert.equal(nativeEffectBodyView(input,1),null);assert.equal(nativeEffectEngineMask(input,1),undefined);
 assert.throws(()=>nativeEffectBodyView({...input,bodyWordsBySlot:[Array(1478).fill(0)]},0),/one physical/);
});

test('physical capture uses retained frame and last-tick motion owners with an explicit applied wrap',()=>{
 const race=createRace({mode:'time',physics:'native',course:getCourse('greyhaven')}),a=race.nativeHost.world.adapters[0];
 assert.throws(()=>captureNativeEffectBody(a,{boundaryDriftNative:{x:0,z:0}}),/completed/);
 for(let i=0;i<100;i++)stepRace(race,{throttle:1},.01);
 assert.throws(()=>captureNativeEffectBody(a),/boundary drift/);
 const before=structuredClone({hull:a.hull,lastFrame:a.lastFrame}),drift={x:49152,z:-0},q=captureNativeEffectBody(a,{boundaryDriftNative:drift});
 for(const k of ['x','y','z']){
  assert.equal(q.positionNative[k],Math.fround(a.hull.center[k]/a.hull.scale));
  assert.equal(q.frameDisplacementNative[k],a.lastFrame.frameDisplacementNative[k]);
  assert.equal(q.referenceVelocityNative[k],Math.fround(a.hull.sprayMotionNative.velocity[k]));
  assert.equal(q.tickDisplacementNative[k],Math.fround(a.hull.sprayMotionNative.centerVelocity[k]));
 }
 assert.equal(q.engineMaskC66,a.frame.controls.engineMask);assert.equal(q.stumbleCountdown16e0,a.riderLifecycle.state.stumbleCountdown);
 assert.deepEqual(q.boundaryDriftNative,drift);drift.x=0;assert.equal(q.boundaryDriftNative.x,49152);
 assert.ok(Object.isFrozen(q)&&Object.isFrozen(q.positionNative));
 assert.deepEqual({hull:a.hull,lastFrame:a.lastFrame},before);
 stepRace(race,{throttle:1},.01);
 assert.throws(()=>captureNativeEffectBody(a,{boundaryDriftNative:{x:0,z:0}}),/completed/,'partial next frame cannot mix owners');
});

test('structured halves and floats preserve native validation and signed zero',()=>{
 const a={bodyFieldsBySlot:[{boundaryDriftNative:{x:-0,z:0},alternate16cc:65535,stumbleCountdown16e0:1}]},view=nativeEffectBodyView(a,0);
 assert.ok(Object.is(view.float(0xbf0),-0));assert.equal(view.half(0x16cc),65535);
 a.bodyFieldsBySlot[0].stumbleCountdown16e0=65536;assert.throws(()=>view.half(0x16e0),/stumbleCountdown/);
 a.bodyFieldsBySlot[0].boundaryDriftNative.x=Infinity;assert.throws(()=>view.float(0xbf0),/Nonfinite/);
 assert.throws(()=>view.float(0x999),/Unsupported/);
});
