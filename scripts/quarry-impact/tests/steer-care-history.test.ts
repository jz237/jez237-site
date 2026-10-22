import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSteerCarePrevious,restoreSteerCareBytes,verifySteerCareRevision} from './steer-care-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SteerCare preserves every prior fixture, vehicle asset, venue art and history input',verifySteerCareRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/steer-care/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSteerCareBytes(file,bytes),readSteerCarePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSteerCareBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSteerCareBytes('src/unknown.ts',unknown),unknown);
});
