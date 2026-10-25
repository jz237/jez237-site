import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBrokenLensPrevious,restoreBrokenLensBytes,verifyBrokenLensRevision} from './broken-lens-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BrokenLens preserves every prior fixture, vehicle asset, venue art and history input',verifyBrokenLensRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/broken-lens/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBrokenLensBytes(file,bytes),readBrokenLensPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBrokenLensBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBrokenLensBytes('src/unknown.ts',unknown),unknown);
});
