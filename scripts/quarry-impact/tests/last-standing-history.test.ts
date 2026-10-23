import {restoreHangingOnBytes} from './hanging-on-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLastStandingPrevious,restoreLastStandingBytes,verifyLastStandingRevision} from './last-standing-invariants';
const source=(file:string)=>restoreHangingOnBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('LastStanding preserves every prior fixture, vehicle asset, venue art and history input',verifyLastStandingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/last-standing/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLastStandingBytes(file,bytes),readLastStandingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLastStandingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLastStandingBytes('src/unknown.ts',unknown),unknown);
});
