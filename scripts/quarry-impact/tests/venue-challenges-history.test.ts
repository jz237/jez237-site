import {restoreBoardsEverywhereBytes} from './boards-everywhere-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readVenueChallengesPrevious,restoreVenueChallengesBytes,verifyVenueChallengesRevision} from './venue-challenges-invariants';
const source=(file:string)=>restoreBoardsEverywhereBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('VenueChallenges preserves every prior fixture, vehicle asset, challenge, career and history input',verifyVenueChallengesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/venue-challenges/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreVenueChallengesBytes(file,bytes),readVenueChallengesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreVenueChallengesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreVenueChallengesBytes('src/unknown.ts',unknown),unknown);
});
