import {restoreRollBarBytes} from './roll-bar-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readShedWeightPrevious,restoreShedWeightBytes,verifyShedWeightRevision} from './shed-weight-invariants';
const source=(file:string)=>restoreRollBarBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ShedWeight preserves every prior fixture, vehicle asset, venue art and history input',verifyShedWeightRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/shed-weight/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreShedWeightBytes(file,bytes),readShedWeightPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreShedWeightBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreShedWeightBytes('src/unknown.ts',unknown),unknown);
});
