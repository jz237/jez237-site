import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDerbyFlagPrevious,restoreDerbyFlagBytes,verifyDerbyFlagRevision} from './derby-flag-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DerbyFlag preserves every prior fixture, vehicle asset, venue art and history input',verifyDerbyFlagRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/derby-flag/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDerbyFlagBytes(file,bytes),readDerbyFlagPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDerbyFlagBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDerbyFlagBytes('src/unknown.ts',unknown),unknown);
});
