import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRaceSafetyPrevious,restoreRaceSafetyBytes,verifyRaceSafetyRevision} from './race-safety-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RaceSafety preserves every prior fixture, vehicle asset, control and camera input',verifyRaceSafetyRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/race-safety/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRaceSafetyBytes(file,bytes),readRaceSafetyPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRaceSafetyBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRaceSafetyBytes('src/unknown.ts',unknown),unknown);
});
