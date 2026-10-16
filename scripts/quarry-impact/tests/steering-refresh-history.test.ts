import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSteeringRefreshPrevious,restoreSteeringRefreshBytes,verifySteeringRefreshRevision} from './steering-refresh-invariants';
const source=(file:string)=>restoreDashboardBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SteeringRefresh preserves every prior fixture, vehicle asset, control and camera input',verifySteeringRefreshRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/steering-refresh/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSteeringRefreshBytes(file,bytes),readSteeringRefreshPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSteeringRefreshBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSteeringRefreshBytes('src/unknown.ts',unknown),unknown);
});

import {restoreDashboardBytes} from './dashboard-invariants';
