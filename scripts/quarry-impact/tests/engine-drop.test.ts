import test from 'node:test';
import assert from 'node:assert/strict';
import {ENGINE_DROP,engineDrops} from '../src/damage-handling';
test('the engine drops out only on broken mounts, a wrecked engine and a big hit at the engine end',()=>{
 assert.equal(engineDrops(true,ENGINE_DROP.engine,ENGINE_DROP.damage,true),true);
 assert.equal(engineDrops(false,.9,40,true),false,'mounts still holding');
 assert.equal(engineDrops(true,ENGINE_DROP.engine-.01,40,true),false,'engine not far gone');
 assert.equal(engineDrops(true,.9,ENGINE_DROP.damage-.1,true),false,'too light a hit');
 assert.equal(engineDrops(true,.9,40,false),false,'a hit at the other end');
 assert.equal(engineDrops(true,undefined,40,true),false);assert.equal(engineDrops(true,.9,NaN,true),false);
});
