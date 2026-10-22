import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDogTrackingPrevious,restoreDogTrackingBytes,verifyDogTrackingRevision} from './dog-tracking-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DogTracking preserves every prior fixture, vehicle asset, venue art and history input',verifyDogTrackingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/dog-tracking/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDogTrackingBytes(file,bytes),readDogTrackingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDogTrackingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDogTrackingBytes('src/unknown.ts',unknown),unknown);
});
