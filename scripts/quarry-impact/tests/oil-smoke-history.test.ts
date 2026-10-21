import {restoreBurningSlicksBytes} from './burning-slicks-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOilSmokePrevious,restoreOilSmokeBytes,verifyOilSmokeRevision} from './oil-smoke-invariants';
const source=(file:string)=>restoreBurningSlicksBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OilSmoke preserves every prior fixture, vehicle asset, venue art and history input',verifyOilSmokeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/oil-smoke/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOilSmokeBytes(file,bytes),readOilSmokePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOilSmokeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOilSmokeBytes('src/unknown.ts',unknown),unknown);
});
