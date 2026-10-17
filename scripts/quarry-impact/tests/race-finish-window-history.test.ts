import {restoreRaceResultStatusBytes} from './race-result-status-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRaceFinishWindowPrevious,restoreRaceFinishWindowBytes,verifyRaceFinishWindowRevision} from './race-finish-window-invariants';
const source=(file:string)=>restoreRaceResultStatusBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RaceFinishWindow preserves every prior fixture, vehicle asset, control and camera input',verifyRaceFinishWindowRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/race-finish-window/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRaceFinishWindowBytes(file,bytes),readRaceFinishWindowPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRaceFinishWindowBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRaceFinishWindowBytes('src/unknown.ts',unknown),unknown);
});
