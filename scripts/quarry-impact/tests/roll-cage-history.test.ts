import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRollCagePrevious,restoreRollCageBytes,verifyRollCageRevision} from './roll-cage-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RollCage preserves every prior fixture, vehicle asset, venue art and history input',verifyRollCageRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/roll-cage/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRollCageBytes(file,bytes),readRollCagePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRollCageBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRollCageBytes('src/unknown.ts',unknown),unknown);
});
