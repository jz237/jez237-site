import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRollShedPrevious,restoreRollShedBytes,verifyRollShedRevision} from './roll-shed-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RollShed preserves every prior fixture, vehicle asset, venue art and history input',verifyRollShedRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/roll-shed/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRollShedBytes(file,bytes),readRollShedPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRollShedBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRollShedBytes('src/unknown.ts',unknown),unknown);
});
