import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCameraSettingsPrevious,restoreCameraSettingsBytes,verifyCameraSettingsRevision} from './camera-settings-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CameraSettings preserves every prior fixture, vehicle asset, control and camera input',verifyCameraSettingsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/camera-settings/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCameraSettingsBytes(file,bytes),readCameraSettingsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCameraSettingsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCameraSettingsBytes('src/unknown.ts',unknown),unknown);
});
