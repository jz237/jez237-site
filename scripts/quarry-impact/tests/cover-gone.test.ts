import test from 'node:test';
import assert from 'node:assert/strict';
import {BUMPER_GONE,COVER_GONE,exposedDamage} from '../src/damage-handling';
test('a missing door weakens its side and a missing bonnet bares the engine, stacking with a missing bumper',()=>{
 assert.ok(COVER_GONE.side>1&&COVER_GONE.engine>1);
 assert.ok(Math.abs(exposedDamage(0,.294,COVER_GONE.side)-.294*COVER_GONE.side)<1e-12,'the r189 door-side T-bone, crushed 1.3x');
 const both=exposedDamage(.1,exposedDamage(.1,.2,BUMPER_GONE.engine),COVER_GONE.engine);
 assert.ok(Math.abs(both-(.1+.1*BUMPER_GONE.engine*COVER_GONE.engine))<1e-12,'bumper and bonnet both gone: 1.5x');
});
