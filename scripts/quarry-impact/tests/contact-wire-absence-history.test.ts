import {restoreAlderModelBytes} from './alder-model-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readContactWireAbsencePrevious,restoreContactWireAbsenceBytes,verifyContactWireAbsenceRevision} from './contact-wire-absence-invariants';
const source=(file:string)=>restoreAlderModelBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ContactWireAbsence preserves every prior fixture, vehicle asset, control and camera input',verifyContactWireAbsenceRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/contact-wire-absence/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreContactWireAbsenceBytes(file,bytes),readContactWireAbsencePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreContactWireAbsenceBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreContactWireAbsenceBytes('src/unknown.ts',unknown),unknown);
});
