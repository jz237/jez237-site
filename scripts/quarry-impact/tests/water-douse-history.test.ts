import {restoreBurningDebrisBytes} from './burning-debris-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWaterDousePrevious,restoreWaterDouseBytes,verifyWaterDouseRevision} from './water-douse-invariants';
const source=(file:string)=>restoreBurningDebrisBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WaterDouse preserves every prior fixture, vehicle asset, venue art and history input',verifyWaterDouseRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/water-douse/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWaterDouseBytes(file,bytes),readWaterDousePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWaterDouseBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWaterDouseBytes('src/unknown.ts',unknown),unknown);
});
