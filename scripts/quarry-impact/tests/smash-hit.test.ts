import test from 'node:test';
import assert from 'node:assert/strict';
import {SMASH,isSmash,smashLabel,impactSoundScale,impactSpeedFactor,IMPACT_SPEED} from '../src/damage-rules';
test('a smash is a hit that takes a quarter of a car or more; the toast gives the closing speed in km/h',()=>{
 assert.equal(isSmash(SMASH.health-.1),false);assert.ok(isSmash(SMASH.health));assert.equal(isSmash(NaN),false);
 assert.equal(smashLabel(20),'SMASH · 72 KM/H');assert.equal(smashLabel(NaN),'SMASH · 0 KM/H');
 assert.ok(SMASH.scale>0&&SMASH.scale<1&&SMASH.slowmo<1,'a short, real slow-motion beat');
});
test('crash sounds grow with speed, gentler than the damage does',()=>{
 assert.ok(Math.abs(impactSoundScale(IMPACT_SPEED.ref)-1)<1e-12);
 assert.ok(impactSoundScale(20)>1&&impactSoundScale(20)<impactSpeedFactor(20));assert.ok(impactSoundScale(4)<1);
});
test('a smash survived on the last fifth of the car is HANGING ON',async()=>{
 const {hangingOn,HANGING_ON}=await import('../src/damage-rules');
 assert.ok(hangingOn(HANGING_ON));assert.ok(hangingOn(3));assert.equal(hangingOn(HANGING_ON+1),false);assert.equal(hangingOn(0),false);assert.equal(hangingOn(NaN),false);
});
