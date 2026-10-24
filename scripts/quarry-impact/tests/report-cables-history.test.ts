import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReportCablesPrevious,restoreReportCablesBytes,verifyReportCablesRevision} from './report-cables-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ReportCables preserves every prior fixture, vehicle asset, venue art and history input',verifyReportCablesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/report-cables/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReportCablesBytes(file,bytes),readReportCablesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReportCablesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReportCablesBytes('src/unknown.ts',unknown),unknown);
});
