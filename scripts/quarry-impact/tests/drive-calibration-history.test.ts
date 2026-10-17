import {restoreAngularDifferentialBytes} from './angular-differential-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDriveCalibrationPrevious,restoreDriveCalibrationBytes,verifyDriveCalibrationRevision} from './drive-calibration-invariants';
const source=(file:string)=>restoreAngularDifferentialBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DriveCalibration preserves every prior fixture, vehicle asset, control and camera input',verifyDriveCalibrationRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/drive-calibration/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDriveCalibrationBytes(file,bytes),readDriveCalibrationPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDriveCalibrationBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDriveCalibrationBytes('src/unknown.ts',unknown),unknown);
});
