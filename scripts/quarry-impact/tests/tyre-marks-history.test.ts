import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTyreMarksPrevious,restoreTyreMarksBytes,verifyTyreMarksRevision} from './tyre-marks-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TyreMarks preserves every prior fixture, vehicle asset, venue art and history input',verifyTyreMarksRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tyre-marks/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTyreMarksBytes(file,bytes),readTyreMarksPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTyreMarksBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTyreMarksBytes('src/unknown.ts',unknown),unknown);
});
