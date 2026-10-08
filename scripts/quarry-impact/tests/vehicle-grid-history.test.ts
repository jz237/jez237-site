import {restoreDamageRulesBytes} from './damage-rules-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readVehicleGridPrevious,restoreVehicleGridBytes,verifyVehicleGridRevision} from './vehicle-grid-invariants';
const source=(file:string)=>restoreDamageRulesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('VehicleGrid preserves every prior fixture, vehicle asset, control and camera input',verifyVehicleGridRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/vehicle-grid/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreVehicleGridBytes(file,bytes),readVehicleGridPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreVehicleGridBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreVehicleGridBytes('src/unknown.ts',unknown),unknown);
});
