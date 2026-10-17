import {restoreRaceFinishWindowBytes} from './race-finish-window-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReservoirPumphousePrevious,restoreReservoirPumphouseBytes,verifyReservoirPumphouseRevision} from './reservoir-pumphouse-invariants';
const source=(file:string)=>restoreRaceFinishWindowBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ReservoirPumphouse preserves every prior fixture, vehicle asset, control and camera input',verifyReservoirPumphouseRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/reservoir-pumphouse/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReservoirPumphouseBytes(file,bytes),readReservoirPumphousePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReservoirPumphouseBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReservoirPumphouseBytes('src/unknown.ts',unknown),unknown);
});
