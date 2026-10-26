import {restoreWashMeBytes} from './wash-me-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSunstripsPrevious,restoreSunstripsBytes,verifySunstripsRevision} from './sunstrips-invariants';
const source=(file:string)=>restoreWashMeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Sunstrips preserves every prior fixture, vehicle asset, venue art and history input',verifySunstripsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/sunstrips/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSunstripsBytes(file,bytes),readSunstripsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSunstripsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSunstripsBytes('src/unknown.ts',unknown),unknown);
});
