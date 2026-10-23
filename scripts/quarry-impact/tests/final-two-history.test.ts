import {restoreRevengeBytes} from './revenge-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFinalTwoPrevious,restoreFinalTwoBytes,verifyFinalTwoRevision} from './final-two-invariants';
const source=(file:string)=>restoreRevengeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FinalTwo preserves every prior fixture, vehicle asset, venue art and history input',verifyFinalTwoRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/final-two/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFinalTwoBytes(file,bytes),readFinalTwoPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFinalTwoBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFinalTwoBytes('src/unknown.ts',unknown),unknown);
});
