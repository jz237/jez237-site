import {restoreEngineMountsBytes} from './engine-mounts-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMechReportPrevious,restoreMechReportBytes,verifyMechReportRevision} from './mech-report-invariants';
const source=(file:string)=>restoreEngineMountsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('MechReport preserves every prior fixture, vehicle asset, venue art and history input',verifyMechReportRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/mech-report/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMechReportBytes(file,bytes),readMechReportPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMechReportBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMechReportBytes('src/unknown.ts',unknown),unknown);
});
