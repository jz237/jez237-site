import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFastestHitPrevious,restoreFastestHitBytes,verifyFastestHitRevision} from './fastest-hit-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FastestHit preserves every prior fixture, vehicle asset, venue art and history input',verifyFastestHitRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fastest-hit/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFastestHitBytes(file,bytes),readFastestHitPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFastestHitBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFastestHitBytes('src/unknown.ts',unknown),unknown);
});
