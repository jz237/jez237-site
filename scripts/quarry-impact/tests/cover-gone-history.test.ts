import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCoverGonePrevious,restoreCoverGoneBytes,verifyCoverGoneRevision} from './cover-gone-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CoverGone preserves every prior fixture, vehicle asset, venue art and history input',verifyCoverGoneRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/cover-gone/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCoverGoneBytes(file,bytes),readCoverGonePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCoverGoneBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCoverGoneBytes('src/unknown.ts',unknown),unknown);
});
