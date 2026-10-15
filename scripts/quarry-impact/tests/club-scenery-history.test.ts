import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readClubSceneryPrevious,restoreClubSceneryBytes,verifyClubSceneryRevision} from './club-scenery-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ClubScenery preserves every prior fixture, vehicle asset, control and camera input',verifyClubSceneryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/club-scenery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreClubSceneryBytes(file,bytes),readClubSceneryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreClubSceneryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreClubSceneryBytes('src/unknown.ts',unknown),unknown);
});
