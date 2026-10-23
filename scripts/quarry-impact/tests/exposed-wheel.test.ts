import test from 'node:test';
import assert from 'node:assert/strict';
import {EXPOSED_WHEEL,exposedDamage} from '../src/damage-handling';
test('a bare front wheel takes more from each hit, never more than ruined, and nothing it was not dealt',()=>{
 assert.ok(Math.abs(exposedDamage(.2,.3,EXPOSED_WHEEL.tyre)-(.2+.1*EXPOSED_WHEEL.tyre))<1e-12);
 assert.ok(Math.abs(exposedDamage(.4,.5,EXPOSED_WHEEL.rim)-(.4+.1*EXPOSED_WHEEL.rim))<1e-12);
 assert.equal(exposedDamage(.9,1,EXPOSED_WHEEL.tyre),1);assert.equal(exposedDamage(.3,.3,EXPOSED_WHEEL.tyre),.3,'no hit there, no change');
 assert.equal(exposedDamage(.3,.2,EXPOSED_WHEEL.tyre),.2,'a lower value passes straight through');
 assert.equal(exposedDamage(NaN,.4,2),.4);assert.ok(EXPOSED_WHEEL.tyre>EXPOSED_WHEEL.rim&&EXPOSED_WHEEL.rim>1);
});
