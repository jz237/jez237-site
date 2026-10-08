import {restoreWaypointVenuesBytes} from './waypoint-venues-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readShuttlePrevious,restoreShuttleBytes,verifyShuttleRevision} from './shuttle-invariants';
const source=(file:string)=>restoreWaypointVenuesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Shuttle preserves every prior fixture, vehicle asset, control and camera input',verifyShuttleRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/shuttle/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreShuttleBytes(file,bytes),readShuttlePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreShuttleBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreShuttleBytes('src/unknown.ts',unknown),unknown);
});
