import test from 'node:test';import assert from 'node:assert/strict';
import {clearWakeTrail,recordWake,wakeHeight,wakeGradient,wakeContact} from '../wake-field.js';
import {sceneryFirstQuality} from '../adaptive-quality.js';
import {riderMotion} from '../rider-motion.js';
import {landingEnvelope} from '../finishing-effects.js';
test('wake pressure uses the rendered packet gradient, with bounded directional response',()=>{
 clearWakeTrail();const owner={};recordWake(0,0,0,.3,1.4,owner);assert.deepEqual(wakeGradient(2,.8,2,.3,owner),{x:0,z:0});assert.deepEqual(wakeGradient(2,.8,2,.3,null,1.4),{x:0,z:0});const x=2,z=.8,t=2,e=.00001,g=wakeGradient(x,z,t,.3);
 const dx=(wakeHeight(x+e,z,t,.3)-wakeHeight(x-e,z,t,.3))/(2*e),dz=(wakeHeight(x,z+e,t,.3)-wakeHeight(x,z-e,t,.3))/(2*e);
 assert.ok(Math.abs(dx-g.x)<1e-7&&Math.abs(dz-g.z)<1e-7);
 const across=wakeContact({x:1,z:0},0,25,1),along=wakeContact({x:1,z:0},Math.PI/2,25,1);
 assert.ok(Math.abs(across.x)>.8&&Math.abs(along.x)<1e-9);assert.ok(Math.abs(across.roll)<=.65);
 assert.ok(Object.values(wakeContact(g,0,30,0)).every(v=>v===0));clearWakeTrail();
});
test('adaptive rendering tries distant scenery reductions before lowering the water tier',()=>{
 const m={};let q='high';q=sceneryFirstQuality(m,q,20);assert.equal(q,'high');
 q=sceneryFirstQuality(m,q,20);assert.equal(q,'high');assert.ok(m.scenery<1);
 q=sceneryFirstQuality(m,q,20);assert.equal(q,'high');assert.equal(m.scenery,.55);
 q=sceneryFirstQuality(m,q,20);assert.equal(q,'medium');
 for(let i=0;i<80;i++)q=sceneryFirstQuality(m,q,60);assert.equal(q,'high');assert.equal(m.scenery,1);
});
test('rider braces on descent, counters roll and eases out after impact without pause drift',()=>{
 const m={};riderMotion(m,0,0,{speed:25});let r;
 for(let i=1;i<=30;i++)r=riderMotion(m,i/60,0,{speed:25,airborne:true,verticalSpeed:-8,rollVelocity:1});
 assert.ok(r.brace>.8&&r.counter<-.03);
 for(let i=31;i<=45;i++)r=riderMotion(m,i/60,0,{speed:20,impact:8});assert.ok(r.recovery>.05);
 const held=structuredClone(m);riderMotion(m,.75,0,{speed:20,impact:8,dt:0});assert.deepEqual(m,held);
 for(let i=46;i<=240;i++)r=riderMotion(m,i/60,0,{speed:20});assert.ok(r.recovery<.0001&&r.brace<.0001);
});
test('landing presentation scales with impact and speed but stays bounded',()=>{
 const soft=landingEnvelope(1,25),heavy=landingEnvelope(10,25),stopped=landingEnvelope(10,0),extreme=landingEnvelope(1000,1000);
 assert.equal(soft.spray,0);assert.ok(heavy.height>soft.height&&heavy.radius>soft.radius);assert.equal(stopped.spray,0);assert.ok(extreme.height<=2.1&&extreme.spray<=1);
});
