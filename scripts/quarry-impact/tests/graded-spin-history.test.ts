import {restoreEnginePackagesBytes} from './engine-packages-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readGradedSpinPrevious,restoreGradedSpinBytes,verifyGradedSpinRevision} from './graded-spin-invariants';
const source=(file:string)=>restoreEnginePackagesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('GradedSpin preserves every prior fixture, vehicle asset, control and camera input',verifyGradedSpinRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/graded-spin/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreGradedSpinBytes(file,bytes),readGradedSpinPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreGradedSpinBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreGradedSpinBytes('src/unknown.ts',unknown),unknown);
});
