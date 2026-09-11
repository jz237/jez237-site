import test from 'node:test';import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {quickTurn,beginWipeout,stepWipeout,wipeoutPose,collideRiders} from '../rider-actions.js';
test('rocket start rewards a fresh throttle press at green, not holding it through countdown',()=>{
 for(const held of [false,true]){const s=createRace({mode:'time'});while(s.phase==='countdown')stepRace(s,{throttle:held?1:0},1/60);stepRace(s,{throttle:1},1/60);assert.equal(s.racers[0].power,held?0:5);}
 const s=createRace({mode:'time'});while(s.phase==='countdown'||s.time<.3)stepRace(s,{},1/60);stepRace(s,{throttle:1},1/60);assert.equal(s.racers[0].power,0);
});
test('rearward trim tightens a powered turn only with water contact',()=>{
 assert.equal(quickTurn({steer:.8,lean:1},15,1),0);assert.equal(quickTurn({steer:.8,lean:-1},15,0),0);assert.equal(quickTurn({steer:0,lean:-1},15,1),0);assert.equal(quickTurn({steer:.8,lean:-1},15,1),1);
 const run=lean=>{const s=createRace({mode:'practice'});s.phase='running';const r=s.racers[0];r.x=0;r.z=0;r.heading=0;r.vz=14;s.course={...s.course,ground:()=>-20,rocks:[],ramps:[]};for(let i=0;i<30;i++)stepRace(s,{throttle:1,steer:.8,lean},1/60);return r.heading;};assert.ok(run(-1)>run(0)*1.25);
});
test('wipeout has continuous fall and remount, taps recover faster, holding does not',()=>{
 const run=tap=>{const r=createRace().racers[0];beginWipeout(r,0,18);let elapsed=0,maxOffset=0;while(r.wipeout&&elapsed<4){stepWipeout(r,{throttle:tap&&Math.floor(elapsed*10)%2?1:0},.01,elapsed);maxOffset=Math.max(maxOffset,Math.abs(wipeoutPose(r.wipeout).x));elapsed+=.01;}assert.ok(maxOffset>1);assert.deepEqual(wipeoutPose(r.wipeout),{x:0,y:0,z:0,roll:0,pitch:0});assert.equal(r.recover,0);return elapsed;};assert.ok(run(true)<run(false)-.5);
});
test('rider collision conserves momentum, respects mass and separates coincident hulls',()=>{
 const [a,b]=createRace({rider:1}).racers;a.x=0;a.z=0;b.x=1.2;b.z=0;a.vx=20;b.vx=0;
 const ma=240+a.stats.stability*22,mb=240+b.stats.stability*22,before=ma*a.vx+mb*b.vx;
 assert.equal(collideRiders(a,b),20);assert.ok(Math.abs(ma*a.vx+mb*b.vx-before)<1e-8);assert.ok(Math.hypot(a.x-b.x,a.z-b.z)>=1.8-1e-8);
 a.x=b.x=0;a.z=b.z=0;collideRiders(a,b);assert.ok(Math.hypot(a.x-b.x,a.z-b.z)>1.7);
});

test('a fast shoreline collision actually ejects the rider through the race loop',()=>{const s=createRace({mode:'practice'}),r=s.racers[0];s.phase='running';s.course={...s.course,ground:(x,z)=>z>1?5:-10,rocks:[],ramps:[]};r.x=r.z=0;r.heading=0;r.vz=22;for(let i=0;i<10;i++)stepRace(s,{throttle:1},1/60);assert.ok(r.wipeout);assert.equal(r.wipeoutId,1);assert.equal(r.throttle,0);assert.ok(r.recover>2);});
