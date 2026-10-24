import {restoreWreckedByBytes} from './wrecked-by-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRollReportPrevious,restoreRollReportBytes,verifyRollReportRevision} from './roll-report-invariants';
const source=(file:string)=>restoreWreckedByBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RollReport preserves every prior fixture, vehicle asset, venue art and history input',verifyRollReportRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/roll-report/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRollReportBytes(file,bytes),readRollReportPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRollReportBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRollReportBytes('src/unknown.ts',unknown),unknown);
});
