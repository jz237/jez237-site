import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAirbagsPrevious,restoreAirbagsBytes,verifyAirbagsRevision} from './airbags-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Airbags preserves every prior fixture, vehicle asset, venue art and history input',verifyAirbagsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/airbags/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAirbagsBytes(file,bytes),readAirbagsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAirbagsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAirbagsBytes('src/unknown.ts',unknown),unknown);
});
