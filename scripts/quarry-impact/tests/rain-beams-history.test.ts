import {restoreExhaustVapourBytes} from './exhaust-vapour-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRainBeamsPrevious,restoreRainBeamsBytes,verifyRainBeamsRevision} from './rain-beams-invariants';
const source=(file:string)=>restoreExhaustVapourBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RainBeams preserves every prior fixture, vehicle asset, venue art and history input',verifyRainBeamsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rain-beams/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRainBeamsBytes(file,bytes),readRainBeamsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRainBeamsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRainBeamsBytes('src/unknown.ts',unknown),unknown);
});
