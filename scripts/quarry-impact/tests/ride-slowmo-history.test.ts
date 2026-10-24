import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRideSlowmoPrevious,restoreRideSlowmoBytes,verifyRideSlowmoRevision} from './ride-slowmo-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RideSlowmo preserves every prior fixture, vehicle asset, venue art and history input',verifyRideSlowmoRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ride-slowmo/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRideSlowmoBytes(file,bytes),readRideSlowmoPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRideSlowmoBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRideSlowmoBytes('src/unknown.ts',unknown),unknown);
});
