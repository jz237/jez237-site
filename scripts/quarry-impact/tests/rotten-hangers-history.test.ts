import {restoreSunstripsBytes} from './sunstrips-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRottenHangersPrevious,restoreRottenHangersBytes,verifyRottenHangersRevision} from './rotten-hangers-invariants';
const source=(file:string)=>restoreSunstripsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RottenHangers preserves every prior fixture, vehicle asset, venue art and history input',verifyRottenHangersRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rotten-hangers/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRottenHangersBytes(file,bytes),readRottenHangersPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRottenHangersBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRottenHangersBytes('src/unknown.ts',unknown),unknown);
});
