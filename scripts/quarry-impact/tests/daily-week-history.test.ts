import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDailyWeekPrevious,restoreDailyWeekBytes,verifyDailyWeekRevision} from './daily-week-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DailyWeek preserves every prior fixture, vehicle asset, venue art and history input',verifyDailyWeekRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/daily-week/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDailyWeekBytes(file,bytes),readDailyWeekPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDailyWeekBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDailyWeekBytes('src/unknown.ts',unknown),unknown);
});
