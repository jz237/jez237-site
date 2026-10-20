import {restoreExtendedDamageBytes} from './extended-damage-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTeamRacePrevious,restoreTeamRaceBytes,verifyTeamRaceRevision} from './team-race-invariants';
const source=(file:string)=>restoreExtendedDamageBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TeamRace preserves every prior fixture, vehicle asset, venue art and history input',verifyTeamRaceRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/team-race/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTeamRaceBytes(file,bytes),readTeamRacePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTeamRaceBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTeamRaceBytes('src/unknown.ts',unknown),unknown);
});
