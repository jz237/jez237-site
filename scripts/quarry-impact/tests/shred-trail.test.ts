import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {SHRED_TRAIL,LITTER,CrashLitter} from '../src/crash-litter';
test('a shredding tyre at speed sheds a couple of lumps of rubber at its wheel every moment',()=>{
 assert.ok(SHRED_TRAIL.chips>0&&SHRED_TRAIL.chips<LITTER.rubber.count,'a trail of small drops, not blowout heaps');assert.ok(SHRED_TRAIL.gap>0&&SHRED_TRAIL.speed>0);
 const litter=new CrashLitter(new T.Scene());assert.equal(litter.scatter(new T.Vector3(1,0,1),'rubber',4,()=>0,undefined,undefined,SHRED_TRAIL.chips),SHRED_TRAIL.chips);
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes("if(!c.extendedDamage||Math.abs(c.speed)<SHRED_TRAIL.speed||clock-(shredClock.get(c)??-9)<SHRED_TRAIL.gap)continue;const w=c.wheels[c.tyreShred.findIndex(t=>t>0)];if(!w?.visible)continue;"),'offline, at speed, at the shredding wheel, no more often than the gap');
 assert.ok(main.includes("fx.scatterLitter(crunchAt,'rubber',c.id*151+(++shredChunks),undefined,undefined,SHRED_TRAIL.chips);"));
 assert.ok(main.includes("c.tyreShred[wheel] = SHRED_SECONDS; return true;"),'__quarry.shredTyre for QA');
});
