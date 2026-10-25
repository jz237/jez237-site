import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRainSprayPrevious,restoreRainSprayBytes,verifyRainSprayRevision} from './rain-spray-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RainSpray preserves every prior fixture, vehicle asset, venue art and history input',verifyRainSprayRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rain-spray/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRainSprayBytes(file,bytes),readRainSprayPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRainSprayBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRainSprayBytes('src/unknown.ts',unknown),unknown);
});
