import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWingOffPrevious,restoreWingOffBytes,verifyWingOffRevision} from './wing-off-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WingOff preserves every prior fixture, vehicle asset, venue art and history input',verifyWingOffRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wing-off/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWingOffBytes(file,bytes),readWingOffPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWingOffBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWingOffBytes('src/unknown.ts',unknown),unknown);
});
