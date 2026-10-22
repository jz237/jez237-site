import {restoreDiagramFaultsBytes} from './diagram-faults-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDeadCarPrevious,restoreDeadCarBytes,verifyDeadCarRevision} from './dead-car-invariants';
const source=(file:string)=>restoreDiagramFaultsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DeadCar preserves every prior fixture, vehicle asset, venue art and history input',verifyDeadCarRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/dead-car/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDeadCarBytes(file,bytes),readDeadCarPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDeadCarBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDeadCarBytes('src/unknown.ts',unknown),unknown);
});
