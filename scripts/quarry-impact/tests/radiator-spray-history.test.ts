import {restoreEngineNurseBytes} from './engine-nurse-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRadiatorSprayPrevious,restoreRadiatorSprayBytes,verifyRadiatorSprayRevision} from './radiator-spray-invariants';
const source=(file:string)=>restoreEngineNurseBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RadiatorSpray preserves every prior fixture, vehicle asset, venue art and history input',verifyRadiatorSprayRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/radiator-spray/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRadiatorSprayBytes(file,bytes),readRadiatorSprayPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRadiatorSprayBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRadiatorSprayBytes('src/unknown.ts',unknown),unknown);
});
