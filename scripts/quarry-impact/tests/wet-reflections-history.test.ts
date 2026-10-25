import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWetReflectionsPrevious,restoreWetReflectionsBytes,verifyWetReflectionsRevision} from './wet-reflections-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WetReflections preserves every prior fixture, vehicle asset, venue art and history input',verifyWetReflectionsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wet-reflections/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWetReflectionsBytes(file,bytes),readWetReflectionsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWetReflectionsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWetReflectionsBytes('src/unknown.ts',unknown),unknown);
});
