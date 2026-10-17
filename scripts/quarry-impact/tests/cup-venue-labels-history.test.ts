import {restoreReservoirPumphouseBytes} from './reservoir-pumphouse-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCupVenueLabelsPrevious,restoreCupVenueLabelsBytes,verifyCupVenueLabelsRevision} from './cup-venue-labels-invariants';
const source=(file:string)=>restoreReservoirPumphouseBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CupVenueLabels preserves every prior fixture, vehicle asset, control and camera input',verifyCupVenueLabelsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/cup-venue-labels/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCupVenueLabelsBytes(file,bytes),readCupVenueLabelsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCupVenueLabelsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCupVenueLabelsBytes('src/unknown.ts',unknown),unknown);
});
