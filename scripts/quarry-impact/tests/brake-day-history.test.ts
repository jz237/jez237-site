import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBrakeDayPrevious,restoreBrakeDayBytes,verifyBrakeDayRevision} from './brake-day-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BrakeDay preserves every prior fixture, vehicle asset, venue art and history input',verifyBrakeDayRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/brake-day/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBrakeDayBytes(file,bytes),readBrakeDayPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBrakeDayBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBrakeDayBytes('src/unknown.ts',unknown),unknown);
});
