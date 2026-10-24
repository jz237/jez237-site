import test from 'node:test';
import assert from 'node:assert/strict';
import {PIN,pinCounts} from '../src/damage-handling';
import {PIN_ESCAPE,rocking,rockInput} from '../src/derby-driving';
test('a pinned driver starts rocking only once the pin has been crushing a while, then keeps at it until free',()=>{
 assert.ok(PIN_ESCAPE.after>PIN.hold+PIN.gap,'the pin gets its first crushes in before the driver fights back');
 assert.ok(!rocking(PIN_ESCAPE.after-.01,false));assert.ok(rocking(PIN_ESCAPE.after,false));
 assert.ok(rocking(.1,true),'easing the pressure for a moment does not stop the rocking');assert.ok(!rocking(0,true),'free at last');
 assert.ok(!rocking(undefined,false)&&!rocking(NaN,true),'no pin clock, no rocking');
});
test('rocking swaps between full reverse and full throttle on opposite locks every PIN_ESCAPE.swing seconds',()=>{
 const a=rockInput(0,3),b=rockInput(PIN_ESCAPE.swing+.01,3),c=rockInput(2*PIN_ESCAPE.swing+.01,3);
 assert.equal(a.throttle,-1);assert.equal(b.throttle,1);assert.equal(c.throttle,-1);
 assert.equal(a.steer,-b.steer,'opposite lock on the way back out');assert.equal(rockInput(0,2).steer,-a.steer,'drivers pick different sides');
 assert.ok(a.brake===0&&!a.handbrake);
});
test('the same car counts as pinned at most once every PIN.recount seconds, however often it is pinned again',()=>{
 assert.ok(pinCounts(undefined,3));assert.ok(!pinCounts(10,10+PIN.recount-.1));assert.ok(pinCounts(10,10+PIN.recount));
});
