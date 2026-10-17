import {restoreContactWireAbsenceBytes} from './contact-wire-absence-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readForestLodgePrevious,restoreForestLodgeBytes,verifyForestLodgeRevision} from './forest-lodge-invariants';
const source=(file:string)=>restoreContactWireAbsenceBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ForestLodge preserves every prior fixture, vehicle asset, control and camera input',verifyForestLodgeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/forest-lodge/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreForestLodgeBytes(file,bytes),readForestLodgePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreForestLodgeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreForestLodgeBytes('src/unknown.ts',unknown),unknown);
});
