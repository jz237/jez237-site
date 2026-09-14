import test from 'node:test';import assert from 'node:assert/strict';
import {cocPixels,dofFor,DOF_VIEWS,DOF_TAPS} from '../dof-model.js';
test('the circle of confusion is zero on the focus plane, grows toward the aperture in the distance, and is capped',()=>{
 assert.equal(cocPixels(1,1,16,18),0);assert.equal(cocPixels(1.15,1,16,18,.2),0,'inside the focal band');assert.ok(cocPixels(1.15,1,16,18)>0&&cocPixels(1.5,1,16,18,.2)>0,'outside it blurs');
 assert.ok(cocPixels(2,1,16,18)>cocPixels(1.5,1,16,18)&&cocPixels(1.5,1,16,18)>0,'farther is softer');
 assert.ok(Math.abs(cocPixels(1000,1,16,18)-16)<.1,'the far background reaches the aperture');
 assert.equal(cocPixels(.05,1,16,18),18,'very near is capped at maxCoc');
 assert.ok(cocPixels(.5,1,16,18)>0,'nearer than the focus blurs too');assert.equal(cocPixels(0,1,16,18),0);
});
test('the pass runs for the hero, gallery and photo views on High and Medium, scales with pixel ratio, and stays off on Low and Saver',()=>{
 const h=dofFor('hero',{focus:.9,quality:'high',pixelRatio:1.5});assert.equal(h.taps,DOF_TAPS.high);assert.ok(Math.abs(h.aperture-DOF_VIEWS.hero.aperture*1.5)<1e-9);assert.equal(h.focus,.9);assert.equal(h.range,DOF_VIEWS.hero.range);
 assert.equal(dofFor('gallery',{focus:.8,quality:'medium'}).taps,DOF_TAPS.medium);
 assert.ok(dofFor('hero',{focus:1}).aperture>dofFor('photo',{focus:6}).aperture,'the hero shot is the shallowest');
 assert.equal(dofFor('hero',{focus:1,quality:'saver'}),null);assert.equal(dofFor('hero',{focus:1,quality:'low'}),null);
 assert.equal(dofFor('hero',{focus:1,enabled:false}),null);assert.equal(dofFor('surface',{focus:1}),null);assert.equal(dofFor('hero',{focus:0}),null);
});
