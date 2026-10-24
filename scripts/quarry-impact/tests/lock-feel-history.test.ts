import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLockFeelPrevious,restoreLockFeelBytes,verifyLockFeelRevision} from './lock-feel-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('LockFeel preserves every prior fixture, vehicle asset, venue art and history input',verifyLockFeelRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/lock-feel/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLockFeelBytes(file,bytes),readLockFeelPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLockFeelBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLockFeelBytes('src/unknown.ts',unknown),unknown);
});
