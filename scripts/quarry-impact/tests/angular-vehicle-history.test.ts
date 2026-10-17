import {restoreDriveCalibrationBytes} from './drive-calibration-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAngularVehiclePrevious,restoreAngularVehicleBytes,verifyAngularVehicleRevision} from './angular-vehicle-invariants';
const source=(file:string)=>restoreDriveCalibrationBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AngularVehicle preserves every prior fixture, vehicle asset, control and camera input',verifyAngularVehicleRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/angular-vehicle/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAngularVehicleBytes(file,bytes),readAngularVehiclePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAngularVehicleBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAngularVehicleBytes('src/unknown.ts',unknown),unknown);
});
