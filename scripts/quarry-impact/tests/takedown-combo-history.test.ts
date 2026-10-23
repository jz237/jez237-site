import {restoreRevengeReadyBytes} from './revenge-ready-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTakedownComboPrevious,restoreTakedownComboBytes,verifyTakedownComboRevision} from './takedown-combo-invariants';
const source=(file:string)=>restoreRevengeReadyBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TakedownCombo preserves every prior fixture, vehicle asset, venue art and history input',verifyTakedownComboRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/takedown-combo/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTakedownComboBytes(file,bytes),readTakedownComboPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTakedownComboBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTakedownComboBytes('src/unknown.ts',unknown),unknown);
});
