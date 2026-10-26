import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPrimerPatchesPrevious,restorePrimerPatchesBytes,verifyPrimerPatchesRevision} from './primer-patches-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('PrimerPatches preserves every prior fixture, vehicle asset, venue art and history input',verifyPrimerPatchesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/primer-patches/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePrimerPatchesBytes(file,bytes),readPrimerPatchesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePrimerPatchesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePrimerPatchesBytes('src/unknown.ts',unknown),unknown);
});
