import {restoreTimedRaceHarnessBytes} from './timed-race-harness-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTimedRacesPrevious,restoreTimedRacesBytes,verifyTimedRacesRevision} from './timed-races-invariants';
const source=(file:string)=>restoreTimedRaceHarnessBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TimedRaces preserves every prior fixture, vehicle asset, control and camera input',verifyTimedRacesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/timed-races/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTimedRacesBytes(file,bytes),readTimedRacesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTimedRacesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTimedRacesBytes('src/unknown.ts',unknown),unknown);
});
