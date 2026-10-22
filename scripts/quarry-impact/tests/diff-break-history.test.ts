import {restoreLidSwingBytes} from './lid-swing-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDiffBreakPrevious,restoreDiffBreakBytes,verifyDiffBreakRevision} from './diff-break-invariants';
const source=(file:string)=>restoreLidSwingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DiffBreak preserves every prior fixture, vehicle asset, venue art and history input',verifyDiffBreakRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/diff-break/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDiffBreakBytes(file,bytes),readDiffBreakPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDiffBreakBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDiffBreakBytes('src/unknown.ts',unknown),unknown);
});
