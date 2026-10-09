import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPerformanceClassesPrevious,restorePerformanceClassesBytes,verifyPerformanceClassesRevision} from './performance-classes-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('PerformanceClasses preserves every prior fixture, vehicle asset, control and camera input',verifyPerformanceClassesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/performance-classes/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePerformanceClassesBytes(file,bytes),readPerformanceClassesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePerformanceClassesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePerformanceClassesBytes('src/unknown.ts',unknown),unknown);
});
