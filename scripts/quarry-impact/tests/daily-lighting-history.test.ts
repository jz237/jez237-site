import {restoreCrowdRoarBytes} from './crowd-roar-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDailyLightingPrevious,restoreDailyLightingBytes,verifyDailyLightingRevision} from './daily-lighting-invariants';
const source=(file:string)=>restoreCrowdRoarBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DailyLighting preserves every prior fixture, vehicle asset, venue art and history input',verifyDailyLightingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/daily-lighting/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDailyLightingBytes(file,bytes),readDailyLightingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDailyLightingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDailyLightingBytes('src/unknown.ts',unknown),unknown);
});
