import test from 'node:test';
import assert from 'node:assert/strict';
import {finalFour,finalFourBanner,finalTwo} from '../src/derby-moments';
test('the final four is announced once, on the step a bigger field comes down to four',()=>{
 assert.equal(finalFour(5,4),true);assert.equal(finalFour(9,4),true,'two cars out at once');
 assert.equal(finalFour(4,4),false);assert.equal(finalFour(4,3),false);assert.equal(finalFour(0,4),false,'a four-car event starts there');
 assert.equal(finalFour(NaN,4),false);assert.equal(finalTwo(5,4),false,'not the final two');
 assert.equal(finalFourBanner(true),"FINAL FOUR · YOU'RE STILL IN IT");assert.equal(finalFourBanner(false),'FINAL FOUR');
});
