import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAirfieldCareerPrevious,restoreAirfieldCareerBytes,verifyAirfieldCareerRevision} from './airfield-career-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('AirfieldCareer preserves every prior fixture, vehicle asset, control and camera input',verifyAirfieldCareerRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/airfield-career/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAirfieldCareerBytes(file,bytes),readAirfieldCareerPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAirfieldCareerBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAirfieldCareerBytes('src/unknown.ts',unknown),unknown);
});
