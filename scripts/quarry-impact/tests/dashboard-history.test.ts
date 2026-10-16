import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDashboardPrevious,restoreDashboardBytes,verifyDashboardRevision} from './dashboard-invariants';
const source=(file:string)=>restoreMudMayhemBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Dashboard preserves every prior fixture, vehicle asset, control and camera input',verifyDashboardRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/dashboard/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDashboardBytes(file,bytes),readDashboardPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDashboardBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDashboardBytes('src/unknown.ts',unknown),unknown);
});

import {restoreMudMayhemBytes} from './mud-mayhem-invariants';
