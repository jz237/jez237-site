import {restoreOnlineRuleDraftBytes} from './online-rule-draft-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineMorrowPrevious,restoreOnlineMorrowBytes,verifyOnlineMorrowRevision} from './online-morrow-invariants';
const source=(file:string)=>restoreOnlineRuleDraftBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineMorrow preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineMorrowRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-morrow/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineMorrowBytes(file,bytes),readOnlineMorrowPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineMorrowBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineMorrowBytes('src/unknown.ts',unknown),unknown);
});
