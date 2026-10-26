import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTiredElectricsPrevious,restoreTiredElectricsBytes,verifyTiredElectricsRevision} from './tired-electrics-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TiredElectrics preserves every prior fixture, vehicle asset, venue art and history input',verifyTiredElectricsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tired-electrics/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTiredElectricsBytes(file,bytes),readTiredElectricsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTiredElectricsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTiredElectricsBytes('src/unknown.ts',unknown),unknown);
});
