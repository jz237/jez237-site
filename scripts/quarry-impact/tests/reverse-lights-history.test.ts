import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReverseLightsPrevious,restoreReverseLightsBytes,verifyReverseLightsRevision} from './reverse-lights-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ReverseLights preserves every prior fixture, vehicle asset, venue art and history input',verifyReverseLightsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/reverse-lights/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReverseLightsBytes(file,bytes),readReverseLightsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReverseLightsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReverseLightsBytes('src/unknown.ts',unknown),unknown);
});
