import {restoreFuelStarveBytes} from './fuel-starve-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readInvertedLeakPrevious,restoreInvertedLeakBytes,verifyInvertedLeakRevision} from './inverted-leak-invariants';
const source=(file:string)=>restoreFuelStarveBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('InvertedLeak preserves every prior fixture, vehicle asset, venue art and history input',verifyInvertedLeakRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/inverted-leak/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreInvertedLeakBytes(file,bytes),readInvertedLeakPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreInvertedLeakBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreInvertedLeakBytes('src/unknown.ts',unknown),unknown);
});
