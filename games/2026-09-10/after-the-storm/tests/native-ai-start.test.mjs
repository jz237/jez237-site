import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeAIStartInput} from '../native-ai-start.js';
const start=(extra={})=>prepareNativeAIStartInput({role:-1,difficulty:0,chargeTimerNative:0,heldButtons:0x0100,...extra});
test('selected-human start input clears raw axes and releases both source bits at16',()=>{
 assert.deepEqual(start({chargeTimerNative:15}),{rawXNative:0,rawYNative:0,heldButtons:0xa100});
 assert.deepEqual(start({chargeTimerNative:16,heldButtons:0xffff}),{rawXNative:0,rawYNative:0,heldButtons:0x5fff});
 assert.equal(start({difficulty:99}).heldButtons,0xa100);
});
test('original role and difficulty boundaries retain their inclusive final hold frame',()=>{
 for(const [role,difficulty,lastHeld] of[[0,0,10],[0,1,13],[0,2,15],[1,0,10],[1,1,12],[1,2,13],[2,0,10],[2,1,11],[2,2,11]]){
  assert.equal(start({role,difficulty,chargeTimerNative:lastHeld}).heldButtons,0xa100,`${role}/${difficulty} inclusive`);
  assert.equal(start({role,difficulty,chargeTimerNative:lastHeld+1,heldButtons:0xa100}).heldButtons,0x0100,`${role}/${difficulty} release`);
 }
});
test('the timer is signed32 and unrelated held bits survive both branches',()=>{
 assert.equal(start({chargeTimerNative:-2147483648,heldButtons:0x5a5a}).heldButtons,0xfa5a);
 assert.equal(start({chargeTimerNative:2147483647,heldButtons:0xfa5a}).heldButtons,0x5a5a);
 assert.equal(start({chargeTimerNative:65536,heldButtons:0xffff}).heldButtons,0x5fff);
 const input={role:2,difficulty:1,chargeTimerNative:11,heldButtons:0x0140},before=structuredClone(input);
 const r=prepareNativeAIStartInput(input);assert.deepEqual(input,before);assert.ok(Object.isFrozen(r));
});
test('unsupported start table selectors and invalid native widths reject explicitly',()=>{
 assert.throws(()=>start({role:3}),/role/);assert.throws(()=>start({role:0,difficulty:3}),/difficulty0..2/);
 assert.throws(()=>start({chargeTimerNative:2147483648}),/chargeTimerNative/);assert.throws(()=>start({heldButtons:65536}),/heldButtons/);
 assert.throws(()=>start({chargeTimerNative:NaN}),/chargeTimerNative/);assert.throws(()=>start({role:1.5}),/role/);
});
