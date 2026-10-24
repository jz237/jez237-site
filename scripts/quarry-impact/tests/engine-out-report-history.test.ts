import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readEngineOutReportPrevious,restoreEngineOutReportBytes,verifyEngineOutReportRevision} from './engine-out-report-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('EngineOutReport preserves every prior fixture, vehicle asset, venue art and history input',verifyEngineOutReportRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/engine-out-report/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreEngineOutReportBytes(file,bytes),readEngineOutReportPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreEngineOutReportBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreEngineOutReportBytes('src/unknown.ts',unknown),unknown);
});
