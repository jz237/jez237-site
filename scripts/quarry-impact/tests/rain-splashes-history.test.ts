import {restoreUmbrellaWindBytes} from './umbrella-wind-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRainSplashesPrevious,restoreRainSplashesBytes,verifyRainSplashesRevision} from './rain-splashes-invariants';
const source=(file:string)=>restoreUmbrellaWindBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RainSplashes preserves every prior fixture, vehicle asset, venue art and history input',verifyRainSplashesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rain-splashes/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRainSplashesBytes(file,bytes),readRainSplashesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRainSplashesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRainSplashesBytes('src/unknown.ts',unknown),unknown);
});
