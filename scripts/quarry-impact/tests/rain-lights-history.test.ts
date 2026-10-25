import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRainLightsPrevious,restoreRainLightsBytes,verifyRainLightsRevision} from './rain-lights-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RainLights preserves every prior fixture, vehicle asset, venue art and history input',verifyRainLightsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rain-lights/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRainLightsBytes(file,bytes),readRainLightsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRainLightsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRainLightsBytes('src/unknown.ts',unknown),unknown);
});
