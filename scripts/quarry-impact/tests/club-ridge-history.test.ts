import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readClubRidgePrevious,restoreClubRidgeBytes,verifyClubRidgeRevision} from './club-ridge-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ClubRidge preserves every prior fixture, vehicle asset, control and camera input',verifyClubRidgeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/club-ridge/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreClubRidgeBytes(file,bytes),readClubRidgePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreClubRidgeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreClubRidgeBytes('src/unknown.ts',unknown),unknown);
});
