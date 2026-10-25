import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRoofRainPrevious,restoreRoofRainBytes,verifyRoofRainRevision} from './roof-rain-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RoofRain preserves every prior fixture, vehicle asset, venue art and history input',verifyRoofRainRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/roof-rain/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRoofRainBytes(file,bytes),readRoofRainPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRoofRainBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRoofRainBytes('src/unknown.ts',unknown),unknown);
});
