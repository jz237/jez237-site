import {restoreCoolantLossBytes} from './coolant-loss-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readThrottleJamPrevious,restoreThrottleJamBytes,verifyThrottleJamRevision} from './throttle-jam-invariants';
const source=(file:string)=>restoreCoolantLossBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ThrottleJam preserves every prior fixture, vehicle asset, venue art and history input',verifyThrottleJamRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/throttle-jam/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreThrottleJamBytes(file,bytes),readThrottleJamPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreThrottleJamBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreThrottleJamBytes('src/unknown.ts',unknown),unknown);
});
