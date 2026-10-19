import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readEventAwardsPrevious,restoreEventAwardsBytes,verifyEventAwardsRevision} from './event-awards-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('EventAwards preserves every prior fixture, vehicle asset, venue art and history input',verifyEventAwardsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/event-awards/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreEventAwardsBytes(file,bytes),readEventAwardsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreEventAwardsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreEventAwardsBytes('src/unknown.ts',unknown),unknown);
});
