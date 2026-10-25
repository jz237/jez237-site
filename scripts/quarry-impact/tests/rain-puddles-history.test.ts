import {restoreAquaplaningBytes} from './aquaplaning-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRainPuddlesPrevious,restoreRainPuddlesBytes,verifyRainPuddlesRevision} from './rain-puddles-invariants';
const source=(file:string)=>restoreAquaplaningBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RainPuddles preserves every prior fixture, vehicle asset, venue art and history input',verifyRainPuddlesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rain-puddles/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRainPuddlesBytes(file,bytes),readRainPuddlesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRainPuddlesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRainPuddlesBytes('src/unknown.ts',unknown),unknown);
});
