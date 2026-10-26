import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readStoneChipsPrevious,restoreStoneChipsBytes,verifyStoneChipsRevision} from './stone-chips-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('StoneChips preserves every prior fixture, vehicle asset, venue art and history input',verifyStoneChipsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/stone-chips/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreStoneChipsBytes(file,bytes),readStoneChipsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreStoneChipsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreStoneChipsBytes('src/unknown.ts',unknown),unknown);
});
