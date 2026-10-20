import {restoreBangerCareerBytes} from './banger-career-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWreckBadgesPrevious,restoreWreckBadgesBytes,verifyWreckBadgesRevision} from './wreck-badges-invariants';
const source=(file:string)=>restoreBangerCareerBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WreckBadges preserves every prior fixture, vehicle asset, venue art and history input',verifyWreckBadgesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wreck-badges/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWreckBadgesBytes(file,bytes),readWreckBadgesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWreckBadgesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWreckBadgesBytes('src/unknown.ts',unknown),unknown);
});
