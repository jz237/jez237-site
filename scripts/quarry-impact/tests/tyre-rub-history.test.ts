import {restoreElectricalFaultBytes} from './electrical-fault-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTyreRubPrevious,restoreTyreRubBytes,verifyTyreRubRevision} from './tyre-rub-invariants';
const source=(file:string)=>restoreElectricalFaultBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TyreRub preserves every prior fixture, vehicle asset, venue art and history input',verifyTyreRubRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tyre-rub/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTyreRubBytes(file,bytes),readTyreRubPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTyreRubBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTyreRubBytes('src/unknown.ts',unknown),unknown);
});
