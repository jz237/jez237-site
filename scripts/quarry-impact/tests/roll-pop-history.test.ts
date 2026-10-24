import {restoreDominoBytes} from './domino-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRollPopPrevious,restoreRollPopBytes,verifyRollPopRevision} from './roll-pop-invariants';
const source=(file:string)=>restoreDominoBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RollPop preserves every prior fixture, vehicle asset, venue art and history input',verifyRollPopRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/roll-pop/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRollPopBytes(file,bytes),readRollPopPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRollPopBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRollPopBytes('src/unknown.ts',unknown),unknown);
});
