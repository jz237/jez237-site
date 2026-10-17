import {restoreOnlineSpectatingBytes} from './online-spectating-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineHostRestorePrevious,restoreOnlineHostRestoreBytes,verifyOnlineHostRestoreRevision} from './online-host-restore-invariants';
const source=(file:string)=>restoreOnlineSpectatingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineHostRestore preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineHostRestoreRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-host-restore/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineHostRestoreBytes(file,bytes),readOnlineHostRestorePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineHostRestoreBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineHostRestoreBytes('src/unknown.ts',unknown),unknown);
});
