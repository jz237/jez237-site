import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLodgedDebrisPrevious,restoreLodgedDebrisBytes,verifyLodgedDebrisRevision} from './lodged-debris-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('LodgedDebris preserves every prior fixture, vehicle asset, venue art and history input',verifyLodgedDebrisRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/lodged-debris/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLodgedDebrisBytes(file,bytes),readLodgedDebrisPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLodgedDebrisBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLodgedDebrisBytes('src/unknown.ts',unknown),unknown);
});
