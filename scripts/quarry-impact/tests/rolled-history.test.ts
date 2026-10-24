import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRolledPrevious,restoreRolledBytes,verifyRolledRevision} from './rolled-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Rolled preserves every prior fixture, vehicle asset, venue art and history input',verifyRolledRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rolled/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRolledBytes(file,bytes),readRolledPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRolledBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRolledBytes('src/unknown.ts',unknown),unknown);
});
