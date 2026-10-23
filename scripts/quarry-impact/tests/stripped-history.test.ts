import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readStrippedPrevious,restoreStrippedBytes,verifyStrippedRevision} from './stripped-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Stripped preserves every prior fixture, vehicle asset, venue art and history input',verifyStrippedRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/stripped/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreStrippedBytes(file,bytes),readStrippedPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreStrippedBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreStrippedBytes('src/unknown.ts',unknown),unknown);
});
