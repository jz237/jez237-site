import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHuntLeaderPrevious,restoreHuntLeaderBytes,verifyHuntLeaderRevision} from './hunt-leader-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('HuntLeader preserves every prior fixture, vehicle asset, venue art and history input',verifyHuntLeaderRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/hunt-leader/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHuntLeaderBytes(file,bytes),readHuntLeaderPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHuntLeaderBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHuntLeaderBytes('src/unknown.ts',unknown),unknown);
});
