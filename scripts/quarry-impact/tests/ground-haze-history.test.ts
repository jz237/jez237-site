import {restoreLensRainBytes} from './lens-rain-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readGroundHazePrevious,restoreGroundHazeBytes,verifyGroundHazeRevision} from './ground-haze-invariants';
const source=(file:string)=>restoreLensRainBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('GroundHaze preserves every prior fixture, vehicle asset, venue art and history input',verifyGroundHazeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ground-haze/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreGroundHazeBytes(file,bytes),readGroundHazePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreGroundHazeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreGroundHazeBytes('src/unknown.ts',unknown),unknown);
});
