import {restoreRainRunsBytes} from './rain-runs-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readColdStartPrevious,restoreColdStartBytes,verifyColdStartRevision} from './cold-start-invariants';
const source=(file:string)=>restoreRainRunsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ColdStart preserves every prior fixture, vehicle asset, venue art and history input',verifyColdStartRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/cold-start/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreColdStartBytes(file,bytes),readColdStartPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreColdStartBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreColdStartBytes('src/unknown.ts',unknown),unknown);
});
