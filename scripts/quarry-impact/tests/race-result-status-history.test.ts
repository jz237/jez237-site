import {restoreForestLodgeBytes} from './forest-lodge-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRaceResultStatusPrevious,restoreRaceResultStatusBytes,verifyRaceResultStatusRevision} from './race-result-status-invariants';
const source=(file:string)=>restoreForestLodgeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RaceResultStatus preserves every prior fixture, vehicle asset, control and camera input',verifyRaceResultStatusRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/race-result-status/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRaceResultStatusBytes(file,bytes),readRaceResultStatusPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRaceResultStatusBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRaceResultStatusBytes('src/unknown.ts',unknown),unknown);
});
