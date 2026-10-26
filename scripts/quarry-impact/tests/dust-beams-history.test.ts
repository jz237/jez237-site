import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDustBeamsPrevious,restoreDustBeamsBytes,verifyDustBeamsRevision} from './dust-beams-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DustBeams preserves every prior fixture, vehicle asset, venue art and history input',verifyDustBeamsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/dust-beams/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDustBeamsBytes(file,bytes),readDustBeamsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDustBeamsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDustBeamsBytes('src/unknown.ts',unknown),unknown);
});
