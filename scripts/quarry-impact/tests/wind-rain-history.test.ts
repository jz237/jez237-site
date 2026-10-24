import {restoreShrapnelBytes} from './shrapnel-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWindRainPrevious,restoreWindRainBytes,verifyWindRainRevision} from './wind-rain-invariants';
const source=(file:string)=>restoreShrapnelBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WindRain preserves every prior fixture, vehicle asset, venue art and history input',verifyWindRainRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wind-rain/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWindRainBytes(file,bytes),readWindRainPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWindRainBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWindRainBytes('src/unknown.ts',unknown),unknown);
});
