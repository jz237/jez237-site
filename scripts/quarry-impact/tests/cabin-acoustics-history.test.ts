import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCabinAcousticsPrevious,restoreCabinAcousticsBytes,verifyCabinAcousticsRevision} from './cabin-acoustics-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CabinAcoustics preserves every prior fixture, vehicle asset, venue art and history input',verifyCabinAcousticsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/cabin-acoustics/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCabinAcousticsBytes(file,bytes),readCabinAcousticsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCabinAcousticsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCabinAcousticsBytes('src/unknown.ts',unknown),unknown);
});
