import {restoreVehicleGridBytes} from './vehicle-grid-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTimedRaceHarnessPrevious,restoreTimedRaceHarnessBytes,verifyTimedRaceHarnessRevision} from './timed-race-harness-invariants';
const source=(file:string)=>restoreVehicleGridBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TimedRaceHarness preserves every prior fixture, vehicle asset, control and camera input',verifyTimedRaceHarnessRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/timed-race-harness/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTimedRaceHarnessBytes(file,bytes),readTimedRaceHarnessPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTimedRaceHarnessBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTimedRaceHarnessBytes('src/unknown.ts',unknown),unknown);
});
