import {restoreEliminationRaceBytes} from './elimination-race-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAchievementsPrevious,restoreAchievementsBytes,verifyAchievementsRevision} from './achievements-invariants';
const source=(file:string)=>restoreEliminationRaceBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Achievements preserves every prior fixture, vehicle asset, venue art and history input',verifyAchievementsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/achievements/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAchievementsBytes(file,bytes),readAchievementsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAchievementsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAchievementsBytes('src/unknown.ts',unknown),unknown);
});
