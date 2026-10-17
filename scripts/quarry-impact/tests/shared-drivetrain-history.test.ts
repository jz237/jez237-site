import {restoreAngularVehicleBytes} from './angular-vehicle-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSharedDrivetrainPrevious,restoreSharedDrivetrainBytes,verifySharedDrivetrainRevision} from './shared-drivetrain-invariants';
const source=(file:string)=>restoreAngularVehicleBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SharedDrivetrain preserves every prior fixture, vehicle asset, control and camera input',verifySharedDrivetrainRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/shared-drivetrain/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSharedDrivetrainBytes(file,bytes),readSharedDrivetrainPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSharedDrivetrainBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSharedDrivetrainBytes('src/unknown.ts',unknown),unknown);
});
