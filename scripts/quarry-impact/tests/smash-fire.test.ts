import test from 'node:test';
import assert from 'node:assert/strict';
import {SMASH_FIRE,smashFire} from '../src/damage-handling';
test('only a smash into the engine end can light it, on about a quarter of such hits',()=>{
 assert.equal(smashFire(SMASH_FIRE.damage-1,true,1,1),false);assert.equal(smashFire(90,false,1,1),false,'the wrong end');
 let n=0;for(let id=0;id<20;id++)for(let h=1;h<=10;h++)if(smashFire(60,true,id,h))n++;
 assert.ok(n>=30&&n<=70,`about a quarter of 200 (${n})`);
 assert.equal(smashFire(NaN,true,1,1),false);
 assert.equal(smashFire(60,true,3,4),smashFire(60,true,3,4),'decided per car and hit');
});
