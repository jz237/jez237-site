import {restoreSharedDrivetrainBytes} from './shared-drivetrain-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readExternalLongitudinalPrevious,restoreExternalLongitudinalBytes,verifyExternalLongitudinalRevision} from './external-longitudinal-invariants';
const source=(file:string)=>restoreSharedDrivetrainBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ExternalLongitudinal preserves every prior fixture, vehicle asset, control and camera input',verifyExternalLongitudinalRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/external-longitudinal/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreExternalLongitudinalBytes(file,bytes),readExternalLongitudinalPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreExternalLongitudinalBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreExternalLongitudinalBytes('src/unknown.ts',unknown),unknown);
});
