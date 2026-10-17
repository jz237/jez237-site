import {restoreRecoveryRetryBytes} from './recovery-retry-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineAngularDrivePrevious,restoreOnlineAngularDriveBytes,verifyOnlineAngularDriveRevision} from './online-angular-drive-invariants';
const source=(file:string)=>restoreRecoveryRetryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineAngularDrive preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineAngularDriveRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-angular-drive/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineAngularDriveBytes(file,bytes),readOnlineAngularDrivePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineAngularDriveBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineAngularDriveBytes('src/unknown.ts',unknown),unknown);
});
