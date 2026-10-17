import {restoreRookvaleWearBytes} from './rookvale-wear-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRookvaleRaceVenuePrevious,restoreRookvaleRaceVenueBytes,verifyRookvaleRaceVenueRevision} from './rookvale-race-venue-invariants';
const source=(file:string)=>restoreRookvaleWearBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RookvaleRaceVenue preserves every prior fixture, vehicle asset, control and camera input',verifyRookvaleRaceVenueRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rookvale-race-venue/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRookvaleRaceVenueBytes(file,bytes),readRookvaleRaceVenuePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRookvaleRaceVenueBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRookvaleRaceVenueBytes('src/unknown.ts',unknown),unknown);
});
