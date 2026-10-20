import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWreckReportPrevious,restoreWreckReportBytes,verifyWreckReportRevision} from './wreck-report-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WreckReport preserves every prior fixture, vehicle asset, venue art and history input',verifyWreckReportRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wreck-report/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWreckReportBytes(file,bytes),readWreckReportPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWreckReportBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWreckReportBytes('src/unknown.ts',unknown),unknown);
});
