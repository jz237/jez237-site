import {restoreLastStandingBytes} from './last-standing-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLastGaspPrevious,restoreLastGaspBytes,verifyLastGaspRevision} from './last-gasp-invariants';
const source=(file:string)=>restoreLastStandingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('LastGasp preserves every prior fixture, vehicle asset, venue art and history input',verifyLastGaspRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/last-gasp/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLastGaspBytes(file,bytes),readLastGaspPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLastGaspBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLastGaspBytes('src/unknown.ts',unknown),unknown);
});
