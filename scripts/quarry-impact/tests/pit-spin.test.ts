import test from 'node:test';
import assert from 'node:assert/strict';
import {PIT,pitStrength,pitGrip} from '../src/damage-handling';
const L=2.2;
test('a sideways shove behind the rear axle line of a moving car breaks the rear tyres away, harder the faster it closes',()=>{
 const soft=pitStrength({x:.8,z:-1.5},{x:-1,z:0},L,15,2.5),hard=pitStrength({x:.8,z:-1.5},{x:-1,z:0},L,15,PIT.full);
 assert.ok(soft>0&&soft<hard,`${soft} < ${hard}`);assert.equal(hard,1);
 assert.equal(pitStrength({x:-.8,z:-1.8},{x:1,z:.3},L,-12,9),1,'either side, and reversing too');
});
test('no PIT for a parked car, a hit ahead of the rear quarter, a push from behind or a tap',()=>{
 assert.equal(pitStrength({x:.8,z:-1.5},{x:-1,z:0},L,3,PIT.full),0,'too slow');
 assert.equal(pitStrength({x:.8,z:0},{x:-1,z:0},L,15,PIT.full),0,'the doors');
 assert.equal(pitStrength({x:.8,z:1.5},{x:-1,z:0},L,15,PIT.full),0,'the front quarter');
 assert.equal(pitStrength({x:.2,z:-2.1},{x:-.3,z:1},L,15,PIT.full),0,'a shunt from behind');
 assert.equal(pitStrength({x:.8,z:-1.5},{x:-1,z:0},L,15,PIT.closing),0,'a tap');
});
test('bad input never breaks a car away; the rear grip fades back to full',()=>{
 assert.equal(pitStrength({x:NaN,z:-1.5},{x:-1,z:0},L,15,5),0);assert.equal(pitStrength({x:.8,z:-1.5},{x:0,z:0},L,15,5),0);assert.equal(pitStrength({x:.8,z:-1.5},{x:-1,z:0},0,15,5),0);
 assert.equal(pitGrip(0),1);assert.ok(Math.abs(pitGrip(1)-(1-PIT.loss))<1e-12);assert.equal(pitGrip(NaN),1);assert.equal(pitGrip(5),pitGrip(1));
});
