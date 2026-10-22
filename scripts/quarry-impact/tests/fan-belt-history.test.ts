import {restoreLoopHoldBytes} from './loop-hold-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFanBeltPrevious,restoreFanBeltBytes,verifyFanBeltRevision} from './fan-belt-invariants';
const source=(file:string)=>restoreLoopHoldBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FanBelt preserves every prior fixture, vehicle asset, venue art and history input',verifyFanBeltRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fan-belt/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFanBeltBytes(file,bytes),readFanBeltPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFanBeltBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFanBeltBytes('src/unknown.ts',unknown),unknown);
});
