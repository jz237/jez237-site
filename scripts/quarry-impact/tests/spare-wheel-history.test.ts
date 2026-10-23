import {restoreWingOffBytes} from './wing-off-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSpareWheelPrevious,restoreSpareWheelBytes,verifySpareWheelRevision} from './spare-wheel-invariants';
const source=(file:string)=>restoreWingOffBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SpareWheel preserves every prior fixture, vehicle asset, venue art and history input',verifySpareWheelRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/spare-wheel/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSpareWheelBytes(file,bytes),readSpareWheelPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSpareWheelBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSpareWheelBytes('src/unknown.ts',unknown),unknown);
});
