import test from 'node:test';
import assert from 'node:assert/strict';
import {finalTwo,finalTwoBanner} from '../src/derby-moments';
test('the final two is the step the field drops to two from three or more, once',()=>{
 assert.ok(finalTwo(3,2));assert.ok(finalTwo(5,2),'two wrecked at once still counts');
 assert.equal(finalTwo(2,2),false);assert.equal(finalTwo(3,3),false);assert.equal(finalTwo(2,1),false);assert.equal(finalTwo(NaN,2),false);
});
test('the banner names both, the player as YOU and first',()=>{
 assert.equal(finalTwoBanner({id:3,name:'Kessler R6'},{id:0,name:'Vesper GT'}),'FINAL TWO · YOU VS #4 KESSLER R6');
 assert.equal(finalTwoBanner({id:1,name:'Tern 1400'},{id:8,name:'Pipit 600'}),'FINAL TWO · #2 TERN 1400 VS #9 PIPIT 600');
});
