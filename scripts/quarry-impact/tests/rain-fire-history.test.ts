import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRainFirePrevious,restoreRainFireBytes,verifyRainFireRevision} from './rain-fire-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RainFire preserves every prior fixture, vehicle asset, venue art and history input',verifyRainFireRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rain-fire/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRainFireBytes(file,bytes),readRainFirePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRainFireBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRainFireBytes('src/unknown.ts',unknown),unknown);
});
