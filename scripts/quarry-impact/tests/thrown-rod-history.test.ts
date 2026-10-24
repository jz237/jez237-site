import {restoreRubFireBytes} from './rub-fire-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readThrownRodPrevious,restoreThrownRodBytes,verifyThrownRodRevision} from './thrown-rod-invariants';
const source=(file:string)=>restoreRubFireBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ThrownRod preserves every prior fixture, vehicle asset, venue art and history input',verifyThrownRodRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/thrown-rod/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreThrownRodBytes(file,bytes),readThrownRodPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreThrownRodBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreThrownRodBytes('src/unknown.ts',unknown),unknown);
});
