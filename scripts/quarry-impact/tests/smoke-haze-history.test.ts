import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSmokeHazePrevious,restoreSmokeHazeBytes,verifySmokeHazeRevision} from './smoke-haze-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SmokeHaze preserves every prior fixture, vehicle asset, venue art and history input',verifySmokeHazeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/smoke-haze/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSmokeHazeBytes(file,bytes),readSmokeHazePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSmokeHazeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSmokeHazeBytes('src/unknown.ts',unknown),unknown);
});
