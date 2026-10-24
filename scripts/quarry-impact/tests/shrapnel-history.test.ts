import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readShrapnelPrevious,restoreShrapnelBytes,verifyShrapnelRevision} from './shrapnel-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Shrapnel preserves every prior fixture, vehicle asset, venue art and history input',verifyShrapnelRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/shrapnel/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreShrapnelBytes(file,bytes),readShrapnelPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreShrapnelBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreShrapnelBytes('src/unknown.ts',unknown),unknown);
});
