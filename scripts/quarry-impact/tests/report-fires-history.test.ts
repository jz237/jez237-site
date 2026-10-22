import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReportFiresPrevious,restoreReportFiresBytes,verifyReportFiresRevision} from './report-fires-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ReportFires preserves every prior fixture, vehicle asset, venue art and history input',verifyReportFiresRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/report-fires/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReportFiresBytes(file,bytes),readReportFiresPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReportFiresBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReportFiresBytes('src/unknown.ts',unknown),unknown);
});
