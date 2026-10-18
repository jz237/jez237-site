import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readStarfinCarPrevious,restoreStarfinCarBytes,verifyStarfinCarRevision} from './starfin-car-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('StarfinCar preserves every prior fixture, vehicle asset, control and camera input',verifyStarfinCarRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/starfin-car/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreStarfinCarBytes(file,bytes),readStarfinCarPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreStarfinCarBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreStarfinCarBytes('src/unknown.ts',unknown),unknown);
});
