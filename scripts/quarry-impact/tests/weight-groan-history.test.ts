import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWeightGroanPrevious,restoreWeightGroanBytes,verifyWeightGroanRevision} from './weight-groan-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WeightGroan preserves every prior fixture, vehicle asset, venue art and history input',verifyWeightGroanRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/weight-groan/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWeightGroanBytes(file,bytes),readWeightGroanPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWeightGroanBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWeightGroanBytes('src/unknown.ts',unknown),unknown);
});
