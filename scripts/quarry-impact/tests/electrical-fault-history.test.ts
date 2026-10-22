import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readElectricalFaultPrevious,restoreElectricalFaultBytes,verifyElectricalFaultRevision} from './electrical-fault-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ElectricalFault preserves every prior fixture, vehicle asset, venue art and history input',verifyElectricalFaultRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/electrical-fault/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreElectricalFaultBytes(file,bytes),readElectricalFaultPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreElectricalFaultBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreElectricalFaultBytes('src/unknown.ts',unknown),unknown);
});
