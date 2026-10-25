import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRaceNumbersPrevious,restoreRaceNumbersBytes,verifyRaceNumbersRevision} from './race-numbers-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RaceNumbers preserves every prior fixture, vehicle asset, venue art and history input',verifyRaceNumbersRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/race-numbers/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRaceNumbersBytes(file,bytes),readRaceNumbersPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRaceNumbersBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRaceNumbersBytes('src/unknown.ts',unknown),unknown);
});
