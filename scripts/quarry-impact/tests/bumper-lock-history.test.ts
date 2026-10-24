import {restoreTetherBytes} from './tether-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBumperLockPrevious,restoreBumperLockBytes,verifyBumperLockRevision} from './bumper-lock-invariants';
const source=(file:string)=>restoreTetherBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BumperLock preserves every prior fixture, vehicle asset, venue art and history input',verifyBumperLockRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bumper-lock/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBumperLockBytes(file,bytes),readBumperLockPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBumperLockBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBumperLockBytes('src/unknown.ts',unknown),unknown);
});
