import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWaypointVenuesPrevious,restoreWaypointVenuesBytes,verifyWaypointVenuesRevision} from './waypoint-venues-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WaypointVenues preserves every prior fixture, vehicle asset, control and camera input',verifyWaypointVenuesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/waypoint-venues/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWaypointVenuesBytes(file,bytes),readWaypointVenuesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWaypointVenuesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWaypointVenuesBytes('src/unknown.ts',unknown),unknown);
});
