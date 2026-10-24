import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readJointSlotPrevious,restoreJointSlotBytes,verifyJointSlotRevision} from './joint-slot-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('JointSlot preserves every prior fixture, vehicle asset, venue art and history input',verifyJointSlotRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/joint-slot/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreJointSlotBytes(file,bytes),readJointSlotPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreJointSlotBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreJointSlotBytes('src/unknown.ts',unknown),unknown);
});
