import {restorePointsTagBytes} from './points-tag-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDestructionPointsPrevious,restoreDestructionPointsBytes,verifyDestructionPointsRevision} from './destruction-points-invariants';
const source=(file:string)=>restorePointsTagBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DestructionPoints preserves every prior fixture, vehicle asset, venue art and history input',verifyDestructionPointsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/destruction-points/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDestructionPointsBytes(file,bytes),readDestructionPointsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDestructionPointsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDestructionPointsBytes('src/unknown.ts',unknown),unknown);
});
