import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSoftDustPrevious,restoreSoftDustBytes,verifySoftDustRevision} from './soft-dust-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SoftDust preserves every prior fixture, vehicle asset, venue art and history input',verifySoftDustRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/soft-dust/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSoftDustBytes(file,bytes),readSoftDustPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSoftDustBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSoftDustBytes('src/unknown.ts',unknown),unknown);
});
