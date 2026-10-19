import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRaceRivalPrevious,restoreRaceRivalBytes,verifyRaceRivalRevision} from './race-rival-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RaceRival preserves every prior fixture, vehicle asset, venue art and history input',verifyRaceRivalRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/race-rival/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRaceRivalBytes(file,bytes),readRaceRivalPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRaceRivalBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRaceRivalBytes('src/unknown.ts',unknown),unknown);
});
