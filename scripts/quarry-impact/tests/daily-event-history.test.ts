import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDailyEventPrevious,restoreDailyEventBytes,verifyDailyEventRevision} from './daily-event-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DailyEvent preserves every prior fixture, vehicle asset, venue art and history input',verifyDailyEventRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/daily-event/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDailyEventBytes(file,bytes),readDailyEventPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDailyEventBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDailyEventBytes('src/unknown.ts',unknown),unknown);
});
