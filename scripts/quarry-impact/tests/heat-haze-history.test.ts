import {restoreGroundHazeBytes} from './ground-haze-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHeatHazePrevious,restoreHeatHazeBytes,verifyHeatHazeRevision} from './heat-haze-invariants';
const source=(file:string)=>restoreGroundHazeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('HeatHaze preserves every prior fixture, vehicle asset, venue art and history input',verifyHeatHazeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/heat-haze/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHeatHazeBytes(file,bytes),readHeatHazePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHeatHazeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHeatHazeBytes('src/unknown.ts',unknown),unknown);
});
