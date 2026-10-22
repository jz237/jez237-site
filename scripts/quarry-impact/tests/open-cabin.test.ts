import test from 'node:test';
import assert from 'node:assert/strict';
import {AERO,openness,openDrag,windRoar} from '../src/damage-handling';
import {synthWind} from '../src/damage-rattle';
test('a sealed car is closed; a lost windscreen opens it most, then doors, bonnet and side glass; never past 1',()=>{
 assert.equal(openness({}),0);
 assert.equal(openness({windscreen:true}),AERO.windscreen);
 assert.ok(openness({windscreen:true})>openness({doors:1})&&openness({doors:1})>openness({panes:1}));
 assert.equal(openness({panes:20}),AERO.panes,'side glass caps');
 assert.equal(openness({windscreen:true,panes:9,doors:4,hood:true,lids:2}),1);
 assert.equal(openness({panes:NaN,doors:-2}),0);
});
test('the open car drags with the square of speed; a sealed one never does',()=>{
 assert.equal(openDrag(0,40),0);assert.equal(openDrag(.5,0),0);
 assert.ok(Math.abs(openDrag(.5,30)-4*openDrag(.5,15))<1e-9);assert.ok(Math.abs(openDrag(1,30)-AERO.drag*900)<1e-9);
 assert.equal(openDrag(.5,NaN),0);
});
test('the wind roar builds with speed and openness and tops out',()=>{
 assert.equal(windRoar(0,40),0);assert.ok(windRoar(.5,20)>windRoar(.5,10)&&windRoar(1,20)>windRoar(.5,20));assert.ok(windRoar(1,99)<=1);
});
test('the wind loop is two seconds, finite, audible, unclipped and seamless',()=>{
 const w=synthWind(48000);assert.equal(w.length,96000);let peak=0;for(const v of w){assert.ok(Number.isFinite(v));peak=Math.max(peak,Math.abs(v));}
 assert.ok(peak>.05&&peak<=.55,`peak ${peak}`);assert.ok(Math.abs(w[0])<1e-6&&Math.abs(w[w.length-1])<1e-6);
});
