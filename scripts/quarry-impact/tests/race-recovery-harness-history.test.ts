import {restoreChampionshipsBytes} from './championships-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRaceRecoveryHarnessPrevious,restoreRaceRecoveryHarnessBytes,verifyRaceRecoveryHarnessRevision} from './race-recovery-harness-invariants';
const source=(file:string)=>restoreChampionshipsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RaceRecoveryHarness preserves every prior fixture, vehicle asset, control and camera input',verifyRaceRecoveryHarnessRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/race-recovery-harness/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRaceRecoveryHarnessBytes(file,bytes),readRaceRecoveryHarnessPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRaceRecoveryHarnessBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRaceRecoveryHarnessBytes('src/unknown.ts',unknown),unknown);
});
