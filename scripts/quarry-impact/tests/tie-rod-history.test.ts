import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTieRodPrevious,restoreTieRodBytes,verifyTieRodRevision} from './tie-rod-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TieRod preserves every prior fixture, vehicle asset, venue art and history input',verifyTieRodRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tie-rod/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTieRodBytes(file,bytes),readTieRodPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTieRodBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTieRodBytes('src/unknown.ts',unknown),unknown);
});
