import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAxleTrampPrevious,restoreAxleTrampBytes,verifyAxleTrampRevision} from './axle-tramp-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('AxleTramp preserves every prior fixture, vehicle asset, venue art and history input',verifyAxleTrampRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/axle-tramp/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAxleTrampBytes(file,bytes),readAxleTrampPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAxleTrampBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAxleTrampBytes('src/unknown.ts',unknown),unknown);
});
