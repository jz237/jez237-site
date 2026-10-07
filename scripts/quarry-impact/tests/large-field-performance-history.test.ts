import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLargeFieldPrevious,restoreLargeFieldBytes,verifyLargeFieldRevision} from './large-field-performance-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('large-field optimization preserves every prior fixture, vehicle asset, control and camera input',verifyLargeFieldRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/large-field-performance/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLargeFieldBytes(file,bytes),readLargeFieldPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLargeFieldBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLargeFieldBytes('src/unknown.ts',unknown),unknown);
});
