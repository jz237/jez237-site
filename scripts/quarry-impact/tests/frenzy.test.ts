import test from 'node:test';
import assert from 'node:assert/strict';
import {FRENZY,frenzyFactor,CHARGE} from '../src/derby-driving';
test('the last few cars running go at it harder; a full arena, a lone survivor or bad numbers do not',()=>{
 assert.equal(frenzyFactor(FRENZY.alive),FRENZY.factor);assert.equal(frenzyFactor(2),FRENZY.factor);
 assert.equal(frenzyFactor(FRENZY.alive+1),1);assert.equal(frenzyFactor(24),1);assert.equal(frenzyFactor(1),1);assert.equal(frenzyFactor(NaN),1);
 assert.ok(FRENZY.factor>1&&CHARGE.cooldown/FRENZY.factor<CHARGE.cooldown);
});
