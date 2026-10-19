import {restoreDailyWeekBytes} from './daily-week-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSpeedbowlCareerPrevious,restoreSpeedbowlCareerBytes,verifySpeedbowlCareerRevision} from './speedbowl-career-invariants';
const source=(file:string)=>restoreDailyWeekBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SpeedbowlCareer preserves every prior fixture, vehicle asset, venue art and history input',verifySpeedbowlCareerRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/speedbowl-career/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSpeedbowlCareerBytes(file,bytes),readSpeedbowlCareerPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSpeedbowlCareerBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSpeedbowlCareerBytes('src/unknown.ts',unknown),unknown);
});
