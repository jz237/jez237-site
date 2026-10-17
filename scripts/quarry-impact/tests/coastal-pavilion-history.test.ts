import {restorePortWarehouseBytes} from './port-warehouse-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCoastalPavilionPrevious,restoreCoastalPavilionBytes,verifyCoastalPavilionRevision} from './coastal-pavilion-invariants';
const source=(file:string)=>restorePortWarehouseBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CoastalPavilion preserves every prior fixture, vehicle asset, control and camera input',verifyCoastalPavilionRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/coastal-pavilion/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCoastalPavilionBytes(file,bytes),readCoastalPavilionPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCoastalPavilionBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCoastalPavilionBytes('src/unknown.ts',unknown),unknown);
});
