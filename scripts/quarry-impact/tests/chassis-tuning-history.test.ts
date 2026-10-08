import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readChassisTuningPrevious,restoreChassisTuningBytes,verifyChassisTuningRevision} from './chassis-tuning-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ChassisTuning preserves every prior fixture, vehicle asset, control and camera input',verifyChassisTuningRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/chassis-tuning/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreChassisTuningBytes(file,bytes),readChassisTuningPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreChassisTuningBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreChassisTuningBytes('src/unknown.ts',unknown),unknown);
});
