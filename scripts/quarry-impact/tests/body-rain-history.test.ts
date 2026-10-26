import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBodyRainPrevious,restoreBodyRainBytes,verifyBodyRainRevision} from './body-rain-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BodyRain preserves every prior fixture, vehicle asset, venue art and history input',verifyBodyRainRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/body-rain/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBodyRainBytes(file,bytes),readBodyRainPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBodyRainBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBodyRainBytes('src/unknown.ts',unknown),unknown);
});
