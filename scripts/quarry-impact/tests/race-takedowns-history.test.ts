import {restoreAchievementsBytes} from './achievements-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRaceTakedownsPrevious,restoreRaceTakedownsBytes,verifyRaceTakedownsRevision} from './race-takedowns-invariants';
const source=(file:string)=>restoreAchievementsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RaceTakedowns preserves every prior fixture, vehicle asset, venue art and history input',verifyRaceTakedownsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/race-takedowns/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRaceTakedownsBytes(file,bytes),readRaceTakedownsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRaceTakedownsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRaceTakedownsBytes('src/unknown.ts',unknown),unknown);
});
