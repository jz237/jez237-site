import {restoreReportFiresBytes} from './report-fires-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRadiatorMomentPrevious,restoreRadiatorMomentBytes,verifyRadiatorMomentRevision} from './radiator-moment-invariants';
const source=(file:string)=>restoreReportFiresBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RadiatorMoment preserves every prior fixture, vehicle asset, venue art and history input',verifyRadiatorMomentRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/radiator-moment/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRadiatorMomentBytes(file,bytes),readRadiatorMomentPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRadiatorMomentBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRadiatorMomentBytes('src/unknown.ts',unknown),unknown);
});
