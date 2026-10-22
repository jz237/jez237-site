import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSteerSkewPrevious,restoreSteerSkewBytes,verifySteerSkewRevision} from './steer-skew-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SteerSkew preserves every prior fixture, vehicle asset, venue art and history input',verifySteerSkewRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/steer-skew/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSteerSkewBytes(file,bytes),readSteerSkewPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSteerSkewBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSteerSkewBytes('src/unknown.ts',unknown),unknown);
});
