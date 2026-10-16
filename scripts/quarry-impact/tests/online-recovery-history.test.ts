import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineRecoveryPrevious,restoreOnlineRecoveryBytes,verifyOnlineRecoveryRevision} from './online-recovery-invariants';
const source=(file:string)=>restoreOnlineCoursesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineRecovery preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineRecoveryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-recovery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineRecoveryBytes(file,bytes),readOnlineRecoveryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineRecoveryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineRecoveryBytes('src/unknown.ts',unknown),unknown);
});

import {restoreOnlineCoursesBytes} from './online-courses-invariants';
