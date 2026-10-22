import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOpenCabinPrevious,restoreOpenCabinBytes,verifyOpenCabinRevision} from './open-cabin-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('OpenCabin preserves every prior fixture, vehicle asset, venue art and history input',verifyOpenCabinRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/open-cabin/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOpenCabinBytes(file,bytes),readOpenCabinPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOpenCabinBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOpenCabinBytes('src/unknown.ts',unknown),unknown);
});
