import {restoreWingToastBytes} from './wing-toast-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPointsTagPrevious,restorePointsTagBytes,verifyPointsTagRevision} from './points-tag-invariants';
const source=(file:string)=>restoreWingToastBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PointsTag preserves every prior fixture, vehicle asset, venue art and history input',verifyPointsTagRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/points-tag/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePointsTagBytes(file,bytes),readPointsTagPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePointsTagBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePointsTagBytes('src/unknown.ts',unknown),unknown);
});
