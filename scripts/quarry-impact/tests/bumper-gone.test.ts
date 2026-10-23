import test from 'node:test';
import assert from 'node:assert/strict';
import {BUMPER_GONE,exposedDamage} from '../src/damage-handling';
test('with its bumper gone an end crumples faster, and the engine end hurts the engine more, never past ruined',()=>{
 assert.ok(BUMPER_GONE.crush>1&&BUMPER_GONE.engine>1&&BUMPER_GONE.crush>=BUMPER_GONE.engine);
 assert.ok(Math.abs(exposedDamage(.573,.844,BUMPER_GONE.crush)-(.573+.271*BUMPER_GONE.crush))<1e-12,'the r188 third ram, crumpled 1.35x');
 assert.equal(exposedDamage(.9,1,BUMPER_GONE.crush),1);assert.equal(exposedDamage(.4,.4,BUMPER_GONE.engine),.4,'no hit on that end, no change');
});
