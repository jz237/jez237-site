import {restoreWetFiresBytes} from './wet-fires-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFireAwardsPrevious,restoreFireAwardsBytes,verifyFireAwardsRevision} from './fire-awards-invariants';
const source=(file:string)=>restoreWetFiresBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FireAwards preserves every prior fixture, vehicle asset, venue art and history input',verifyFireAwardsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fire-awards/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFireAwardsBytes(file,bytes),readFireAwardsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFireAwardsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFireAwardsBytes('src/unknown.ts',unknown),unknown);
});
