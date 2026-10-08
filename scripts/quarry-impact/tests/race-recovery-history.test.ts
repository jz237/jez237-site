import {restoreRaceRecoveryHarnessBytes} from './race-recovery-harness-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRaceRecoveryPrevious,restoreRaceRecoveryBytes,verifyRaceRecoveryRevision} from './race-recovery-invariants';
const source=(file:string)=>restoreRaceRecoveryHarnessBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RaceRecovery preserves every prior fixture, vehicle asset, control and camera input',verifyRaceRecoveryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/race-recovery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRaceRecoveryBytes(file,bytes),readRaceRecoveryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRaceRecoveryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRaceRecoveryBytes('src/unknown.ts',unknown),unknown);
});
