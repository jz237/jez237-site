import test from 'node:test';
import assert from 'node:assert/strict';
import {THROTTLE_JAM,throttleJams,jammedThrottle} from '../src/damage-handling';
test('a crushed front jams the throttle on about half the cars; lifting off leaves it part-open, reverse and braking still work',()=>{
 const ids=Array.from({length:24},(_,i)=>i),jammed=ids.filter(i=>throttleJams(.7,i)).length;
 assert.ok(jammed>=8&&jammed<=16,`about half (${jammed}/24)`);assert.equal(ids.filter(i=>throttleJams(THROTTLE_JAM.onset,i)).length,0);
 assert.equal(jammedThrottle(0,true),THROTTLE_JAM.hold);assert.equal(jammedThrottle(.9,true),.9);assert.equal(jammedThrottle(-1,true),-1);assert.equal(jammedThrottle(0,false),0);
});
