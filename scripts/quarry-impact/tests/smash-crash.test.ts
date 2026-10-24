import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SMASH_FIRE} from '../src/damage-handling';
test('a smash fire is judged on the whole crash into the engine end, at a threshold a big head-on reaches',()=>{
 assert.ok(SMASH_FIRE.damage<=24,'an 18 m/s head-on totals about 27 at the engine end');
 assert.ok(readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8').includes("smashFire(crash(SMASH_FIRE.damage),zone===(isRearEngineKind(this.kind)?'rear':'front'),this.id,this.bigHits)"));
});
