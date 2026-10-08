import {restoreChassisTuningBytes} from './chassis-tuning-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCountyCareerPrevious,restoreCountyCareerBytes,verifyCountyCareerRevision} from './county-career-invariants';
const source=(file:string)=>restoreChassisTuningBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CountyCareer preserves every prior fixture, vehicle asset, control and camera input',verifyCountyCareerRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/county-career/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCountyCareerBytes(file,bytes),readCountyCareerPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCountyCareerBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCountyCareerBytes('src/unknown.ts',unknown),unknown);
});
