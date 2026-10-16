import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineRosterPrevious,restoreOnlineRosterBytes,verifyOnlineRosterRevision} from './online-roster-invariants';
const source=(file:string)=>restoreOnlineRecoveryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineRoster preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineRosterRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-roster/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineRosterBytes(file,bytes),readOnlineRosterPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineRosterBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineRosterBytes('src/unknown.ts',unknown),unknown);
});

import {restoreOnlineRecoveryBytes} from './online-recovery-invariants';
