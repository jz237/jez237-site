import {restoreClubRidgeBytes} from './club-ridge-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRidgeClubPrevious,restoreRidgeClubBytes,verifyRidgeClubRevision} from './ridge-club-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RidgeClub preserves every prior fixture, vehicle asset, control and camera input',verifyRidgeClubRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ridge-club/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreClubRidgeBytes(file,source(file));assert.deepEqual(restoreRidgeClubBytes(file,bytes),readRidgeClubPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRidgeClubBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRidgeClubBytes('src/unknown.ts',unknown),unknown);
});
