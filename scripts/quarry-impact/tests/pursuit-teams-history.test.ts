import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPursuitTeamsPrevious,restorePursuitTeamsBytes,verifyPursuitTeamsRevision} from './pursuit-teams-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('PursuitTeams preserves every prior fixture, vehicle asset, control and camera input',verifyPursuitTeamsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pursuit-teams/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePursuitTeamsBytes(file,bytes),readPursuitTeamsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePursuitTeamsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePursuitTeamsBytes('src/unknown.ts',unknown),unknown);
});
