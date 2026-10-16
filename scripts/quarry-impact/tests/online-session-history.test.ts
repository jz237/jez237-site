import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineSessionPrevious,restoreOnlineSessionBytes,verifyOnlineSessionRevision} from './online-session-invariants';
const source=(file:string)=>restoreChaseClearanceBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineSession preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineSessionRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-session/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineSessionBytes(file,bytes),readOnlineSessionPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineSessionBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineSessionBytes('src/unknown.ts',unknown),unknown);
});

import {restoreChaseClearanceBytes} from './chase-clearance-invariants';
