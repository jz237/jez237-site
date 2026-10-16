import {restoreVenueCrowdBytes} from './venue-crowd-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRaceMudPrevious,restoreRaceMudBytes,verifyRaceMudRevision} from './race-mud-invariants';
const source=(file:string)=>restoreVenueCrowdBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RaceMud preserves every prior fixture, vehicle asset, control and camera input',verifyRaceMudRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/race-mud/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRaceMudBytes(file,bytes),readRaceMudPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRaceMudBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRaceMudBytes('src/unknown.ts',unknown),unknown);
});
