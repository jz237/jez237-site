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
test('revenge: a solid hit on the rival who hurt you most, once per grudge',async()=>{
 const {revenge,REVENGE}=await import('../src/derby-moments');
 assert.ok(revenge({id:3,damage:40},3,REVENGE.loss,undefined));
 assert.equal(revenge({id:3,damage:40},4,30,undefined),false,'not the rival');assert.equal(revenge({id:3,damage:40},3,REVENGE.loss-1,undefined),false,'too light');
 assert.equal(revenge({id:3,damage:40},3,30,40),false,'already settled');assert.ok(revenge({id:3,damage:55},3,30,40),'they hurt you again');
 assert.equal(revenge(null,3,30,undefined),false);
});
test('takedowns close together chain into a combo; a pause resets it',async()=>{
 const {takedownChain,comboLabel,COMBO}=await import('../src/derby-moments');
 let chain=takedownChain(0,0,10);assert.equal(chain,1);assert.equal(comboLabel(chain),'');
 chain=takedownChain(chain,10,12);assert.equal(comboLabel(chain),'DOUBLE TAKEDOWN');
 chain=takedownChain(chain,12,15);assert.equal(comboLabel(chain),'TRIPLE TAKEDOWN');
 chain=takedownChain(chain,15,16);assert.equal(comboLabel(chain),'4x TAKEDOWN');
 assert.equal(takedownChain(chain,16,16+COMBO.window+.1),1,'too late: a fresh chain');assert.equal(takedownChain(2,10,NaN),1);
});
test('revenge is ready once the nemesis has hurt you enough and not been paid back since',async()=>{
 const {revengeReady,REVENGE_READY}=await import('../src/derby-moments');
 assert.ok(revengeReady({id:2,damage:REVENGE_READY},undefined));assert.equal(revengeReady({id:2,damage:REVENGE_READY-1},undefined),false);
 assert.equal(revengeReady({id:2,damage:30},30),false,'paid back');assert.ok(revengeReady({id:2,damage:42},30),'hurt again');assert.equal(revengeReady(null,undefined),false);
});
