import {restoreChainReactionBytes} from './chain-reaction-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBlowUpPrevious,restoreBlowUpBytes,verifyBlowUpRevision} from './blow-up-invariants';
const source=(file:string)=>restoreChainReactionBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BlowUp preserves every prior fixture, vehicle asset, venue art and history input',verifyBlowUpRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/blow-up/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBlowUpBytes(file,bytes),readBlowUpPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBlowUpBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBlowUpBytes('src/unknown.ts',unknown),unknown);
});
