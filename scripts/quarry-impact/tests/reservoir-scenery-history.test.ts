import {restoreClubSceneryBytes} from './club-scenery-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReservoirSceneryPrevious,restoreReservoirSceneryBytes,verifyReservoirSceneryRevision} from './reservoir-scenery-invariants';
const source=(file:string)=>restoreClubSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ReservoirScenery preserves every prior fixture, vehicle asset, control and camera input',verifyReservoirSceneryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/reservoir-scenery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReservoirSceneryBytes(file,bytes),readReservoirSceneryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReservoirSceneryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReservoirSceneryBytes('src/unknown.ts',unknown),unknown);
});
