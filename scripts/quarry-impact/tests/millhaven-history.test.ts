import {restoreAirfieldCareerBytes} from './airfield-career-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMillhavenPrevious,restoreMillhavenBytes,verifyMillhavenRevision} from './millhaven-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Millhaven preserves every prior fixture, vehicle asset, control and camera input',verifyMillhavenRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/millhaven/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreAirfieldCareerBytes(file,source(file));assert.deepEqual(restoreMillhavenBytes(file,bytes),readMillhavenPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMillhavenBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMillhavenBytes('src/unknown.ts',unknown),unknown);
});
