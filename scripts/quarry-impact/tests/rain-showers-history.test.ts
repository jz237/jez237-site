import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRainShowersPrevious,restoreRainShowersBytes,verifyRainShowersRevision} from './rain-showers-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RainShowers preserves every prior fixture, vehicle asset, venue art and history input',verifyRainShowersRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rain-showers/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRainShowersBytes(file,bytes),readRainShowersPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRainShowersBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRainShowersBytes('src/unknown.ts',unknown),unknown);
});
