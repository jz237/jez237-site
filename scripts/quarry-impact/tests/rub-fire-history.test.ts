import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRubFirePrevious,restoreRubFireBytes,verifyRubFireRevision} from './rub-fire-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RubFire preserves every prior fixture, vehicle asset, venue art and history input',verifyRubFireRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rub-fire/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRubFireBytes(file,bytes),readRubFirePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRubFireBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRubFireBytes('src/unknown.ts',unknown),unknown);
});
