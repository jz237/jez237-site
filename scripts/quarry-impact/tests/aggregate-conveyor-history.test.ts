import {restoreReservoirShoreMaterialBytes} from './reservoir-shore-material-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAggregateConveyorPrevious,restoreAggregateConveyorBytes,verifyAggregateConveyorRevision} from './aggregate-conveyor-invariants';
const source=(file:string)=>restoreReservoirShoreMaterialBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AggregateConveyor preserves every prior fixture, vehicle asset, control and camera input',verifyAggregateConveyorRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/aggregate-conveyor/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAggregateConveyorBytes(file,bytes),readAggregateConveyorPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAggregateConveyorBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAggregateConveyorBytes('src/unknown.ts',unknown),unknown);
});
