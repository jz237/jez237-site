import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCameraShimmyPrevious,restoreCameraShimmyBytes,verifyCameraShimmyRevision} from './camera-shimmy-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CameraShimmy preserves every prior fixture, vehicle asset, venue art and history input',verifyCameraShimmyRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/camera-shimmy/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCameraShimmyBytes(file,bytes),readCameraShimmyPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCameraShimmyBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCameraShimmyBytes('src/unknown.ts',unknown),unknown);
});
