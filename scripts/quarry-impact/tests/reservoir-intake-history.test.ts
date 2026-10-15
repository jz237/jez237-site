import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReservoirIntakePrevious,restoreReservoirIntakeBytes,verifyReservoirIntakeRevision} from './reservoir-intake-invariants';
const source=(file:string)=>restoreHazelwoodLookoutBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ReservoirIntake preserves every prior fixture, vehicle asset, control and camera input',verifyReservoirIntakeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/reservoir-intake/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReservoirIntakeBytes(file,bytes),readReservoirIntakePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReservoirIntakeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReservoirIntakeBytes('src/unknown.ts',unknown),unknown);
});

import {restoreHazelwoodLookoutBytes} from './hazelwood-lookout-invariants';
