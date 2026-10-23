import test from 'node:test';
import assert from 'node:assert/strict';
import {MASS_SHARE,IMPACT_SPEED,massShare,sharedDamage} from '../src/damage-rules';
test('equal weights share a crash evenly; the lighter car takes more and the heavier less, within limits',()=>{
 assert.equal(massShare(1400,1400),1);
 const light=massShare(1100,1900),heavy=massShare(1900,1100);
 assert.ok(light>1.2&&light<1.3,`${light}`);assert.ok(heavy>.7&&heavy<.8,`${heavy}`);
 assert.ok(Math.abs(light+heavy-2)<1e-9,'the crash total is kept');
 assert.equal(massShare(560,3300),MASS_SHARE.max);assert.equal(massShare(3300,560),MASS_SHARE.min);
});
test('a car that has shed weight takes a larger share than it did whole',()=>{
 assert.ok(massShare(1400-120,1400)>massShare(1400,1400));
});
test('no other car, or a broken weight, leaves the damage alone',()=>{
 for(const [a,b] of [[0,1400],[1400,0],[NaN,1400],[1400,Infinity],[-5,1400]])assert.equal(massShare(a,b),1);
});
test('a shared hit stays within the single-hit cap; an unshared one is untouched',()=>{
 assert.equal(sharedDamage(40,1),40);assert.equal(sharedDamage(90,1),90,'online hits are never capped here');
 assert.equal(sharedDamage(40,.75),30);assert.equal(sharedDamage(60,1.4),IMPACT_SPEED.cap);assert.equal(sharedDamage(0,1.3),0);
 assert.equal(sharedDamage(40,NaN),40);
});
