import test from 'node:test';
import assert from 'node:assert/strict';
import {IMPACT_ZONE,impactZoneFactor} from '../src/damage-handling';
const W=.9,L=2.2;
test('a square T-bone into the doors hurts most; a glancing one barely more',()=>{
 assert.ok(Math.abs(impactZoneFactor({x:.85,z:.2},{x:-1,z:0},W,L)-IMPACT_ZONE.side)<1e-12);
 assert.ok(Math.abs(impactZoneFactor({x:-.85,z:-.3},{x:1,z:0},W,L)-IMPACT_ZONE.side)<1e-12,'either side');
 const glance=impactZoneFactor({x:.85,z:.2},{x:-.2,z:1},W,L);assert.ok(glance>1&&glance<1.05);
});
test('a nose-on hit is softened by the crumple zone; rear and corner hits are unchanged',()=>{
 assert.ok(Math.abs(impactZoneFactor({x:0,z:2.1},{x:0,z:-1},W,L)-IMPACT_ZONE.nose)<1e-12);
 assert.equal(impactZoneFactor({x:0,z:-2.1},{x:0,z:1},W,L),1);
 assert.equal(impactZoneFactor({x:.85,z:2},{x:-1,z:0},W,L),1,'the front corner is not the doors');
});
test('bad input changes nothing',()=>{
 assert.equal(impactZoneFactor({x:.85,z:0},{x:0,z:0},W,L),1);assert.equal(impactZoneFactor({x:NaN,z:0},{x:1,z:0},W,L),1);assert.equal(impactZoneFactor({x:.8,z:0},{x:1,z:0},0,L),1);
});
