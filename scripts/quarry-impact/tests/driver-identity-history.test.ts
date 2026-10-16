import {restoreMorrowBytes} from './morrow-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDriverIdentityPrevious,restoreDriverIdentityBytes,verifyDriverIdentityRevision} from './driver-identity-invariants';
const source=(file:string)=>restoreMorrowBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DriverIdentity preserves every prior fixture, vehicle asset, control and camera input',verifyDriverIdentityRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/driver-identity/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDriverIdentityBytes(file,bytes),readDriverIdentityPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDriverIdentityBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDriverIdentityBytes('src/unknown.ts',unknown),unknown);
});
