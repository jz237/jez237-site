import {restoreReportCablesBytes} from './report-cables-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHandbrakeCablePrevious,restoreHandbrakeCableBytes,verifyHandbrakeCableRevision} from './handbrake-cable-invariants';
const source=(file:string)=>restoreReportCablesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('HandbrakeCable preserves every prior fixture, vehicle asset, venue art and history input',verifyHandbrakeCableRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/handbrake-cable/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHandbrakeCableBytes(file,bytes),readHandbrakeCablePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHandbrakeCableBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHandbrakeCableBytes('src/unknown.ts',unknown),unknown);
});
